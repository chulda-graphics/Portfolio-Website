"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function easeInOut(value: number) {
  const progress = clamp(value);
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

const CLOSED_LID_ROTATION = 1.92;
const CAMERA_VERTICAL_FOV = 34;
const CAMERA_REFERENCE_ASPECT = 16 / 9;

function createStudioEnvironment() {
  const faces = [
    ["#d9d9d5", "#191919"],
    ["#8e9699", "#090909"],
    ["#f5f5f0", "#3e4142"],
    ["#202020", "#050505"],
    ["#b8bcbd", "#101010"],
    ["#55595b", "#050505"],
  ];
  const images = faces.map(([highlight, shadow]) => {
    const face = document.createElement("canvas");
    face.width = 64;
    face.height = 64;
    const context = face.getContext("2d");
    if (context) {
      const gradient = context.createLinearGradient(0, 0, 64, 64);
      gradient.addColorStop(0, highlight);
      gradient.addColorStop(0.28, "#313334");
      gradient.addColorStop(1, shadow);
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    return face;
  });
  const environment = new THREE.CubeTexture(images);
  environment.colorSpace = THREE.SRGBColorSpace;
  environment.needsUpdate = true;
  return environment;
}

type PortalPoint = { x: number; y: number };

function midpoint(first: PortalPoint, second: PortalPoint): PortalPoint {
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}

function scaleFrom(center: PortalPoint, point: PortalPoint, amount: number): PortalPoint {
  return {
    x: center.x + (point.x - center.x) * amount,
    y: center.y + (point.y - center.y) * amount,
  };
}

function coverQuad(
  corners: PortalPoint[],
  sourceAspect: number,
  screenAspect: number,
): PortalPoint[] {
  if (sourceAspect > screenAspect) {
    const amount = sourceAspect / screenAspect;
    const top = midpoint(corners[0], corners[1]);
    const bottom = midpoint(corners[3], corners[2]);
    return [
      scaleFrom(top, corners[0], amount),
      scaleFrom(top, corners[1], amount),
      scaleFrom(bottom, corners[2], amount),
      scaleFrom(bottom, corners[3], amount),
    ];
  }

  const amount = screenAspect / sourceAspect;
  const left = midpoint(corners[0], corners[3]);
  const right = midpoint(corners[1], corners[2]);
  return [
    scaleFrom(left, corners[0], amount),
    scaleFrom(right, corners[1], amount),
    scaleFrom(right, corners[2], amount),
    scaleFrom(left, corners[3], amount),
  ];
}

function focusCoveredQuad(corners: PortalPoint[]): PortalPoint[] {
  const center = corners.reduce(
    (sum, corner) => ({ x: sum.x + corner.x / corners.length, y: sum.y + corner.y / corners.length }),
    { x: 0, y: 0 },
  );
  const overscanned = corners.map((corner) => scaleFrom(center, corner, 1.028));
  const horizontal = {
    x: (overscanned[1].x - overscanned[0].x) * 0.024,
    y: (overscanned[1].y - overscanned[0].y) * 0.024,
  };
  return overscanned.map((corner) => ({
    x: corner.x + horizontal.x,
    y: corner.y + horizontal.y,
  }));
}

function portalMatrix(width: number, height: number, corners: PortalPoint[]) {
  const [topLeft, topRight, bottomRight, bottomLeft] = corners;
  const dx1 = topRight.x - bottomRight.x;
  const dx2 = bottomLeft.x - bottomRight.x;
  const sx = topLeft.x - topRight.x + bottomRight.x - bottomLeft.x;
  const dy1 = topRight.y - bottomRight.y;
  const dy2 = bottomLeft.y - bottomRight.y;
  const sy = topLeft.y - topRight.y + bottomRight.y - bottomLeft.y;
  const denominator = dx1 * dy2 - dx2 * dy1;
  const perspectiveX = Math.abs(denominator) > 0.0001
    ? (sx * dy2 - dx2 * sy) / denominator
    : 0;
  const perspectiveY = Math.abs(denominator) > 0.0001
    ? (dx1 * sy - sx * dy1) / denominator
    : 0;
  const scaleX = topRight.x - topLeft.x + perspectiveX * topRight.x;
  const skewX = bottomLeft.x - topLeft.x + perspectiveY * bottomLeft.x;
  const scaleY = topRight.y - topLeft.y + perspectiveX * topRight.y;
  const skewY = bottomLeft.y - topLeft.y + perspectiveY * bottomLeft.y;

  return `matrix3d(${[
    scaleX / width, scaleY / width, 0, perspectiveX / width,
    skewX / height, skewY / height, 0, perspectiveY / height,
    0, 0, 1, 0,
    topLeft.x, topLeft.y, 0, 1,
  ].join(",")})`;
}

export function MacbookIntro() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const introCopy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!section.current || !canvas.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const simplified = reduceMotion || window.matchMedia("(max-width: 900px)").matches;
    const workIndex = document.querySelector<HTMLElement>("[data-home-portal]");
    const portalViewport = document.querySelector<HTMLElement>("[data-home-portal-viewport]");
    const portalGlass = document.querySelector<HTMLElement>("[data-home-portal-glass]");
    const homeEntry = section.current.closest<HTMLElement>(".home-entry");
    const activateFallback = () => {
      if (section.current) {
        section.current.dataset.simplified = "true";
        section.current.dataset.modelError = "true";
      }
      homeEntry?.setAttribute("data-simplified", "true");
      if (workIndex) {
        workIndex.inert = false;
        workIndex.style.removeProperty("transform");
        workIndex.style.removeProperty("transform-origin");
        workIndex.style.removeProperty("filter");
      }
      if (portalViewport) {
        portalViewport.style.removeProperty("clip-path");
        portalViewport.style.removeProperty("border-radius");
        portalViewport.style.removeProperty("transform");
        portalViewport.style.removeProperty("transform-origin");
        portalViewport.style.removeProperty("visibility");
        portalViewport.style.removeProperty("width");
        portalViewport.style.removeProperty("height");
        portalViewport.style.removeProperty("filter");
      }
      if (portalGlass) {
        portalGlass.style.removeProperty("transform");
        portalGlass.style.removeProperty("opacity");
      }
      delete document.body.dataset.productIntro;
      document.body.style.removeProperty("--product-ui-progress");
      window.dispatchEvent(new Event("dhrex:model-ready"));
    };

    let bypassIntro = Boolean(window.__dhrexInternalNavigation);
    try {
      bypassIntro ||= sessionStorage.getItem("dhrex-bypass-intro-once") === "1";
      if (bypassIntro) sessionStorage.removeItem("dhrex-bypass-intro-once");
    } catch {
      // The in-memory marker remains available in restricted storage contexts.
    }

    if (bypassIntro) {
      section.current.dataset.modelReady = "true";
      section.current.dataset.bypass = "true";
      homeEntry?.setAttribute("data-bypass-intro", "true");
      if (workIndex) workIndex.inert = false;
      window.dispatchEvent(new Event("dhrex:model-ready"));
      return;
    }

    if (simplified) {
      section.current.dataset.simplified = "true";
      section.current.dataset.modelReady = "true";
      homeEntry?.setAttribute("data-simplified", "true");
      if (workIndex) workIndex.inert = false;
      window.dispatchEvent(new Event("dhrex:model-ready"));
      return;
    }

    if (workIndex && portalViewport) {
      workIndex.inert = true;
      workIndex.style.transformOrigin = "top left";
      portalViewport.style.clipPath = "inset(50%)";
      portalViewport.style.transformOrigin = "top left";
    }
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.current,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      activateFallback();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_VERTICAL_FOV, 1, 0.01, 100);
    const revealCameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.42, 1.45, 7.4),
      new THREE.Vector3(0.32, 1.33, 7.25),
      new THREE.Vector3(0.18, 1.15, 7.05),
      new THREE.Vector3(0.05, 1.02, 6.9),
    ]);
    const revealTargetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.04, 0),
      new THREE.Vector3(0, 0.12, 0.01),
      new THREE.Vector3(0, 0.22, 0.005),
      new THREE.Vector3(0, 0.28, 0),
    ]);
    const displayCenterTarget = new THREE.Vector3(0, 0.35, 0.05);
    const displayNormalTarget = new THREE.Vector3(0, 0, 1);
    const openingCameraPositionTarget = revealCameraPath.getPoint(1);
    const openingLookTarget = revealTargetPath.getPoint(1);
    camera.position.copy(revealCameraPath.getPoint(1));
    camera.lookAt(revealTargetPath.getPoint(1));

    const entranceRig = new THREE.Group();
    const floatRig = new THREE.Group();
    const pivot = new THREE.Group();
    pivot.rotation.set(-0.025, -0.08, 0);
    floatRig.add(pivot);
    entranceRig.add(floatRig);
    scene.add(entranceRig);
    scene.add(new THREE.HemisphereLight(0xf4f4ef, 0x090909, 1.55));
    const keyLight = new THREE.RectAreaLight(0xffffff, 11.5, 4.8, 3.2);
    keyLight.position.set(2.8, 4.6, 4.2);
    keyLight.lookAt(0, 0.25, 0);
    scene.add(keyLight);
    const fillLight = new THREE.RectAreaLight(0xc8d0d3, 4.8, 3.2, 4.5);
    fillLight.position.set(-3.8, 1.6, 3.1);
    fillLight.lookAt(0, 0.2, 0);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 5.4);
    rimLight.position.set(-4.5, 3.2, -1.5);
    scene.add(rimLight);

    const studioEnvironment = createStudioEnvironment();
    scene.environment = studioEnvironment;

    let model: THREE.Object3D | null = null;
    let screenMesh: THREE.Mesh | null = null;
    let displayLocalCorners: THREE.Vector3[] = [];
    let displayAspect = 1.54;
    let displayWidth = 0;
    let displayHeight = 0;
    let handoffDistance = 3.2;
    let lidPivot: THREE.Group | null = null;
    let visible = true;
    let frame = 0;
    let progress = 0;
    let openingProgress = 0;
    let approachProgress = 0;
    let portalDirty = true;
    let pivotRotationX = -0.07;
    let pivotRotationY = -0.1;
    let entranceStartedAt = 0;

    const restartEntrance = () => {
      entranceStartedAt = performance.now();
    };

    window.addEventListener("dhrex:loaded", restartEntrance);

    const updateHandoffDistance = () => {
      if (displayWidth <= 0 || displayHeight <= 0) return;
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
      const fitWidth = displayWidth / (2 * Math.tan(horizontalFov / 2));
      const fitHeight = displayHeight / (2 * Math.tan(verticalFov / 2));
      handoffDistance = Math.max(fitWidth, fitHeight) * 1.045;
    };

    const renderSize = () => {
      if (!section.current || !canvas.current) return;
      const width = section.current.clientWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = camera.aspect < CAMERA_REFERENCE_ASPECT
        ? THREE.MathUtils.radToDeg(
            2 * Math.atan(
              Math.tan(THREE.MathUtils.degToRad(CAMERA_VERTICAL_FOV / 2))
              * CAMERA_REFERENCE_ASPECT / camera.aspect,
            ),
          )
        : CAMERA_VERTICAL_FOV;
      camera.updateProjectionMatrix();
      updateHandoffDistance();
      portalDirty = true;
    };

    const updatePortal = (revealProgress: number, screenPresence: number) => {
      if (
        !workIndex
        || !portalViewport
        || !screenMesh
        || !canvas.current
        || displayLocalCorners.length !== 4
      ) return;
      // The DOM portal sits above WebGL, so keep it physically inside the lid until
      // the display is facing the camera enough to contain the projected page.
      portalViewport.style.visibility = screenPresence > 0.16 ? "visible" : "hidden";
      pivot.updateMatrixWorld(true);
      const portalRect = portalViewport.getBoundingClientRect();
      const canvasRect = canvas.current.getBoundingClientRect();
      const sourceWidth = workIndex.offsetWidth;
      const sourceHeight = workIndex.offsetHeight;
      const projectedCorners = displayLocalCorners.map((localCorner) => {
        const point = localCorner.clone();
        screenMesh!.localToWorld(point).project(camera);
        return {
          x: canvasRect.left - portalRect.left + (point.x + 1) * canvasRect.width / 2,
          y: canvasRect.top - portalRect.top + (1 - point.y) * canvasRect.height / 2,
        };
      });
      const portalProgress = easeInOut(clamp((revealProgress - 0.58) / 0.36));
      const viewportCorners = [
        { x: 0, y: 0 },
        { x: portalRect.width, y: 0 },
        { x: portalRect.width, y: portalRect.height },
        { x: 0, y: portalRect.height },
      ];
      const clipCorners = projectedCorners.map((corner, index) => ({
        x: THREE.MathUtils.lerp(corner.x, viewportCorners[index].x, portalProgress),
        y: THREE.MathUtils.lerp(corner.y, viewportCorners[index].y, portalProgress),
      }));
      const coveredCorners = focusCoveredQuad(coverQuad(
        projectedCorners,
        sourceWidth / sourceHeight,
        displayAspect,
      ));
      const contentCorners = coveredCorners.map((corner, index) => ({
        x: THREE.MathUtils.lerp(corner.x, viewportCorners[index].x, portalProgress),
        y: THREE.MathUtils.lerp(corner.y, viewportCorners[index].y, portalProgress),
      }));
      portalViewport.style.clipPath = `polygon(${clipCorners.map((corner) => `${corner.x}px ${corner.y}px`).join(", ")})`;
      portalViewport.style.borderRadius = `${THREE.MathUtils.lerp(1.2, 0, portalProgress)}rem`;
      portalViewport.style.transform = "none";
      const displayPresence = easeInOut(screenPresence);
      workIndex.style.filter = `brightness(${THREE.MathUtils.lerp(0.78, 1, displayPresence)})`;
      workIndex.style.transform = portalMatrix(
        sourceWidth,
        sourceHeight,
        contentCorners,
      );
      portalViewport.style.filter = portalProgress < 0.98
        ? `drop-shadow(0 0 ${THREE.MathUtils.lerp(6, 14, displayPresence)}px rgba(255, 255, 255, ${THREE.MathUtils.lerp(0.035, 0.09, displayPresence)}))`
        : "none";
      if (portalGlass) {
        portalGlass.style.transform = workIndex.style.transform;
        portalGlass.style.opacity = String((1 - portalProgress) * THREE.MathUtils.lerp(0.08, 0.2, displayPresence));
      }
      const live = revealProgress >= 0.9;
      workIndex.inert = !live;
      workIndex.dataset.portalLive = live ? "true" : "false";
      portalViewport.dataset.portalLive = live ? "true" : "false";
      canvas.current.style.visibility = portalProgress > 0.985 ? "hidden" : "visible";
    };

    const updateProgress = () => {
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const distance = Math.max(section.current.offsetHeight - window.innerHeight, 1);
      progress = clamp(-rect.top / distance);
      openingProgress = easeInOut(clamp(progress / 0.36));
      approachProgress = clamp((progress - 0.36) / 0.64);
      const approachEased = easeInOut(approachProgress);
      if (lidPivot) lidPivot.rotation.x = THREE.MathUtils.lerp(CLOSED_LID_ROTATION, 0, openingProgress);
      pivotRotationY = approachProgress > 0
        ? THREE.MathUtils.lerp(-0.05, 0, approachEased)
        : THREE.MathUtils.lerp(-0.1, -0.05, openingProgress);
      pivotRotationX = approachProgress > 0
        ? THREE.MathUtils.lerp(-0.03, 0, approachEased)
        : THREE.MathUtils.lerp(-0.07, -0.03, openingProgress);
      pivot.rotation.x = pivotRotationX;
      pivot.rotation.y = pivotRotationY;
      if (approachProgress <= 0) {
        const basePosition = revealCameraPath.getPoint(openingProgress);
        const baseTarget = revealTargetPath.getPoint(openingProgress);
        if (model) {
          pivot.updateMatrixWorld(true);
          const opticalCenter = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
          opticalCenter.y += 0.02;
          openingLookTarget.copy(opticalCenter);
          openingCameraPositionTarget.copy(basePosition).add(opticalCenter.clone().sub(baseTarget));
          camera.position.copy(openingCameraPositionTarget);
          camera.lookAt(openingLookTarget);
        } else {
          openingCameraPositionTarget.copy(basePosition);
          openingLookTarget.copy(baseTarget);
          camera.position.copy(basePosition);
          camera.lookAt(baseTarget);
        }
      } else {
        const inverse = 1 - approachEased;
        const start = openingCameraPositionTarget;
        const control = displayCenterTarget.clone()
          .addScaledVector(displayNormalTarget, handoffDistance + 2.25)
          .add(new THREE.Vector3(0.12, 0.18, 0));
        const end = displayCenterTarget.clone()
          .addScaledVector(displayNormalTarget, handoffDistance);
        camera.position.copy(start).multiplyScalar(inverse * inverse)
          .addScaledVector(control, 2 * inverse * approachEased)
          .addScaledVector(end, approachEased * approachEased);
        const target = openingLookTarget.clone()
          .lerp(displayCenterTarget, approachEased);
        camera.lookAt(target);
      }
      const interfaceProgress = easeInOut(clamp((progress - 0.82) / 0.1));
      if (progress < 0.92) {
        document.body.dataset.productIntro = "true";
        document.body.style.setProperty("--product-ui-progress", String(interfaceProgress));
      } else {
        delete document.body.dataset.productIntro;
        document.body.style.removeProperty("--product-ui-progress");
      }
      portalDirty = true;
    };

    const draw = (time: number) => {
      if (visible) {
        const entranceLinear = entranceStartedAt
          ? clamp((time - entranceStartedAt) / 1700)
          : 0;
        const entranceProgress = easeInOut(entranceLinear);
        entranceRig.scale.setScalar(THREE.MathUtils.lerp(0.72, 1, entranceProgress));
        entranceRig.position.x = THREE.MathUtils.lerp(0.06, 0, entranceProgress);
        entranceRig.position.y = THREE.MathUtils.lerp(-0.2, 0, entranceProgress);
        entranceRig.position.z = THREE.MathUtils.lerp(-0.8, 0, entranceProgress);
        entranceRig.rotation.x = THREE.MathUtils.lerp(0.04, 0, entranceProgress);
        entranceRig.rotation.y = THREE.MathUtils.lerp(0.15, 0, entranceProgress);
        entranceRig.rotation.z = THREE.MathUtils.lerp(-0.03, 0, entranceProgress);
        const openingPresence = 1 - easeInOut(clamp(progress / 0.08));
        floatRig.position.y = Math.sin(time * 0.00055) * 0.018 * openingPresence;
        floatRig.rotation.z = Math.cos(time * 0.00042) * 0.004 * openingPresence;
        pivot.rotation.x = pivotRotationX + Math.sin(time * 0.00038) * 0.004 * openingPresence;
        pivot.rotation.y = pivotRotationY + Math.cos(time * 0.00031) * 0.006 * openingPresence;
        if (portalDirty || openingPresence > 0 || entranceLinear < 1) {
          camera.updateMatrixWorld(true);
          updatePortal(approachProgress, openingProgress);
          portalDirty = false;
        }
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(draw);
    };

    const loader = new GLTFLoader();
    loader.load(
      "/models/macbook-pro-14-m5-v1.glb",
      (gltf) => {
        model = gltf.scene;
        const lidParts: THREE.Object3D[] = [];
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.frustumCulled = true;
          object.geometry.computeBoundingBox();
          const geometrySize = object.geometry.boundingBox?.getSize(new THREE.Vector3());
          const objectBounds = new THREE.Box3().setFromObject(object);
          if (objectBounds.max.y > 0.025 && objectBounds.min.z < -0.1) lidParts.push(object);
          const isStructural = geometrySize ? Math.max(geometrySize.x, geometrySize.y, geometrySize.z) > 0.2 : false;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((sourceMaterial, index) => {
            const material = sourceMaterial.clone();
            if (Array.isArray(object.material)) object.material[index] = material;
            else object.material = material;
            const isScreen = material.name === "HlQwFCAPWzetDQy";
            if (isScreen) {
              screenMesh = object;
              const screenMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x181818,
                emissive: 0x111111,
                emissiveIntensity: 0.82,
                transparent: true,
                opacity: 0.5,
                metalness: 0.02,
                roughness: 0.12,
                clearcoat: 1,
                clearcoatRoughness: 0.08,
                envMapIntensity: 2.8,
                depthWrite: false,
                side: THREE.DoubleSide,
              });
              material.dispose();
              if (Array.isArray(object.material)) object.material[index] = screenMaterial;
              else object.material = screenMaterial;
              return;
            }
            if (material.name === "KtCwfhzYtafEPLg") {
              object.visible = false;
              return;
            }
            if (
              material instanceof THREE.MeshStandardMaterial &&
              (isStructural || material.metalness > 0.35)
            ) {
              material.color.setHex(0x3b3b3e);
              material.metalness = Math.max(material.metalness, 0.8);
              material.roughness = Math.max(0.2, Math.min(material.roughness, 0.28));
              material.envMapIntensity = 3;
              material.needsUpdate = true;
            }
          });
        });

        model.updateMatrixWorld(true);
        lidPivot = new THREE.Group();
        const lidGeometry = new THREE.Group();
        const hinge = new THREE.Vector3(0, 0, -0.108);
        lidPivot.position.copy(hinge);
        lidGeometry.position.copy(hinge).multiplyScalar(-1);
        model.add(lidPivot);
        lidPivot.add(lidGeometry);
        model.updateMatrixWorld(true);
        lidParts.forEach((part) => lidGeometry.attach(part));
        lidPivot.rotation.x = CLOSED_LID_ROTATION;

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const scale = 3.55 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        pivot.add(model);

        if (screenMesh && screenMesh.geometry.boundingBox) {
          const savedLidRotation = lidPivot.rotation.x;
          const savedPivotRotation = pivot.rotation.clone();
          lidPivot.rotation.x = 0;
          pivot.rotation.set(0, 0, 0);
          entranceRig.position.set(0, 0, 0);
          entranceRig.rotation.set(0, 0, 0);
          entranceRig.scale.setScalar(1);
          entranceRig.updateMatrixWorld(true);

          const screenPositions = screenMesh.geometry.getAttribute("position");
          const screenPoints = Array.from(
            { length: screenPositions.count },
            (_, index) => new THREE.Vector3().fromBufferAttribute(screenPositions, index),
          );
          const localCorners = [
            screenPoints.reduce((corner, point) => point.x - point.y < corner.x - corner.y ? point : corner),
            screenPoints.reduce((corner, point) => point.x + point.y > corner.x + corner.y ? point : corner),
            screenPoints.reduce((corner, point) => point.x - point.y > corner.x - corner.y ? point : corner),
            screenPoints.reduce((corner, point) => point.x + point.y < corner.x + corner.y ? point : corner),
          ];
          const orderedLocalCorners = [
            localCorners[3],
            localCorners[2],
            localCorners[1],
            localCorners[0],
          ];
          displayLocalCorners = orderedLocalCorners.map((corner) => corner.clone());
          const worldCorners = orderedLocalCorners.map((corner) => {
            const worldCorner = corner.clone();
            screenMesh!.localToWorld(worldCorner);
            return worldCorner;
          });
          const displayCenter = worldCorners
            .reduce((center, corner) => center.add(corner), new THREE.Vector3())
            .multiplyScalar(0.25);
          const displayNormal = worldCorners[1].clone().sub(worldCorners[0])
            .cross(worldCorners[3].clone().sub(worldCorners[0]))
            .normalize();
          if (displayNormal.z < 0) displayNormal.negate();
          displayCenterTarget.copy(displayCenter);
          displayNormalTarget.copy(displayNormal);
          displayWidth = worldCorners[0].distanceTo(worldCorners[1]);
          displayHeight = worldCorners[0].distanceTo(worldCorners[3]);
          displayAspect = displayWidth / displayHeight;
          updateHandoffDistance();

          lidPivot.rotation.x = savedLidRotation;
          pivot.rotation.copy(savedPivotRotation);
          entranceRig.updateMatrixWorld(true);
        }

        entranceStartedAt = performance.now();
        updateProgress();
        section.current?.setAttribute("data-model-ready", "true");
        window.dispatchEvent(new Event("dhrex:model-ready"));
      },
      undefined,
      () => activateFallback(),
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "20%" },
    );
    observer.observe(section.current);
    renderSize();
    updateProgress();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", renderSize);
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("dhrex:loaded", restartEntrance);
      window.removeEventListener("resize", renderSize);
      window.removeEventListener("scroll", updateProgress);
      if (workIndex) {
        workIndex.inert = false;
        workIndex.style.removeProperty("transform");
        workIndex.style.removeProperty("transform-origin");
        workIndex.style.removeProperty("filter");
        delete workIndex.dataset.portalLive;
      }
      if (portalViewport) {
        portalViewport.style.removeProperty("clip-path");
        portalViewport.style.removeProperty("border-radius");
        portalViewport.style.removeProperty("transform");
        portalViewport.style.removeProperty("transform-origin");
        portalViewport.style.removeProperty("visibility");
        portalViewport.style.removeProperty("width");
        portalViewport.style.removeProperty("height");
        portalViewport.style.removeProperty("filter");
        delete portalViewport.dataset.portalLive;
      }
      if (portalGlass) {
        portalGlass.style.removeProperty("transform");
        portalGlass.style.removeProperty("opacity");
      }
      delete document.body.dataset.productIntro;
      document.body.style.removeProperty("--product-ui-progress");
      studioEnvironment.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={section} className="macbook-intro" aria-label="Enter the Dhrex portfolio">
      <div className="macbook-sticky">
        <div ref={introCopy} className="macbook-intro-copy">
          <p className="eyebrow">SaaS motion / Remote worldwide</p>
          <h1>Clarity lives in the details.</h1>
          <span>Scroll to enter</span>
        </div>
        <canvas ref={canvas} aria-hidden="true" />
        <div className="model-fallback" aria-hidden="true">
          <span>Dhrex</span>
          <strong>Clarity,<br />set in motion.</strong>
        </div>
      </div>
    </section>
  );
}

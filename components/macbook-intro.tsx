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
      }
      delete document.body.dataset.productIntro;
      document.body.style.removeProperty("--product-ui-progress");
      window.dispatchEvent(new Event("dhrex:model-ready"));
    };

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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
    const revealCameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.5, 1.55, 7.2),
      new THREE.Vector3(1.3, 1.36, 7.15),
      new THREE.Vector3(0.82, 1.16, 7.1),
      new THREE.Vector3(0.12, 1.02, 6.9),
    ]);
    const revealTargetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.03, 0.04, 0),
      new THREE.Vector3(0.02, 0.12, 0.01),
      new THREE.Vector3(-0.015, 0.22, 0.005),
      new THREE.Vector3(0, 0.28, 0),
    ]);
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, 1.02, 6.9),
      new THREE.Vector3(0.07, 0.82, 4.7),
      new THREE.Vector3(0.025, 0.42, 2.4),
      new THREE.Vector3(0, -0.06, 0.92),
    ]);
    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.28, 0),
      new THREE.Vector3(0, 0.31, 0.015),
      new THREE.Vector3(0, 0.34, 0.035),
      new THREE.Vector3(0, 0.35, 0.05),
    ]);
    camera.position.copy(cameraPath.getPoint(0));
    camera.lookAt(targetPath.getPoint(0));

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
    let lidPivot: THREE.Group | null = null;
    let visible = true;
    let frame = 0;
    let progress = 0;
    let pivotRotationX = -0.07;
    let pivotRotationY = -0.2;
    let entranceStartedAt = 0;

    const restartEntrance = () => {
      entranceStartedAt = performance.now();
    };

    window.addEventListener("dhrex:loaded", restartEntrance);

    const renderSize = () => {
      if (!section.current || !canvas.current) return;
      const width = section.current.clientWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updatePortal = (revealProgress: number, screenPresence: number) => {
      if (!workIndex || !portalViewport || !screenMesh || !canvas.current) return;
      portalViewport.style.visibility = screenPresence > 0.06 ? "visible" : "hidden";
      pivot.updateMatrixWorld(true);
      const positions = screenMesh.geometry.getAttribute("position");
      const points = Array.from({ length: positions.count }, (_, index) => {
        const point = new THREE.Vector3().fromBufferAttribute(positions, index);
        screenMesh!.localToWorld(point).project(camera);
        return { x: (point.x + 1) * 50, y: (1 - point.y) * 50 };
      });
      const left = Math.min(...points.map((point) => point.x));
      const right = Math.max(...points.map((point) => point.x));
      const top = Math.min(...points.map((point) => point.y));
      const bottom = Math.max(...points.map((point) => point.y));
      const projectedCorners = [
        points.reduce((corner, point) => point.x + point.y < corner.x + corner.y ? point : corner),
        points.reduce((corner, point) => point.x - point.y > corner.x - corner.y ? point : corner),
        points.reduce((corner, point) => point.x + point.y > corner.x + corner.y ? point : corner),
        points.reduce((corner, point) => point.x - point.y < corner.x - corner.y ? point : corner),
      ];
      const portalProgress = easeInOut(clamp((revealProgress - 0.66) / 0.25));
      const portalLeft = THREE.MathUtils.lerp(left, 0, portalProgress);
      const portalRight = THREE.MathUtils.lerp(right, 100, portalProgress);
      const portalTop = THREE.MathUtils.lerp(top, 0, portalProgress);
      const portalBottom = THREE.MathUtils.lerp(bottom, 100, portalProgress);
      const portalWidth = Math.max(portalRight - portalLeft, 0.01);
      const portalHeight = Math.max(portalBottom - portalTop, 0.01);
      const targetCorners = [[0, 0], [100, 0], [100, 100], [0, 100]];
      const clipCorners = projectedCorners.map((corner, index) => {
        const localX = ((corner.x - left) / Math.max(right - left, 0.01)) * 100;
        const localY = ((corner.y - top) / Math.max(bottom - top, 0.01)) * 100;
        const [targetX, targetY] = targetCorners[index];
        return `${THREE.MathUtils.lerp(localX, targetX, portalProgress)}% ${THREE.MathUtils.lerp(localY, targetY, portalProgress)}%`;
      });
      const containedScale = Math.min(portalWidth / 100, portalHeight / 100);
      const contentX = (portalWidth - 100 * containedScale) / 2;
      const contentY = (portalHeight - 100 * containedScale) / 2;
      portalViewport.style.width = `${portalWidth}vw`;
      portalViewport.style.height = `${portalHeight}vh`;
      portalViewport.style.clipPath = `polygon(${clipCorners.join(", ")})`;
      portalViewport.style.borderRadius = `${THREE.MathUtils.lerp(1.2, 0, portalProgress)}rem`;
      portalViewport.style.transform = `translate3d(${portalLeft}vw, ${portalTop}vh, 0)`;
      workIndex.style.filter = `brightness(${THREE.MathUtils.lerp(0.32, 1, easeInOut(screenPresence))})`;
      workIndex.style.transform = `translate3d(${contentX}vw, ${contentY}vh, 0) scale(${containedScale})`;
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
      const openingProgress = easeInOut(clamp(progress / 0.36));
      const approachProgress = clamp((progress - 0.36) / 0.64);
      const approachEased = easeInOut(approachProgress);
      if (approachProgress <= 0) {
        camera.position.copy(revealCameraPath.getPoint(openingProgress));
        camera.lookAt(revealTargetPath.getPoint(openingProgress));
      } else {
        camera.position.copy(cameraPath.getPoint(approachEased));
        camera.lookAt(targetPath.getPoint(approachEased));
      }
      if (lidPivot) lidPivot.rotation.x = THREE.MathUtils.lerp(CLOSED_LID_ROTATION, 0, openingProgress);
      pivotRotationY = approachProgress > 0
        ? THREE.MathUtils.lerp(-0.08, 0, approachEased)
        : THREE.MathUtils.lerp(-0.2, -0.08, openingProgress);
      pivotRotationX = approachProgress > 0
        ? THREE.MathUtils.lerp(-0.03, 0, approachEased)
        : THREE.MathUtils.lerp(-0.07, -0.03, openingProgress);
      const interfaceProgress = easeInOut(clamp((progress - 0.82) / 0.1));
      if (progress < 0.92) {
        document.body.dataset.productIntro = "true";
        document.body.style.setProperty("--product-ui-progress", String(interfaceProgress));
      } else {
        delete document.body.dataset.productIntro;
        document.body.style.removeProperty("--product-ui-progress");
      }
      updatePortal(approachProgress, openingProgress);
    };

    const draw = (time: number) => {
      if (visible) {
        const entranceLinear = entranceStartedAt
          ? clamp((time - entranceStartedAt) / 1700)
          : 0;
        const entranceProgress = easeInOut(entranceLinear);
        entranceRig.scale.setScalar(THREE.MathUtils.lerp(0.72, 1, entranceProgress));
        entranceRig.position.y = THREE.MathUtils.lerp(-0.2, 0, entranceProgress);
        entranceRig.position.z = THREE.MathUtils.lerp(-0.8, 0, entranceProgress);
        entranceRig.rotation.y = THREE.MathUtils.lerp(0.1, 0, entranceProgress);
        entranceRig.rotation.z = THREE.MathUtils.lerp(-0.022, 0, entranceProgress);
        const openingPresence = 1 - easeInOut(clamp((progress - 0.32) / 0.3));
        floatRig.position.y = Math.sin(time * 0.00055) * 0.018 * openingPresence;
        floatRig.rotation.z = Math.cos(time * 0.00042) * 0.004 * openingPresence;
        pivot.rotation.x = pivotRotationX + Math.sin(time * 0.00038) * 0.004 * openingPresence;
        pivot.rotation.y = pivotRotationY + Math.cos(time * 0.00031) * 0.006 * openingPresence;
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
              const screenMaterial = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                depthWrite: false,
                colorWrite: false,
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
        delete portalViewport.dataset.portalLive;
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

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

function createHomepageTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1000;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#050505";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f5f5f2";
  context.font = "600 34px 'DM Sans', sans-serif";
  context.fillText("Dhrex", 80, 92);
  context.fillStyle = "#888884";
  context.font = "500 17px 'DM Sans', sans-serif";
  context.fillText("WORK     ABOUT     CONTACT", 1210, 88);
  context.fillStyle = "#f5f5f2";
  context.font = "500 102px 'DM Sans', sans-serif";
  context.fillText("CLARITY,", 80, 350);
  context.fillText("SET IN MOTION.", 80, 454);
  context.strokeStyle = "rgba(255,255,255,.22)";
  context.lineWidth = 2;
  context.strokeRect(890, 170, 620, 560);
  context.fillStyle = "#141414";
  context.fillRect(906, 186, 588, 528);
  context.strokeStyle = "rgba(255,255,255,.12)";
  for (let line = 0; line < 6; line += 1) {
    const y = 250 + line * 68;
    context.beginPath();
    context.moveTo(954, y);
    context.lineTo(1444, y);
    context.stroke();
  }
  context.fillStyle = "#f5f5f2";
  context.font = "500 30px 'DM Sans', sans-serif";
  context.fillText("DEMO REEL 2026", 938, 665);
  context.strokeStyle = "rgba(255,255,255,.28)";
  context.beginPath();
  context.moveTo(80, 850);
  context.lineTo(1520, 850);
  context.stroke();
  context.fillStyle = "#8e8e89";
  context.font = "500 20px 'DM Sans', sans-serif";
  context.fillText("PRODUCT MOTION / LAUNCH FILMS / UI ANIMATION", 80, 902);
  context.fillText("REMOTE WORLDWIDE", 1320, 902);
  return canvas;
}

export function MacbookIntro() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const introCopy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!section.current || !canvas.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.current,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      section.current.dataset.modelError = "true";
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.55));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.01, 100);
    camera.position.set(0.15, 1.05, 7.2);
    camera.lookAt(0, 0.25, 0);

    const pivot = new THREE.Group();
    pivot.rotation.set(-0.025, -0.08, 0);
    scene.add(pivot);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x101010, 2.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.2);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xd8d8d2, 1.7);
    rimLight.position.set(-4, 2, -2);
    scene.add(rimLight);

    let model: THREE.Object3D | null = null;
    let homepageTexture: THREE.CanvasTexture | null = null;
    let visible = true;
    let frame = 0;
    let progress = 0;

    const renderSize = () => {
      if (!section.current || !canvas.current) return;
      const width = section.current.clientWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updateProgress = () => {
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const distance = Math.max(section.current.offsetHeight - window.innerHeight, 1);
      progress = clamp(-rect.top / distance);
      const eased = easeInOut(progress);
      camera.position.x = THREE.MathUtils.lerp(0.15, 0, eased);
      camera.position.y = THREE.MathUtils.lerp(1.05, -0.05, eased);
      camera.position.z = THREE.MathUtils.lerp(7.2, 1.35, eased);
      camera.lookAt(
        0,
        THREE.MathUtils.lerp(0.25, 0.35, eased),
        THREE.MathUtils.lerp(0, 0.05, eased),
      );
      pivot.rotation.y = THREE.MathUtils.lerp(-0.08, 0, eased);
      pivot.rotation.x = THREE.MathUtils.lerp(-0.03, 0, eased);
      if (introCopy.current) {
        const copyExit = easeInOut(clamp(progress / 0.24));
        introCopy.current.style.transform = `translate3d(${-copyExit * 120}vw, -50%, 0)`;
      }
    };

    const draw = (time: number) => {
      if (visible) {
        if (model && !reduceMotion) {
          pivot.position.y = Math.sin(time * 0.00055) * 0.015;
        }
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(draw);
    };

    const textureCanvas = createHomepageTexture();
    if (textureCanvas) {
      homepageTexture = new THREE.CanvasTexture(textureCanvas);
      homepageTexture.colorSpace = THREE.SRGBColorSpace;
      homepageTexture.flipY = false;
      homepageTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    }

    const loader = new GLTFLoader();
    loader.load(
      "/models/macbook-pro-14-m5-v1.glb",
      (gltf) => {
        model = gltf.scene;
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.frustumCulled = true;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((sourceMaterial, index) => {
            const material = sourceMaterial.clone();
            if (Array.isArray(object.material)) object.material[index] = material;
            else object.material = material;
            const isScreen = material.name === "HlQwFCAPWzetDQy" ||
              (material instanceof THREE.MeshStandardMaterial && Boolean(material.emissiveMap));
            if (isScreen && homepageTexture) {
              const screenMaterial = new THREE.MeshBasicMaterial({
                map: homepageTexture,
                toneMapped: false,
              });
              material.dispose();
              if (Array.isArray(object.material)) object.material[index] = screenMaterial;
              else object.material = screenMaterial;
              return;
            }
            if (
              material instanceof THREE.MeshStandardMaterial &&
              !material.transparent &&
              material.opacity > 0.98 &&
              material.metalness > 0.35
            ) {
              material.color.setHex(0x080808);
              material.metalness = Math.max(material.metalness, 0.82);
              material.roughness = Math.max(0.25, Math.min(material.roughness, 0.42));
              material.needsUpdate = true;
            }
          });
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const scale = 3.25 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        pivot.add(model);
        section.current?.setAttribute("data-model-ready", "true");
        window.dispatchEvent(new Event("dhrex:model-ready"));
      },
      undefined,
      () => section.current?.setAttribute("data-model-error", "true"),
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
      window.removeEventListener("resize", renderSize);
      window.removeEventListener("scroll", updateProgress);
      homepageTexture?.dispose();
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

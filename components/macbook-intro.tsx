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
  context.strokeStyle = "rgba(255,255,255,.18)";
  context.lineWidth = 2;
  context.strokeRect(66, 68, 1468, 864);
  context.fillStyle = "#f5f5f2";
  context.font = "600 42px 'DM Sans', sans-serif";
  context.fillText("DHREX", 112, 145);
  context.fillStyle = "#888884";
  context.font = "500 24px 'DM Sans', sans-serif";
  context.fillText("SAAS MOTION DESIGNER", 112, 202);
  context.fillStyle = "#f5f5f2";
  context.font = "500 122px 'DM Sans', sans-serif";
  context.fillText("CLARITY,", 112, 480);
  context.fillText("SET IN MOTION.", 112, 610);
  context.strokeStyle = "rgba(255,255,255,.28)";
  context.beginPath();
  context.moveTo(112, 760);
  context.lineTo(1488, 760);
  context.stroke();
  context.fillStyle = "#8e8e89";
  context.font = "500 25px 'DM Sans', sans-serif";
  context.fillText("PRODUCT MOTION / LAUNCH FILMS / UI ANIMATION", 112, 828);
  context.fillText("REMOTE WORLDWIDE", 1210, 828);
  return canvas;
}

export function MacbookIntro() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const introCopy = useRef<HTMLDivElement>(null);
  const portalCopy = useRef<HTMLDivElement>(null);

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
    camera.position.set(3.9, 2.25, 5.4);
    camera.lookAt(0, 0, 0);

    const pivot = new THREE.Group();
    pivot.rotation.set(-0.03, -0.25, -0.015);
    scene.add(pivot);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x101010, 2.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.2);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x9ba7ff, 2.1);
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
      camera.position.x = THREE.MathUtils.lerp(3.9, 0.25, eased);
      camera.position.y = THREE.MathUtils.lerp(2.25, 0.12, eased);
      camera.position.z = THREE.MathUtils.lerp(5.4, 2.25, eased);
      camera.lookAt(0, THREE.MathUtils.lerp(0, 0.18, eased), 0);
      pivot.rotation.y = THREE.MathUtils.lerp(-0.25, -0.015, eased);
      pivot.rotation.x = THREE.MathUtils.lerp(-0.03, 0, eased);
      const modelOpacity = 1 - clamp((progress - 0.74) / 0.18);
      canvas.current.style.opacity = String(modelOpacity);
      if (introCopy.current) introCopy.current.style.opacity = String(1 - clamp(progress / 0.2));
      if (portalCopy.current) {
        portalCopy.current.style.opacity = String(clamp((progress - 0.68) / 0.18));
        portalCopy.current.style.transform = `translate3d(0, ${18 - clamp((progress - 0.66) / 0.2) * 18}px, 0)`;
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
          materials.forEach((material, index) => {
            const isScreen = material.name === "HlQwFCAPWzetDQy" ||
              (material instanceof THREE.MeshStandardMaterial && Boolean(material.emissiveMap));
            if (!isScreen || !homepageTexture) return;
            const screenMaterial = new THREE.MeshBasicMaterial({
              map: homepageTexture,
              toneMapped: false,
            });
            if (Array.isArray(object.material)) object.material[index] = screenMaterial;
            else object.material = screenMaterial;
          });
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const scale = 3.9 / Math.max(size.x, size.y, size.z);
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
        <div ref={portalCopy} className="macbook-portal-copy" aria-hidden="true">
          <span>Inside the work</span>
          <strong>Clarity,<br />set in motion.</strong>
        </div>
        <div className="model-fallback" aria-hidden="true">
          <span>Dhrex</span>
          <strong>Clarity,<br />set in motion.</strong>
        </div>
      </div>
    </section>
  );
}

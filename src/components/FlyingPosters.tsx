"use client";

import { useEffect, useRef } from "react";
import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from "ogl";

type FlyingPostersProps = {
  items?: string[];
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
  className?: string;
};

type Size = { width: number; height: number };
type ScrollState = { ease: number; current: number; target: number };

const vertexShader = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPosition;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;
varying vec2 vUv;

float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(
    oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}
vec3 rotate(vec3 value, vec3 axis, float angle) {
  return (rotationMatrix(axis, angle) * vec4(value, 1.0)).xyz;
}
float quinticInOut(float value) {
  return value < 0.5 ? 16.0 * pow(value, 5.0) : -0.5 * abs(pow(2.0 * value - 2.0, 5.0)) + 1.0;
}
void main() {
  vUv = uv;
  vec3 nextPosition = position;
  float offset = (dot(distortionAxis, position) + 0.25) / 0.5;
  float progress = clamp(
    (fract(uPosition * 0.05) - 0.01 * uDistortion * offset) / (1.0 - 0.01 * uDistortion),
    0.0,
    2.0
  );
  nextPosition = rotate(nextPosition, rotationAxis, quinticInOut(progress) * PI);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(nextPosition, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;
varying vec2 vUv;
void main() {
  float imageAspect = uImageSize.x / uImageSize.y;
  float planeAspect = uPlaneSize.x / uPlaneSize.y;
  vec2 scale = vec2(1.0);
  if (planeAspect > imageAspect) scale.x = imageAspect / planeAspect;
  else scale.y = planeAspect / imageAspect;
  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;
  gl_FragColor = texture2D(tMap, uv);
}`;

const lerp = (from: number, to: number, ease: number) => from + (to - from) * ease;
const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

class PosterMedia {
  private extra = 0;
  private y = 0;
  private height = 0;
  private heightTotal = 0;
  private readonly program: Program;
  private readonly plane: Mesh;

  constructor(
    private readonly gl: OGLRenderingContext,
    geometry: Plane,
    scene: Transform,
    private screen: Size,
    private viewport: Size,
    image: string,
    private readonly length: number,
    private readonly index: number,
    private readonly planeWidth: number,
    private readonly planeHeight: number,
    distortion: number,
  ) {
    const texture = new Texture(gl, { generateMipmaps: false });
    this.program = new Program(gl, {
      depthTest: false,
      depthWrite: false,
      cullFace: false,
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [1, 1] },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: distortion },
      },
    });

    const poster = new Image();
    poster.decoding = "async";
    poster.src = image;
    poster.onload = () => {
      texture.image = poster;
      this.program.uniforms.uImageSize.value = [poster.naturalWidth, poster.naturalHeight];
    };

    this.plane = new Mesh(gl, { geometry, program: this.program });
    this.plane.setParent(scene);
    this.resize();
  }

  resize(screen = this.screen, viewport = this.viewport) {
    this.screen = screen;
    this.viewport = viewport;
    const responsiveWidth = Math.min(this.planeWidth, screen.width * 0.72);
    const responsiveHeight = Math.min(this.planeHeight, screen.height * 0.58);
    this.plane.scale.x = (viewport.width * responsiveWidth) / screen.width;
    this.plane.scale.y = (viewport.height * responsiveHeight) / screen.height;
    this.plane.position.x = 0;
    this.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
    this.height = this.plane.scale.y + 5;
    this.heightTotal = this.height * this.length;
    this.y = -this.heightTotal / 2 + (this.index + 0.5) * this.height;
  }

  update(scroll: ScrollState) {
    this.plane.position.y = this.y - scroll.current - this.extra;
    this.program.uniforms.uPosition.value = map(this.plane.position.y, -this.viewport.height, this.viewport.height, 5, 15);
    const top = this.plane.position.y + this.plane.scale.y / 2;
    const bottom = this.plane.position.y - this.plane.scale.y / 2;
    if (top < -this.viewport.height / 2) this.extra -= this.heightTotal;
    else if (bottom > this.viewport.height / 2) this.extra += this.heightTotal;
  }

  destroy() {
    this.plane.setParent(null);
    this.program.remove();
  }
}

class PosterCanvas {
  private readonly renderer: Renderer;
  private readonly camera: Camera;
  private readonly scene = new Transform();
  private readonly geometry: Plane;
  private readonly medias: PosterMedia[];
  private readonly scroll: ScrollState;
  private screen: Size = { width: 1, height: 1 };
  private viewport: Size = { width: 1, height: 1 };
  private animationFrame = 0;
  private active = true;
  private dragging = false;
  private pointerY = 0;
  private scrollStart = 0;
  private readonly resizeObserver: ResizeObserver;
  private readonly visibilityObserver: IntersectionObserver;

  constructor(
    private readonly container: HTMLDivElement,
    canvas: HTMLCanvasElement,
    items: string[],
    planeWidth: number,
    planeHeight: number,
    distortion: number,
    scrollEase: number,
    cameraFov: number,
    cameraZ: number,
  ) {
    this.renderer = new Renderer({ canvas, alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 1.5) });
    const getShaderInfoLog = this.renderer.gl.getShaderInfoLog.bind(this.renderer.gl);
    this.renderer.gl.getShaderInfoLog = shader => getShaderInfoLog(shader) ?? "";
    this.camera = new Camera(this.renderer.gl);
    this.camera.fov = cameraFov;
    this.camera.position.z = cameraZ;
    this.scroll = { ease: scrollEase, current: 0, target: 0 };
    this.resize();
    this.geometry = new Plane(this.renderer.gl, { heightSegments: 1, widthSegments: 100 });
    this.medias = items.map((image, index) => new PosterMedia(
      this.renderer.gl,
      this.geometry,
      this.scene,
      this.screen,
      this.viewport,
      image,
      items.length,
      index,
      planeWidth,
      planeHeight,
      distortion,
    ));

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.active = entry.isIntersecting && !document.hidden;
    }, { rootMargin: "200px" });
    this.visibilityObserver.observe(container);
    canvas.addEventListener("wheel", this.onWheel, { passive: true });
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerUp);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.update();
  }

  private resize = () => {
    const bounds = this.container.getBoundingClientRect();
    this.screen = { width: Math.max(bounds.width, 1), height: Math.max(bounds.height, 1) };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.renderer.gl.canvas.width / this.renderer.gl.canvas.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { height, width: height * this.camera.aspect };
    this.medias?.forEach(media => media.resize(this.screen, this.viewport));
  };

  private onWheel = (event: WheelEvent) => {
    this.scroll.target += event.deltaY * 0.005;
  };

  private onPointerDown = (event: PointerEvent) => {
    this.dragging = true;
    this.pointerY = event.clientY;
    this.scrollStart = this.scroll.current;
    (event.currentTarget as HTMLCanvasElement).setPointerCapture(event.pointerId);
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.dragging) this.scroll.target = this.scrollStart + (this.pointerY - event.clientY) * 0.1;
  };

  private onPointerUp = () => {
    this.dragging = false;
  };

  private onVisibilityChange = () => {
    this.active = !document.hidden && this.container.getBoundingClientRect().bottom > 0;
  };

  private update = () => {
    if (this.active) {
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
      this.medias.forEach(media => media.update(this.scroll));
      this.renderer.render({ scene: this.scene, camera: this.camera });
    }
    this.animationFrame = requestAnimationFrame(this.update);
  };

  destroy(canvas: HTMLCanvasElement) {
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();
    canvas.removeEventListener("wheel", this.onWheel);
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointercancel", this.onPointerUp);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.medias.forEach(media => media.destroy());
    this.renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export function FlyingPosters({
  items = [],
  planeWidth = 320,
  planeHeight = 320,
  distortion = 3,
  scrollEase = 0.01,
  cameraFov = 45,
  cameraZ = 20,
  className = "",
}: FlyingPostersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    container.dataset.initialized = "true";
    let instance: PosterCanvas | undefined;
    try {
      instance = new PosterCanvas(container, canvas, items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ);
      container.dataset.ready = "true";
    } catch (error) {
      container.dataset.ready = "false";
      container.dataset.error = error instanceof Error ? error.message : "WebGL initialization failed";
    }

    return () => instance?.destroy(canvas);
  }, [items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ]);

  return (
    <div ref={containerRef} className={`posters-container ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} className="posters-canvas" />
    </div>
  );
}

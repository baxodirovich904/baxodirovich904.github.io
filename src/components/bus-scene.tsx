"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useLanguage } from "@/lib/i18n/provider";

type LoadState = "loading" | "ready" | "error";

function disposeMaterial(material: THREE.Material) {
  const values = Object.values(
    material as unknown as Record<string, unknown>,
  );

  for (const value of values) {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  }

  material.dispose();
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
      object.geometry.dispose();
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach(disposeMaterial);
    }
  });
}

export function BusScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      const frame = window.requestAnimationFrame(() => setState("error"));
      return () => window.cancelAnimationFrame(frame);
    }

    const pixelRatioCap = window.matchMedia("(max-width: 767px)").matches
      ? 1.5
      : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "default";
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 700ms ease";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 1.25, 5.9);
    camera.lookAt(0, 0.62, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.6;

    scene.add(new THREE.AmbientLight(0xe6e6e6, 0.55));

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(4.5, 6, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xcfcfcf, 1.15);
    fill.position.set(-5, 2.4, 4);
    scene.add(fill);

    const lightRim = new THREE.PointLight(0xf0f0f0, 28, 18, 2);
    lightRim.position.set(-4.2, 1.1, 3);
    scene.add(lightRim);

    const softRim = new THREE.PointLight(0xcfcac4, 15, 18, 2);
    softRim.position.set(4.2, -1.1, 2.6);
    scene.add(softRim);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let mixer: THREE.AnimationMixer | null = null;
    let loadedRoot: THREE.Object3D | null = null;
    let baseY = 0.6;
    let frameCorners: THREE.Vector3[] = [];
    let busSphere: THREE.Sphere | null = null;
    let disposed = false;
    let resize = () => {};
    const maxPitch = 0.28;

    const loader = new GLTFLoader();
    loader.load(
      "/models/avtobus.glb",
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }

        loadedRoot = gltf.scene;

        const inner = new THREE.Group();
        inner.add(gltf.scene);
        inner.updateMatrixWorld(true);

        const bounds = new THREE.Box3().setFromObject(inner);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const scale = 5.9 / maxDimension;

        inner.scale.setScalar(scale);
        inner.position.set(
          -center.x * scale,
          -center.y * scale,
          -center.z * scale,
        );
        inner.updateMatrixWorld(true);

        const scaledBounds = new THREE.Box3().setFromObject(inner);
        const scaledSize = scaledBounds.getSize(new THREE.Vector3());
        const scaledCenter = scaledBounds.getCenter(new THREE.Vector3());
        const half = scaledSize.clone().multiplyScalar(0.5);

        frameCorners = [];
        for (const sx of [-1, 1]) {
          for (const sy of [-1, 1]) {
            for (const sz of [-1, 1]) {
              frameCorners.push(
                new THREE.Vector3(
                  scaledCenter.x + sx * half.x,
                  scaledCenter.y + sy * half.y,
                  scaledCenter.z + sz * half.z,
                ),
              );
            }
          }
        }

        baseY = scaledSize.y * 0.5 + 0.02;
        pivot.position.y = baseY;
        pivot.add(inner);
        busSphere = scaledBounds.getBoundingSphere(new THREE.Sphere());

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          const clip =
            gltf.animations.find((animation) =>
              animation.name.toLowerCase().includes("cycle"),
            ) ?? gltf.animations[0];
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        }

        resize();
        setState("ready");
        canvas.style.opacity = "1";
      },
      undefined,
      () => {
        if (!disposed) {
          setState("error");
        }
      },
    );

    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let lastY = 0;
    let yaw = 0;
    let pitch = 0;
    let spin = 0;
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let frame = 0;
    let elapsed = 0;
    const timer = new THREE.Timer();
    timer.connect(document);

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    // Only the bus itself reacts to the pointer: raycast against the model.
    const hitsBus = () => {
      if (!loadedRoot || !busSphere) {
        return false;
      }

      pivot.updateMatrixWorld(true);
      const worldSphere = busSphere.clone().applyMatrix4(pivot.matrixWorld);
      raycaster.setFromCamera(pointer, camera);

      if (!raycaster.ray.intersectsSphere(worldSphere)) {
        return false;
      }

      return raycaster.intersectObject(loadedRoot, true).length > 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      updatePointer(event);

      if (!hitsBus()) {
        return;
      }

      dragging = true;
      spin = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);

      if (dragging) {
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;

        yaw += deltaX * 0.007;
        pitch = THREE.MathUtils.clamp(pitch + deltaY * 0.0045, -maxPitch, maxPitch);
        spin = deltaX * 0.0038;
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }

      hovering = hitsBus();
      canvas.style.cursor = hovering ? "grab" : "default";
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging) {
        return;
      }

      dragging = false;
      updatePointer(event);
      hovering = hitsBus();
      canvas.style.cursor = hovering ? "grab" : "default";

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const onPointerLeave = () => {
      hovering = false;
      if (!dragging) {
        canvas.style.cursor = "default";
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    canvas.addEventListener("contextmenu", onContextMenu);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("lostpointercapture", endDrag);
    canvas.addEventListener("pointerleave", onPointerLeave);

    resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;

      if (!width || !height) {
        return;
      }

      renderer.setSize(width, height, false);
      camera.aspect = width / height;

      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const verticalTan = Math.tan(verticalFov / 2);
      const horizontalTan = verticalTan * camera.aspect;
      const margin = 0.72;

      let distance = 4;
      const corners = frameCorners.length > 0 ? frameCorners : [new THREE.Vector3(3, 1, 1)];
      const pitches = [-maxPitch - 0.08, 0, maxPitch + 0.08];

      for (let step = 0; step <= 36; step += 1) {
        const yaw = (step / 36) * Math.PI * 2;
        for (const pitch of pitches) {
          const euler = new THREE.Euler(pitch, yaw, 0, "XYZ");
          for (const corner of corners) {
            const point = corner.clone().applyEuler(euler);
            distance = Math.max(
              distance,
              point.z + Math.abs(point.x) / (margin * horizontalTan),
              point.z + Math.abs(point.y) / (margin * verticalTan),
            );
          }
        }
      }

      const lift = Math.min(0.3, distance * 0.035);
      camera.position.set(0, baseY + lift, distance);
      camera.lookAt(0, baseY, 0);
      camera.updateProjectionMatrix();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    // Passenger doors sit on the -X side; this yaw shows the same three-quarter
    // view as the reference render (front on the right, doors facing camera).
    const baseYaw = 0.85;

    const animate = () => {
      timer.update();
      const delta = Math.min(timer.getDelta(), 0.05);
      elapsed = timer.getElapsed();

      if (!dragging) {
        yaw += spin;
        spin *= 0.93;
      }

      const hoverX = hovering ? pointer.x : 0;
      const hoverY = hovering ? pointer.y : 0;

      const targetYaw = yaw + baseYaw + hoverX * 0.22 + Math.sin(elapsed * 0.32) * 0.055;
      const targetPitch = pitch + hoverY * 0.07;

      pivot.rotation.y += (targetYaw - pivot.rotation.y) * Math.min(1, delta * 5.5);
      pivot.rotation.x += (targetPitch - pivot.rotation.x) * Math.min(1, delta * 5.5);
      pivot.position.y = baseY + Math.sin(elapsed * 0.85) * 0.035;

      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();

      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("lostpointercapture", endDrag);
      canvas.removeEventListener("pointerleave", onPointerLeave);

      if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
      }

      if (loadedRoot) {
        disposeObject(loadedRoot);
      }

      room.dispose();
      envTarget.dispose();
      pmrem.dispose();
      timer.disconnect();
      renderer.dispose();

      if (canvas.parentElement === host) {
        host.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="pointer-events-none absolute inset-x-6 bottom-8 h-32 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(235,235,235,0.13),transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-x-16 bottom-12 h-20 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(205,200,192,0.07),transparent_70%)] blur-2xl" />

      <div
        ref={hostRef}
        role="img"
        aria-label={t.hero.buses}
        className="relative z-10 min-h-0 w-full flex-1"
      />

      {state !== "ready" && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-600">
            {state === "error" ? t.hero.busError : t.common.loading}
          </span>
        </div>
      )}
    </div>
  );
}

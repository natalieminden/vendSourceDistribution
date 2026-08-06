import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/asset";

type Phase = "waiting" | "ready" | "failed";

/**
 * Rotating 3D view of a machine.
 *
 * three.js and the 2.5MB model are both dynamic imports fired by an
 * IntersectionObserver, so a visitor who never scrolls this far pays nothing
 * for them. Anything that goes wrong — no WebGL, a failed fetch, a decode
 * error — falls back to the product photo, which is why `poster` is required.
 */
export default function MachineViewer({
  src,
  poster,
  posterAlt,
}: {
  src: string;
  poster: string;
  posterAlt: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  /*
   * Two pieces of state on purpose. `started` is the only one the scene effect
   * depends on; `phase` just drives the poster and caption. Folding them into
   * one status meant reporting "ready" changed the effect's own dependency,
   * so React tore the scene down and removed the canvas the instant it loaded.
   */
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>("waiting");

  // Kick off loading only once the viewer is near the viewport.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/libs/meshopt_decoder.module.js"),
        ]);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

        // The scan carries baked lighting in its albedo, so this is fill only —
        // enough to keep the unlit faces from going flat.
        scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b8c4, 2.2));
        const key = new THREE.DirectionalLight(0xffffff, 1.4);
        key.position.set(2, 4, 3);
        scene.add(key);

        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        const gltf = await loader.loadAsync(asset(src));
        if (disposed) return;

        const model = gltf.scene;
        model.traverse(o => {
          const mesh = o as import("three").Mesh;
          if (mesh.isMesh) {
            const mat = mesh.material as import("three").MeshStandardMaterial;
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.roughness = 0.75;
            mat.metalness = 0;
            mat.needsUpdate = true;
          }
        });

        // Recentre on the origin and scale to a predictable height, so framing
        // never depends on how the model happened to be exported.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const centre = box.getCenter(new THREE.Vector3());
        const scale = 2 / size.y;
        model.scale.setScalar(scale);
        model.position.set(-centre.x * scale, -box.min.y * scale, -centre.z * scale);

        const pivot = new THREE.Group();
        pivot.add(model);
        scene.add(pivot);

        camera.position.set(0, 1.35, 4.6);
        camera.lookAt(0, 1, 0);

        host.appendChild(renderer.domElement);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        renderer.domElement.style.touchAction = "pan-y";
        renderer.domElement.setAttribute("role", "img");
        renderer.domElement.setAttribute("aria-label", `${posterAlt}, rotating 3D view`);

        const resize = () => {
          const { clientWidth: w, clientHeight: h } = host;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);

        // Drag to spin. Pointer capture keeps the gesture alive if the cursor
        // leaves the canvas mid-drag.
        let dragging = false;
        let lastX = 0;
        let velocity = 0;
        const down = (e: PointerEvent) => {
          dragging = true;
          lastX = e.clientX;
          velocity = 0;
          renderer.domElement.setPointerCapture(e.pointerId);
        };
        const move = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - lastX;
          lastX = e.clientX;
          velocity = dx * 0.005;
          pivot.rotation.y += velocity;
        };
        const up = (e: PointerEvent) => {
          dragging = false;
          if (renderer.domElement.hasPointerCapture(e.pointerId)) {
            renderer.domElement.releasePointerCapture(e.pointerId);
          }
        };
        renderer.domElement.addEventListener("pointerdown", down);
        renderer.domElement.addEventListener("pointermove", move);
        renderer.domElement.addEventListener("pointerup", up);
        renderer.domElement.addEventListener("pointercancel", up);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        // Only paint while the viewer is actually on screen: an idle canvas in a
        // background tab or below the fold has no business holding the GPU.
        let onScreen = true;
        const vis = new IntersectionObserver(es => {
          onScreen = es.some(e => e.isIntersecting);
        });
        vis.observe(host);

        // Paint once up front so the model is on screen even if the loop is
        // throttled, and so "ready" never promises a frame that isn't there.
        renderer.render(scene, camera);

        renderer.setAnimationLoop(() => {
          if (!onScreen || document.hidden) return;
          if (!dragging) {
            if (Math.abs(velocity) > 0.0002) {
              // Coast to a stop after a flick.
              pivot.rotation.y += velocity;
              velocity *= 0.95;
            } else if (!reduced.matches) {
              pivot.rotation.y += 0.0035;
            }
          }
          renderer.render(scene, camera);
        });

        setPhase("ready");

        cleanup = () => {
          renderer.setAnimationLoop(null);
          ro.disconnect();
          vis.disconnect();
          renderer.domElement.removeEventListener("pointerdown", down);
          renderer.domElement.removeEventListener("pointermove", move);
          renderer.domElement.removeEventListener("pointerup", up);
          renderer.domElement.removeEventListener("pointercancel", up);
          scene.traverse(o => {
            const mesh = o as import("three").Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              const std = m as import("three").MeshStandardMaterial;
              std.map?.dispose();
              std.dispose();
            });
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) setPhase("failed");
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [started, src, posterAlt]);

  return (
    <div className="relative w-full h-[22rem] sm:h-[26rem] lg:h-[32rem]">
      <div ref={hostRef} className="absolute inset-0" />

      {/* The photo holds the frame until the first rendered pixel, and stays put
          for good if the viewer cannot run. */}
      {phase !== "ready" && (
        <img
          src={asset(poster)}
          alt={posterAlt}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}

      {phase === "ready" && (
        <span className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-slate-500 pointer-events-none">
          Drag to rotate
        </span>
      )}
    </div>
  );
}

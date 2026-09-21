"use client";

import {
  Fragment,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { PiWhatsappLogoBold } from "react-icons/pi";
import Image from "next/image";

/**
 * NLX THEME NOTES — DARK
 * - Stage: Deep Space #080A0F -> #10131A. Copy in #F8FAFC / #94A3B8.
 * - Accents stay blue: Electric Blue #2563EB, Bright Blue #3B82F6, Cyan #0891B2.
 * - The robot is deliberately the LIGHT element on the dark stage: chassis and
 *   ears in #F1F5F9 / #E2E8F0 / #FFFFFF, so it reads as the focal object.
 * - Screen glow uses Bright Blue #3B82F6 — your own design doc names this
 *   color specifically for "hover states, animated elements, visual emphasis,"
 *   which is exactly what the glowing screen fresnel shader needs to read as lit.
 * - Antenna tip uses Cyan #0891B2 as the secondary accent (was pink in the original).
 * - The background image (hero-bg-dark.png) is generated separately via fal.ai —
 *   see the accompanying prompt document. It sits behind the transparent
 *   WebGL canvas as a subtle decorative layer, per your doc's Section 19/23 rules
 *   ("keep the visual subtle, don't make it look like a gaming website").
 *
 * DEVIATIONS FROM THE SUPPLIED FILE (each one deliberate, see comments inline):
 * 1. `showNavbar` prop added — the root layout already mounts FloatingNavbar
 *    (logo + links + CTA in one pill), so the hero's own AntennaNavbar is off by
 *    default to avoid two stacked navigations. Pass `showNavbar` to restore it.
 * 2. `<Image priority>` -> `<Image preload>` — `priority` is deprecated in
 *    Next.js 16 (node_modules/next/dist/docs/.../image.md).
 * 3. `React.MutableRefObject` -> `React.RefObject` — deprecated in React 19 types.
 * 4. Robot offset + hero copy centring (see ResponsiveGroup and the copy block)
 *    so the text sits mid-height instead of pinned to the bottom edge.
 */

class HeartCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    t = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
  }
}

const sharedHeartCurve = new HeartCurve();

/**
 * Reveals a line of copy one word at a time — each word fades up out of a blur
 * on a short stagger, so the sentence reads in instead of snapping on as one
 * block.
 *
 * The stagger is an inline `animationDelay` rather than a Tailwind `delay-*`
 * class, because the value is computed per word and Tailwind can only generate
 * classes it can see statically.
 *
 * Each word is its own inline-block span with a real space between them, so the
 * line still wraps normally.
 */
function WordReveal({
  text,
  delay = 0,
  step = 55,
  className,
}: {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="inline-block animate-in fade-in slide-in-from-bottom-3 blur-in-[10px] ease-out fill-mode-both duration-700"
            style={{ animationDelay: `${delay + i * step}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Entrance motion is CSS keyframes (tw-animate-css), not framer-motion
 * `initial`/`animate`. Staggering is just `delay-*`, so the art settles first
 * and the copy reads in after it — and nothing is left parked at `opacity: 0`
 * waiting on a JS animation loop to start.
 */

/**
 * The white "shadow" under the robot. A horizontal floor plane is useless here
 * — the camera sits at y=0.2 looking at the origin, roughly 9 degrees above a
 * floor at y=-0.78, so anything lying flat is seen edge-on. This is a
 * camera-facing billboard instead: a soft radial gradient, additively blended,
 * tucked just below and behind the robot so it reads as a pool of light.
 *
 * It mirrors the robot's horizontal drift with the same lerp, so the glow
 * travels with it instead of being left behind when the robot follows the
 * cursor.
 */
function FloorGlow({
  y = -0.74,
  width = 2.5,
  height = 0.95,
  intensity = 0.55,
}: {
  y?: number;
  width?: number;
  height?: number;
  intensity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.3, "rgba(226,232,240,0.45)");
      g.addColorStop(0.6, "rgba(147,180,251,0.16)");
      g.addColorStop(1, "rgba(147,180,251,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    return t;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.1);
    const target = state.pointer.x * (state.viewport.width / 3.5);
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      target,
      0.35 * dt,
    );
  });

  return (
    <mesh ref={ref} position={[0, y, -0.25]} renderOrder={-1}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function ResponsiveGroup({
  children,
  scale = 1,
}: {
  children: React.ReactNode;
  scale?: number;
}) {
  const { viewport, size } = useThree();
  const s = Math.min(1.1, viewport.width / 3.5) * scale;

  // The hero copy is vertically centred, so keep the robot out of its way:
  // from `lg` up it sits in the right half; below that it lifts toward the top
  // so the copy underneath stays readable. Cursor tracking still happens
  // relative to this offset, so the interaction is unchanged.
  const isDesktop = size.width >= 1024;
  const offsetX = isDesktop ? viewport.width * 0.2 : 0;
  const offsetY = isDesktop ? 0 : viewport.height * 0.17;

  return (
    <group scale={s} position={[offsetX, offsetY, 0]}>
      {children}
    </group>
  );
}

function GlassCapsule({
  color,
  power,
  intensity,
}: {
  color: string;
  power: number;
  intensity: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color("#ffffff") },
      power: { value: 2.5 },
      intensity: { value: 0.6 },
    }),
    [],
  );

  // These three uniforms are driven by props that do not change while the hero
  // is mounted, so syncing them in an effect costs nothing instead of running
  // three writes and a Color parse on every single frame.
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.color.value.set(color);
    materialRef.current.uniforms.power.value = power;
    materialRef.current.uniforms.intensity.value = intensity;
  }, [color, power, intensity]);

  return (
    <mesh>
      <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
            fresnel = pow(fresnel, power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// NLX: chassis kept light/neutral so the robot sits naturally on the Soft Cloud background
const earBaseMat = new THREE.MeshStandardMaterial({
  color: "#F1F5F9",
  roughness: 0.5,
});
const earRingMat = new THREE.MeshStandardMaterial({
  color: "#FFFFFF",
  roughness: 0.3,
});
const earCenterMat = new THREE.MeshStandardMaterial({
  color: "#E2E8F0",
  roughness: 0.8,
});
const antennaBaseMat = new THREE.MeshStandardMaterial({
  color: "#94A3B8",
  roughness: 0.4,
  metalness: 0.5,
});
const antennaStickMat = new THREE.MeshStandardMaterial({
  color: "#CBD5E1",
  roughness: 0.4,
  metalness: 0.2,
});
// NLX: antenna tip recolored from pink to Cyan (your doc's secondary accent color)
const antennaTipMat = new THREE.MeshStandardMaterial({
  color: "#0891B2",
  roughness: 0.2,
  toneMapped: false,
});

function RobotEar({
  position,
  scale = 1,
  isLeft = false,
}: {
  position: [number, number, number];
  scale?: number;
  isLeft?: boolean;
}) {
  const dir = isLeft ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earBaseMat}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earRingMat}
      >
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earCenterMat}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>

      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh
          position={[0, 0.01, 0]}
          castShadow
          receiveShadow
          material={antennaBaseMat}
        >
          <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh
          position={[0, 0.06, 0]}
          castShadow
          receiveShadow
          material={antennaStickMat}
        >
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh
          position={[0, 0.11, 0]}
          castShadow
          receiveShadow
          material={antennaTipMat}
        >
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

// Over-bright and untonemapped so the eyes read as lit glass on the dark stage.
const eyeMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color(1.7, 1.9, 2.3),
  toneMapped: false,
  transparent: true,
});
// NLX: heart-eye easter egg uses Cyan to stay in the secondary-accent family
const heartMat = new THREE.MeshBasicMaterial({
  color: "#0891B2",
  toneMapped: false,
});

function RobotEye({
  position,
  rotation,
  scale = 1,
  blinkDuration = 0.15,
  blinkCycle = 3.0,
  isLovedRef,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  blinkDuration?: number;
  blinkCycle?: number;
  // React 19 deprecates MutableRefObject; RefObject is already mutable.
  isLovedRef: React.RefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const normalEyesRef = useRef<THREE.Group>(null);
  const heartEyeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current)
      return;

    const isHeart = isLovedRef.current;

    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;

    const cycle = clock.getElapsedTime() % blinkCycle;

    let targetScaleY = 1;

    if (cycle < blinkDuration && !isHeart) {
      const progress = cycle / blinkDuration;
      const blinkClose = Math.sin(progress * Math.PI);

      targetScaleY = Math.max(0.05, 1.0 - blinkClose);
    }

    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025;
    const h = 0.035;
    const r = 0.02;
    const g = 0.005;

    const tPath = new THREE.CurvePath<THREE.Vector3>();
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, g, 0),
        new THREE.Vector3(-w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, h - r, 0),
        new THREE.Vector3(-w, h, 0),
        new THREE.Vector3(-w + r, h, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, h, 0),
        new THREE.Vector3(w - r, h, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, h, 0),
        new THREE.Vector3(w, h, 0),
        new THREE.Vector3(w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, h - r, 0),
        new THREE.Vector3(w, g, 0),
      ),
    );

    const bPath = new THREE.CurvePath<THREE.Vector3>();
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, -g, 0),
        new THREE.Vector3(-w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, -(h - r), 0),
        new THREE.Vector3(-w, -h, 0),
        new THREE.Vector3(-w + r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, -h, 0),
        new THREE.Vector3(w - r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, -h, 0),
        new THREE.Vector3(w, -h, 0),
        new THREE.Vector3(w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, -(h - r), 0),
        new THREE.Vector3(w, -g, 0),
      ),
    );

    return { topPath: tPath, bottomPath: bPath };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>

      <group ref={normalEyesRef}>
        <mesh material={eyeMat}>
          <tubeGeometry args={[topPath, 20, 0.0035, 8, false]} />
        </mesh>
        <mesh material={eyeMat}>
          <tubeGeometry args={[bottomPath, 20, 0.0035, 8, false]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * The chassis speckle. This used to be 10,000 `ctx.arc()` fills across two
 * 512px canvases behind a `setTimeout`, and the robot returned `null` until it
 * resolved — so the hero's focal object was gated behind a main-thread stall.
 *
 * Same look, built synchronously: one 128px `ImageData` pass writing bytes
 * directly (the grain is sampled at `repeat(6,3)` and modulated by a
 * `bumpScale` of 0.005, so the extra resolution was never visible anyway).
 * Fast enough to run inline during render, which lets the robot draw on the
 * very first frame.
 */
const TEXTURE_SIZE = 128;

function makeSpeckleTextures(): {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = TEXTURE_SIZE;
  const canvasC = document.createElement("canvas");
  const canvasB = document.createElement("canvas");
  canvasC.width = canvasB.width = size;
  canvasC.height = canvasB.height = size;
  const ctxC = canvasC.getContext("2d");
  const ctxB = canvasB.getContext("2d");

  if (ctxC && ctxB) {
    const imgC = ctxC.createImageData(size, size);
    const imgB = ctxB.createImageData(size, size);
    const dC = imgC.data;
    const dB = imgB.data;

    for (let i = 0; i < size * size; i++) {
      const o = i * 4;
      // ~15% of texels stay bright, the rest take the darker speckle — the
      // same ratio the arc-based version used.
      const bright = Math.random() > 0.85;

      // #FFFFFF vs #CBD5E1
      dC[o] = bright ? 255 : 203;
      dC[o + 1] = bright ? 255 : 213;
      dC[o + 2] = bright ? 255 : 225;
      dC[o + 3] = 255;

      const b = bright ? 255 : 0;
      dB[o] = dB[o + 1] = dB[o + 2] = b;
      dB[o + 3] = 255;
    }

    ctxC.putImageData(imgC, 0, 0);
    ctxB.putImageData(imgB, 0, 0);
  }

  const texC = new THREE.CanvasTexture(canvasC);
  const texB = new THREE.CanvasTexture(canvasB);
  texC.wrapS = texB.wrapS = THREE.RepeatWrapping;
  texC.wrapT = texB.wrapT = THREE.RepeatWrapping;

  texC.repeat.set(6, 3);
  texB.repeat.set(6, 3);
  // The colour map feeds `map`, so it has to be read as sRGB or the chassis
  // shifts. The bump map is raw data and must stay linear.
  texC.colorSpace = THREE.SRGBColorSpace;
  texC.needsUpdate = true;
  texB.needsUpdate = true;

  return { colorMap: texC, bumpMap: texB };
}

function RobotPrototype({
  neckParams = {
    baseR: 0.25,
    baseH: -0.01,
    midR: 0.23,
    midH: 0.02,
    lipBottomR: 0.27,
    lipBottomH: 0.025,
    lipTopR: 0.28,
    lipTopH: 0.05,
    innerR: 0.24,
    innerDropH: 0.03,
  },
  bodyParams = { bodyBevelR: 0.21, bodyBevelY: 0.38, bodyBevelT: 0.015 },
  color = "#F1F5F9",
  pantallaColor = "#3B82F6",
  pantallaBrillo = 1.2,
  blinkCycle = 3.0,
  metalness = 0.0,
}: {
  neckParams?: Record<string, number>;
  bodyParams?: Record<string, number>;
  color?: string;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
}) {
  const isLovedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Built inline rather than in an effect: the robot must not be `null` on the
  // first frame. Disposed on unmount below.
  const textures = useMemo(() => makeSpeckleTextures(), []);

  const design = {
    pantallaColor: pantallaColor,
    pantallaGrosor: 3.8,
    pantallaBrillo: pantallaBrillo,
    separacionOjos: 0.07,
    tamanoOrejas: 1.3,
    escalaOjos: 1.1,
    parpadeoFrecuencia: blinkCycle,
    parpadeoDuracion: 0.45,
    colorChasis: color,
    alturaCabeza: 0.6,
  };

  const config = {
    moveSpeed: 0.35,
    bodyRotSpeed: 10.0,
    headRotSpeed: 20.0,
    bodyTiltX: 0.0,
    bodyTiltY: 0.95,
    headLookX: 0.3,
    headLookY: 1.8,
  };

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);

    const tx = state.pointer.x;
    const ty = state.pointer.y;

    const maxMoveX = state.viewport.width / 3.5;
    const targetPosX = tx * maxMoveX;
    bodyRef.current.position.x = THREE.MathUtils.lerp(
      bodyRef.current.position.x,
      targetPosX,
      config.moveSpeed * dt,
    );

    const relativeX = tx - bodyRef.current.position.x / 2.5;

    const bodyTargetRotY = -relativeX * config.bodyTiltY;
    const bodyTargetRotX = relativeX * relativeX * config.bodyTiltX - ty * 0.25;
    const bodyTargetRotZ = -relativeX * 0.15;

    bodyRef.current.rotation.y = THREE.MathUtils.lerp(
      bodyRef.current.rotation.y,
      bodyTargetRotY,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(
      bodyRef.current.rotation.x,
      bodyTargetRotX,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(
      bodyRef.current.rotation.z,
      bodyTargetRotZ,
      config.bodyRotSpeed * dt,
    );

    const headTargetRotY = relativeX * config.headLookY;
    const headTargetRotX = -ty * config.headLookX;

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      headTargetRotY,
      config.headRotSpeed * dt,
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      headTargetRotX,
      config.headRotSpeed * dt,
    );
  });

  useEffect(() => {
    return () => {
      textures.colorMap.dispose();
      textures.bumpMap.dispose();
    };
  }, [textures]);

  // Clear the easter-egg timer if the hero unmounts mid-animation.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePointerDown = (
    e: import("@react-three/fiber").ThreeEvent<PointerEvent>,
  ) => {
    e.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isLovedRef.current = false;
    }, 2000);
  };

  const neckProfile = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(neckParams.innerR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.baseR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.midR, neckParams.midH));
    points.push(
      new THREE.Vector2(neckParams.lipBottomR, neckParams.lipBottomH),
    );
    points.push(new THREE.Vector2(neckParams.lipTopR, neckParams.lipTopH));
    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH));
    points.push(
      new THREE.Vector2(
        neckParams.innerR,
        neckParams.lipTopH - neckParams.innerDropH,
      ),
    );
    return points;
  }, [neckParams]);

  // NLX: the head stays the one dark part (it is the screen), lifted just
  // enough to separate from the near-black stage behind it.
  const headMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#131A26",
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  return (
    <group
      ref={bodyRef}
      position={[0, -0.3, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry
          args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]}
        />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={metalness}
          envMapIntensity={0.0}
        />
      </mesh>

      {bodyParams.bodyBevelT > 0 && (
        <mesh
          position={[0, bodyParams.bodyBevelY, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry
            args={[bodyParams.bodyBevelR, bodyParams.bodyBevelT, 32, 64]}
          />
          <meshStandardMaterial
            color={design.colorChasis}
            map={textures.colorMap || undefined}
            bumpMap={textures.bumpMap || undefined}
            bumpScale={0.005}
            roughness={1.0}
            metalness={metalness}
            envMapIntensity={0.0}
          />
        </mesh>
      )}

      <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
        <latheGeometry args={[neckProfile, 64]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={metalness}
          envMapIntensity={0.0}
        />
      </mesh>

      <group ref={headRef} position={[0, design.alturaCabeza, 0]}>
        <mesh material={headMat} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
        </mesh>

        <GlassCapsule
          color={design.pantallaColor}
          power={design.pantallaGrosor}
          intensity={design.pantallaBrillo}
        />

        <group position={[0, -0.02, 0.29]}>
          <RobotEye
            position={[-design.separacionOjos, 0, 0]}
            rotation={[0, -0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
          <RobotEye
            position={[design.separacionOjos, 0, 0]}
            rotation={[0, 0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
        </group>

        <RobotEar
          position={[-0.29, 0, 0]}
          isLeft={true}
          scale={design.tamanoOrejas}
        />
        <RobotEar
          position={[0.29, 0, 0]}
          isLeft={false}
          scale={design.tamanoOrejas}
        />
      </group>
    </group>
  );
}

export interface NavItem {
  label: string;
  href: string;
  target?: string;
}

export interface RobotHeroProps {
  backgroundText?: string;
  navItemsLeft?: NavItem[];
  contactText?: string;
  contactHref?: string;
  contactTarget?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  color?: string;
  scale?: number;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
  headline?: string;
  subheadline?: string;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  backgroundImageSrc?: string;
  /**
   * The hero ships with its own AntennaNavbar. The NLX layout already mounts
   * FloatingNavbar, so this is off by default — turn it on only if you drop that.
   */
  showNavbar?: boolean;
}

function AntennaNavbar({
  leftItems,
  contactText,
  contactHref,
  contactTarget,
  ctaText,
  onCtaClick,
}: {
  leftItems: NavItem[];
  contactText: string;
  contactHref: string;
  contactTarget?: string;
  ctaText: string;
  onCtaClick?: () => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const lineOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  return (
    <nav className="sticky top-0 z-50 w-full pt-8 px-8 pointer-events-none">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col relative pointer-events-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between relative gap-4 lg:gap-0">
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 z-20">
            {leftItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative px-7 py-2.5 rounded-full bg-[#10131A]/80 text-[#F8FAFC] border border-[#252B36] hover:border-[#3A424F] text-sm font-medium backdrop-blur-sm transition-all overflow-hidden"
              >
                {item.label}
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navbar-indicator-left"
                    className="absolute inset-0 border-b-[3px] border-[#3B82F6]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-auto cursor-pointer group z-10">
            <div className="relative flex items-center justify-center h-12 w-16">
              <div className="absolute left-2 w-1.5 h-4 bg-[#3A424F] rounded-l-md transition-transform duration-300 group-hover:-translate-x-1" />
              <div className="absolute right-2 w-1.5 h-4 bg-[#3A424F] rounded-r-md transition-transform duration-300 group-hover:translate-x-1" />
              <div className="z-10 w-10 h-10 bg-[#151A23] border-2 border-[#252B36] backdrop-blur-md rounded-[12px] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-[#3A424F]">
                <div className="w-[70%] h-[60%] bg-[#080A0F] rounded-lg flex items-center justify-center gap-1.5 overflow-hidden">
                  <div className="w-1.5 h-3 bg-[#3B82F6] rounded-[2px] shadow-[0_0_8px_#3B82F6] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                  <div className="w-1.5 h-3 bg-[#3B82F6] rounded-[2px] shadow-[0_0_8px_#3B82F6] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2 sm:gap-3 w-full lg:w-auto mt-4 lg:mt-0 z-20">
            <a
              href={contactHref}
              target={contactTarget}
              rel={
                contactTarget === "_blank" ? "noopener noreferrer" : undefined
              }
              className="px-5 sm:px-7 py-2.5 rounded-full bg-[#10131A]/80 text-[#F8FAFC] border border-[#252B36] hover:bg-[#151A23] hover:border-[#3A424F] text-xs sm:text-sm font-medium backdrop-blur-sm transition-all"
            >
              {contactText}
            </a>
            <button
              onClick={onCtaClick}
              className="px-5 sm:px-7 py-2.5 rounded-full bg-[#3B82F6] text-[#0B0F17] text-xs sm:text-sm font-semibold hover:bg-[#60A5FA] active:bg-[#93B4FB] transition-colors flex items-center gap-2 shadow-[0_6px_22px_rgba(59,130,246,0.35)]"
            >
              {ctaText}
              <PiWhatsappLogoBold size={18} />
            </button>
          </div>
        </div>

        <motion.div
          style={{ opacity: lineOpacity }}
          className="w-full mt-6 border-b-2 border-dotted border-[#252B36]"
        />
      </div>
    </nav>
  );
}

export function RobotHero({
  backgroundText = "NLX",
  navItemsLeft = [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "Pricing", href: "#pricing" },
  ],
  contactText = "Contact",
  contactHref = "#contact",
  contactTarget,
  ctaText = "WhatsApp Us",
  onCtaClick,
  color = "#F1F5F9",
  scale = 1,
  pantallaColor = "#3B82F6",
  pantallaBrillo = 1.7,
  blinkCycle = 3.0,
  metalness = 0.0,
  headline = "Automate what's slowing your business down.",
  subheadline = "AI automation and custom software for growing businesses — WhatsApp chatbots, AI chatbots, and full business systems, built end to end.",
  secondaryCtaText = "See services",
  onSecondaryCtaClick,
  backgroundImageSrc = "/hero-bg-dark.png",
  showNavbar = false,
}: RobotHeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null);

  // The canvas fades in when the scene actually exists, rather than on a timer.
  // It used to ride a `animate-in … zoom-in-95` keyframe with
  // `animation-fill-mode: both`, which parks the element at `opacity: 0` until
  // the animation runs — so any condition that keeps the animation from
  // starting (a backgrounded tab freezes both CSS animations and the
  // ResizeObserver that R3F sizes itself from) left the robot permanently
  // invisible. A plain opacity transition driven by `onCreated` cannot get
  // stuck in the hidden state.
  const [sceneReady, setSceneReady] = useState(false);
  const handleCreated = useCallback(() => setSceneReady(true), []);

  // Don't burn a render loop on a hero nobody is looking at. The robot tracks
  // the cursor and blinks continuously, so left unpaused it drives the GPU for
  // the entire length of the page.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // NLX: dark stage. Ambient is pulled well down and replaced with a bright
  // neutral key plus a blue fill, so the light chassis keeps real form and a
  // blue rim instead of being flat-lit the way it was on the light background.
  const entorno = {
    fondoArriba: "#080A0F",
    fondoMedio: "#0B0F17",
    fondoAbajo: "#10131A",
    luzAmbiente: 0.45,
    luzPrincipal: 1.25,
    luzPrincipalColor: "#FFFFFF",
    luzRelleno: 0.75,
    luzRellenoColor: "#3B82F6",
    // drei's ContactShadows can only ever darken: its shader resolves to
    // `vec4(ucolor * fragCoordZ * 2.0, 1.0 - fragCoordZ)`, so where the shadow
    // is densest the alpha is high but the colour is driven to black. A white
    // `color` therefore renders nothing. It stays black (near-invisible on this
    // stage) and <FloorGlow> below provides the light pool that grounds the robot.
    sombraColor: "#000000",
    sombraOpacidad: 0.45,
    sombraBlur: 2.6,
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-dvh min-h-[600px] overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${entorno.fondoArriba} 0%, ${entorno.fondoArriba} 55%, ${entorno.fondoMedio} 65%, ${entorno.fondoAbajo} 100%)`,
      }}
    >
      {/* fal.ai-generated background image — subtle abstract tech visualization,
          sits below the watermark text and the 3D canvas. See the accompanying
          prompt document for the exact generation brief. */}
      <div className="absolute inset-0 z-0 animate-in fade-in ease-out fill-mode-both duration-1000">
        <Image
          src={backgroundImageSrc}
          alt=""
          fill
          // `priority` is deprecated in Next.js 16; `preload` is the replacement
          // and this is the hero's above-the-fold LCP candidate.
          preload
          sizes="100vw"
          className="object-cover opacity-80"
        />
      </div>

      {/* Scrim: the generated art is brightest at the edges, which is exactly
          where the copy sits. This darkens the left/centre so text stays legible
          without flattening the artwork at the far edges. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(120% 90% at 28% 50%, rgba(8,10,15,0.92) 0%, rgba(8,10,15,0.72) 38%, rgba(8,10,15,0.28) 68%, rgba(8,10,15,0) 100%)",
        }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden animate-in fade-in ease-out fill-mode-both duration-1000 delay-200"
        style={{ zIndex: 2 }}
      >
        <h1
          className="font-sans font-black select-none whitespace-nowrap"
          style={{
            color: "#F8FAFC",
            opacity: 0.055,
            letterSpacing: "-0.05em",
            fontSize: "clamp(4rem, 15vw, 14rem)",
            lineHeight: 1,
            transform: `translate(0px, 40px) rotate(0deg)`,
          }}
        >
          {backgroundText}
        </h1>
      </div>

      <div
        className="absolute inset-0 z-10 transition-opacity duration-1000 ease-out motion-reduce:transition-none"
        style={{ opacity: sceneReady ? 1 : 0 }}
      >
        <Canvas
          // `shadows` as a bare boolean asks R3F for PCFSoftShadowMap, which
          // three r186 removed — it warns and falls back to PCFShadowMap.
          // Naming that map directly is the same result without the warning.
          shadows="percentage"
          camera={{ position: [0, 0.2, 6], fov: 40 }}
          dpr={[1, 1.5]}
          frameloop={inView ? "always" : "never"}
          onCreated={handleCreated}
          // Lets R3F scale the internal resolution down instead of dropping
          // frames when the GPU is struggling.
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={entorno.luzAmbiente} color="#ffffff" />

          <directionalLight
            position={[0, 6, 3]}
            intensity={entorno.luzPrincipal}
            color={entorno.luzPrincipalColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-1.5, 1.5, 1.5, -1.5, 0.1, 20]}
            />
          </directionalLight>

          <directionalLight
            position={[-5, 2, -5]}
            intensity={entorno.luzRelleno}
            color={entorno.luzRellenoColor}
          />

          {/*
            This was `<Environment preset="night" />`, which fetches a 1.75 MB
            .hdr from raw.githack.com at runtime. R3F wraps every Canvas child
            in a single Suspense boundary, so that download blocked the *whole*
            scene — the robot included — and if the CDN was slow, rate-limited
            or blocked, the robot never appeared at all.

            Built locally instead: two Lightformers baked into a 64px cube map
            once (`frames={1}`). No network, no suspend, and the metal antenna
            parts keep the specular response they need. The chassis materials
            all set `envMapIntensity={0}`, so they never used the HDR anyway.
          */}
          <Environment resolution={64} frames={1}>
            <color attach="background" args={["#0B0F17"]} />
            <Lightformer
              intensity={2.2}
              color="#FFFFFF"
              position={[0, 2, 3]}
              scale={[6, 6, 1]}
            />
            <Lightformer
              intensity={1.4}
              color="#3B82F6"
              position={[-4, 1, -2]}
              scale={[5, 5, 1]}
            />
            <Lightformer
              intensity={0.8}
              color="#0891B2"
              position={[4, -1, -2]}
              scale={[4, 4, 1]}
            />
          </Environment>

          <ResponsiveGroup scale={scale}>
            <FloorGlow />
            {/* `frames={1}` bakes the shadow once. Without it drei re-renders
                the whole depth pass every frame, which is the single most
                expensive thing in this scene — and the robot barely moves. */}
            <ContactShadows
              position={[0, -0.79, 0]}
              opacity={entorno.sombraOpacidad}
              scale={15}
              resolution={256}
              blur={entorno.sombraBlur}
              far={2.5}
              frames={1}
              color={entorno.sombraColor}
            />
            <RobotPrototype
              neckParams={{
                baseR: 0.215,
                baseH: -0.05,
                midR: 0.28,
                midH: 0.02,
                lipBottomR: 0.295,
                lipBottomH: 0.045,
                lipTopR: 0.27,
                lipTopH: 0.055,
                innerR: 0.1,
                innerDropH: 0.0,
              }}
              bodyParams={{
                bodyBevelR: 0.235,
                bodyBevelY: 0.34,
                bodyBevelT: 0.025,
              }}
              color={color}
              pantallaColor={pantallaColor}
              pantallaBrillo={pantallaBrillo}
              blinkCycle={blinkCycle}
              metalness={metalness}
            />
          </ResponsiveGroup>
      </Canvas>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
        {showNavbar && (
          <AntennaNavbar
            leftItems={navItemsLeft}
            contactText={contactText}
            contactHref={contactHref}
            contactTarget={contactTarget}
            ctaText={ctaText}
            onCtaClick={onCtaClick}
          />
        )}

        <div className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-8 flex-1 flex flex-col justify-end lg:justify-center">
          {/* From `lg` up the copy is vertically centred beside the robot.
              Below that the robot lifts to the top and the copy sits under it,
              with padding that clears the pill nav fixed to the bottom. */}
          <div className="flex flex-col gap-6 pb-28 sm:pb-20 lg:pb-0 w-full max-w-xl pointer-events-auto">
            <h2 className="font-semibold text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] text-[#F8FAFC]">
              <WordReveal text={headline} delay={260} step={70} />
            </h2>
            <WordReveal
              text={subheadline}
              delay={260 + headline.split(" ").length * 70}
              step={16}
              className="block text-base sm:text-lg text-[#94A3B8] max-w-xl"
            />
            <div className="flex flex-wrap gap-3 mt-2 animate-in fade-in slide-in-from-bottom-4 blur-in-[6px] ease-out fill-mode-both duration-700 delay-[580ms]">
              <button
                onClick={onCtaClick}
                className="px-6 py-3 rounded-full bg-[#3B82F6] text-[#0B0F17] text-sm font-semibold hover:bg-[#60A5FA] active:bg-[#93B4FB] transition-colors flex items-center gap-2 shadow-[0_6px_22px_rgba(59,130,246,0.35)]"
              >
                {ctaText}
                <PiWhatsappLogoBold size={18} />
              </button>
              <button
                onClick={onSecondaryCtaClick}
                className="px-6 py-3 rounded-full bg-[#10131A]/80 border border-[#252B36] text-[#F8FAFC] text-sm font-medium backdrop-blur-sm hover:bg-[#151A23] hover:border-[#3A424F] transition-colors"
              >
                {secondaryCtaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RobotHero;

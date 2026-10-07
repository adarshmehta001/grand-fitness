import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import './DumbbellHero.css';

// Axis-aligned helper: align lathe / cylinder geometries along X axis (rotate Z by 90°)
const X_AXIS = [0, 0, Math.PI / 2];

/**
 * Creates a LatheGeometry cross-section profile for weight plates with bevelled / chamfered outer edges.
 * Outer edge bevel allows specular light sweeps to smoothly wrap around the plate perimeter.
 */
function createBeveledPlateGeometry(radius, thickness, bevel = 0.02) {
  const points = [];
  const innerR = 0.092; // hole for bar sleeve
  const halfT = thickness / 2;
  const b = Math.min(bevel, thickness * 0.22, radius * 0.08);

  points.push(new THREE.Vector2(innerR, -halfT));
  points.push(new THREE.Vector2(radius - b, -halfT));
  points.push(new THREE.Vector2(radius, -halfT + b));
  points.push(new THREE.Vector2(radius, halfT - b));
  points.push(new THREE.Vector2(radius - b, halfT));
  points.push(new THREE.Vector2(innerR, halfT));

  return new THREE.LatheGeometry(points, 64);
}

function DumbbellMesh({ pointer }) {
  const groupRef = useRef(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5.5;

  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Generate procedural diamond knurling normal map for the central grip shaft
  const knurlTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, 256, 256);

    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;

    const step = 16;
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const idx = (y * 256 + x) * 4;
        const slopeX = Math.sin((x + y) * Math.PI * 2 / step) * 0.5 + Math.sin((x - y) * Math.PI * 2 / step) * 0.5;
        const slopeY = Math.cos((x + y) * Math.PI * 2 / step) * 0.5 - Math.cos((x - y) * Math.PI * 2 / step) * 0.5;

        data[idx] = Math.max(0, Math.min(255, Math.floor(128 + slopeX * 90)));
        data[idx + 1] = Math.max(0, Math.min(255, Math.floor(128 + slopeY * 90)));
        data[idx + 2] = 230;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 2);
    return tex;
  }, []);

  // ── MATERIALS ──
  // Plates: Dark cast-iron / powder-coated steel with low roughness, high metalness & subtle clearcoat
  const plateMat = useMemo(
    () =>
    new THREE.MeshPhysicalMaterial({
      color: '#1a1a1d',
      roughness: 0.28,
      metalness: 0.88,
      clearcoat: 0.15,
      clearcoatRoughness: 0.25
    }),
    []
  );

  // Bar shaft & sleeves: Brushed chrome with lower roughness & higher metalness
  const barMat = useMemo(
    () =>
    new THREE.MeshPhysicalMaterial({
      color: '#d0d0d5',
      roughness: 0.16,
      metalness: 0.96,
      clearcoat: 0.08,
      clearcoatRoughness: 0.15
    }),
    []
  );

  // Grip shaft: Machined steel with knurled normal map (no bead geometry)
  const gripMat = useMemo(
    () =>
    new THREE.MeshPhysicalMaterial({
      color: '#b5b5ba',
      roughness: 0.22,
      metalness: 0.94,
      normalMap: knurlTexture,
      normalScale: new THREE.Vector2(0.75, 0.75)
    }),
    [knurlTexture]
  );

  // Stop collars: Polished steel
  const collarMat = useMemo(
    () =>
    new THREE.MeshPhysicalMaterial({
      color: '#e2e2e6',
      roughness: 0.12,
      metalness: 0.98
    }),
    []
  );

  // ── GEOMETRIES ──
  const innerPlateGeo = useMemo(() => createBeveledPlateGeometry(0.44, 0.11), []);
  const midPlateGeo = useMemo(() => createBeveledPlateGeometry(0.58, 0.14), []);
  const outerPlateGeo = useMemo(() => createBeveledPlateGeometry(0.72, 0.18), []);

  useFrame(({ clock }) => {
    if (!groupRef.current || prefersReducedMotion.current) return;
    const t = clock.getElapsedTime();

    // Constrain Y rotation so the object stays in an oblique 15°–33° view range
    // and never turns face-on where plates read as flat circles
    const baseAngleY = 0.42; // ~24 degrees
    groupRef.current.rotation.y = baseAngleY + Math.sin(t * 0.35) * 0.14;
    groupRef.current.rotation.x =
    0.18 +
    Math.sin(t * 0.25) * 0.03 +
    THREE.MathUtils.lerp(0, pointer.current.y * 0.08, 0.05);
    groupRef.current.rotation.z =
    -0.12 +
    Math.cos(t * 0.22) * 0.02 +
    THREE.MathUtils.lerp(0, pointer.current.x * 0.08, 0.05);
  });

  return (
    // Parent Group: Positioned to the right of headline on desktop, centered in contained 16:10 box on mobile
    <group ref={groupRef} position={isMobile ? [0, 0, 0] : [1.15, -0.05, 0]} scale={isMobile ? 0.95 : 1.0}>

      {/* ── CONTINUOUS CORE SHAFT ── (Runs end-to-end through center bore of all components) */}
      <mesh rotation={X_AXIS} material={barMat}>
        <cylinderGeometry args={[0.065, 0.065, 1.76, 32]} />
      </mesh>

      {/* ── KNURLED GRIP SLEEVE ── (Center section between stop collars) */}
      <mesh rotation={X_AXIS} material={gripMat}>
        <cylinderGeometry args={[0.069, 0.069, 0.70, 32]} />
      </mesh>

      {/* ── SLEEVES / WEIGHT HOLDERS ── (Outer shafts holding weight plates) */}
      <mesh position={[-0.58, 0, 0]} rotation={X_AXIS} material={barMat}>
        <cylinderGeometry args={[0.088, 0.088, 0.46, 32]} />
      </mesh>
      <mesh position={[0.58, 0, 0]} rotation={X_AXIS} material={barMat}>
        <cylinderGeometry args={[0.088, 0.088, 0.46, 32]} />
      </mesh>

      {/* ── INNER STOP COLLARS ── (Pressed flush against inner plates) */}
      <mesh position={[-0.39, 0, 0]} rotation={X_AXIS} material={collarMat}>
        <cylinderGeometry args={[0.135, 0.135, 0.08, 48]} />
      </mesh>
      <mesh position={[0.39, 0, 0]} rotation={X_AXIS} material={collarMat}>
        <cylinderGeometry args={[0.135, 0.135, 0.08, 48]} />
      </mesh>

      {/* ── LEFT WEIGHT PLATES (Stacked flush with zero gaps) ── */}
      {/* Inner large plate (flush against stop collar) */}
      <mesh position={[-0.50, 0, 0]} rotation={X_AXIS} geometry={outerPlateGeo} material={plateMat} />
      {/* Mid plate (flush against inner plate) */}
      <mesh position={[-0.63, 0, 0]} rotation={X_AXIS} geometry={midPlateGeo} material={plateMat} />
      {/* Outer small plate (flush against mid plate) */}
      <mesh position={[-0.74, 0, 0]} rotation={X_AXIS} geometry={innerPlateGeo} material={plateMat} />

      {/* ── RIGHT WEIGHT PLATES (Stacked flush with zero gaps) ── */}
      {/* Inner large plate (flush against stop collar) */}
      <mesh position={[0.50, 0, 0]} rotation={X_AXIS} geometry={outerPlateGeo} material={plateMat} />
      {/* Mid plate (flush against inner plate) */}
      <mesh position={[0.63, 0, 0]} rotation={X_AXIS} geometry={midPlateGeo} material={plateMat} />
      {/* Outer small plate (flush against mid plate) */}
      <mesh position={[0.74, 0, 0]} rotation={X_AXIS} geometry={innerPlateGeo} material={plateMat} />

      {/* ── OUTER LOCKING END CAPS ── (Flush against outer plate) */}
      <mesh position={[-0.82, 0, 0]} rotation={X_AXIS} material={collarMat}>
        <cylinderGeometry args={[0.095, 0.095, 0.05, 32]} />
      </mesh>
      <mesh position={[0.82, 0, 0]} rotation={X_AXIS} material={collarMat}>
        <cylinderGeometry args={[0.095, 0.095, 0.05, 32]} />
      </mesh>

    </group>);

}

function Scene({ pointer }) {
  return (
    <>
      {/* ── 3-POINT LIGHTING RIG ── */}
      {/* Low-key ambient base */}
      <ambientLight intensity={0.12} />

      {/* Key Light: High angle right front creating a prominent highlight sweep */}
      <directionalLight position={[6, 5, 4]} intensity={1.8} color="#ffffff" />

      {/* Fill Light: Soft blue-tinted fill from opposite side */}
      <directionalLight position={[-6, 1, -2]} intensity={0.45} color="#b0c4de" />

      {/* Rim / Back Light: Separates metal object edges from dark background */}
      <directionalLight position={[-2, 4, -5]} intensity={1.3} color="#ffffff" />

      {/* Subtle Apex Lime Accent Backlight */}
      <directionalLight position={[3, -2, -3]} intensity={0.3} color="#d4ff00" />

      <DumbbellMesh pointer={pointer} />

      {/* Studio environment map for realistic metallic reflections */}
      <Environment preset="studio" />
    </>);

}



function StaticFallback() {
  return (
    <div className="dumbbell-fallback" aria-hidden="true">
      <div className="dumbbell-static">
        <div className="static-plate static-plate--outer static-plate--left" />
        <div className="static-plate static-plate--inner static-plate--left" />
        <div className="static-bar" />
        <div className="static-plate static-plate--inner static-plate--right" />
        <div className="static-plate static-plate--outer static-plate--right" />
      </div>
    </div>);

}

export default function DumbbellHero() {
  const pointer = useRef({ x: 0, y: 0 });
  const wrapRef = useRef(null);
  const [webglAvailable, setWebglAvailable] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setWebglAvailable(!!ctx);
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handle = (e) => {
      pointer.current = {
        x: e.clientX / window.innerWidth * 2 - 1,
        y: -(e.clientY / window.innerHeight * 2 - 1)
      };
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  if (prefersReducedMotion) return <StaticFallback />;
  if (webglAvailable === false) return <StaticFallback />;

  return (
    <div ref={wrapRef} className="dumbbell-canvas-wrap" aria-hidden="true">
      <Suspense fallback={<StaticFallback />}>
        <Canvas
          dpr={Math.min(window.devicePixelRatio, 1.5)}
          camera={{ position: [0, 0.6, 5.2], fov: 36 }}
          frameloop={isVisible ? 'always' : 'never'}
          style={{ touchAction: 'pan-y' }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}>
          
          <Scene pointer={pointer} />
        </Canvas>
      </Suspense>
    </div>);

}
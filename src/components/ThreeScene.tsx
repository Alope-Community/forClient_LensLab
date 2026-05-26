import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { calcEV, calcStops } from "../utils/cameraMath";

function useWoodTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Base gradient warm brown
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, "#7A4F2D");
    grad.addColorStop(0.3, "#9B6740");
    grad.addColorStop(0.6, "#8B5E35");
    grad.addColorStop(1, "#7A4F2D");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Wood grain lines
    for (let i = 0; i < 120; i++) {
      const y = Math.random() * 1024;
      const alpha = 0.08 + Math.random() * 0.2;
      const dark = Math.random() > 0.5;
      ctx.strokeStyle = dark
        ? `rgba(30,15,5,${alpha})`
        : `rgba(200,150,80,${alpha * 0.6})`;
      ctx.lineWidth = 0.5 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      let cx = 0;
      while (cx < 1024) {
        cx += 80 + Math.random() * 120;
        ctx.lineTo(cx, y + (Math.random() - 0.5) * 22);
      }
      ctx.stroke();
    }

    // Subtle knots
    for (let k = 0; k < 3; k++) {
      const kx = 150 + Math.random() * 700;
      const ky = 150 + Math.random() * 700;
      for (let r = 30; r > 0; r -= 3) {
        ctx.strokeStyle = `rgba(50,25,8,${0.04 + (30 - r) * 0.003})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(kx, ky, r * 1.5, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }, []);
}

function useFloorTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1C1410";
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 40; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle = `rgba(80,50,20,${0.06 + Math.random() * 0.1})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y + (Math.random() - 0.5) * 10); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, []);
}

function Floor() {
  const floor = useFloorTexture();
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.08, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial map={floor} roughness={0.95} metalness={0} />
    </mesh>
  );
}

function Marbles() {
  const marbles = useMemo(() => {
    const colors = [
      "#FF6B6B",
      "#FFD93D",
      "#6BCB77",
      "#4D96FF",
      "#B983FF",
      "#FF8E3C",
      "#F72585",
      "#90BE6D",
      "#43AA8B",
      "#577590",
    ];

    return Array.from({ length: 40 }, (_, i) => {
      const radius = 0.05 + Math.random() * 0.06;

      return {
        id: i,
        radius,
        position: [
          (Math.random() - 0.5) * 3.8,
          radius + 0.09, // tetap menyentuh meja
          (Math.random() - 0.5) * 1.6,
        ] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
  }, []);

  return (
    <group>
      {marbles.map((m) => (
        <mesh
          key={m.id}
          castShadow
          receiveShadow
          position={m.position}
        >
          <sphereGeometry args={[m.radius, 32, 32]} />
          <meshPhysicalMaterial
            color={m.color}
            roughness={0.05}
            transmission={1}
            thickness={0.4}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function BookStack() {
  const books = useMemo(() => {
    const palette = [
      "#5A2E2E",
      "#2F4363",
      "#6A5A2E",
      "#4A345F",
      "#3D5B45",
      "#6B3F24",
      "#2E2E2E",
    ];

    let stackY = 0.09;

    return Array.from({ length: 7 }, (_, i) => {
      const h = 0.1 + Math.random() * 0.08;
      const w = 0.9 + Math.random() * 0.4;
      const d = 0.6 + Math.random() * 0.2;

      const isLeather = Math.random() > 0.6;

      const book = {
        id: i,
        width: w,
        height: h,
        depth: d,
        y: stackY,
        color: palette[Math.floor(Math.random() * palette.length)],

        x: 1.55 + (Math.random() - 0.5) * 0.05,
        z: -0.72 + (Math.random() - 0.5) * 0.05,

        rotY: (Math.random() - 0.5) * 0.2,
        rotZ: (Math.random() - 0.5) * 0.05,
        rotX: (Math.random() - 0.5) * 0.03,

        isLeather,
      };

      stackY += h * 0.92; // slight compression realism
      return book;
    });
  }, []);

  return (
    <group>
      {books.map((b) => (
        <group
          key={b.id}
          position={[b.x, b.y, b.z]}
          rotation={[b.rotX, b.rotY, b.rotZ]}
        >
          {/* ── BOOK COVER (rounded feel) ── */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth, 2, 2, 2]} />
            <meshStandardMaterial
              color={b.color}
              roughness={b.isLeather ? 0.6 : 0.75}
              metalness={b.isLeather ? 0.05 : 0.02}
            />
          </mesh>

          {/* ── PAGES (slightly offset + brighter) ── */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry
              args={[
                b.width * 0.96,
                b.height * 0.86,
                b.depth * 0.92,
              ]}
            />
            <meshStandardMaterial
              color="#F2E8D8"
              roughness={0.95}
              metalness={0}
            />
          </mesh>

          {/* ── PAGE EDGE DETAIL (thin highlight strip) ── */}
          <mesh position={[-b.width / 2 + 0.01, 0, 0]}>
            <boxGeometry args={[0.02, b.height * 0.9, b.depth * 0.9]} />
            <meshStandardMaterial
              color="#D8C9AA"
              roughness={1}
            />
          </mesh>

          {/* ── SPINE DETAIL (more embedded, not floating) ── */}
          <mesh position={[-b.width / 2 + 0.03, 0, 0]}>
            <boxGeometry
              args={[0.06, b.height * 0.92, b.depth * 0.15]}
            />
            <meshStandardMaterial
              color={b.isLeather ? "#C9A44C" : "#B08D57"}
              roughness={0.5}
              metalness={0.15}
            />
          </mesh>

          {/* ── subtle top compression (realistic stack pressure illusion) ── */}
          <mesh position={[0, b.height / 2 - 0.01, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[b.width * 0.98, 0.01, b.depth * 0.95]} />
            <meshStandardMaterial
              color="black"
              transparent
              opacity={0.05}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BrownTable() {
  const wood = useWoodTexture();
  const legMat = <meshStandardMaterial color="#5C3318" roughness={0.55} metalness={0.04} />;

  return (
    <group>
      {/* ── Tabletop ── */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <boxGeometry args={[5.2, 0.18, 2.6]} />
        <meshStandardMaterial map={wood} roughness={0.4} metalness={0.04} />
      </mesh>

      {/* ── Apron front/back ── */}
      {([[0, -0.19, -1.18], [0, -0.19, 1.18]] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <boxGeometry args={[4.8, 0.2, 0.08]} />
          {legMat}
        </mesh>
      ))}
      {/* ── Apron left/right ── */}
      {([[-2.5, -0.19, 0], [2.5, -0.19, 0]] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <boxGeometry args={[0.08, 0.2, 2.28]} />
          {legMat}
        </mesh>
      ))}

      {/* ── Legs ── */}
      {([
        [-2.35, -1.14, -1.05],
        [2.35, -1.14, -1.05],
        [-2.35, -1.14, 1.05],
        [2.35, -1.14, 1.05],
      ] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={i} castShadow receiveShadow position={[x, y, z]}>
          <boxGeometry args={[0.14, 1.86, 0.14]} />
          {legMat}
        </mesh>
      ))}

      {/* ── Lower stretcher front/back ── */}
      {([[0, -1.76, -1.05], [0, -1.76, 1.05]] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <boxGeometry args={[4.56, 0.08, 0.08]} />
          {legMat}
        </mesh>
      ))}
      {/* ── Lower stretcher left/right ── */}
      {([[-2.35, -1.76, 0], [2.35, -1.76, 0]] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <boxGeometry args={[0.08, 0.08, 2.02]} />
          {legMat}
        </mesh>
      ))}
    </group>
  );
}

interface ThreeSceneProps {
  lightRotation?: number;
  iso: number;
  aperture: number;
  shutter: number;
}

export const ThreeScene = ({ 
  lightRotation = 0,
  iso,
  aperture,
  shutter 
}: ThreeSceneProps) => {
  const stops = calcStops(aperture, shutter, iso);
  const brightness = Math.pow(2, -stops);
  const exposure = 1.3 * brightness;
  const ev = calcEV(aperture, shutter);

  // ISO Noise Effect (Simplified)
  const [noiseSeed, setNoiseSeed] = useState(0);
  useEffect(() => {
    if (iso >= 1600) {
      const interval = setInterval(() => {
        setNoiseSeed(Math.random());
      }, 50);
      return () => clearInterval(interval);
    }
  }, [iso]);

  return (
    <div className="relative w-full h-full bg-[#110e0b] rounded-sm border border-white/5 overflow-hidden">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: exposure,
        }}
      >
        {/* Camera angled for dramatic 3D perspective */}
        <PerspectiveCamera makeDefault position={[5, 3.5, 6]} fov={38} />
        <OrbitControls
          enableZoom
          minDistance={4}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, -0.5, 0]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.18} color="#FFF0D8" />

        <group rotation={[0, THREE.MathUtils.degToRad(lightRotation), 0]}>
          {/* Key light — upper left warm */}
          <directionalLight
            position={[-4, 8, 5]}
            intensity={2.2}
            color="#FFF5E0"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={1}
            shadow-camera-far={30}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-bias={-0.001}
          />
          {/* Fill light — right cool */}
          <directionalLight position={[6, 4, -2]} intensity={0.5} color="#B8CCFF" />
          {/* Rim light — back */}
          <directionalLight position={[0, 2, -7]} intensity={0.3} color="#FFE8C0" />
        </group>

        <Suspense fallback={null}>
          <Floor />
          <BrownTable />
          <Marbles />
          <BookStack />
          <ContactShadows
            position={[0, -2.07, 0]}
            opacity={0.6}
            scale={12}
            blur={2.5}
            far={4}
            color="#1a0f05"
          />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>

      {/* ISO Noise Overlay */}
      {iso >= 1600 && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            transform: `scale(${1 + noiseSeed * 0.1})`,
          }}
        />
      )}

      {/* Camera Info Overlay */}
      <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[10px] text-white/60 bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
        ISO {iso} | f/{aperture.toFixed(1)} | 1/{Math.round(1 / shutter)}s | EV {ev.toFixed(1)}
      </div>
    </div>
  );
};
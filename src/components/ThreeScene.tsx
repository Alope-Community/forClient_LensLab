import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

type ThreeSceneProps = {
  iso: number;
  aperture: number;
  shutter: number;
  lightRotation: number;
};

function Mannequin() {
  const { scene } = useGLTF("/models/mannequin.glb");

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -2, 0]}
    />
  );
}

useGLTF.preload("/models/mannequin.glb");

function LightMarker({
  position,
  color = "#ff0000",
  radius = 0.08,
}: {
  position: [number, number, number];
  color?: string;
  radius?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function CameraExposure({
  iso,
  aperture,
  shutter,
}: {
  iso: number;
  aperture: number;
  shutter: number;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const ev = Math.log2((aperture * aperture) / shutter);

    const exposure =
      (iso / 100) /
      Math.pow(2, ev);

    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure * 600;

  }, [gl, iso, aperture, shutter]);

  return null;
}

export default function ThreeScene({
  iso,
  aperture,
  shutter,
  lightRotation,
}: ThreeSceneProps) {

  const directionalPosition = useMemo(() => {
    const radius = 5;
    const rad = THREE.MathUtils.degToRad(lightRotation);

    return [
      Math.sin(rad) * radius,
      -1.5,
      Math.cos(rad) * radius,
    ] as [number, number, number];
  }, [lightRotation]);

  const pointLightPosition: [number, number, number] = [0, -2, 2];

  return (
    <Canvas
      shadows
      camera={{
        position: [0.00, -2.00, 30],
        fov: 5,
      }}
    >
      <CameraExposure
        iso={iso}
        aperture={aperture}
        shutter={shutter}
      />

      <color attach="background" args={["#2b2b2b"]} />

      <ambientLight intensity={0.25} />

      <directionalLight
        position={directionalPosition}
        intensity={10}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <LightMarker
        position={directionalPosition}
        color="#ffff00"
        radius={0.12}
      />

      <pointLight
        position={pointLightPosition}
        intensity={25}
      />

      <LightMarker
        position={pointLightPosition}
        color="#ff0000"
      />

      <Environment preset="studio" />

      <Suspense fallback={null}>
        <Mannequin />
      </Suspense>

      <ContactShadows
        position={[0, -2.02, 0]}
        opacity={0.5}
        blur={2}
        scale={10}
        far={10}
      />

      <OrbitControls
        // enabled={false}
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
        enableDamping
        makeDefault
        target={[0, -2, 0]}
      // onChange={(e) => {
      //   if (!e) return;

      //   const cam = e.target.object;
      //   const tgt = e.target.target;

      //   console.clear();
      //   console.log(
      //     `POSISI AWAL KAMERA ANDA:\n` +
      //     `camera={{ position: [${cam.position.x.toFixed(2)}, ${cam.position.y.toFixed(2)}, ${cam.position.z.toFixed(2)}], fov: 5 }}\n\n` +
      //     `TARGET ORBITCONTROLS ANDA:\n` +
      //     `target={[${tgt.x.toFixed(2)}, ${tgt.y.toFixed(2)}, ${tgt.z.toFixed(2)}]}`
      //   );
      // }}
      />
    </Canvas>
  );
}
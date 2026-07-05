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

  lightEnabled: boolean;

  keyLightEnabled: boolean;
  lightRotation: number;
  lightHeight: number;
  lightDistance: number;

  reflectorEnabled: boolean;
  reflectorRotation: number;
  reflectorHeight: number;
  reflectorDistance: number;
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

  lightEnabled,

  keyLightEnabled,
  lightRotation,
  lightHeight,
  lightDistance,

  reflectorEnabled,
  reflectorRotation,
  reflectorHeight,
  reflectorDistance,
}: ThreeSceneProps) {

  const directionalPosition = useMemo(() => {
    const rad = THREE.MathUtils.degToRad(lightRotation);

    return [
      Math.sin(rad) * lightDistance,
      lightHeight,
      Math.cos(rad) * lightDistance,
    ] as [number, number, number];
  }, [
    lightRotation,
    lightDistance,
    lightHeight,
  ]);

  const pointLightPosition = useMemo(() => {
    const rad = THREE.MathUtils.degToRad(reflectorRotation);

    return [
      Math.sin(rad) * reflectorDistance,
      reflectorHeight,
      Math.cos(rad) * reflectorDistance,
    ] as [number, number, number];
  }, [
    reflectorRotation,
    reflectorDistance,
    reflectorHeight,
  ]);

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

      <ambientLight
        intensity={lightEnabled ? 0.25 : 0}
      />

      <directionalLight
        position={directionalPosition}
        intensity={lightEnabled && keyLightEnabled ? 10 : 0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight
        position={pointLightPosition}
        intensity={lightEnabled && reflectorEnabled ? 4 : 0}
        distance={20}
        decay={2}
      />

      {lightEnabled && keyLightEnabled && (
        <LightMarker
          position={directionalPosition}
          color="#FFD700"
          radius={0.12}
        />
      )}

      {lightEnabled && reflectorEnabled && (
        <LightMarker
          position={pointLightPosition}
          color="#00BFFF"
        />
      )}

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
      />
    </Canvas>
  );
}
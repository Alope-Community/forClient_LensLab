import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
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
  selectedModel: "model1" | "model2";

  keyLightEnabled: boolean;
  lightRotation: number;
  lightHeight: number;
  lightDistance: number;

  fillLightEnabled: boolean;
  fillLightRotation: number;
  fillLightHeight: number;
  fillLightDistance: number;

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
  return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

function SecondModel() {
  const { scene } = useGLTF("/models/cosmetics__skin_care_product.glb");
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

useGLTF.preload("/models/mannequin.glb");
useGLTF.preload("/models/cosmetics__skin_care_product.glb");

function CameraManager({
  selectedModel,
}: {
  selectedModel: "model1" | "model2";
}) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (selectedModel === "model1") {
      camera.position.set(0.0, -2.0, 30);
      camera.lookAt(0, -2, 0);

      if (controls) {
        (controls as any).target.set(0, -2, 0);
      }
    } else {
      camera.position.set(-5.18, 1.87, 1.52);
      camera.lookAt(-0.25, -1.78, 0.08);

      if (controls) {
        (controls as any).target.set(-0.25, -1.78, 0.08);
      }
    }

    camera.updateProjectionMatrix();
  }, [selectedModel, camera, controls]);

  useFrame(() => {
    if (selectedModel === "model2" && controls) {
      const p = camera.position;
      const t = (controls as any).target;
      console.log(
        `Posisi Kamera: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}] | Target: [${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}]`,
      );
    }
  });

  return null;
}

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
    const exposure = iso / 100 / Math.pow(2, ev);
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
  selectedModel,

  keyLightEnabled,
  lightRotation,
  lightHeight,
  lightDistance,

  fillLightEnabled,
  fillLightRotation,
  fillLightHeight,
  fillLightDistance,

  reflectorEnabled,
  reflectorRotation,
  reflectorHeight,
  reflectorDistance,
}: ThreeSceneProps) {
  const directionalPosition1 = useMemo(() => {
    const rad = THREE.MathUtils.degToRad(lightRotation);
    return [
      Math.sin(rad) * lightDistance,
      lightHeight,
      Math.cos(rad) * lightDistance,
    ] as [number, number, number];
  }, [lightRotation, lightDistance, lightHeight]);

  const directionalPosition2 = useMemo(() => {
    const rad = THREE.MathUtils.degToRad(fillLightRotation);
    return [
      Math.sin(rad) * fillLightDistance,
      fillLightHeight,
      Math.cos(rad) * fillLightDistance,
    ] as [number, number, number];
  }, [fillLightRotation, fillLightDistance, fillLightHeight]);

  const pointLightPosition = useMemo(() => {
    const rad = THREE.MathUtils.degToRad(reflectorRotation);
    return [
      Math.sin(rad) * reflectorDistance,
      reflectorHeight,
      Math.cos(rad) * reflectorDistance,
    ] as [number, number, number];
  }, [reflectorRotation, reflectorDistance, reflectorHeight]);

  return (
    <Canvas shadows camera={{ fov: 5 }}>
      <CameraExposure iso={iso} aperture={aperture} shutter={shutter} />

      <CameraManager selectedModel={selectedModel} />

      <color attach="background" args={["#2b2b2b"]} />
      <ambientLight intensity={lightEnabled ? 0.25 : 0} />

      {/* LIGHTS */}
      <directionalLight
        position={directionalPosition1}
        intensity={lightEnabled && keyLightEnabled ? 10 : 0}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={directionalPosition2}
        intensity={lightEnabled && fillLightEnabled ? 4 : 0}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={pointLightPosition}
        intensity={lightEnabled && reflectorEnabled ? 4 : 0}
        distance={20}
        decay={2}
      />

      {/* MARKERS */}
      {lightEnabled && keyLightEnabled && (
        <LightMarker
          position={directionalPosition1}
          color="#FFD700"
          radius={0.12}
        />
      )}
      {lightEnabled && fillLightEnabled && (
        <LightMarker
          position={directionalPosition2}
          color="#FF8C00"
          radius={0.12}
        />
      )}
      {lightEnabled && reflectorEnabled && (
        <LightMarker position={pointLightPosition} color="#00BFFF" />
      )}

      <Environment preset="studio" />

      <Suspense fallback={null}>
        {selectedModel === "model1" ? <Mannequin /> : <SecondModel />}
      </Suspense>

      <ContactShadows
        position={[0, -2.02, 0]}
        opacity={0.5}
        blur={2}
        scale={10}
        far={10}
      />

      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
        enableDamping
        makeDefault
      />
    </Canvas>
  );
}

import { Suspense, useEffect, useMemo, useState, useRef } from "react";
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
  selectedModel: "model1" | "model2" | "model3" | "model4" | "model5";

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
  reflectorTilt: number;
};

// --- 1. KOMPONEN BARU: MODEL LAMPU STUDIO FISIK (PENGGANTI LIGHTMARKER BULAT) ---
function StudioLightFixture({
  position,
  color = "#ffffff",
}: {
  position: [number, number, number];
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Membuat moncong studio light selalu menyorot lurus ke arah model utama
      groupRef.current.lookAt(0, -2, 0);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Kap / Rumah Lampu Studio (Silinder Kerucut) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Bagian Belakang / Engsel Lampu */}
      <mesh position={[0, 0, -0.28]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Kaca Bohlam Depan yang Memancarkan Cahaya Emissive */}
      <mesh position={[0, 0, 0.251]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0, 0.19, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

// --- 2. PAPAN REFLEKTOR FISIK ---
function StudioReflector({
  position,
  lightEnabled,
  keyLightEnabled,
  fillLightEnabled,
  lightRotation,
  fillLightRotation,
  reflectorRotation,
  reflectorTilt // <-- Tambahkan prop kemiringan baru di sini (dalam derajat)
}: {
  position: [number, number, number];
  lightEnabled: boolean;
  keyLightEnabled: boolean;
  fillLightEnabled: boolean;
  lightRotation: number;
  fillLightRotation: number;
  reflectorRotation: number;
  reflectorTilt: number; // <-- Daftarkan tipenya
}) {
  const reflectorRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const lightTargetRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (reflectorRef.current) {
      // Sumbu Y mengontrol arah hadap melingkar mengikuti posisinya di studio
      // Kita tambah Math.PI (180 derajat) agar bagian depan papan menghadap ke tengah subjek
      reflectorRef.current.rotation.y = THREE.MathUtils.degToRad(reflectorRotation) + Math.PI;

      // Sumbu X mengontrol kemiringan atas / bawah (Tilt) secara manual sesuai input slider
      reflectorRef.current.rotation.x = THREE.MathUtils.degToRad(reflectorTilt);
    }

    // Hitung intensitas pantulan real-time
    if (lightRef.current && lightTargetRef.current) {
      if (!lightEnabled) {
        lightRef.current.intensity = 0;
        return;
      }

      let totalBounce = 0;

      const diffKey = Math.abs((lightRotation % 360) - (reflectorRotation % 360));
      const angleDiffKey = diffKey > 180 ? 360 - diffKey : diffKey;

      if (keyLightEnabled && angleDiffKey >= 90) {
        const factor = (angleDiffKey - 90) / 90;
        totalBounce += (10 * 0.20) * factor;
      }

      const diffFill = Math.abs((fillLightRotation % 360) - (reflectorRotation % 360));
      const angleDiffFill = diffFill > 180 ? 360 - diffFill : diffFill;

      if (fillLightEnabled && angleDiffFill >= 90) {
        const factor = (angleDiffFill - 90) / 90;
        totalBounce += (4 * 0.20) * factor;
      }

      lightRef.current.intensity = totalBounce;
      lightRef.current.target = lightTargetRef.current;
    }
  });

  return (
    <group ref={reflectorRef} position={position}>
      {/* VISUAL PAPAN */}
      <mesh>
        <planeGeometry args={[0.6, 1.0]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.1} />
      </mesh>

      {/* TARGET JANGKAR CAHAYA (Ikut miring mengikuti rotasi lokal group papan) */}
      <object3D ref={lightTargetRef} position={[0, 0, 5]} />

      {/* CAHAYA PANTULAN SIMULASI */}
      <directionalLight
        ref={lightRef}
        position={[0, 0, 0.1]}
        intensity={0}
      />
    </group>
  );
}

// --- 3. MODEL LOADERS ---
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

function ThirdModel() {
  const { scene } = useGLTF("/models/female.glb");
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
useGLTF.preload("/models/female.glb");

// --- 4. CAMERA MANAGER ---
function CameraManager({
  selectedModel,
}: {
  selectedModel: "model1" | "model2" | "model3" | "model4" | "model5";
}) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (selectedModel === "model1") {
      camera.position.set(0.0, -2.0, 30);
      camera.lookAt(0, -2, 0);
      if (controls) (controls as any).target.set(0, -2, 0);
    } else if (selectedModel === "model3") {
      camera.position.set(-0.03, 0.27, 21.14);
      camera.lookAt(-0.00, -0.94, -0.40);
      if (controls) (controls as any).target.set(-0.00, -0.94, -0.40);
    } else {
      camera.position.set(-5.18, 1.87, 1.52);
      camera.lookAt(-0.25, -1.78, 0.08);
      if (controls) (controls as any).target.set(-0.25, -1.78, 0.08);
    }
    camera.updateProjectionMatrix();
  }, [selectedModel, camera, controls]);

  return null;
}

// --- 5. EXPOSURE ---
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

// --- 6. UTAN SCENE UTAMA ---
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
  reflectorTilt
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

      {/* REAL LIGHTS */}
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

      {/* VISUAL HARDWARE LIGHT FIXTURES (Menggantikan bulatan LightMarker) */}
      {lightEnabled && keyLightEnabled && (
        <StudioLightFixture
          position={directionalPosition1}
          color="#FFD700" // Kuning Emas untuk Key Light
        />
      )}
      {lightEnabled && fillLightEnabled && (
        <StudioLightFixture
          position={directionalPosition2}
          color="#FF8C00" // Oranye Gelap untuk Fill Light
        />
      )}

      {/* PAPAN REFLEKTOR DAN ALAT PANTUL */}
      {lightEnabled && reflectorEnabled && (
        <StudioReflector
          position={pointLightPosition}
          lightEnabled={lightEnabled}
          keyLightEnabled={keyLightEnabled}
          fillLightEnabled={fillLightEnabled}
          lightRotation={lightRotation}
          fillLightRotation={fillLightRotation}
          reflectorRotation={reflectorRotation}
          reflectorTilt={reflectorTilt} // <-- Salurkan variabelnya ke sini
        />
      )}

      <Environment preset="studio" />

      <Suspense fallback={null}>
        {selectedModel === "model1" ? <Mannequin /> : selectedModel === "model2" ? <SecondModel /> : <ThirdModel />}
      </Suspense>

      <ContactShadows
        position={[0, -2.02, 0]}
        opacity={0.5}
        blur={2}
        scale={10}
        far={10}
      />

      <OrbitControls
        enableRotate={false}
        enablePan={false}
        enableDamping
        makeDefault
      />
    </Canvas>
  );
}
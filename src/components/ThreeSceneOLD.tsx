import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

type ThreeSceneProps = {
  lightEnabled: boolean;
  selectedModel: "model1_female" | "model2_male" | "model3_milkchocolate" | "model4_serum" | "model5_cosmetic";

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
      groupRef.current.lookAt(0, -2, 0);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0, -0.28]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <mesh position={[0, 0, 0.251]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0, 0.19, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

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
      reflectorRef.current.rotation.y = THREE.MathUtils.degToRad(reflectorRotation) + Math.PI;
      reflectorRef.current.rotation.x = THREE.MathUtils.degToRad(reflectorTilt);
    }

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
      <mesh>
        <planeGeometry args={[0.6, 1.0]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.1} />
      </mesh>

      <object3D ref={lightTargetRef} position={[0, 0, 5]} />

      <directionalLight
        ref={lightRef}
        position={[0, 0, 0.1]}
        intensity={0}
      />
    </group>
  );
}

function Model1Female() {
  const { scene } = useGLTF("/models/model1_female.glb");
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

function Model2Male() {
  const { scene } = useGLTF("/models/model2_male.glb");
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

function Model3MilkChocolate() {
  const { scene } = useGLTF("/models/model3_milkchocolate.glb");
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

function Model4Serum() {
  const { scene } = useGLTF("/models/model4_serum.glb");
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


function Model5Cosmetic() {
  const { scene } = useGLTF("/models/model5_cosmetic.glb");
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


useGLTF.preload("/models/model1_female.glb");
useGLTF.preload("/models/model2_male.glb");
useGLTF.preload("/models/model3_milkchocolate.glb");
useGLTF.preload("/models/model4_serum.glb");
useGLTF.preload("/models/model5_cosmetic.glb");

function CameraManager({
  selectedModel,
}: {
  selectedModel: "model1_female" | "model2_male" | "model3_milkchocolate" | "model4_serum" | "model5_cosmetic";
}) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (selectedModel === "model1_female") {
      camera.position.set(-0.03, 0.27, 21.14);
      camera.lookAt(-0.00, -0.94, -0.40);
      if (controls) (controls as any).target.set(-0.00, -0.94, -0.40);
    } else if (selectedModel === "model2_male") {
      camera.position.set(0.01, 2.05, 21.04);
      camera.lookAt(0.04, 0.84, -0.50);
      if (controls) (controls as any).target.set(0.04, 0.84, -0.50);
    } else if (selectedModel === "model3_milkchocolate") {
      camera.position.set(67.02, 15.86, -26.38);
      camera.lookAt(1.05, -3.53, 0.65);
      if (controls) (controls as any).target.set(1.05, -3.53, 0.65);
    } else if (selectedModel === "model4_serum") {
      camera.position.set(40.03, 67.39, 104.30);
      camera.lookAt(-0.44, 1.46, -0.09);
      if (controls) (controls as any).target.set(-0.44, 1.46, -0.09);
    } else if (selectedModel === "model5_cosmetic") {
      camera.position.set(17.97, 22.34, 34.11);
      camera.lookAt(1.90, -1.55, 0.51);
      if (controls) (controls as any).target.set(1.90, -1.55, 0.51);
    } else {
      camera.position.set(-5.18, 1.87, 1.52);
      camera.lookAt(-0.25, -1.78, 0.08);
      if (controls) (controls as any).target.set(-0.25, -1.78, 0.08);
    }
    camera.updateProjectionMatrix();
  }, [selectedModel, camera, controls]);

  return null;
}

export type ThreeSceneHandle = {
  capture: (iso: number, aperture: number, shutter: number) => string;
};

function CaptureHelper({
  onReady,
}: {
  onReady: (fn: (iso: number, aperture: number, shutter: number) => string) => void;
}) {
  const { gl, scene, camera } = useThree();
  const readyRef = useRef(false);

  useEffect(() => {
    if (!readyRef.current) {
      readyRef.current = true;
      onReady((iso: number, aperture: number, shutter: number) => {
        const prevToneMapping = gl.toneMapping;
        const prevExposure = gl.toneMappingExposure;

        const ev = Math.log2((aperture * aperture) / shutter);
        const exposure = iso / 100 / Math.pow(2, ev);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = exposure * 600;

        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL("image/png");

        gl.toneMapping = prevToneMapping;
        gl.toneMappingExposure = prevExposure;

        return dataUrl;
      });
    }
  }, [gl, scene, camera, onReady]);

  return null;
}

const ThreeSceneWithRef = forwardRef<ThreeSceneHandle, ThreeSceneProps>(function ThreeSceneOLD({
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
}: ThreeSceneProps, ref) {
  const captureFnRef = useRef<((iso: number, aperture: number, shutter: number) => string) | null>(null);

  useImperativeHandle(ref, () => ({
    capture: (iso: number, aperture: number, shutter: number) => {
      return captureFnRef.current?.(iso, aperture, shutter) ?? "";
    },
  }), []);

  const handleCaptureReady = useCallback((fn: (iso: number, aperture: number, shutter: number) => string) => {
    captureFnRef.current = fn;
  }, []);

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
    <Canvas shadows camera={{ fov: 5 }} gl={{ preserveDrawingBuffer: true }}>
      <CaptureHelper onReady={handleCaptureReady} />
      <CameraManager selectedModel={selectedModel} />

      <color attach="background" args={["#2b2b2b"]} />
      <ambientLight intensity={lightEnabled ? 0.25 : 0} />

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

      {lightEnabled && keyLightEnabled && (
        <StudioLightFixture
          position={directionalPosition1}
          color="#FFD700"
        />
      )}
      {lightEnabled && fillLightEnabled && (
        <StudioLightFixture
          position={directionalPosition2}
          color="#FF8C00"
        />
      )}

      {lightEnabled && reflectorEnabled && (
        <StudioReflector
          position={pointLightPosition}
          lightEnabled={lightEnabled}
          keyLightEnabled={keyLightEnabled}
          fillLightEnabled={fillLightEnabled}
          lightRotation={lightRotation}
          fillLightRotation={fillLightRotation}
          reflectorRotation={reflectorRotation}
          reflectorTilt={reflectorTilt}
        />
      )}

      <Environment preset="studio" />

      <Suspense fallback={null}>
        {selectedModel === "model1_female" ? <Model1Female /> : selectedModel === "model2_male" ? <Model2Male /> : selectedModel === "model3_milkchocolate" ? <Model3MilkChocolate /> : selectedModel === "model4_serum" ? <Model4Serum /> : selectedModel === "model5_cosmetic" ? <Model5Cosmetic /> : null}
      </Suspense>

      <ContactShadows
        position={[0, -2.02, 0]}
        opacity={0.5}
        blur={2}
        scale={10}
        far={10}
      />

      <OrbitControls
        enableDamping
        makeDefault
        onChange={(event) => {
          const controls = event?.target;
          if (controls) {
            const p = controls.object.position;
            const t = controls.target;
            console.log(
              `Camera Position: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}] | Orbit Target: [${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}]`
            );
          }
        }}
      />
    </Canvas>
  );
});

export default ThreeSceneWithRef;
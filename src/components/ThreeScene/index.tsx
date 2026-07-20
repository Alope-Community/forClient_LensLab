import { Suspense, useMemo, useRef, forwardRef, useImperativeHandle, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// 
import { CameraManager } from "./CameraManager";
import { CaptureHelper } from "./CaptureHelper";
import { StudioLightFixture } from "./StudioLightFixture";
import { StudioReflector } from "./StudioReflector";
import {
    Model1Female,
    Model2Male,
    Model3MilkChocolate,
    Model4Serum,
    Model5Cosmetic,
} from "./Models";

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

    aperture: number;
    shutter: number;
    iso: number;
    exposureComp: number;
};

export type ThreeSceneHandle = {
    capture: (iso: number, aperture: number, shutter: number) => string;
};

const LIVE_MULT = 600;

function LiveExposure({ aperture, shutter, iso, compensation }: { aperture: number; shutter: number; iso: number; compensation: number }) {
    const { gl } = useThree();
    useEffect(() => {
        const ev = Math.log2((aperture * aperture) / shutter);
        const exposure = iso / 100 / Math.pow(2, ev - compensation);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = exposure * LIVE_MULT;
    }, [aperture, shutter, iso, compensation, gl]);
    return null;
}

const ThreeScene = forwardRef<ThreeSceneHandle, ThreeSceneProps>(function ThreeScene(
    {

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
        reflectorTilt,
        aperture = 5.6,
        shutter = 0.004,
        iso = 100,
        exposureComp = 0.1,
    }: ThreeSceneProps,
    ref
) {
    const captureFnRef = useRef<((iso: number, aperture: number, shutter: number) => string) | null>(null);

    useImperativeHandle(ref, () => ({
        capture: (iso: number, aperture: number, shutter: number) => {
            return captureFnRef.current?.(iso, aperture, shutter) ?? "";
        },
    }), []);

    const handleCaptureReady = useCallback((fn: (iso: number, aperture: number, shutter: number) => string) => {
        captureFnRef.current = fn;
    }, []);

    // Key Light
    const keyLightPos = useMemo((): [number, number, number] => {
        const rad = THREE.MathUtils.degToRad(lightRotation);
        return [
            Math.sin(rad) * lightDistance,
            lightHeight,
            Math.cos(rad) * lightDistance,
        ];
    }, [lightRotation, lightDistance, lightHeight]);

    // Fill Light
    const fillLightPos = useMemo((): [number, number, number] => {
        const rad = THREE.MathUtils.degToRad(fillLightRotation);
        return [
            Math.sin(rad) * fillLightDistance,
            fillLightHeight,
            Math.cos(rad) * fillLightDistance,
        ];
    }, [fillLightRotation, fillLightDistance, fillLightHeight]);

    // Reflektor
    const reflectorPos = useMemo((): [number, number, number] => {
        const rad = THREE.MathUtils.degToRad(reflectorRotation);
        return [
            Math.sin(rad) * reflectorDistance,
            reflectorHeight,
            Math.cos(rad) * reflectorDistance,
        ];
    }, [reflectorRotation, reflectorDistance, reflectorHeight]);

    return (
        <Canvas shadows camera={{ fov: 5 }} gl={{ preserveDrawingBuffer: true }}>
            <LiveExposure aperture={aperture} shutter={shutter} iso={iso} compensation={exposureComp} />
            <CaptureHelper
                onReady={handleCaptureReady}
                exposureComp={exposureComp}
                liveMult={LIVE_MULT}
                iso={iso}
                aperture={aperture}
                shutter={shutter}
            />
            <CameraManager selectedModel={selectedModel} />

            <color attach="background" args={["#2b2b2b"]} />
            <ambientLight intensity={lightEnabled ? 0.25 : 0} />

            {/* Sumber Cahaya Utama */}
            <directionalLight
                position={keyLightPos}
                intensity={lightEnabled && keyLightEnabled ? 10 : 0}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <directionalLight
                position={fillLightPos}
                intensity={lightEnabled && fillLightEnabled ? 4 : 0}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            {/* Model Visual Lampu Studio */}
            {lightEnabled && keyLightEnabled && (
                <StudioLightFixture position={keyLightPos} color="#FFD700" />
            )}
            {lightEnabled && fillLightEnabled && (
                <StudioLightFixture position={fillLightPos} color="#FF8C00" />
            )}

            {/* Reflektor Cahaya */}
            {lightEnabled && reflectorEnabled && (
                <StudioReflector
                    position={reflectorPos}
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

            {/* Rendering Model Berdasarkan Pilihan */}
            <Suspense fallback={null}>
                {selectedModel === "model1_female" && <Model1Female />}
                {selectedModel === "model2_male" && <Model2Male />}
                {selectedModel === "model3_milkchocolate" && <Model3MilkChocolate />}
                {selectedModel === "model4_serum" && <Model4Serum />}
                {selectedModel === "model5_cosmetic" && <Model5Cosmetic />}
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
                enableRotate={false}
                enableZoom={false}
                enablePan={false}
                onChange={(event) => {
                    const controls = event?.target;
                    if (controls) {
                        const p = controls.object.position;
                        const t = controls.target;
                        console.log(
                            `Camera: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}] | Target: [${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}]`
                        );
                    }
                }}
            />
        </Canvas>
    );
});

export default ThreeScene;
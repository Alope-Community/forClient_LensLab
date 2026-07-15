import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type StudioReflectorProps = {
    position: [number, number, number];
    lightEnabled: boolean;
    keyLightEnabled: boolean;
    fillLightEnabled: boolean;
    lightRotation: number;
    fillLightRotation: number;
    reflectorRotation: number;
    reflectorTilt: number;
};

export function StudioReflector({
    position,
    lightEnabled,
    keyLightEnabled,
    fillLightEnabled,
    lightRotation,
    fillLightRotation,
    reflectorRotation,
    reflectorTilt,
}: StudioReflectorProps) {
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

            // Hitung pantulan dari Key Light
            const diffKey = Math.abs((lightRotation % 360) - (reflectorRotation % 360));
            const angleDiffKey = diffKey > 180 ? 360 - diffKey : diffKey;

            if (keyLightEnabled && angleDiffKey >= 90) {
                const factor = (angleDiffKey - 90) / 90;
                totalBounce += (10 * 0.20) * factor; // Daya pantul 20% dari Key Light
            }

            // Hitung pantulan dari Fill Light
            const diffFill = Math.abs((fillLightRotation % 360) - (reflectorRotation % 360));
            const angleDiffFill = diffFill > 180 ? 360 - diffFill : diffFill;

            if (fillLightEnabled && angleDiffFill >= 90) {
                const factor = (angleDiffFill - 90) / 90;
                totalBounce += (4 * 0.20) * factor; // Daya pantul 20% dari Fill Light
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

            {/* Arah Pancar Pantulan */}
            <object3D ref={lightTargetRef} position={[0, 0, 5]} />

            <directionalLight
                ref={lightRef}
                position={[0, 0, 0.1]}
                intensity={0}
            />
        </group>
    );
}
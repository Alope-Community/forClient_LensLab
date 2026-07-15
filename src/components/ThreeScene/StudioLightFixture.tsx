import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type StudioLightFixtureProps = {
    position: [number, number, number];
    color?: string;
};

export function StudioLightFixture({ position, color = "#ffffff" }: StudioLightFixtureProps) {
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

            <mesh position={[0, 0, 0.251]}>
                <ringGeometry args={[0, 0.19, 32]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
        </group>
    );
}
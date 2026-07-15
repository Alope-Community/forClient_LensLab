import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

function applyShadows(scene: any) {
    scene.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}

export function Model1Female() {
    const { scene } = useGLTF("/models/model1_female.glb");
    useEffect(() => applyShadows(scene), [scene]);
    return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

export function Model2Male() {
    const { scene } = useGLTF("/models/model2_male.glb");
    useEffect(() => applyShadows(scene), [scene]);
    return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

export function Model3MilkChocolate() {
    const { scene } = useGLTF("/models/model3_milkchocolate.glb");
    useEffect(() => applyShadows(scene), [scene]);
    return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

export function Model4Serum() {
    const { scene } = useGLTF("/models/model4_serum.glb");
    useEffect(() => applyShadows(scene), [scene]);
    return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

export function Model5Cosmetic() {
    const { scene } = useGLTF("/models/model5_cosmetic.glb");
    useEffect(() => applyShadows(scene), [scene]);
    return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

// Preload resources
useGLTF.preload("/models/model1_female.glb");
useGLTF.preload("/models/model2_male.glb");
useGLTF.preload("/models/model3_milkchocolate.glb");
useGLTF.preload("/models/model4_serum.glb");
useGLTF.preload("/models/model5_cosmetic.glb");
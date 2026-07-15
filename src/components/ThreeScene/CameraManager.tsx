import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

type CameraManagerProps = {
    selectedModel: "model1_female" | "model2_male" | "model3_milkchocolate" | "model4_serum" | "model5_cosmetic";
};

export function CameraManager({ selectedModel }: CameraManagerProps) {
    const { camera, controls } = useThree();

    useEffect(() => {
        const orbitControls = controls as any;

        switch (selectedModel) {
            case "model1_female":
                camera.position.set(-0.03, 0.27, 21.14);
                camera.lookAt(-0.00, -0.94, -0.40);
                if (orbitControls) orbitControls.target.set(-0.00, -0.94, -0.40);
                break;
            case "model2_male":
                camera.position.set(0.01, 2.05, 21.04);
                camera.lookAt(0.04, 0.84, -0.50);
                if (orbitControls) orbitControls.target.set(0.04, 0.84, -0.50);
                break;
            case "model3_milkchocolate":
                camera.position.set(67.02, 15.86, -26.38);
                camera.lookAt(1.05, -3.53, 0.65);
                if (orbitControls) orbitControls.target.set(1.05, -3.53, 0.65);
                break;
            case "model4_serum":
                camera.position.set(40.03, 67.39, 104.30);
                camera.lookAt(-0.44, 1.46, -0.09);
                if (orbitControls) orbitControls.target.set(-0.44, 1.46, -0.09);
                break;
            case "model5_cosmetic":
                camera.position.set(17.97, 22.34, 34.11);
                camera.lookAt(1.90, -1.55, 0.51);
                if (orbitControls) orbitControls.target.set(1.90, -1.55, 0.51);
                break;
            default:
                camera.position.set(-5.18, 1.87, 1.52);
                camera.lookAt(-0.25, -1.78, 0.08);
                if (orbitControls) orbitControls.target.set(-0.25, -1.78, 0.08);
        }

        camera.updateProjectionMatrix();
    }, [selectedModel, camera, controls]);

    return null;
}
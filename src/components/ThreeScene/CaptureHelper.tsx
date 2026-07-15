import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

type CaptureHelperProps = {
    onReady: (fn: (iso: number, aperture: number, shutter: number) => string) => void;
};

export function CaptureHelper({ onReady }: CaptureHelperProps) {
    const { gl, scene, camera } = useThree();
    const readyRef = useRef(false);

    useEffect(() => {
        if (!readyRef.current) {
            readyRef.current = true;

            onReady((iso: number, aperture: number, shutter: number) => {
                const prevToneMapping = gl.toneMapping;
                const prevExposure = gl.toneMappingExposure;

                // Exposure Value (EV)
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
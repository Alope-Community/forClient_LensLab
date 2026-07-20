import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

type CaptureHelperProps = {
    onReady: (fn: (iso: number, aperture: number, shutter: number) => string) => void;
    exposureComp: number;
    liveMult: number;
};

export function CaptureHelper({ onReady, exposureComp, liveMult }: CaptureHelperProps) {
    const { gl, scene, camera } = useThree();
    const readyRef = useRef(false);
    const exposureCompRef = useRef(exposureComp);
    const liveMultRef = useRef(liveMult);

    exposureCompRef.current = exposureComp;
    liveMultRef.current = liveMult;

    useEffect(() => {
        if (!readyRef.current) {
            readyRef.current = true;

            onReady((iso: number, aperture: number, shutter: number) => {
                const prevToneMapping = gl.toneMapping;
                const prevExposure = gl.toneMappingExposure;

                const ev = Math.log2((aperture * aperture) / shutter);
                const exposure = iso / 100 / Math.pow(2, ev - exposureCompRef.current);

                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = exposure * liveMultRef.current;

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
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type CaptureHelperProps = {
    onReady: (fn: (iso: number, aperture: number, shutter: number) => string) => void;
    exposureComp: number;
    liveMult: number;
    iso: number;
    aperture: number;
    shutter: number;
};

export function CaptureHelper({
    onReady,
    exposureComp,
    liveMult,
    iso,
    aperture,
    shutter,
}: CaptureHelperProps) {
    const { gl, scene, camera } = useThree();
    const readyRef = useRef(false);

    const calculateExposure = (
        isoVal: number,
        apertureVal: number,
        shutterVal: number,
        compVal: number,
        multVal: number
    ) => {
        const safeShutter = shutterVal > 0 ? shutterVal : 0.004;

        const ev = Math.log2((apertureVal * apertureVal) / safeShutter);
        const exposure = isoVal / 100 / Math.pow(2, ev - compVal);

        return exposure * multVal;
    };

    useFrame(() => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = calculateExposure(
            iso,
            aperture,
            shutter,
            exposureComp,
            liveMult
        );
    });

    useEffect(() => {
        if (!readyRef.current) {
            readyRef.current = true;

            onReady((isoVal: number, apertureVal: number, shutterVal: number) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = calculateExposure(
                    isoVal,
                    apertureVal,
                    shutterVal,
                    exposureComp,
                    liveMult
                );

                gl.render(scene, camera);
                return gl.domElement.toDataURL("image/png");
            });
        }
    }, [gl, scene, camera, onReady, exposureComp, liveMult]);

    return null;
}
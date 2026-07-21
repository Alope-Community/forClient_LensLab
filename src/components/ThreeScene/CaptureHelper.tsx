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

    useEffect(() => {
        if (!readyRef.current) {
            readyRef.current = true;

            onReady((isoVal: number, apertureVal: number, shutterVal: number) => {
                // 1. Simpan kondisi tone mapping live view saat ini
                const prevToneMapping = gl.toneMapping;
                const prevExposure = gl.toneMappingExposure;

                // 2. Hitung EV dan Exposure berdasarkan rumus Segitiga Exposure
                const safeShutter = shutterVal > 0 ? shutterVal : 0.004;
                const ev = Math.log2((apertureVal * apertureVal) / safeShutter);
                const calculatedExposure = (isoVal / 100 / Math.pow(2, ev - exposureComp)) * liveMult;

                // 3. Terapkan exposure fisik hanya untuk proses render foto
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = calculatedExposure;

                // 4. Render & ambil URL gambar
                gl.render(scene, camera);
                const dataUrl = gl.domElement.toDataURL("image/png");

                // 5. Kembalikan exposure live view ke posisi stabil konstan
                gl.toneMapping = prevToneMapping;
                gl.toneMappingExposure = prevExposure;

                return dataUrl;
            });
        }
    }, [gl, scene, camera, onReady, exposureComp, liveMult]);

    return null;
}
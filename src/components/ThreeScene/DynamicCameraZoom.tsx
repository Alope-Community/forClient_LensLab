import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type DynamicCameraZoomProps = {
    // Seluruh state slider pencahayaan yang dipantau
    lightRotation: number;
    lightHeight: number;
    lightDistance: number;
    fillLightRotation: number;
    fillLightHeight: number;
    fillLightDistance: number;
    reflectorRotation: number;
    reflectorHeight: number;
    reflectorDistance: number;

    // Koordinat kamera [X, Y, Z]
    defaultCameraPos?: [number, number, number]; // Posisi dekat / awal (Zoom In)
    zoomOutCameraPos?: [number, number, number]; // Posisi jauh saat slider digeser (Zoom Out)
    delayMs?: number;                             // Jeda waktu sebelum kembali zoom in (ms)
};

export function DynamicCameraZoom({
    lightRotation,
    lightHeight,
    lightDistance,
    fillLightRotation,
    fillLightHeight,
    fillLightDistance,
    reflectorRotation,
    reflectorHeight,
    reflectorDistance,
    defaultCameraPos = [0, -2, 30],
    zoomOutCameraPos = [0, -2, 80],
    delayMs = 1000, // Default 1 detik setelah user berhenti geser slider
}: DynamicCameraZoomProps) {
    const { camera, controls } = useThree();

    // Menyimpan posisi target kamera untuk interpolasi halus (lerp)
    const targetPos = useRef(new THREE.Vector3(...defaultCameraPos));

    // Catat timestamp waktu terakhir slider digeser
    const lastInteractionTime = useRef<number>(0);

    // 1. Setiap kali salah satu slider berubah, catat waktu saat ini
    useEffect(() => {
        lastInteractionTime.current = Date.now();
    }, [
        lightRotation,
        lightHeight,
        lightDistance,
        fillLightRotation,
        fillLightHeight,
        fillLightDistance,
        reflectorRotation,
        reflectorHeight,
        reflectorDistance,
    ]);

    // 2. Loop animasi R3F (mengecek selisih waktu secara kontinu)
    useFrame(() => {
        const timePassed = Date.now() - lastInteractionTime.current;

        // Jika selisih waktu masih di bawah delay (misal: < 1000ms), tetap Zoom Out
        if (timePassed < delayMs) {
            targetPos.current.set(...zoomOutCameraPos);
        } else {
            // Jika sudah tidak ada perubahan melebihi delay, kembalikan ke Zoom In
            targetPos.current.set(...defaultCameraPos);
        }

        // Gerakkan posisi kamera secara mulus menuju targetPos (kecepatan lerp = 0.08)
        camera.position.lerp(targetPos.current, 0.08);

        // Update OrbitControls agar sinkron dengan posisi kamera baru
        if (controls) {
            (controls as any).update();
        }
    });

    return null;
}
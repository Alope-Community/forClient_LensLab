// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            productSubject: "Product Objek",
            selectModelScene: "Select Model Scene",
            cameraExposure: "Camera & Exposure",
            studioLighting: "Studio Lighting",
            masterLight: "Master Studio Light",
            masterLightDesc: "Enable / Disable All Lights",
            keyLight: "Key Light (Light 1)",
            fillLight: "Fill Light (Light 2)",
            reflector: "Reflector",
            rotation: "Rotation",
            height: "Height",
            distance: "Distance",
            capture: "Capture Simulation",
            models: {
                model1: "Woman",
                model2: "Male",
                model3: "Milk Chocolate",
                model4: "Serum",
                model5: "Cosmetic"
            }
        }
    },
    id: {
        translation: {
            productSubject: "Objek Produk",
            selectModelScene: "Pilih Model Scene",
            cameraExposure: "Kamera & Eksposur",
            studioLighting: "Pencahayaan Studio",
            masterLight: "Lampu Utama Studio",
            masterLightDesc: "Aktifkan / Matikan Semua Lampu",
            keyLight: "Key Light (Cahaya 1)",
            fillLight: "Fill Light (Cahaya 2)",
            reflector: "Reflektor",
            rotation: "Rotasi",
            height: "Tinggi",
            distance: "Jarak",
            capture: "Ambil Simulasi",
            models: {
                model1: "Wanita",
                model2: "Pria",
                model3: "Susu Cokelat",
                model4: "Serum",
                model5: "Kosmetik"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "id", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
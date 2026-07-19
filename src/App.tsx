import { useState, useRef } from "react";
import { Navbar, Slider } from "./components";
import { IconCameraFill } from "justd-icons";
import { useTranslation } from "react-i18next";

import { calcStops } from "./utils/cameraMath";
import { ExposureMeter } from "./components/ExposureMeter";
import ThreeScene, { type ThreeSceneHandle } from "./components/ThreeScene";
import { CaptureModal } from "./components/CaptureModal";
import SideBySideSliders from "./components/sliders/SideBySideSlider";
import { Button } from "./components/button/Button";
import Footer from "./components/footer/Footer";


import { ModelSelectorModal } from "./components/modal/ModelSelectorModal";

function App() {
  const { t } = useTranslation();

  const [aperture, setAperture] = useState(5.6);
  const [shutter, setShutter] = useState(250);
  const [iso, setIso] = useState(180);

  const [selectedModel, setSelectedModel] = useState<"model1_female" | "model2_male" | "model3_milkchocolate" | "model4_serum" | "model5_cosmetic">(
    "model1_female",
  );
  const [activeTab, setActiveTab] = useState<"camera" | "lighting">("camera");

  const stops = calcStops(aperture, 1 / shutter, iso);
  const [lightEnabled, setLightEnabled] = useState(true);

  const [keyLightEnabled, setKeyLightEnabled] = useState(true);
  const [lightRotation, setLightRotation] = useState(0);
  const [lightHeight, setLightHeight] = useState(-1.5);
  const [lightDistance, setLightDistance] = useState(5);

  const [fillLightEnabled, setFillLightEnabled] = useState(true);
  const [fillLightRotation, setFillLightRotation] = useState(180);
  const [fillLightHeight, setFillLightHeight] = useState(-1.0);
  const [fillLightDistance, setFillLightDistance] = useState(5);

  const [reflectorEnabled, setReflectorEnabled] = useState(true);
  const [reflectorRotation, setReflectorRotation] = useState(120);
  const [reflectorDistance, setReflectorDistance] = useState(2.5);
  const [reflectorHeight, setReflectorHeight] = useState(-1.7);
  const [reflectorTilt, setReflectorTilt] = useState<number>(0);

  const threeSceneRef = useRef<ThreeSceneHandle>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

  const handleCapture = () => {
    const dataUrl = threeSceneRef.current?.capture(iso, aperture, 1 / shutter);
    if (dataUrl) {
      setCapturedImageUrl(dataUrl);
    }
  };

  const handleCloseModal = () => setCapturedImageUrl(null);

  const exposureStatus =
    stops > 2 ? "Underexposed" : stops < -2 ? "Overexposed" : "Balanced";

  const MODELS_LIST = [
    { id: "model1_female", name: "models.model1", thumbnail: "/models/thumbs/model1_female.jpg" },
    { id: "model2_male", name: "models.model2", thumbnail: "/models/thumbs/model2_male.jpg" },
    { id: "model3_milkchocolate", name: "models.model3", thumbnail: "/models/thumbs/model3.png" },
    { id: "model4_serum", name: "models.model4", thumbnail: "/models/thumbs/model4.png" },
    { id: "model5_cosmetic", name: "models.model5", thumbnail: "/models/thumbs/model5.png" },
  ] as const;

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const activeModelInfo = MODELS_LIST.find((m) => m.id === selectedModel);

  return (
    <div className="min-h-screen bg-neutral text-white font-inter selection:bg-primary/30 pb-12">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative min-h-[calc(100vh-7rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border border-white/5 bg-surface">
              <ThreeScene
                ref={threeSceneRef}
                lightEnabled={lightEnabled}
                selectedModel={selectedModel}
                keyLightEnabled={keyLightEnabled}
                lightRotation={lightRotation}
                lightHeight={lightHeight}
                lightDistance={lightDistance}
                fillLightEnabled={fillLightEnabled}
                fillLightRotation={fillLightRotation}
                fillLightHeight={fillLightHeight}
                fillLightDistance={fillLightDistance}
                reflectorEnabled={reflectorEnabled}
                reflectorRotation={reflectorRotation}
                reflectorHeight={reflectorHeight}
                reflectorDistance={reflectorDistance}
                reflectorTilt={reflectorTilt}
                aperture={aperture}
                shutter={1 / shutter}
                iso={iso}
                exposureComp={0.1}
              />
            </div>

            <div className="bg-surface border border-white/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-grotesk text-[11px] font-bold tracking-widest text-white/50 uppercase">
                  {t("productSubject")}
                </span>
                <span className="text-sm font-medium text-white/90">
                  {t("selectModelScene")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsModelModalOpen(true)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-neutral border border-white/5 rounded-md text-xs font-medium text-white hover:bg-white/[0.04] transition-all min-w-[200px]"
              >
                <span>{activeModelInfo ? t(activeModelInfo.name) : "Select Model"}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <ModelSelectorModal
              isOpen={isModelModalOpen}
              onClose={() => setIsModelModalOpen(false)}
              modelsList={MODELS_LIST}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />

            <div className="grid gap-4">
              <div className="bg-surface border border-white/5 rounded-lg pb-5">
                <ExposureMeter stops={stops} exposureStatus={exposureStatus} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-surface border border-white/5 rounded-lg p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral rounded-lg border border-white/5 mb-6">
                <Button
                  type="button"
                  variant="tab"
                  isActive={activeTab === "camera"}
                  onClick={() => setActiveTab("camera")}
                >
                  {t("cameraExposure")}
                </Button>

                <Button
                  type="button"
                  variant="tab"
                  isActive={activeTab === "lighting"}
                  onClick={() => setActiveTab("lighting")}
                >
                  {t("studioLighting")}
                </Button>
              </div>

              {activeTab === "camera" && (
                <div className="space-y-6 animate-fade-in">
                  <Slider
                    label="Aperture (f-stop)"
                    value={`f/${aperture.toFixed(1)}`}
                    min={1.2}
                    max={22}
                    current={aperture}
                    onChange={setAperture}
                    leftLabel="Shallow DOF"
                    rightLabel="Deep DOF"
                  />

                  <Slider
                    label="Shutter Speed"
                    value={`1/${shutter}s`}
                    min={1}
                    max={4000}
                    current={shutter}
                    onChange={setShutter}
                    leftLabel="Motion Blur"
                    rightLabel="Freeze Motion"
                  />

                  <Slider
                    label="ISO Sensitivity"
                    value={iso.toString()}
                    min={100}
                    max={6400}
                    current={iso}
                    onChange={setIso}
                    leftLabel="Low Noise"
                    rightLabel="High Grain"
                  />
                </div>
              )}

              {activeTab === "lighting" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {t("masterLight")}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {t("masterLightDesc")}
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={lightEnabled}
                        onChange={(e) => setLightEnabled(e.target.checked)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-600 transition-all peer-checked:bg-blue-600"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div
                    className={`space-y-6 transition-all duration-300 ${!lightEnabled ? "pointer-events-none opacity-40 select-none" : ""
                      }`}
                  >
                    <div className="space-y-4 border border-white/5 p-4 rounded-lg bg-white/[0.02]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h3 className="text-sm font-semibold text-yellow-400">
                          {t("keyLight")}
                        </h3>
                        <label className="relative inline-flex cursor-pointer items-center scale-90">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={keyLightEnabled}
                            onChange={(e) => setKeyLightEnabled(e.target.checked)}
                          />
                          <div className="peer h-5 w-9 rounded-full bg-gray-600 transition-all peer-checked:bg-yellow-500"></div>
                          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4"></div>
                        </label>
                      </div>
                      <Slider
                        label={t("rotation")}
                        value={`${lightRotation.toFixed(0)}°`}
                        min={0}
                        max={360}
                        current={lightRotation}
                        onChange={setLightRotation}
                        leftLabel="Front"
                        rightLabel="Back"
                      />
                      <SideBySideSliders
                        label1={t("height")}
                        val1={`${lightHeight.toFixed(1)}m`}
                        min1={-2}
                        max1={3}
                        cur1={lightHeight}
                        chg1={setLightHeight}
                        step1={0.5}
                        label2={t("distance")}
                        val2={`${lightDistance.toFixed(1)}m`}
                        min2={1}
                        max2={8}
                        cur2={lightDistance}
                        chg2={setLightDistance}
                        step2={0.5}
                      />
                    </div>

                    <div className="space-y-4 border border-white/5 p-4 rounded-lg bg-white/[0.02]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h3 className="text-sm font-semibold text-orange-400">
                          {t("fillLight")}
                        </h3>
                        <label className="relative inline-flex cursor-pointer items-center scale-90">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={fillLightEnabled}
                            onChange={(e) => setFillLightEnabled(e.target.checked)}
                          />
                          <div className="peer h-5 w-9 rounded-full bg-gray-600 transition-all peer-checked:bg-orange-500"></div>
                          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4"></div>
                        </label>
                      </div>
                      <Slider
                        label={t("rotation")}
                        value={`${fillLightRotation.toFixed(0)}°`}
                        min={0}
                        max={360}
                        current={fillLightRotation}
                        onChange={setFillLightRotation}
                        leftLabel="Front"
                        rightLabel="Back"
                      />
                      <SideBySideSliders
                        label1={t("height")}
                        val1={`${fillLightHeight.toFixed(1)}m`}
                        min1={-2}
                        max1={3}
                        cur1={fillLightHeight}
                        chg1={setFillLightHeight}
                        step1={0.5}
                        label2={t("distance")}
                        val2={`${fillLightDistance.toFixed(1)}m`}
                        min2={1}
                        max2={8}
                        cur2={fillLightDistance}
                        chg2={setFillLightDistance}
                        step2={0.5}
                      />
                    </div>

                    <div className="space-y-4 border border-white/5 p-4 rounded-lg bg-white/[0.02]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h3 className="text-sm font-semibold text-blue-400">
                          {t("reflector")}
                        </h3>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={reflectorEnabled && lightEnabled && (keyLightEnabled || fillLightEnabled)}
                            onChange={(e) => setReflectorEnabled(e.target.checked)}
                          />
                          <div className="peer h-5 w-9 rounded-full bg-gray-600 transition-all peer-checked:bg-blue-600"></div>
                          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4"></div>
                        </label>
                      </div>

                      <Slider
                        label={t("rotation")}
                        value={`${reflectorRotation.toFixed(0)}°`}
                        min={0}
                        max={360}
                        current={reflectorRotation}
                        onChange={setReflectorRotation}
                        leftLabel="Left"
                        rightLabel="Right"
                      />

                      <Slider
                        label="Tilt (Kemiringan)"
                        value={`${reflectorTilt.toFixed(0)}°`}
                        min={-45}
                        max={45}
                        current={reflectorTilt}
                        onChange={setReflectorTilt}
                        leftLabel="Down"
                        rightLabel="Up"
                      />

                      <SideBySideSliders
                        label1={t("height")}
                        val1={`${reflectorHeight.toFixed(1)}m`}
                        min1={-5}
                        max1={2}
                        cur1={reflectorHeight}
                        chg1={setReflectorHeight}
                        step1={0.5}
                        label2={t("distance")}
                        val2={`${reflectorDistance.toFixed(1)}m`}
                        min2={1}
                        max2={5}
                        cur2={reflectorDistance}
                        chg2={setReflectorDistance}
                        step2={0.5}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/5">
                <Button variant="primary" onClick={handleCapture}>
                  <IconCameraFill className="w-5 h-5" />
                  {t("capture")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

      <CaptureModal dataUrl={capturedImageUrl} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
import { useEffect, useState } from "react";
import { Navbar, Slider } from "./components";
import { IconCameraFill } from "justd-icons";

import { calcStops } from "./utils/cameraMath";
import { ExposureMeter } from "./components/ExposureMeter";
import ThreeScene from "./components/ThreeScene";

function App() {
  const [aperture, setAperture] = useState(5.6);
  const [shutter, setShutter] = useState(250);
  const [iso, setIso] = useState(100);

  const [selectedModel, setSelectedModel] = useState<"model1" | "model2">(
    "model1",
  );
  const [activeTab, setActiveTab] = useState<"camera" | "lighting">("camera");

  const stops = calcStops(aperture, 1 / shutter, iso);
  const [lightEnabled, setLightEnabled] = useState(true);

  // === STATE FOR KEY LIGHT (CAHAYA 1) ===
  const [keyLightEnabled, setKeyLightEnabled] = useState(true);
  const [lightRotation, setLightRotation] = useState(0);
  const [lightHeight, setLightHeight] = useState(-1.5);
  const [lightDistance, setLightDistance] = useState(5);

  // === STATE FOR FILL LIGHT (CAHAYA 2) ===
  const [fillLightEnabled, setFillLightEnabled] = useState(true);
  const [fillLightRotation, setFillLightRotation] = useState(180);
  const [fillLightHeight, setFillLightHeight] = useState(-1.0);
  const [fillLightDistance, setFillLightDistance] = useState(5);

  // === STATE FOR REFLECTOR ===
  const [reflectorEnabled, setReflectorEnabled] = useState(true);
  const [reflectorRotation, setReflectorRotation] = useState(120);
  const [reflectorDistance, setReflectorDistance] = useState(2.5);
  const [reflectorHeight, setReflectorHeight] = useState(-1.7);

  const exposureStatus =
    stops > 2 ? "Underexposed" : stops < -2 ? "Overexposed" : "Balanced";

  return (
    <div className="min-h-screen bg-neutral text-white font-inter selection:bg-primary/30 pb-12">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column - Image Preview & Model Selector */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border border-white/5 bg-surface">
              <ThreeScene
                iso={iso}
                aperture={aperture}
                shutter={1 / shutter}
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
              />
            </div>

            {/* SELEKSI MODEL (Pindah ke bawah Canvas) */}
            <div className="bg-surface border border-white/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-grotesk text-[11px] font-bold tracking-widest text-white/50 uppercase">
                  Product Subject
                </span>
                <span className="text-sm font-medium text-white/90">
                  Select Model Scene
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900 rounded-lg border border-white/5 min-w-[280px]">
                <button
                  type="button"
                  onClick={() => setSelectedModel("model1")}
                  className={`py-2 px-4 text-xs font-medium rounded-md transition-all ${
                    selectedModel === "model1"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  Mannequin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel("model2")}
                  className={`py-2 px-4 text-xs font-medium rounded-md transition-all ${
                    selectedModel === "model2"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  Cosmetics Product
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="bg-surface border border-white/5 rounded-lg pb-5">
                <ExposureMeter stops={stops} exposureStatus={exposureStatus} />
              </div>
            </div>
          </div>

          {/* Right Column - Controls (Tabs Only) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-surface border border-white/5 rounded-lg p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {/* TAB NAVIGATION */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900 rounded-lg border border-white/5 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("camera")}
                  className={`py-2.5 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "camera"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  Camera & Exposure
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("lighting")}
                  className={`py-2.5 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "lighting"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  Studio Lighting
                </button>
              </div>

              {/* TAB CONTENT: CAMERA & EXPOSURE */}
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

              {/* TAB CONTENT: STUDIO LIGHTING */}
              {activeTab === "lighting" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Master Studio Light
                      </h3>
                      <p className="text-xs text-gray-400">
                        Enable / Disable All Lights
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

                  {/* CONTROLS: KEY LIGHT */}
                  <div className="space-y-4 border border-white/5 p-4 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="text-sm font-semibold text-yellow-400">
                        Key Light (Cahaya 1)
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
                      label="Rotation"
                      value={`${lightRotation.toFixed(0)}°`}
                      min={0}
                      max={360}
                      current={lightRotation}
                      onChange={setLightRotation}
                      leftLabel="Front"
                      rightLabel="Back"
                    />
                    <SideBySideSliders
                      label1="Height"
                      val1={`${lightHeight.toFixed(1)}m`}
                      min1={-2}
                      max1={3}
                      cur1={lightHeight}
                      chg1={setLightHeight}
                      label2="Distance"
                      val2={`${lightDistance.toFixed(1)}m`}
                      min2={1}
                      max2={8}
                      cur2={lightDistance}
                      chg2={setLightDistance}
                    />
                  </div>

                  {/* CONTROLS: FILL LIGHT */}
                  <div className="space-y-4 border border-white/5 p-4 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="text-sm font-semibold text-orange-400">
                        Fill Light (Cahaya 2)
                      </h3>
                      <label className="relative inline-flex cursor-pointer items-center scale-90">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={fillLightEnabled}
                          onChange={(e) =>
                            setFillLightEnabled(e.target.checked)
                          }
                        />
                        <div className="peer h-5 w-9 rounded-full bg-gray-600 transition-all peer-checked:bg-orange-500"></div>
                        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4"></div>
                      </label>
                    </div>
                    <Slider
                      label="Rotation"
                      value={`${fillLightRotation.toFixed(0)}°`}
                      min={0}
                      max={360}
                      current={fillLightRotation}
                      onChange={setFillLightRotation}
                      leftLabel="Front"
                      rightLabel="Back"
                    />
                    <SideBySideSliders
                      label1="Height"
                      val1={`${fillLightHeight.toFixed(1)}m`}
                      min1={-2}
                      max1={3}
                      cur1={fillLightHeight}
                      chg1={setFillLightHeight}
                      label2="Distance"
                      val2={`${fillLightDistance.toFixed(1)}m`}
                      min2={1}
                      max2={8}
                      cur2={fillLightDistance}
                      chg2={setFillLightDistance}
                    />
                  </div>

                  {/* CONTROLS: REFLECTOR */}
                  <div className="space-y-4 border border-white/5 p-4 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="text-sm font-semibold text-blue-400">
                        Reflector (Point Light)
                      </h3>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={reflectorEnabled}
                          onChange={(e) =>
                            setReflectorEnabled(e.target.checked)
                          }
                        />
                        <div className="peer h-5 w-9 rounded-full bg-gray-600 transition-all peer-checked:bg-green-600"></div>
                        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4"></div>
                      </label>
                    </div>
                    <Slider
                      label="Rotation"
                      value={`${reflectorRotation.toFixed(0)}°`}
                      min={0}
                      max={360}
                      current={reflectorRotation}
                      onChange={setReflectorRotation}
                      leftLabel="Left"
                      rightLabel="Right"
                    />
                    <SideBySideSliders
                      label1="Height"
                      val1={`${reflectorHeight.toFixed(1)}m`}
                      min1={-2}
                      max1={2}
                      cur1={reflectorHeight}
                      chg1={setReflectorHeight}
                      label2="Distance"
                      val2={`${reflectorDistance.toFixed(1)}m`}
                      min2={1}
                      max2={5}
                      cur2={reflectorDistance}
                      chg2={setReflectorDistance}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/5">
                <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-inter font-medium text-sm py-3.5 rounded-md transition-all flex items-center justify-center gap-2">
                  <IconCameraFill className="w-5 h-5" />
                  Capture Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SideBySideSliders({
  label1,
  val1,
  min1,
  max1,
  cur1,
  chg1,
  label2,
  val2,
  min2,
  max2,
  cur2,
  chg2,
}: any) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Slider
        label={label1}
        value={val1}
        min={min1}
        max={max1}
        current={cur1}
        onChange={chg1}
        compact
      />
      <Slider
        label={label2}
        value={val2}
        min={min2}
        max={max2}
        current={cur2}
        onChange={chg2}
        compact
      />
    </div>
  );
}

export default App;

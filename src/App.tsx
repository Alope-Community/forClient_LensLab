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
  const [lightRotation, setLightRotation] = useState(0);

  const stops = calcStops(aperture, 1 / shutter, iso);
  const [lightEnabled, setLightEnabled] = useState(true);
  const [keyLightEnabled, setKeyLightEnabled] = useState(true);
  const [reflectorEnabled, setReflectorEnabled] = useState(true);


  const [reflectorRotation, setReflectorRotation] = useState(120);
  const [reflectorDistance, setReflectorDistance] = useState(2.5);
  const [reflectorHeight, setReflectorHeight] = useState(-1.7);


  const [lightDistance, setLightDistance] = useState(5);

  const [lightHeight, setLightHeight] = useState(-1.5);

  const exposureStatus =
    stops > 2 ? "Underexposed" : stops < -2 ? "Overexposed" : "Balanced";


  useEffect(() => {
    console.log(`Aperture: f/${aperture.toFixed(1)}, Shutter: 1/${shutter}s, ISO: ${iso}, Light Rotation: ${lightRotation.toFixed(0)}°`);
  }, [aperture, shutter, iso, lightRotation]);

  return (
    <div className="min-h-screen bg-neutral text-white font-inter selection:bg-primary/30 pb-12">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column - Image Preview & Stats */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border border-white/5 bg-surface">

              <ThreeScene
                iso={iso}
                aperture={aperture}
                shutter={1 / shutter}

                lightEnabled={lightEnabled}

                keyLightEnabled={keyLightEnabled}
                lightRotation={lightRotation}
                lightHeight={lightHeight}
                lightDistance={lightDistance}

                reflectorEnabled={reflectorEnabled}
                reflectorRotation={reflectorRotation}
                reflectorHeight={reflectorHeight}
                reflectorDistance={reflectorDistance}
              />
            </div>

            <div className="grid gap-4">
              <div className="bg-surface border border-white/5 rounded-lg pb-5">
                <ExposureMeter stops={stops} exposureStatus={exposureStatus} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">

            {/* Exposure Controls Box */}
            <div className="bg-surface border border-white/5 rounded-lg p-6">
              <h2 className="text-xl font-grotesk font-semibold text-white mb-6">
                Exposure Controls
              </h2>
              <div className="w-full h-px bg-white/5 mb-8"></div>

              <div className="space-y-8">
                {/* <Slider
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
                /> */}

                <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      Studio Light
                    </h3>
                    <p className="text-xs text-gray-400">
                      Enable / Disable Light
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


                <Slider
                  label="Light Rotation"
                  value={`${lightRotation.toFixed(0)}°`}
                  min={0}
                  max={360}
                  current={lightRotation}
                  onChange={setLightRotation}
                  leftLabel="Front"
                  rightLabel="Back"
                />

                <Slider
                  label="Light Height"
                  value={`${lightHeight.toFixed(1)} m`}
                  min={-2}
                  max={3}
                  current={lightHeight}
                  onChange={setLightHeight}
                  leftLabel="Low"
                  rightLabel="High"
                />

                <Slider
                  label="Light Distance"
                  value={`${lightDistance.toFixed(1)} m`}
                  min={1}
                  max={8}
                  current={lightDistance}
                  onChange={setLightDistance}
                  leftLabel="Near"
                  rightLabel="Far"
                />

                <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      Reflector
                    </h3>
                    <p className="text-xs text-gray-400">
                      Enable / Disable Fill Light
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={reflectorEnabled}
                      onChange={(e) => setReflectorEnabled(e.target.checked)}
                    />

                    <div className="peer h-6 w-11 rounded-full bg-gray-600 transition-all peer-checked:bg-green-600"></div>

                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <Slider
                  label="Reflector Rotation"
                  value={`${reflectorRotation.toFixed(0)}°`}
                  min={0}
                  max={360}
                  current={reflectorRotation}
                  onChange={setReflectorRotation}
                  leftLabel="Left"
                  rightLabel="Right"
                />

                <Slider
                  label="Reflector Distance"
                  value={`${reflectorDistance.toFixed(1)}m`}
                  min={1}
                  max={5}
                  current={reflectorDistance}
                  onChange={setReflectorDistance}
                  leftLabel="Near"
                  rightLabel="Far"
                />

                <Slider
                  label="Reflector Height"
                  value={`${reflectorHeight.toFixed(1)}m`}
                  min={-2}
                  max={2}
                  current={reflectorHeight}
                  onChange={setReflectorHeight}
                  leftLabel="Low"
                  rightLabel="High"
                />
              </div>


              <div className="mt-8 pt-6 border-t border-white/5">
                <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-inter font-medium text-sm py-3.5 rounded-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
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

export default App;

import { useEffect, useState } from "react";
import { Navbar, Slider } from "./components";
// export { default as ThreeScene } from "";
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
              {/* <img 
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" 
                alt="Camera Lens Simulation" 
                className="w-full h-full object-cover"
              /> */}

              <ThreeScene
                iso={iso}
                aperture={aperture}
                shutter={1 / shutter}
                lightRotation={lightRotation}
              />

              {/* Overlay stats inside image (EV scale) */}
              {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 bg-black/40 backdrop-blur-md px-6 py-2 rounded-xl border border-white/10">
                <div className="w-2 h-2 rotate-45 bg-primary mb-1"></div>
                <div className="flex items-center gap-4 text-[10px] text-white/70 font-mono">
                  <span>-3</span>
                  <span className="w-px h-2 bg-white/30"></span>
                  <span className="w-px h-3 bg-secondary"></span>
                  <span className="w-px h-2 bg-white/30"></span>
                  <span>+3</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-white/50 mt-1">EV</span>
              </div> */}
            </div>

            <div className="grid gap-4">
              <div className="bg-surface border border-white/5 rounded-lg pb-5">
                <ExposureMeter stops={stops} exposureStatus={exposureStatus} />
              </div>
            </div>

            {/* Stat Boxes */}
            {/* <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface border border-white/5 rounded-lg md:p-4 p-3">
                <div className="text-xs font-inter text-tertiary uppercase tracking-widest mb-1">
                  Aperture
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="md:text-2xl font-grotesk text-white">
                    f/{aperture.toFixed(1)}
                  </span>
                  <span className="text-xs text-tertiary">15mm</span>
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-lg md:p-4 p-3">
                <div className="text-xs font-inter text-tertiary uppercase tracking-widest mb-1">
                  Shutter
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="md:text-2xl font-grotesk text-white">
                    1/{shutter}s
                  </span>
                  <span className="text-xs text-tertiary">Frozen</span>
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-lg md:p-4 p-3">
                <div className="text-xs font-inter text-tertiary uppercase tracking-widest mb-1">
                  ISO
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="md:text-2xl font-grotesk text-white">
                    {iso}
                  </span>
                  <span className="text-xs text-tertiary">Clean</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Controls & Accordions */}
          <div className="lg:col-span-4 space-y-4">
            {/* <div className="bg-surface border border-white/5 rounded-lg p-4">
              <div className="text-[10px] uppercase tracking-widest text-tertiary mb-1">
                Exposure Status
              </div>

              <div className="text-2xl font-grotesk">{exposureStatus}</div>
            </div> */}

            {/* Exposure Controls Box */}
            <div className="bg-surface border border-white/5 rounded-lg p-6">
              <h2 className="text-xl font-grotesk font-semibold text-white mb-6">
                Exposure Controls
              </h2>
              <div className="w-full h-px bg-white/5 mb-8"></div>

              <div className="space-y-8">
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
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-inter font-medium text-sm py-3.5 rounded-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  <IconCameraFill className="w-5 h-5" />
                  Capture Simulation
                </button>
              </div>
            </div>

            {/* Accordions */}
            {/* <div className="space-y-2">
              <Accordion
                title="APERTURE & DOF"
                icon={<IconCamera className="w-4 h-4" />}
                content="Controls how much light passes through the lens and determines depth of field. Lower f-numbers create that cinematic blurred background."
              />
              <Accordion
                title="SHUTTER & MOTION"
                icon={<IconClock className="w-4 h-4" />}
                content="Shutter speed dictates how long the sensor is exposed to light. Fast speeds (e.g., 1/1000s) freeze fast-moving action, while slow speeds introduce motion blur, perfect for waterfalls or light trails."
              />
              <Accordion
                title="ISO & NOISE"
                icon={<IconSparklesThree className="w-4 h-4" />}
                content="ISO measures the sensor's sensitivity to light. Higher ISO values allow shooting in darker environments but introduce digital grain or 'noise' to the image. Keep it as low as possible for clean shots."
              />
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

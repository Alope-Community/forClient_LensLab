import React from "react";

interface SliderProps {
  label: string;
  value: string;
  min: number;
  max: number;
  current: number;
  onChange: (val: number) => void;
  leftLabel: string;
  rightLabel: string;
}

export function Slider({ label, value, min, max, current, onChange, leftLabel, rightLabel }: SliderProps) {
  const percentage = ((current - min) / (max - min)) * 100;
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="font-grotesk text-[11px] font-bold tracking-widest text-white/80 uppercase">{label}</span>
        <span className="font-inter text-sm text-[#00D1FF]">{value}</span>
      </div>
      
      <div className="relative py-2">
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-[2px] rounded-full appearance-none cursor-pointer outline-none slider-thumb-rect"
          style={{
            background: `linear-gradient(to right, #4A5568 ${percentage}%, #2D3748 ${percentage}%)` // It's actually a dark track, wait, looking at image... The track left of thumb is slightly lighter grey, track right is darker grey. Let's use #4A5568 and #2D3748.
          }}
        />
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className="font-inter text-[9px] uppercase tracking-wider text-tertiary/60">{leftLabel}</span>
        <span className="font-inter text-[9px] uppercase tracking-wider text-tertiary/60">{rightLabel}</span>
      </div>
    </div>
  );
}

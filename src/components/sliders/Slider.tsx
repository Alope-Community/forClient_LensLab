interface SliderProps {
  label: string;
  value: string;
  min: number;
  max: number;
  current: number;
  onChange: (val: number) => void;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
  compact?: boolean;
}

export function Slider({
  label,
  value,
  min,
  max,
  current,
  onChange,
  step = 1,
  leftLabel,
  rightLabel,
  compact = false,
}: SliderProps) {
  const percentage = ((current - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col w-full">
      {/* Label atas dan nilai slider */}
      <div
        className={`flex justify-between items-center ${compact ? "mb-1" : "mb-3"}`}
      >
        <span className="font-grotesk text-[11px] font-bold tracking-widest text-white/80 uppercase">
          {label}
        </span>
        <span className="font-inter text-sm text-primary">{value}</span>
      </div>

      {/* Input Range Track */}
      <div className="relative py-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-[4px] rounded-full appearance-none cursor-pointer outline-none 
            /* Webkit (Chrome, Safari, Edge) - UKURAN DIPERBESAR */
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-[12px] 
            [&::-webkit-slider-thumb]:h-[20px] 
            [&::-webkit-slider-thumb]:bg-primary 
            [&::-webkit-slider-thumb]:rounded-[2px] 
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_theme(colors.primary/50%)] 
            [&::-webkit-slider-thumb]:cursor-pointer 
            [&::-webkit-slider-thumb]:transition-transform 
            [&::-webkit-slider-thumb]:duration-100 
            hover:[&::-webkit-slider-thumb]:scale-110

            /* Firefox - UKURAN DIPERBESAR */
            [&::-moz-range-thumb]:appearance-none 
            [&::-moz-range-thumb]:border-none 
            [&::-moz-range-thumb]:w-[12px] 
            [&::-moz-range-thumb]:h-[20px] 
            [&::-moz-range-thumb]:bg-primary 
            [&::-moz-range-thumb]:rounded-[2px] 
            [&::-moz-range-thumb]:shadow-[0_0_10px_theme(colors.primary/50%)] 
            [&::-moz-range-thumb]:cursor-pointer 
            [&::-moz-range-thumb]:transition-transform 
            [&::-moz-range-thumb]:duration-100 
            hover:[&::-moz-range-thumb]:scale-110"
          style={{
            background: `linear-gradient(to right, #4A5568 ${percentage}%, #2D3748 ${percentage}%)`,
          }}
        />
      </div>

      {!compact && (leftLabel || rightLabel) && (
        <div className="flex justify-between items-center mt-1">
          <span className="font-inter text-[9px] uppercase tracking-wider text-tertiary/60">
            {leftLabel}
          </span>
          <span className="font-inter text-[9px] uppercase tracking-wider text-tertiary/60">
            {rightLabel}
          </span>
        </div>
      )}
    </div>
  );
}
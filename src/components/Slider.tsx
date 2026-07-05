interface SliderProps {
  label: string;
  value: string;
  min: number;
  max: number;
  current: number;
  onChange: (val: number) => void;
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
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-[2px] rounded-full appearance-none cursor-pointer outline-none 
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[6px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-[1px] [&::-webkit-slider-thumb]:shadow-[0_0_8px_theme(colors.primary/40%)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-100 hover:[&::-webkit-slider-thumb]:scale-y-120
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:w-[6px] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:rounded-[1px] [&::-moz-range-thumb]:shadow-[0_0_8px_theme(colors.primary/40%)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-100 hover:[&::-moz-range-thumb]:scale-y-120"
          style={{
            background: `linear-gradient(to right, #4A5568 ${percentage}%, #2D3748 ${percentage}%)`,
          }}
        />
      </div>

      {/* Hanya munculkan label bawah jika TIDAK compact dan labelnya tersedia */}
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

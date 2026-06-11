interface Props {
  stops: number;
  exposureStatus: string;
}

export function ExposureMeter({ stops, exposureStatus }: Props) {
  const position = Math.min(Math.max(((stops + 4) / 8) * 100, 0), 100);

  return (
    <div className="pt-5 pb-0 px-5">
      <p className="text-center text-tertiary mb-4">
        Exposure Status: <b className="text-white">{exposureStatus}</b>
      </p>

      {/* EV Value */}
      <div className="text-center">
        <span className="text-sm font-medium text-white">
          {stops > 0 ? `+${stops.toFixed(1)}` : stops.toFixed(1)}
        </span>
        <span className="ml-1 text-xs text-white/50">EV</span>
      </div>

      {/* Meter */}
      <div className="relative">
        {/* Track */}
        <div className="h-1.5 rounded-full bg-white/10" />

        {/* Center marker */}
        <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-white/60" />

        {/* Knob */}
        <div
          className="absolute -top-1 -translate-x-1/2"
          style={{
            left: `${position}%`,
          }}
        >
          <div
            className="h-3 w-4 bg-white"
            style={{
              clipPath: "polygon(50% 100%, 0 0, 100% 0)",
            }}
          />
        </div>
      </div>

      {/* Scale */}
      <div className="relative text-[11px] text-white/40">
        <div className="flex justify-between">
          <span>-4</span>
          <span>+4</span>
        </div>

        <span className="absolute left-1/2 top-0 -translate-x-1/2">0</span>
      </div>
    </div>
  );
}

import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  showValue?: boolean;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  ariaLabel,
  showValue = true,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-3 w-full">
      {showValue && (
        <span className="text-sm font-semibold text-white/70 w-10 text-right tabular-nums">
          {value}
        </span>
      )}
      <div className="relative flex-1 h-10 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={ariaLabel}
          className="w-full h-2 bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-blue-500 touch-none"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, rgba(255,255,255,0.08) ${percentage}%, rgba(255,255,255,0.08) 100%)`,
          }}
        />
      </div>
    </div>
  );
}

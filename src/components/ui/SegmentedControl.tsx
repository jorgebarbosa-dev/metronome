interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex items-center p-1 bg-white/[0.06] rounded-2xl border border-white/[0.08]"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`
            flex-1 h-10 px-3 rounded-xl text-sm font-semibold
            transition-all duration-150 active:scale-[0.95]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
            ${value === option.value
              ? 'bg-white/[0.12] text-white shadow-sm'
              : 'text-white/50 [@media(hover:hover)]:hover:text-white/70'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

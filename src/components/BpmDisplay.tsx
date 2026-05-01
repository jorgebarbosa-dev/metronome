interface BpmDisplayProps {
  bpm: number;
}

export function BpmDisplay({ bpm }: BpmDisplayProps) {
  return (
    <div className="text-center" role="status" aria-label={`BPM: ${bpm}`} aria-live="polite" aria-atomic="true">
      <div className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white tabular-nums">
        {bpm}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">BPM</div>
    </div>
  );
}

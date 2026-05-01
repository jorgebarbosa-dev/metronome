import { useMetronome } from '../context/MetronomeContext';

export function BeatNumberDisplay() {
  const { currentBeat, state } = useMetronome();
  const { timeSignature } = state;

  return (
    <div
      className="text-center"
      role="status"
      aria-label={`Current beat: ${currentBeat} of ${timeSignature.beats}`}
      aria-live="polite"
    >
      <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tabular-nums">
        {currentBeat > 0 ? currentBeat : '-'}
      </span>
      <span className="text-lg md:text-xl text-gray-500 dark:text-gray-400 ml-1">
        /{timeSignature.beats}
      </span>
    </div>
  );
}

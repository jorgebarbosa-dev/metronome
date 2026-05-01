import { useMetronome } from '../context/MetronomeContext';

export function BeatIndicator() {
  const { currentBeat, currentSubBeat, state } = useMetronome();
  const isBeatOne = currentBeat === 1;
  const isActive = currentBeat > 0 && state.isPlaying;

  return (
    <div
      className="relative flex items-center justify-center"
      role="status"
      aria-label={isActive ? `Beat ${currentBeat} of ${state.timeSignature.beats}` : 'Metronome stopped'}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Pulse ring — remounts each beat to re-trigger animation */}
      {isActive && (
        <div
          key={`pulse-${currentBeat}-${currentSubBeat || 0}`}
          className={`
            absolute w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full border-2
            ${isBeatOne ? 'border-red-500/30' : 'border-blue-500/30'}
            animate-pulse-ring pointer-events-none
          `}
          aria-hidden="true"
        />
      )}

      {/* Main beat circle */}
      <div
        className={`
          w-[200px] h-[200px] md:w-[260px] md:h-[260px]
          rounded-full flex items-center justify-center
          transition-all duration-150 spring-bounce
          ${isActive
            ? isBeatOne
              ? 'bg-red-600 scale-110 shadow-[0_0_60px_rgba(220,38,38,0.25)]'
              : 'bg-blue-600 scale-110 shadow-[0_0_60px_rgba(59,130,246,0.25)]'
            : 'bg-neutral-800 scale-100'
          }
        `}
        aria-hidden="true"
      >
        <span className="text-7xl md:text-8xl font-bold text-white tabular-nums">
          {isActive ? currentBeat : '—'}
        </span>
      </div>
    </div>
  );
}

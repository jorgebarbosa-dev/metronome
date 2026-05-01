import { Play, Pause, Minimize, Clock } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { useFullscreen } from '../hooks/useFullscreen';

export function FullscreenView() {
  const { state, currentBeat, trainingConfig, trainingSession, dispatch } =
    useMetronome();
  const { toggleFullscreen } = useFullscreen();

  const isPlaying = state.isPlaying;
  const isBeatOne = currentBeat === 1;
  const isBeatActive = currentBeat > 0;
  const timeSignatureText = `${state.timeSignature.beats}/${state.timeSignature.beatValue}`;
  const hasTrainingModes =
    trainingConfig.autoBpm.enabled ||
    trainingConfig.silence.enabled ||
    trainingConfig.countIn.enabled;
  const isTrainingActive = trainingSession.isActive;

  return (
    <div
      role="main"
      aria-label="Fullscreen metronome view"
      className="h-[100dvh] w-[100dvw] flex flex-col items-center justify-center bg-neutral-950 text-white p-4 md:p-8 gap-6 md:gap-8 select-none overflow-hidden"
    >
      {/* ARIA live region */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isPlaying
          ? `BPM ${state.bpm}, beat ${currentBeat} of ${state.timeSignature.beats}`
          : 'Metronome stopped'}
      </div>

      {/* Top section — Time signature and mode badges */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-3xl md:text-4xl font-bold tabular-nums text-white">
          {timeSignatureText}
        </div>

        {hasTrainingModes && (
          <div className="flex items-center gap-2">
            {trainingConfig.autoBpm.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-400/30 text-blue-400">
                Auto-BPM
              </span>
            )}
            {trainingConfig.countIn.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-green-400/30 text-green-400">
                Count-In
              </span>
            )}
            {trainingConfig.silence.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-amber-400/30 text-amber-400">
                Silence
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center section — Large beat indicator with pulse ring */}
      <div className="relative flex items-center justify-center">
        {/* Pulse ring */}
        {isBeatActive && (
          <div
            key={`fs-pulse-${currentBeat}`}
            className={`
              absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px]
              rounded-full border-2 pointer-events-none
              ${isBeatOne ? 'border-red-500/30' : 'border-blue-500/30'}
              animate-pulse-ring
            `}
            aria-hidden="true"
          />
        )}

        {/* Beat circle */}
        <div
          className={`
            w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[440px] lg:h-[440px]
            rounded-full flex items-center justify-center
            transition-all duration-150 spring-bounce
            ${isBeatActive
              ? isBeatOne
                ? 'bg-red-600 scale-110 shadow-[0_0_80px_rgba(220,38,38,0.25)]'
                : 'bg-blue-600 scale-110 shadow-[0_0_80px_rgba(59,130,246,0.25)]'
              : 'bg-neutral-800 scale-100'
            }
          `}
          aria-hidden="true"
        >
          <span className="text-8xl md:text-9xl font-bold text-white tabular-nums">
            {isPlaying ? currentBeat : '—'}
          </span>
        </div>
      </div>

      {/* BPM display */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-7xl md:text-9xl font-bold tabular-nums bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
          {state.bpm}
        </div>
        <div className="text-xl md:text-2xl text-white/30 font-medium uppercase tracking-[0.2em]">BPM</div>
      </div>

      {/* Bottom section — Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
          aria-label={isPlaying ? 'Pause metronome' : 'Start metronome'}
          aria-pressed={isPlaying}
          className={`
            w-[88px] h-[88px] md:w-32 md:h-32 rounded-full
            flex items-center justify-center
            transition-transform duration-150 active:scale-[0.88] spring-bounce
            focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50
            ${isPlaying
              ? 'bg-red-500 shadow-[0_8px_32px_rgba(239,68,68,0.35)]'
              : 'bg-blue-500 shadow-[0_8px_32px_rgba(59,130,246,0.35)]'
            }
            [@media(hover:hover)]:hover:brightness-110
          `}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 md:w-12 md:h-12 text-white" aria-hidden="true" />
          ) : (
            <Play className="w-8 h-8 md:w-12 md:h-12 text-white ml-0.5" aria-hidden="true" />
          )}
        </button>

        <button
          onClick={toggleFullscreen}
          aria-label="Exit fullscreen"
          className="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white/[0.06] text-white/70 active:scale-90 transition-transform [@media(hover:hover)]:hover:bg-white/[0.10]"
        >
          <Minimize className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
        </button>
      </div>

      {/* Training overlay */}
      {isTrainingActive && (
        <div className="absolute top-4 left-4 bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-4 border border-white/[0.08]">
          <div className="flex flex-col gap-2">
            <div className="font-mono text-xl text-white/70 flex items-center gap-2">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span className="text-white">
                {Math.floor(trainingSession.elapsedTime / 60)}:{String(Math.floor(trainingSession.elapsedTime % 60)).padStart(2, '0')}
              </span>
            </div>

            <div className="font-mono text-2xl text-white">
              Bar: {trainingSession.currentBar}
            </div>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                trainingSession.phase === 'count-in'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}
            >
              {trainingSession.phase === 'count-in' ? 'Count-in' : 'Playing'}
            </span>

            {trainingConfig.autoBpm.enabled && (
              <div className="text-sm text-white/70">
                <span className="text-white/40">BPM: </span>
                <span className="text-white font-mono">{trainingSession.autoBpmCurrentValue}</span>
                <span className="text-white/40">{' '}{trainingConfig.autoBpm.direction === 'decrease' ? '←' : '→'}{' '}</span>
                <span className="text-white font-mono">{trainingConfig.autoBpm.targetBpm}</span>
              </div>
            )}

            {trainingConfig.silence.enabled && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                  trainingSession.silenceIsMuted
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}
              >
                {trainingSession.silenceIsMuted ? 'Silent' : 'Audible'}
              </span>
            )}

            {trainingConfig.countIn.enabled &&
              trainingSession.phase === 'count-in' && (
              <div className="text-sm text-white/70">
                <span className="text-white/40">Count-in: </span>
                <span className="text-white font-mono">{trainingSession.countInBarsRemaining}</span>
                <span className="text-white/40"> bars left</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

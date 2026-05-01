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
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 md:p-8 gap-6 md:gap-8 select-none"
    >
      {/* ARIA live region for screen readers */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isPlaying
          ? `BPM ${state.bpm}, beat ${currentBeat} of ${state.timeSignature.beats}`
          : 'Metronome stopped'}
      </div>

      {/* Top section — Time signature and mode badges */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-3xl md:text-4xl font-bold tabular-nums">
          {timeSignatureText}
        </div>

        {hasTrainingModes && (
          <div className="flex items-center gap-2">
            {trainingConfig.autoBpm.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-400 text-blue-300">
                Auto-BPM
              </span>
            )}
            {trainingConfig.countIn.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-green-400 text-green-300">
                Count-In
              </span>
            )}
            {trainingConfig.silence.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-amber-400 text-amber-300">
                Silence
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center section — Large beat indicator */}
      <div
        className={`
          w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96
          rounded-full flex items-center justify-center
          transition-all duration-100
          ${
            isBeatActive
              ? isBeatOne
                ? 'bg-red-500 ring-8 ring-white/30 scale-110'
                : 'bg-blue-500 ring-8 ring-white/30 scale-110'
              : 'bg-gray-800 scale-100'
          }
        `}
        aria-hidden="true"
      >
        <span className="text-6xl md:text-8xl font-bold text-white">
          {isPlaying ? currentBeat : '-'}
        </span>
      </div>

      {/* BPM display */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-7xl md:text-9xl font-bold tabular-nums">
          {state.bpm}
        </div>
        <div className="text-xl md:text-2xl text-gray-400">BPM</div>
      </div>

      {/* Bottom section — Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Play/Pause button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
          aria-label={isPlaying ? 'Pause metronome' : 'Start metronome'}
          aria-pressed={isPlaying}
          className={`
            w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center
            transition-all duration-150 active:scale-95
            focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500
            ${
              isPlaying
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }
          `}
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 md:w-12 md:h-12" aria-hidden="true" />
          ) : (
            <Play className="w-10 h-10 md:w-12 md:h-12 ml-1" aria-hidden="true" />
          )}
        </button>

        {/* Exit fullscreen button */}
        <button
          onClick={toggleFullscreen}
          aria-label="Exit fullscreen"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500"
        >
          <Minimize className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
        </button>
      </div>

      {/* Training overlay */}
      {isTrainingActive && (
        <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="flex flex-col gap-2">
            <div className="font-mono text-xl text-gray-300 flex items-center gap-2">
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
              <div className="text-sm text-gray-300">
                <span className="text-gray-400">BPM: </span>
                <span className="text-white font-mono">
                  {trainingSession.autoBpmCurrentValue}
                </span>
                <span className="text-gray-400">
                  {' '}
                  {trainingConfig.autoBpm.direction === 'decrease' ? '←' : '→'}{' '}
                </span>
                <span className="text-white font-mono">
                  {trainingConfig.autoBpm.targetBpm}
                </span>
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
                <div className="text-sm text-gray-300">
                  <span className="text-gray-400">Count-in: </span>
                  <span className="text-white font-mono">
                    {trainingSession.countInBarsRemaining}
                  </span>
                  <span className="text-gray-400"> bars left</span>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

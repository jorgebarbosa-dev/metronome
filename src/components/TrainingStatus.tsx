import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Timer,
  VolumeX,
  Clock,
} from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';

export function TrainingStatus() {
  const { state, trainingConfig, trainingSession } = useMetronome();
  const isPlaying = state.isPlaying;

  const enabledModes = useMemo(() => {
    const modes: Array<{
      key: string;
      label: string;
      icon: React.ReactNode;
      colorClass: string;
    }> = [];

    if (trainingConfig.autoBpm.enabled) {
      modes.push({
        key: 'autobpm',
        label: 'Auto-BPM',
        icon: trainingConfig.autoBpm.direction === 'decrease' ? (
          <TrendingDown className="w-3 h-3" aria-hidden="true" />
        ) : (
          <TrendingUp className="w-3 h-3" aria-hidden="true" />
        ),
        colorClass:
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      });
    }

    if (trainingConfig.countIn.enabled) {
      modes.push({
        key: 'countin',
        label: 'Count-In',
        icon: <Timer className="w-3 h-3" aria-hidden="true" />,
        colorClass:
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      });
    }

    if (trainingConfig.silence.enabled) {
      modes.push({
        key: 'silence',
        label: 'Silence',
        icon: <VolumeX className="w-3 h-3" aria-hidden="true" />,
        colorClass:
          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      });
    }

    return modes;
  }, [trainingConfig]);

  const hasModes = enabledModes.length > 0;

  // Build a concise announcement for screen readers
  const announcement = useMemo(() => {
    if (!isPlaying || !trainingSession.isActive) {
      return null;
    }
    const parts: string[] = [];
    parts.push(`Bar ${trainingSession.currentBar}`);
    parts.push(trainingSession.phase === 'count-in' ? 'Count-in' : 'Playing');
    if (trainingConfig.autoBpm.enabled) {
      parts.push(`BPM ${trainingSession.autoBpmCurrentValue}`);
    }
    if (trainingConfig.silence.enabled) {
      parts.push(trainingSession.silenceIsMuted ? 'Silent' : 'Audible');
    }
    const mins = Math.floor(trainingSession.elapsedTime / 60);
    const secs = Math.floor(trainingSession.elapsedTime % 60);
    parts.push(`Time ${mins}:${String(secs).padStart(2, '0')}`);
    return parts.join(', ');
  }, [
    isPlaying,
    trainingSession.isActive,
    trainingSession.currentBar,
    trainingSession.phase,
    trainingSession.autoBpmCurrentValue,
    trainingSession.silenceIsMuted,
    trainingSession.elapsedTime,
    trainingConfig.autoBpm.enabled,
    trainingConfig.silence.enabled,
  ]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="flex flex-wrap items-center gap-2 text-sm w-full"
    >
      {/* Mode badges */}
      {hasModes ? (
        enabledModes.map((mode) => (
          <span
            key={mode.key}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${mode.colorClass}`}
          >
            {mode.icon}
            {mode.label}
          </span>
        ))
      ) : (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          No training modes active
        </span>
      )}

      {/* Session info when playing */}
      {isPlaying && trainingSession.isActive && (
        <div className="flex items-center gap-3 ml-auto">
          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
            <Clock className="w-3 h-3 inline mr-1" aria-hidden="true" />
            {Math.floor(trainingSession.elapsedTime / 60)}:{String(Math.floor(trainingSession.elapsedTime % 60)).padStart(2, '0')}
          </span>

          <span className="font-mono text-sm text-gray-700 dark:text-gray-300 animate-pulse">
            Bar: {trainingSession.currentBar}
          </span>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              trainingSession.phase === 'count-in'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            }`}
          >
            {trainingSession.phase === 'count-in' ? 'Count-in' : 'Playing'}
          </span>

          {trainingConfig.autoBpm.enabled && (
            <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
              BPM: {trainingSession.autoBpmCurrentValue}{' '}
              {trainingConfig.autoBpm.direction === 'decrease' ? '←' : '→'}{' '}
              {trainingConfig.autoBpm.targetBpm}
            </span>
          )}

          {trainingConfig.silence.enabled && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                trainingSession.silenceIsMuted
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}
            >
              {trainingSession.silenceIsMuted ? 'Silent' : 'Audible'}
            </span>
          )}

          {trainingConfig.countIn.enabled &&
            trainingSession.phase === 'count-in' && (
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                Count-in: {trainingSession.countInBarsRemaining} bars left
              </span>
            )}
        </div>
      )}

      {/* Screen reader announcement */}
      {announcement && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      )}
    </div>
  );
}

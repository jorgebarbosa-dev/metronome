import { useCallback } from 'react';
import {
  Target,
  X,
  TrendingUp,
  TrendingDown,
  Timer,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

interface TrainingPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function TrainingPanel({ isOpen, onToggle }: TrainingPanelProps) {
  const { trainingConfig, trainingActions } = useMetronome();
  const { autoBpm, silence, countIn } = trainingConfig;

  const handleReset = useCallback(() => {
    if (confirm('Reset all training modes to their default settings?')) {
      trainingActions.resetTraining();
    }
  }, [trainingActions]);

  if (!isOpen) return null;

  return (
    <section
      role="region"
      aria-label="Training mode configuration"
      className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Training Modes
          </h2>
        </div>
        <button
          onClick={onToggle}
          aria-label="Close training modes panel"
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {/* Auto-BPM Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {autoBpm.direction === 'decrease' ? (
              <TrendingDown className="w-4 h-4" aria-hidden="true" />
            ) : (
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            )}
            Auto-BPM
          </h3>
          <button
            role="switch"
            aria-checked={autoBpm.enabled}
            aria-label="Toggle Auto-BPM training mode"
            onClick={() =>
              trainingActions.updateAutoBpm({ enabled: !autoBpm.enabled })
            }
            className={`relative w-11 h-6 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              autoBpm.enabled
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                autoBpm.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {autoBpm.enabled && (
          <div className="grid grid-cols-2 gap-3">
            {/* Direction toggle */}
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Direction
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    trainingActions.updateAutoBpm({ direction: 'increase' })
                  }
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    autoBpm.direction === 'increase'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Increase
                </button>
                <button
                  onClick={() =>
                    trainingActions.updateAutoBpm({ direction: 'decrease' })
                  }
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    autoBpm.direction === 'decrease'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Decrease
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="autobpm-start"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Start BPM
              </label>
              <input
                id="autobpm-start"
                type="number"
                min={40}
                max={240}
                value={autoBpm.startBpm}
                onChange={(e) =>
                  trainingActions.updateAutoBpm({
                    startBpm: clamp(Number(e.target.value), 40, 240),
                  })
                }
                aria-describedby="autobpm-start-hint"
                className="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                id="autobpm-start-hint"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Range: 40–240
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="autobpm-target"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Target BPM
              </label>
              <input
                id="autobpm-target"
                type="number"
                min={40}
                max={240}
                value={autoBpm.targetBpm}
                onChange={(e) =>
                  trainingActions.updateAutoBpm({
                    targetBpm: clamp(Number(e.target.value), 40, 240),
                  })
                }
                aria-describedby="autobpm-target-hint"
                className={`w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  autoBpm.direction === 'increase'
                    ? autoBpm.startBpm > autoBpm.targetBpm
                      ? 'border-red-500 dark:border-red-500'
                      : ''
                    : autoBpm.startBpm < autoBpm.targetBpm
                      ? 'border-red-500 dark:border-red-500'
                      : ''
                }`}
              />
              <span
                id="autobpm-target-hint"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Range: 40–240
              </span>
              {autoBpm.direction === 'increase'
                ? autoBpm.startBpm > autoBpm.targetBpm && (
                    <span className="text-xs text-red-500">
                      Start BPM must be ≤ Target BPM
                    </span>
                  )
                : autoBpm.startBpm < autoBpm.targetBpm && (
                    <span className="text-xs text-red-500">
                      Start BPM must be ≥ Target BPM
                    </span>
                  )}
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="autobpm-increment"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Increment
              </label>
              <input
                id="autobpm-increment"
                type="number"
                min={1}
                max={20}
                value={autoBpm.increment}
                onChange={(e) =>
                  trainingActions.updateAutoBpm({
                    increment: clamp(Number(e.target.value), 1, 20),
                  })
                }
                aria-describedby="autobpm-increment-hint"
                className="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                id="autobpm-increment-hint"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Range: 1–20
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="autobpm-every"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Every N Bars
              </label>
              <input
                id="autobpm-every"
                type="number"
                min={1}
                max={32}
                value={autoBpm.everyNBars}
                onChange={(e) =>
                  trainingActions.updateAutoBpm({
                    everyNBars: clamp(Number(e.target.value), 1, 32),
                  })
                }
                aria-describedby="autobpm-every-hint"
                className="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                id="autobpm-every-hint"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Range: 1–32
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Count-In Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Timer className="w-4 h-4" aria-hidden="true" />
            Count-In
          </h3>
          <button
            role="switch"
            aria-checked={countIn.enabled}
            aria-label="Toggle Count-In training mode"
            onClick={() =>
              trainingActions.updateCountIn({ enabled: !countIn.enabled })
            }
            className={`relative w-11 h-6 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              countIn.enabled
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                countIn.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {countIn.enabled && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="countin-measures"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Measures
            </label>
            <select
              id="countin-measures"
              value={countIn.measures}
              onChange={(e) =>
                trainingActions.updateCountIn({
                  measures: Number(e.target.value),
                })
              }
              className="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Silence Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <VolumeX className="w-4 h-4" aria-hidden="true" />
            Silence
          </h3>
          <button
            role="switch"
            aria-checked={silence.enabled}
            aria-label="Toggle Silence training mode"
            onClick={() =>
              trainingActions.updateSilence({ enabled: !silence.enabled })
            }
            className={`relative w-11 h-6 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              silence.enabled
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                silence.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {silence.enabled && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="silence-play"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Play Bars
              </label>
              <input
                id="silence-play"
                type="number"
                min={1}
                max={16}
                value={silence.playBars}
                onChange={(e) =>
                  trainingActions.updateSilence({
                    playBars: clamp(Number(e.target.value), 1, 16),
                  })
                }
                aria-describedby="silence-play-hint"
                className="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                id="silence-play-hint"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Range: 1–16
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="silence-silence"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Silence Bars
              </label>
              <input
                id="silence-silence"
                type="number"
                min={1}
                max={16}
                value={silence.silenceBars}
                onChange={(e) =>
                  trainingActions.updateSilence({
                    silenceBars: clamp(Number(e.target.value), 1, 16),
                  })
                }
                aria-describedby="silence-silence-hint"
                className="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                id="silence-silence-hint"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Range: 1–16
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </section>
  );
}

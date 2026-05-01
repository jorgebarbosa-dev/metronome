import { TrendingUp, TrendingDown, VolumeX, Play } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { ControlButton } from './ui/ControlButton';
import { Slider } from './ui/Slider';

function ToggleRow({
  icon,
  label,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <span className="text-white/40">{icon}</span>
        <span className="text-sm font-semibold text-white/70">{label}</span>
      </div>
      <button
        onClick={onToggle}
        aria-pressed={enabled}
        className={`
          w-14 h-8 rounded-full transition-colors duration-200
          ${enabled ? 'bg-blue-500' : 'bg-white/[0.08]'}
        `}
      >
        <div
          className={`
            w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200
            ${enabled ? 'translate-x-7' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}

export function TrainingScreen() {
  const { trainingConfig, trainingActions } = useMetronome();

  return (
    <div className="flex flex-col gap-4">
      {/* Auto-BPM */}
      <ToggleRow
        icon={<TrendingUp className="w-5 h-5" />}
        label="Auto-BPM"
        enabled={trainingConfig.autoBpm.enabled}
        onToggle={() => trainingActions.updateAutoBpm({ enabled: !trainingConfig.autoBpm.enabled })}
      />

      {trainingConfig.autoBpm.enabled && (
        <div className="flex flex-col gap-3 pl-8">
          <div className="flex items-center gap-2">
            <ControlButton
              ariaLabel="Decrease direction"
              variant={trainingConfig.autoBpm.direction === 'decrease' ? 'primary' : 'secondary'}
              onClick={() => trainingActions.updateAutoBpm({ direction: 'decrease' })}
            >
              <TrendingDown className="w-4 h-4" />
            </ControlButton>
            <ControlButton
              ariaLabel="Increase direction"
              variant={trainingConfig.autoBpm.direction === 'increase' ? 'primary' : 'secondary'}
              onClick={() => trainingActions.updateAutoBpm({ direction: 'increase' })}
            >
              <TrendingUp className="w-4 h-4" />
            </ControlButton>
          </div>
          <Slider
            value={trainingConfig.autoBpm.startBpm}
            min={40}
            max={240}
            onChange={(v) => trainingActions.updateAutoBpm({ startBpm: v })}
            ariaLabel="Start BPM"
          />
          <Slider
            value={trainingConfig.autoBpm.targetBpm}
            min={40}
            max={240}
            onChange={(v) => trainingActions.updateAutoBpm({ targetBpm: v })}
            ariaLabel="Target BPM"
          />
          <Slider
            value={trainingConfig.autoBpm.increment}
            min={1}
            max={20}
            onChange={(v) => trainingActions.updateAutoBpm({ increment: v })}
            ariaLabel="Increment"
          />
          <Slider
            value={trainingConfig.autoBpm.everyNBars}
            min={1}
            max={16}
            onChange={(v) => trainingActions.updateAutoBpm({ everyNBars: v })}
            ariaLabel="Every N bars"
          />
        </div>
      )}

      {/* Count-In */}
      <ToggleRow
        icon={<Play className="w-5 h-5" />}
        label="Count-In"
        enabled={trainingConfig.countIn.enabled}
        onToggle={() => trainingActions.updateCountIn({ enabled: !trainingConfig.countIn.enabled })}
      />

      {trainingConfig.countIn.enabled && (
        <div className="pl-8">
          <Slider
            value={trainingConfig.countIn.measures}
            min={1}
            max={8}
            onChange={(v) => trainingActions.updateCountIn({ measures: v })}
            ariaLabel="Count-in measures"
          />
        </div>
      )}

      {/* Silence */}
      <ToggleRow
        icon={<VolumeX className="w-5 h-5" />}
        label="Silence Mode"
        enabled={trainingConfig.silence.enabled}
        onToggle={() => trainingActions.updateSilence({ enabled: !trainingConfig.silence.enabled })}
      />

      {trainingConfig.silence.enabled && (
        <div className="flex flex-col gap-3 pl-8">
          <Slider
            value={trainingConfig.silence.playBars}
            min={1}
            max={16}
            onChange={(v) => trainingActions.updateSilence({ playBars: v })}
            ariaLabel="Play bars"
          />
          <Slider
            value={trainingConfig.silence.silenceBars}
            min={1}
            max={16}
            onChange={(v) => trainingActions.updateSilence({ silenceBars: v })}
            ariaLabel="Silence bars"
          />
        </div>
      )}

      <ControlButton
        ariaLabel="Reset training settings"
        variant="ghost"
        onClick={() => trainingActions.resetTraining()}
      >
        Reset to Defaults
      </ControlButton>
    </div>
  );
}

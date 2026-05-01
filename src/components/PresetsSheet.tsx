import { Trash2, Check } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { usePresets } from '../hooks/usePresets';
import { ControlButton } from './ui/ControlButton';

export function PresetsSheet() {
  const { presets, deletePreset } = usePresets();
  const { loadPreset } = useMetronome();

  return (
    <div className="flex flex-col gap-3">
      {presets.length === 0 ? (
        <p className="text-sm text-white/40 text-center py-8">No saved presets yet.</p>
      ) : (
        presets.map((preset) => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">{preset.name}</span>
              <span className="text-xs text-white/40">
                {preset.bpm} BPM · {preset.timeSignature.beats}/{preset.timeSignature.beatValue}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ControlButton
                ariaLabel={`Load preset ${preset.name}`}
                variant="primary"
                onClick={() => loadPreset(preset)}
              >
                <Check className="w-4 h-4" />
              </ControlButton>
              <ControlButton
                ariaLabel={`Delete preset ${preset.name}`}
                onClick={() => deletePreset(preset.id)}
              >
                <Trash2 className="w-4 h-4" />
              </ControlButton>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

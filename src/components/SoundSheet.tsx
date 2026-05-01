import { Check } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { SoundName } from '../types/metronome';

const SOUNDS: { value: SoundName; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Clear digital click' },
  { value: 'wood', label: 'Wood', description: 'Warm wooden block' },
  { value: 'click', label: 'Click', description: 'Sharp mechanical click' },
];

export function SoundSheet() {
  const { state, dispatch } = useMetronome();

  return (
    <div className="flex flex-col gap-2">
      {SOUNDS.map((sound) => (
        <button
          key={sound.value}
          onClick={() => dispatch({ type: 'SET_SOUND', payload: sound.value })}
          aria-pressed={state.selectedSound === sound.value}
          className={`
            flex items-center justify-between p-4 rounded-2xl
            transition-all duration-150 active:scale-[0.98]
            ${state.selectedSound === sound.value
              ? 'bg-blue-500/15 border border-blue-500/20'
              : 'bg-white/[0.04] border border-white/[0.06] [@media(hover:hover)]:hover:bg-white/[0.08]'
            }
          `}
        >
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-semibold text-white">{sound.label}</span>
            <span className="text-xs text-white/40">{sound.description}</span>
          </div>
          {state.selectedSound === sound.value && (
            <Check className="w-5 h-5 text-blue-400" aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}

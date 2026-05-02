import { Volume2, Bell } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { SegmentedControl } from './ui/SegmentedControl';
import { Slider } from './ui/Slider';
import { Subdivision, TimeSignature } from '../types/metronome';

const TIME_SIGNATURES: { value: TimeSignature; label: string }[] = [
  { value: { beats: 2, beatValue: 4 }, label: '2/4' },
  { value: { beats: 3, beatValue: 4 }, label: '3/4' },
  { value: { beats: 4, beatValue: 4 }, label: '4/4' },
  { value: { beats: 5, beatValue: 4 }, label: '5/4' },
  { value: { beats: 6, beatValue: 8 }, label: '6/8' },
  { value: { beats: 7, beatValue: 8 }, label: '7/8' },
];

const SUBDIVISIONS: { value: Subdivision; label: string }[] = [
  { value: 'quarter', label: '♩' },
  { value: 'eighth', label: '♪' },
  { value: 'triplet', label: '♩₃' },
  { value: 'sixteenth', label: '𝅗𝅥𝅮' },
];

export function SettingsScreen() {
  const { state, dispatch } = useMetronome();

  const currentTimeSignature = TIME_SIGNATURES.find(
    (ts) =>
      ts.value.beats === state.timeSignature.beats &&
      ts.value.beatValue === state.timeSignature.beatValue
  )?.value || TIME_SIGNATURES[2].value;

  return (
    <div className="flex flex-col gap-6">
      {/* Time Signature */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Time Signature
        </label>
        <SegmentedControl
          options={TIME_SIGNATURES}
          value={currentTimeSignature}
          onChange={(value) => dispatch({ type: 'SET_TIME_SIGNATURE', payload: value })}
          ariaLabel="Select time signature"
        />
      </div>

      {/* Subdivision */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Subdivision
        </label>
        <SegmentedControl
          options={SUBDIVISIONS}
          value={state.subdivision}
          onChange={(value) => dispatch({ type: 'SET_SUBDIVISION', payload: value })}
          ariaLabel="Select subdivision"
        />
      </div>

      {/* Volume */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Volume
        </label>
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-white/40" aria-hidden="true" />
          <Slider
            value={Math.round(state.volume * 100)}
            min={0}
            max={100}
            onChange={(value) => dispatch({ type: 'SET_VOLUME', payload: value / 100 })}
            ariaLabel="Volume"
          />
        </div>
      </div>

      {/* Accent Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-white/40" aria-hidden="true" />
          <span className="text-sm font-semibold text-white/70">Accent First Beat</span>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_ACCENT' })}
          aria-label={state.accentEnabled ? 'Disable accent' : 'Enable accent'}
          aria-pressed={state.accentEnabled}
          className={`
            w-14 h-8 rounded-full transition-colors duration-200
            ${state.accentEnabled ? 'bg-blue-500' : 'bg-white/[0.08]'}
          `}
        >
          <div
            className={`
              w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200
              ${state.accentEnabled ? 'translate-x-7' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
}

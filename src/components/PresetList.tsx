import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { usePresets } from '../hooks/usePresets';
import { Preset } from '../types/preset';

export function PresetList() {
  const { loadPreset } = useMetronome();
  const { presets, isLoading, error, deletePreset } = usePresets();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLoad = (preset: Preset) => {
    loadPreset(preset);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deletePreset(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        <span>Loading presets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-red-600 dark:text-red-400 text-sm" role="alert">
        Failed to load presets: {error.message}
      </div>
    );
  }

  if (presets.length === 0) {
    return (
      <div className="py-4 text-gray-500 dark:text-gray-400 text-sm text-center">
        No saved presets yet. Save your current settings to create one.
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-2 w-full"
      role="region"
      aria-label="Saved presets"
    >
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Saved Presets ({presets.length})
      </span>

      <ul
        className="flex flex-col gap-2 w-full max-w-md"
        role="list"
        aria-label="Preset list"
      >
        {presets.map((preset) => (
          <li
            key={preset.id}
            role="listitem"
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => handleLoad(preset)}
              className="
                flex-1 min-h-[44px] px-3 py-2 rounded-md text-left font-medium
                transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                hover:bg-gray-100 dark:hover:bg-gray-700
                text-gray-900 dark:text-white
              "
              aria-label={`Load preset: ${preset.name} — ${preset.bpm} BPM, ${preset.timeSignature.beats}/${preset.timeSignature.beatValue}`}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {preset.bpm} BPM · {preset.timeSignature.beats}/{preset.timeSignature.beatValue} · {preset.selectedSound}
              </div>
            </button>

            <button
              onClick={() => handleDelete(preset.id)}
              disabled={deletingId === preset.id}
              className="
                w-10 h-10 rounded-md flex items-center justify-center
                transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
                text-gray-400 hover:text-red-600 hover:bg-red-50
                dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/20
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              aria-label={`Delete preset: ${preset.name}`}
            >
              {deletingId === preset.id ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Save, X, Check } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { usePresets } from '../hooks/usePresets';

export function PresetManager() {
  const { state, trainingConfig } = useMetronome();
  const { createPreset, isLoading } = usePresets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isDialogOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDialogOpen]);

  const openDialog = () => {
    setPresetName('');
    setError(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setError(null);
    // Return focus to open button
    setTimeout(() => openButtonRef.current?.focus(), 0);
  };

  const handleSave = async () => {
    const trimmedName = presetName.trim();
    if (!trimmedName) {
      setError('Please enter a preset name');
      return;
    }

    try {
      await createPreset({
        name: trimmedName,
        bpm: state.bpm,
        timeSignature: state.timeSignature,
        accentEnabled: state.accentEnabled,
        volume: state.volume,
        selectedSound: state.selectedSound,
        subdivision: state.subdivision,
        trainingConfig,
      });
      closeDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preset');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDialog();
    } else if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <>
      <button
        ref={openButtonRef}
        onClick={openDialog}
        disabled={isLoading}
        className="
          min-h-[44px] px-4 py-2 rounded-lg font-medium transition-colors
          flex items-center gap-2
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          bg-blue-600 hover:bg-blue-700 text-white
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        aria-label="Save current settings as preset"
      >
        <Save className="w-4 h-4" aria-hidden="true" />
        Save Preset
      </button>

      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="preset-dialog-title"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm"
            onKeyDown={handleKeyDown}
          >
            <h2
              id="preset-dialog-title"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Save Preset
            </h2>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="preset-name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Preset Name
              </label>
              <input
                ref={inputRef}
                id="preset-name"
                type="text"
                value={presetName}
                onChange={(e) => {
                  setPresetName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Jazz Practice"
                className="
                  w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800 dark:text-white
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                "
                aria-describedby={error ? 'preset-error' : undefined}
                aria-invalid={error ? 'true' : 'false'}
              />

              {error && (
                <p
                  id="preset-error"
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {state.bpm} BPM · {state.timeSignature.beats}/{state.timeSignature.beatValue} · {state.selectedSound} · {state.subdivision}
              </div>
            </div>

            <div className="flex gap-2 mt-6 justify-end">
              <button
                onClick={closeDialog}
                className="
                  min-h-[44px] px-4 py-2 rounded-lg font-medium transition-colors
                  flex items-center gap-2
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
                "
                aria-label="Cancel save preset"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="
                  min-h-[44px] px-4 py-2 rounded-lg font-medium transition-colors
                  flex items-center gap-2
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  bg-blue-600 hover:bg-blue-700 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                aria-label="Confirm save preset"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

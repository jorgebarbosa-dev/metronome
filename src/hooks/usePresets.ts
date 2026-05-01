import { useState, useEffect, useCallback } from 'react';
import { Preset, CreatePresetInput, UpdatePresetInput } from '../types/preset';
import {
  createPreset as createPresetInDB,
  getAllPresets,
  deletePreset as deletePresetFromDB,
  updatePreset as updatePresetInDB,
} from '../storage/presetStorage';

export interface UsePresetsReturn {
  presets: Preset[];
  isLoading: boolean;
  error: Error | null;
  createPreset: (input: CreatePresetInput) => Promise<Preset>;
  updatePreset: (id: string, input: UpdatePresetInput) => Promise<Preset>;
  deletePreset: (id: string) => Promise<void>;
  refreshPresets: () => Promise<void>;
}

export function usePresets(): UsePresetsReturn {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshPresets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allPresets = await getAllPresets();
      setPresets(allPresets);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load presets'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPresets();
  }, [refreshPresets]);

  const createPreset = useCallback(async (input: CreatePresetInput) => {
    const preset = await createPresetInDB(input);
    await refreshPresets();
    return preset;
  }, [refreshPresets]);

  const updatePreset = useCallback(async (id: string, input: UpdatePresetInput) => {
    const preset = await updatePresetInDB(id, input);
    await refreshPresets();
    return preset;
  }, [refreshPresets]);

  const deletePreset = useCallback(async (id: string) => {
    await deletePresetFromDB(id);
    await refreshPresets();
  }, [refreshPresets]);

  return {
    presets,
    isLoading,
    error,
    createPreset,
    updatePreset,
    deletePreset,
    refreshPresets,
  };
}

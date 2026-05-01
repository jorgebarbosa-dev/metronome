import { useState, useCallback } from 'react';
import { TrainingConfig, DEFAULT_TRAINING_CONFIG } from '../types/training';
import { useLocalStorage } from './useLocalStorage';

export interface TrainingState {
  config: TrainingConfig;
  updateConfig: (partial: Partial<TrainingConfig>) => void;
  updateAutoBpm: (partial: Partial<TrainingConfig['autoBpm']>) => void;
  updateSilence: (partial: Partial<TrainingConfig['silence']>) => void;
  updateCountIn: (partial: Partial<TrainingConfig['countIn']>) => void;
  resetToDefaults: () => void;
  loadFromPreset: (config?: TrainingConfig) => void;
}

export function useTraining(): TrainingState {
  const [savedConfig, setSavedConfig] = useLocalStorage<TrainingConfig>(
    'metronome-training',
    DEFAULT_TRAINING_CONFIG
  );

  const [config, setConfig] = useState<TrainingConfig>(() => ({
    autoBpm: { ...DEFAULT_TRAINING_CONFIG.autoBpm, ...savedConfig.autoBpm },
    silence: { ...DEFAULT_TRAINING_CONFIG.silence, ...savedConfig.silence },
    countIn: { ...DEFAULT_TRAINING_CONFIG.countIn, ...savedConfig.countIn },
  }));

  const persist = useCallback((newConfig: TrainingConfig) => {
    setConfig(newConfig);
    setSavedConfig(newConfig);
  }, [setSavedConfig]);

  const updateConfig = useCallback((partial: Partial<TrainingConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...partial };
      setSavedConfig(next);
      return next;
    });
  }, [setSavedConfig]);

  const updateAutoBpm = useCallback((partial: Partial<TrainingConfig['autoBpm']>) => {
    setConfig(prev => {
      const next = {
        ...prev,
        autoBpm: { ...prev.autoBpm, ...partial },
      };
      setSavedConfig(next);
      return next;
    });
  }, [setSavedConfig]);

  const updateSilence = useCallback((partial: Partial<TrainingConfig['silence']>) => {
    setConfig(prev => {
      const next = {
        ...prev,
        silence: { ...prev.silence, ...partial },
      };
      setSavedConfig(next);
      return next;
    });
  }, [setSavedConfig]);

  const updateCountIn = useCallback((partial: Partial<TrainingConfig['countIn']>) => {
    setConfig(prev => {
      const next = {
        ...prev,
        countIn: { ...prev.countIn, ...partial },
      };
      setSavedConfig(next);
      return next;
    });
  }, [setSavedConfig]);

  const resetToDefaults = useCallback(() => {
    persist(DEFAULT_TRAINING_CONFIG);
  }, [persist]);

  const loadFromPreset = useCallback((presetConfig?: TrainingConfig) => {
    if (presetConfig) {
      // Merge with defaults to handle new fields added after preset was saved
      const merged: TrainingConfig = {
        autoBpm: { ...DEFAULT_TRAINING_CONFIG.autoBpm, ...presetConfig.autoBpm },
        silence: { ...DEFAULT_TRAINING_CONFIG.silence, ...presetConfig.silence },
        countIn: { ...DEFAULT_TRAINING_CONFIG.countIn, ...presetConfig.countIn },
      };
      persist(merged);
    } else {
      // Per D-10: reset to defaults when preset has no training config
      resetToDefaults();
    }
  }, [persist, resetToDefaults]);

  return {
    config,
    updateConfig,
    updateAutoBpm,
    updateSilence,
    updateCountIn,
    resetToDefaults,
    loadFromPreset,
  };
}

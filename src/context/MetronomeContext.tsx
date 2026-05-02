import React, { createContext, useContext, useReducer, useRef, useState, useEffect, useCallback } from 'react';
import { MetronomeState, TimeSignature, SoundName, Subdivision } from '../types/metronome';
import { Preset } from '../types/preset';
import { TrainingConfig, TrainingSessionState, createInitialSessionState } from '../types/training';
import { useTraining } from '../hooks/useTraining';
import { SOUND_PRESETS } from '../audio/sounds';
import { createAudioEngine, AudioEngine } from '../audio/engine';
import { createScheduler, Scheduler } from '../audio/scheduler';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_STATE: MetronomeState = {
  bpm: 120,
  isPlaying: false,
  timeSignature: { beats: 4, beatValue: 4 },
  accentEnabled: true,
  volume: 0.8,
  selectedSound: 'classic',
  subdivision: 'quarter',
};

type Action =
  | { type: 'SET_BPM'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_TIME_SIGNATURE'; payload: TimeSignature }
  | { type: 'TOGGLE_ACCENT' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_BEAT'; payload: number }
  | { type: 'SET_SOUND'; payload: SoundName }
  | { type: 'SET_SUBDIVISION'; payload: Subdivision }
  | { type: 'SET_PRESET'; payload: Preset };

function reducer(state: MetronomeState, action: Action): MetronomeState {
  switch (action.type) {
    case 'SET_BPM':
      return { ...state, bpm: Math.max(40, Math.min(240, action.payload)) };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_TIME_SIGNATURE':
      return { ...state, timeSignature: action.payload };
    case 'TOGGLE_ACCENT':
      return { ...state, accentEnabled: !state.accentEnabled };
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    case 'SET_CURRENT_BEAT':
      return state; // currentBeat is tracked separately
    case 'SET_SOUND':
      return { ...state, selectedSound: action.payload };
    case 'SET_SUBDIVISION':
      return { ...state, subdivision: action.payload };
    case 'SET_PRESET':
      return {
        ...state,
        bpm: action.payload.bpm,
        timeSignature: action.payload.timeSignature,
        accentEnabled: action.payload.accentEnabled,
        volume: action.payload.volume,
        selectedSound: action.payload.selectedSound,
        subdivision: action.payload.subdivision,
      };
    default:
      return state;
  }
}

interface MetronomeContextType {
  state: MetronomeState;
  currentBeat: number;
  currentSubBeat: number;
  dispatch: React.Dispatch<Action>;
  audioEngine: AudioEngine;
  trainingConfig: TrainingConfig;
  trainingSession: TrainingSessionState;
  trainingActions: {
    updateAutoBpm: (partial: Partial<TrainingConfig['autoBpm']>) => void;
    updateSilence: (partial: Partial<TrainingConfig['silence']>) => void;
    updateCountIn: (partial: Partial<TrainingConfig['countIn']>) => void;
    resetTraining: () => void;
  };
  loadPreset: (preset: Preset) => void;
}

const MetronomeContext = createContext<MetronomeContextType | null>(null);

export function MetronomeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentSubBeat, setCurrentSubBeat] = useState(0);
  const [savedVolume, setSavedVolume] = useLocalStorage('metronome-volume', 0.8);
  const [savedSound, setSavedSound] = useLocalStorage<SoundName>('metronome-sound', 'classic');
  const [savedSubdivision, setSavedSubdivision] = useLocalStorage<Subdivision>('metronome-subdivision', 'quarter');
  const [savedBpm, setSavedBpm] = useLocalStorage('metronome-bpm', 120);
  const [savedTimeSignature, setSavedTimeSignature] = useLocalStorage<TimeSignature>('metronome-time-signature', { beats: 4, beatValue: 4 });
  const [savedAccentEnabled, setSavedAccentEnabled] = useLocalStorage('metronome-accent', true);

  const training = useTraining();
  const [trainingSession, setTrainingSession] = useState<TrainingSessionState>(
    createInitialSessionState(training.config)
  );

  const audioEngineRef = useRef<AudioEngine>(createAudioEngine());
  const schedulerRef = useRef<Scheduler | null>(null);

  // Initialize scheduler with beat callback
  useEffect(() => {
    if (!schedulerRef.current) {
      schedulerRef.current = createScheduler(audioEngineRef.current, (beat) => {
        setCurrentBeat(beat.beatNumber);
        setCurrentSubBeat(beat.subBeatIndex);
      });
    }
  }, []);

  // Restore saved volume on mount
  useEffect(() => {
    dispatch({ type: 'SET_VOLUME', payload: savedVolume });
  }, []);

  // Restore saved sound and subdivision on mount
  useEffect(() => {
    dispatch({ type: 'SET_SOUND', payload: savedSound });
  }, []);

  useEffect(() => {
    dispatch({ type: 'SET_SUBDIVISION', payload: savedSubdivision });
  }, []);

  // Restore saved BPM on mount
  useEffect(() => {
    dispatch({ type: 'SET_BPM', payload: savedBpm });
  }, []);

  // Restore saved time signature on mount
  useEffect(() => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: savedTimeSignature });
  }, []);

  // Restore saved accent on mount
  useEffect(() => {
    if (!savedAccentEnabled) {
      dispatch({ type: 'TOGGLE_ACCENT' });
    }
  }, []);

  // Handle play/pause
  useEffect(() => {
    const scheduler = schedulerRef.current;
    if (!scheduler) return;

    if (state.isPlaying) {
      // Determine if training modes are active
      const hasTraining = training.config.autoBpm.enabled ||
                          training.config.silence.enabled ||
                          training.config.countIn.enabled;

      // Initialize training session state before starting
      const initialSession = createInitialSessionState(training.config);
      if (hasTraining) {
        initialSession.isActive = true;
        initialSession.currentBar = 1;
      }
      setTrainingSession(initialSession);

      audioEngineRef.current.resume().then(() => {
        const soundConfig = SOUND_PRESETS[state.selectedSound];

        scheduler.start(
          state.bpm,
          state.timeSignature,
          state.accentEnabled,
          state.volume,
          soundConfig,
          state.subdivision,
          hasTraining ? training.config : undefined,
          hasTraining
              ? (barNumber, schedState) => {
                  setTrainingSession({
                    isActive: true,
                    currentBar: barNumber,
                    phase: schedState.isCountIn ? 'count-in' : 'playing',
                    countInBarsRemaining: schedState.countInBarsRemaining,
                    silenceIsMuted: schedState.silenceIsMuted,
                    silenceBarsRemaining: schedState.silenceBarsRemaining,
                    autoBpmCurrentValue: schedState.autoBpmCurrentValue,
                    autoBpmBarsUntilNext: schedState.autoBpmBarsUntilNext,
                    elapsedTime: schedState.elapsedTime,
                  });
                }
            : undefined
        );
      });
    } else {
      scheduler.stop();
      setCurrentBeat(0);
      setCurrentSubBeat(0);
      // Reset training session state
      setTrainingSession(createInitialSessionState(training.config));
    }
  }, [state.isPlaying, training.config]);

  // Handle BPM changes
  useEffect(() => {
    if (state.isPlaying && schedulerRef.current) {
      schedulerRef.current.updateConfig({ bpm: state.bpm });
    }
  }, [state.bpm]);

  // Handle time signature changes
  useEffect(() => {
    if (state.isPlaying && schedulerRef.current) {
      schedulerRef.current.updateConfig({ timeSignature: state.timeSignature });
    }
  }, [state.timeSignature]);

  // Handle accent toggle
  useEffect(() => {
    if (state.isPlaying && schedulerRef.current) {
      schedulerRef.current.updateConfig({ accentEnabled: state.accentEnabled });
    }
  }, [state.accentEnabled]);

  // Handle volume changes
  useEffect(() => {
    if (state.isPlaying && schedulerRef.current) {
      schedulerRef.current.updateConfig({ volume: state.volume });
    }
    setSavedVolume(state.volume);
  }, [state.volume]);

  // Handle sound changes
  useEffect(() => {
    if (state.isPlaying && schedulerRef.current) {
      schedulerRef.current.updateConfig({
        soundConfig: SOUND_PRESETS[state.selectedSound]
      });
    }
    setSavedSound(state.selectedSound);
  }, [state.selectedSound]);

  // Handle subdivision changes
  useEffect(() => {
    if (state.isPlaying && schedulerRef.current) {
      schedulerRef.current.updateConfig({ subdivision: state.subdivision });
    }
    setSavedSubdivision(state.subdivision);
  }, [state.subdivision]);

  // Save BPM when it changes
  useEffect(() => {
    setSavedBpm(state.bpm);
  }, [state.bpm]);

  // Save time signature when it changes
  useEffect(() => {
    setSavedTimeSignature(state.timeSignature);
  }, [state.timeSignature]);

  // Save accent when it changes
  useEffect(() => {
    setSavedAccentEnabled(state.accentEnabled);
  }, [state.accentEnabled]);

  // Reset training session when config changes
  useEffect(() => {
    setTrainingSession(createInitialSessionState(training.config));
  }, [training.config]);

  const loadPreset = useCallback((preset: Preset) => {
    training.loadFromPreset(preset.trainingConfig);
    dispatch({ type: 'SET_PRESET', payload: preset });
  }, [training]);

  const contextValue: MetronomeContextType = {
    state,
    currentBeat,
    currentSubBeat,
    dispatch,
    audioEngine: audioEngineRef.current,
    trainingConfig: training.config,
    trainingSession,
    trainingActions: {
      updateAutoBpm: training.updateAutoBpm,
      updateSilence: training.updateSilence,
      updateCountIn: training.updateCountIn,
      resetTraining: training.resetToDefaults,
    },
    loadPreset,
  };

  return (
    <MetronomeContext.Provider value={contextValue}>
      {children}
    </MetronomeContext.Provider>
  );
}

export function useMetronome(): MetronomeContextType {
  const context = useContext(MetronomeContext);
  if (!context) {
    throw new Error('useMetronome must be used within a MetronomeProvider');
  }
  return context;
}

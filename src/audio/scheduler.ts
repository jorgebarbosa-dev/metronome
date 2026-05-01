import { AudioEngine } from './engine';
import { playClick } from './sounds';
import { Beat, TimeSignature, SoundConfig, DEFAULT_SOUND_CONFIG, Subdivision } from '../types/metronome';
import { TrainingConfig, SchedulerTrainingState, createSchedulerTrainingState } from '../types/training';

export interface Scheduler {
  start: (
    bpm: number,
    timeSignature: TimeSignature,
    accentEnabled: boolean,
    volume: number,
    soundConfig?: SoundConfig,
    subdivision?: Subdivision,
    trainingConfig?: TrainingConfig,
    onBarBoundary?: (barNumber: number, trainingState: SchedulerTrainingState) => void
  ) => void;
  stop: () => void;
  updateConfig: (partialConfig: Partial<{
    bpm: number;
    timeSignature: TimeSignature;
    accentEnabled: boolean;
    volume: number;
    soundConfig: SoundConfig;
    subdivision: Subdivision;
  }>) => void;
  isRunning: () => boolean;
}

export function createScheduler(
  audioEngine: AudioEngine,
  onBeatScheduled?: (beat: Beat) => void
): Scheduler {
  let intervalId: number | null = null;
  let nextNoteTime = 0;
  let currentBeat = 1;
  let isRunning = false;

  let trainingState: SchedulerTrainingState | null = null;
  let onBarBoundaryCallback: ((barNumber: number, state: SchedulerTrainingState) => void) | undefined = undefined;
  let trainingConfig: TrainingConfig | undefined = undefined;
  let silenceGainNode: GainNode | null = null;
  let playStartTime = 0;
  let timeoutIds: number[] = [];

  let config = {
    bpm: 120,
    timeSignature: { beats: 4, beatValue: 4 } as TimeSignature,
    accentEnabled: true,
    volume: 1.0,
    soundConfig: DEFAULT_SOUND_CONFIG,
    subdivision: 'quarter' as Subdivision,
  };

  function getSubdivisionCount(subdivision: Subdivision): number {
    switch (subdivision) {
      case 'quarter': return 1;
      case 'eighth': return 2;
      case 'triplet': return 3;
      case 'sixteenth': return 4;
    }
  }

  function getSubBeatInterval(secondsPerBeat: number, subdivision: Subdivision): number {
    const count = getSubdivisionCount(subdivision);
    return secondsPerBeat / count;
  }

  function handleBarBoundary(boundaryTime: number): void {
    if (!trainingState) return;

    const tc = trainingState;

    // Count-in logic
    if (tc.isCountIn) {
      tc.countInBarsRemaining--;
      if (tc.countInBarsRemaining <= 0) {
        tc.isCountIn = false;
        tc.currentBar = 1; // Reset bar counter after count-in
      }
      // During count-in, don't process other modes
      return;
    }

    // Silence logic
    if (trainingConfig?.silence.enabled) {
      tc.silenceBarsRemaining--;
      if (tc.silenceBarsRemaining <= 0) {
        tc.silenceIsMuted = !tc.silenceIsMuted;
        tc.silenceBarsRemaining = tc.silenceIsMuted
          ? trainingConfig.silence.silenceBars
          : trainingConfig.silence.playBars;

        // Fade in/out at silence transitions (~50ms)
        if (silenceGainNode) {
          const fadeDuration = 0.05; // 50ms
          if (tc.silenceIsMuted) {
            // Entering silence: fade out from full volume starting at boundary
            silenceGainNode.gain.setValueAtTime(1, boundaryTime);
            silenceGainNode.gain.linearRampToValueAtTime(0, boundaryTime + fadeDuration);
          } else {
            // Exiting silence: fade in from zero starting at boundary
            silenceGainNode.gain.setValueAtTime(0, boundaryTime);
            silenceGainNode.gain.linearRampToValueAtTime(1, boundaryTime + fadeDuration);
          }
        }
      }
    }

    // Auto-BPM logic
    if (trainingConfig?.autoBpm.enabled) {
      tc.autoBpmBarsUntilNext--;
      if (tc.autoBpmBarsUntilNext <= 0) {
        const { increment, targetBpm, direction } = trainingConfig.autoBpm;
        if (direction === 'decrease') {
          const newBpm = tc.autoBpmCurrentValue - increment;
          tc.autoBpmCurrentValue = Math.max(newBpm, targetBpm);
        } else {
          const newBpm = tc.autoBpmCurrentValue + increment;
          tc.autoBpmCurrentValue = Math.min(newBpm, targetBpm);
        }
        config.bpm = tc.autoBpmCurrentValue;
        tc.autoBpmBarsUntilNext = trainingConfig.autoBpm.everyNBars;
      }
    }

    tc.currentBar++;

    // Elapsed time tracking
    tc.elapsedTime = Math.round((boundaryTime - playStartTime) * 10) / 10;
  }

  function schedule(): void {
    const ctx = audioEngine.context;
    const lookahead = 0.1; // 100ms

    while (nextNoteTime < ctx.currentTime + lookahead) {
      const subCount = getSubdivisionCount(config.subdivision);
      const secondsPerBeat = 60 / config.bpm;
      const subInterval = getSubBeatInterval(secondsPerBeat, config.subdivision);

      // Determine if this beat should be muted (silence mode)
      const shouldMute = trainingState && !trainingState.isCountIn
        && trainingConfig?.silence.enabled
        && trainingState.silenceIsMuted;

      // Destination: silence gain node when training is active, otherwise direct
      const audioDestination = silenceGainNode || ctx.destination;

      for (let subIndex = 0; subIndex < subCount; subIndex++) {
        const subBeatTime = nextNoteTime + (subIndex * subInterval);

        // Only accent the first sub-beat of beat 1
        const isAccent = config.accentEnabled && currentBeat === 1 && subIndex === 0;

        if (!shouldMute) {
          playClick(
            ctx,
            audioDestination,
            config.soundConfig,
            isAccent,
            config.volume,
            subBeatTime
          );
        }

        if (onBeatScheduled) {
          const delayMs = Math.max(0, (subBeatTime - ctx.currentTime) * 1000);
          const beatNumber = currentBeat;
          const timeoutId = window.setTimeout(() => {
            onBeatScheduled({
              beatNumber,
              subBeatIndex: subIndex,
              isAccent,
              scheduledTime: subBeatTime,
            });
          }, delayMs);
          timeoutIds.push(timeoutId);
        }
      }

      nextNoteTime += secondsPerBeat;

      const wasLastBeat = currentBeat === config.timeSignature.beats;
      currentBeat++;
      if (currentBeat > config.timeSignature.beats) {
        currentBeat = 1;
      }
      if (wasLastBeat) {
        handleBarBoundary(nextNoteTime);
        if (trainingState && onBarBoundaryCallback) {
          onBarBoundaryCallback(trainingState.currentBar, trainingState);
        }
      }
    }
  }

  return {
    start(bpm, timeSignature, accentEnabled, volume, soundConfig = DEFAULT_SOUND_CONFIG, subdivision = 'quarter' as Subdivision, newTrainingConfig?: TrainingConfig, barBoundaryCallback?: (barNumber: number, state: SchedulerTrainingState) => void) {
      if (isRunning) return;

      config = {
        bpm,
        timeSignature,
        accentEnabled,
        volume,
        soundConfig,
        subdivision,
      };

      // Initialize training state if config provided
      trainingConfig = newTrainingConfig;
      if (trainingConfig) {
        trainingState = createSchedulerTrainingState(trainingConfig, bpm);
        onBarBoundaryCallback = barBoundaryCallback;
        // If auto-BPM is enabled, use startBpm as initial BPM
        if (trainingConfig.autoBpm.enabled) {
          config.bpm = trainingConfig.autoBpm.startBpm;
        }
      } else {
        trainingState = null;
        onBarBoundaryCallback = undefined;
      }

      const ctx = audioEngine.context;

      // Create silence gain node for fade in/out transitions
      if (trainingConfig?.silence.enabled) {
        silenceGainNode = ctx.createGain();
        silenceGainNode.connect(ctx.destination);
        silenceGainNode.gain.setValueAtTime(1, ctx.currentTime);
      }

      playStartTime = ctx.currentTime;
      nextNoteTime = ctx.currentTime + 0.05; // 50ms buffer
      currentBeat = 1;
      isRunning = true;

      schedule(); // Schedule first beat immediately
      intervalId = window.setInterval(schedule, 25); // 25ms lookahead check
    },

    stop() {
      if (!isRunning) return;

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }

      // Clean up silence gain node
      if (silenceGainNode) {
        try {
          silenceGainNode.disconnect();
        } catch {
          // Ignore disconnect errors
        }
        silenceGainNode = null;
      }

      isRunning = false;
      nextNoteTime = 0;
      currentBeat = 1;
      trainingState = null;
      onBarBoundaryCallback = undefined;
      trainingConfig = undefined;
      timeoutIds.forEach(id => clearTimeout(id));
      timeoutIds = [];
    },

    updateConfig(partialConfig) {
      config = { ...config, ...partialConfig };
    },

    isRunning() {
      return isRunning;
    },
  };
}

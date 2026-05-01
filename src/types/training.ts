export interface AutoBpmConfig {
  enabled: boolean;
  startBpm: number;
  targetBpm: number;
  increment: number;
  everyNBars: number;
  direction: 'increase' | 'decrease';
}

export interface SilenceConfig {
  enabled: boolean;
  playBars: number;
  silenceBars: number;
}

export interface CountInConfig {
  enabled: boolean;
  measures: number; // 1–8
}

export interface TrainingConfig {
  autoBpm: AutoBpmConfig;
  silence: SilenceConfig;
  countIn: CountInConfig;
}

export interface TrainingSessionState {
  isActive: boolean;
  currentBar: number;
  phase: 'count-in' | 'playing';
  countInBarsRemaining: number;
  silenceIsMuted: boolean;
  silenceBarsRemaining: number;
  autoBpmCurrentValue: number;
  autoBpmBarsUntilNext: number;
  elapsedTime: number; // seconds
}

export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  autoBpm: {
    enabled: false,
    startBpm: 80,
    targetBpm: 120,
    increment: 5,
    everyNBars: 4,
    direction: 'increase',
  },
  silence: {
    enabled: false,
    playBars: 4,
    silenceBars: 2,
  },
  countIn: {
    enabled: false,
    measures: 2,
  },
};

export function createInitialSessionState(config: TrainingConfig): TrainingSessionState {
  return {
    isActive: false,
    currentBar: 0,
    phase: config.countIn.enabled ? 'count-in' : 'playing',
    countInBarsRemaining: config.countIn.enabled ? config.countIn.measures : 0,
    silenceIsMuted: false,
    silenceBarsRemaining: config.silence.enabled ? config.silence.playBars : 0,
    autoBpmCurrentValue: config.autoBpm.enabled ? config.autoBpm.startBpm : 0,
    autoBpmBarsUntilNext: config.autoBpm.enabled ? config.autoBpm.everyNBars : 0,
    elapsedTime: 0,
  };
}

export interface SchedulerTrainingState {
  isCountIn: boolean;
  countInBarsRemaining: number;
  silenceIsMuted: boolean;
  silenceBarsRemaining: number;
  autoBpmCurrentValue: number;
  autoBpmBarsUntilNext: number;
  currentBar: number;
  elapsedTime: number;
}

export function createSchedulerTrainingState(
  config: TrainingConfig,
  startBpm: number
): SchedulerTrainingState {
  return {
    isCountIn: config.countIn.enabled,
    countInBarsRemaining: config.countIn.enabled ? config.countIn.measures : 0,
    silenceIsMuted: false,
    silenceBarsRemaining: config.silence.enabled ? config.silence.playBars : 0,
    autoBpmCurrentValue: config.autoBpm.enabled ? config.autoBpm.startBpm : startBpm,
    autoBpmBarsUntilNext: config.autoBpm.enabled ? config.autoBpm.everyNBars : 0,
    currentBar: 1,
    elapsedTime: 0,
  };
}

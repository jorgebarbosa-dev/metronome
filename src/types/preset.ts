import { TimeSignature, SoundName, Subdivision } from './metronome';
import { TrainingConfig } from './training';

export interface Preset {
  id: string;
  name: string;
  bpm: number;
  timeSignature: TimeSignature;
  accentEnabled: boolean;
  volume: number;
  selectedSound: SoundName;
  subdivision: Subdivision;
  trainingConfig?: TrainingConfig;
  createdAt: number;
  updatedAt: number;
}

export interface CreatePresetInput {
  name: string;
  bpm: number;
  timeSignature: TimeSignature;
  accentEnabled: boolean;
  volume: number;
  selectedSound: SoundName;
  subdivision: Subdivision;
  trainingConfig?: TrainingConfig;
}

export interface UpdatePresetInput {
  name?: string;
  bpm?: number;
  timeSignature?: TimeSignature;
  accentEnabled?: boolean;
  volume?: number;
  selectedSound?: SoundName;
  subdivision?: Subdivision;
  trainingConfig?: TrainingConfig;
}

export const DEFAULT_PRESET_NAME = 'Default';

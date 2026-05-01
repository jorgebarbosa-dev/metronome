export interface TimeSignature {
  beats: number;
  beatValue: number;
}

export type SoundName = 'classic' | 'wood' | 'click';

export type Subdivision = 'quarter' | 'eighth' | 'triplet' | 'sixteenth';

export interface MetronomeState {
  bpm: number;
  isPlaying: boolean;
  timeSignature: TimeSignature;
  accentEnabled: boolean;
  volume: number;
  selectedSound: SoundName;
  subdivision: Subdivision;
}

export interface SoundConfig {
  accentFrequency: number;
  normalFrequency: number;
  waveType: OscillatorType;
  attackTime: number;
  decayTime: number;
}

export interface Beat {
  beatNumber: number;
  subBeatIndex: number;
  isAccent: boolean;
  scheduledTime: number;
}

export const DEFAULT_SOUND_CONFIG: SoundConfig = {
  accentFrequency: 1000,
  normalFrequency: 800,
  waveType: 'square',
  attackTime: 0.001,
  decayTime: 0.05,
};

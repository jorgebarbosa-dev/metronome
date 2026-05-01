import { SoundConfig, DEFAULT_SOUND_CONFIG, SoundName } from '../types/metronome';

const CLASSIC_CONFIG: SoundConfig = {
  accentFrequency: 1000,
  normalFrequency: 800,
  waveType: 'square',
  attackTime: 0.001,
  decayTime: 0.05,
};

const WOOD_CONFIG: SoundConfig = {
  accentFrequency: 600,
  normalFrequency: 450,
  waveType: 'triangle',
  attackTime: 0.005,
  decayTime: 0.08,
};

const CLICK_CONFIG: SoundConfig = {
  accentFrequency: 1200,
  normalFrequency: 900,
  waveType: 'square',
  attackTime: 0.001,
  decayTime: 0.02,
};

export const SOUND_PRESETS: Record<SoundName, SoundConfig> = {
  classic: CLASSIC_CONFIG,
  wood: WOOD_CONFIG,
  click: CLICK_CONFIG,
};

export function playClick(
  audioContext: AudioContext,
  destination: AudioNode,
  config: SoundConfig = DEFAULT_SOUND_CONFIG,
  isAccent: boolean = false,
  volume: number = 1.0,
  time: number = 0
): void {
  const frequency = isAccent ? config.accentFrequency : config.normalFrequency;
  const maxVolume = Math.max(0, Math.min(1, volume));

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = config.waveType;
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(maxVolume, time + config.attackTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + config.attackTime + config.decayTime);

  oscillator.connect(gainNode);
  gainNode.connect(destination);

  oscillator.start(time);
  oscillator.stop(time + config.attackTime + config.decayTime + 0.01);
}

---
plan: 02-01
phase: 02-enhanced-experience
status: complete
started: 2026-04-30
completed: 2026-04-30
deviations: 0
---

## Summary

Created type foundations and three distinct oscillator-based sound presets for the metronome.

## What Was Built

### Types Extension (src/types/metronome.ts)
- `SoundName` type: `'classic' | 'wood' | 'click'`
- `Subdivision` type: `'quarter' | 'eighth' | 'triplet' | 'sixteenth'`
- Extended `MetronomeState` with `selectedSound` and `subdivision` fields

### Sound Presets (src/audio/sounds.ts)
- **Classic**: Square wave, 1000/800Hz, sharp click (0.05s decay)
- **Wood**: Triangle wave, 600/450Hz, softer rounded tone (0.08s decay)
- **Click**: Square wave, 1200/900Hz, very short crisp (0.02s decay)
- Exported `SOUND_PRESETS` as `Record<SoundName, SoundConfig>`

## Key Decisions

- Presets are static constants (user cannot modify at runtime)
- Frequencies clamped to audible range (450-1200Hz)
- Accent distinction via higher frequency for accented beats
- `playClick` remains compatible with all presets (no signature changes)

## Verification

- TypeScript compilation passes for audio module
- Three distinct presets defined with different wave types, frequencies, and envelopes
- No circular imports or missing exports

## Requirements Satisfied

- AUDIO-04: Multiple click sounds
- AUDIO-05: Accented beat has different timbre

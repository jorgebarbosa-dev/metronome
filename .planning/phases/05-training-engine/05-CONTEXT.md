# Phase 5: Training Engine - Context

**Gathered:** Fri May 01 2026
**Status:** Ready for planning
**Source:** Requirements + Roadmap + Codebase Analysis

<domain>
## Phase Boundary

This phase adds advanced training modes to the metronome engine: auto-BPM progression, count-in measures, and silence mode. These modes operate at the scheduler level (audio timing) and must integrate seamlessly with the existing Web Audio API lookahead scheduler, preset system, and React state management.

**Key constraint:** Training modes must not compromise timing precision. All BPM changes and mode transitions must occur exactly at bar boundaries to avoid rhythmic discontinuities.

</domain>

<decisions>
## Implementation Decisions

### Training Mode Architecture
- **D-01**: Training configuration lives in a dedicated `TrainingConfig` type, separate from `MetronomeState` but managed alongside it — Locked
- **D-02**: Training modes are processed by the scheduler at bar boundaries (not mid-bar) to maintain timing integrity — Locked
- **D-03**: The scheduler tracks bar count internally and emits bar-boundary callbacks — Locked
- **D-04**: Silence mode suppresses audio clicks but continues visual pulse callbacks — Locked
- **D-05**: Count-in always uses the current sound config and plays at the current BPM — Locked
- **D-06**: Auto-BPM changes BPM by discrete steps at configurable bar intervals — Locked
- **D-07**: Multiple training modes can be active simultaneously (count-in + auto-BPM + silence) — Locked
- **D-08**: Training settings are persisted via localStorage and included in preset saves — Locked

### State Management
- **D-09**: Create a `useTraining` hook that manages training config state and integrates with `MetronomeContext` — Locked
- **D-10**: Training config is reset to defaults when loading a preset without training settings — Locked
- **D-11**: Training session state (current bar, current mode phase) is ephemeral — not persisted across page reloads — Locked

### Scheduler Integration
- **D-12**: Extend the existing `createScheduler` function with training mode support rather than creating a separate scheduler — Locked
- **D-13**: Bar counting starts at 1 when playback begins and increments at each bar boundary — Locked
- **D-14**: Training mode callbacks are invoked synchronously within the scheduler loop to maintain timing precision — Locked

### the agent's Discretion
- Exact default values for training parameters (e.g., default increment step, default bars per phase)
- Whether to expose auto-decrement mode as a separate mode or negative increment
- Internal representation of silence pattern (play N/silence N vs. more complex patterns)
- Whether count-in measures are configurable as 1/2/4 only or any 1-8 value
- Training state visualization approach (to be refined in Phase 6)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/REQUIREMENTS.md` — TRAIN-01 to TRAIN-08 requirements
- `.planning/ROADMAP.md` — Phase 5 goal and success criteria
- `AGENTS.md` — Critical technical notes (Web Audio API scheduling, no setInterval for timing)

### Existing Code Patterns
- `src/audio/scheduler.ts` — Current lookahead scheduler (must be extended)
- `src/audio/engine.ts` — Audio engine interface
- `src/context/MetronomeContext.tsx` — State management pattern
- `src/types/metronome.ts` — Core type definitions
- `src/types/preset.ts` — Preset type definitions
- `src/storage/presetStorage.ts` — IndexedDB storage pattern
- `src/hooks/usePresets.ts` — Hook pattern for async storage
- `src/hooks/useLocalStorage.ts` — localStorage persistence pattern

### Key Technical Constraints
- Scheduler uses `setInterval(schedule, 25)` for lookahead polling (acceptable per Chris Wilson's pattern)
- Actual audio scheduling uses `audioContext.currentTime` for precise timing
- Beat callback `onBeatScheduled` drives visual feedback
- Preset system uses IndexedDB with `crypto.randomUUID()` for IDs

</canonical_refs>

<specifics>
## Specific Implementation Details

### Bar Counting in Scheduler
The scheduler currently tracks `currentBeat` but not `currentBar`. To support training modes:

1. Add `currentBar` counter that increments when `currentBeat` wraps from last beat to 1
2. Detect bar boundaries within the scheduling loop
3. Emit bar-boundary callbacks for training mode processing

### Training Mode Types

```typescript
interface AutoBpmConfig {
  enabled: boolean;
  startBpm: number;
  targetBpm: number;
  increment: number;
  everyNBars: number;
}

interface SilenceConfig {
  enabled: boolean;
  playBars: number;
  silenceBars: number;
}

interface CountInConfig {
  enabled: boolean;
  measures: number; // 1, 2, or 4
}

interface TrainingConfig {
  autoBpm: AutoBpmConfig;
  silence: SilenceConfig;
  countIn: CountInConfig;
}
```

### Mode Combination Logic

When multiple modes are active:

1. **Count-in + Auto-BPM**: Count-in plays first using current BPM. After count-in completes, auto-BPM begins from startBpm.
2. **Count-in + Silence**: Count-in plays first, then silence pattern begins.
3. **Auto-BPM + Silence**: Both operate simultaneously. Auto-BPM changes BPM at bar intervals. Silence mutes audio during silence bars.
4. **All three**: Count-in → auto-BPM + silence combined.

### Persistence Strategy

Training config is stored in localStorage with key `metronome-training-config`. When saving a preset, the entire `TrainingConfig` is included. When loading a preset without training config, defaults are used.

### Scheduler Extension Points

The scheduler needs these new capabilities:

1. **Bar boundary detection**: When `currentBeat` transitions from `timeSignature.beats` to `1`, increment `currentBar`
2. **Bar callback**: `onBarScheduled?: (barNumber: number) => void` — called at bar boundaries
3. **Training config**: Passed to `start()` and `updateConfig()`
4. **Conditional muting**: Skip `playClick()` calls during silence bars while still calling `onBeatScheduled()`
5. **BPM change at boundary**: Modify `config.bpm` when auto-BPM interval is reached

### Visual Pulse During Silence

Critical requirement: During silence bars, the visual beat indicator must continue to pulse. This means:
- `onBeatScheduled` callback is ALWAYS called
- `playClick` is conditionally called based on silence state
- The UI components receive beat updates regardless of audio state

</specifics>

<deferred>
## Deferred Ideas

- Complex silence patterns (e.g., random silence, progressive silence increase) — beyond v1.1 scope
- Training session statistics (total practice time, BPM progression graph) — analytics, not core
- Custom training programs (save multiple training configs as programs) — nice to have, not essential
- Training mode audio cues (spoken bar numbers, different sounds for transitions) — audio design complexity
- Accelerating/decelerating tempo (continuous rather than stepwise) — requires different scheduler architecture
- Polyrhythm training modes — deferred to v2.0

</deferred>

---

*Phase: 05-training-engine*
*Context gathered: Fri May 01 2026*

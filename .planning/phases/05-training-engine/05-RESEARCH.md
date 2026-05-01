# Phase 5: Training Engine - Research

**Researched:** Fri May 01 2026
**Phase:** 5 — Training Engine

---

## Training Mode Patterns in Metronome Applications

### Auto-Increment BPM (Progressive Speed Training)

**Common Name:** "Speed Trainer", "Progressive Mode", "Auto-BPM"

**How it works:**
- User sets: start BPM, target BPM, increment amount, interval (every N bars or measures)
- Metronome starts at start BPM
- After every N bars, BPM increases by increment
- Continues until target BPM is reached or exceeded
- Some implementations also support auto-decrement (reverse progression)

**Implementation approaches:**

1. **Bar-boundary increment**: BPM changes occur exactly at bar boundaries
   - Pros: Clean rhythmic transitions, no mid-bar tempo jumps
   - Cons: User must wait for bar boundary
   - **Recommended**: This is the correct approach for timing precision

2. **Time-based increment**: BPM changes after N seconds
   - Pros: More predictable for user
   - Cons: Can occur mid-bar, causing rhythmic discontinuity
   - **Not recommended**: Violates timing precision principle

**Edge cases:**
- What if target BPM is not reachable via exact increments? (e.g., start=80, target=100, increment=15 → stops at 95 or goes to 110?)
  - **Decision**: Stop at or exceed target. If last increment would exceed, cap at target.
- What happens after reaching target?
  - **Decision**: Continue at target BPM until user stops
- Can user adjust BPM during auto-BPM mode?
  - **Decision**: Yes, but auto-BPM continues from new value toward target

**State machine:**
```
Idle → Playing (at start BPM)
Playing → Increment BPM (every N bars)
Increment → Check if target reached
  Yes → Continue at target
  No → Continue playing, schedule next increment
```

### Count-In Measures

**Common Name:** "Count-off", "Pre-roll", "Lead-in"

**How it works:**
- User sets number of measures (typically 1, 2, or 4)
- When play is pressed, count-in measures play first
- After count-in completes, main pattern begins
- Count-in typically uses the same sound/accent pattern as main pattern

**Implementation approaches:**

1. **Scheduler-level count-in**: Scheduler handles count-in internally
   - Pros: Clean integration, precise timing
   - Cons: More complex scheduler
   - **Recommended**: Integrate into existing scheduler

2. **Separate pre-roll scheduler**: Start a temporary scheduler for count-in, then switch
   - Pros: Separation of concerns
   - Cons: Risk of timing gap between count-in and main pattern
   - **Not recommended**: Timing precision is non-negotiable

**Key considerations:**
- Count-in should use current BPM and time signature
- Count-in bars should be visually distinguishable (Phase 6 UI concern)
- Count-in should always play audio (not affected by silence mode)
- After count-in, bar counter resets to 1 for main pattern

### Silence Mode (Bar Muting)

**Common Name:** "Mute Bars", "Silence Trainer", "Internal Time Training"

**How it works:**
- User sets: play N bars, silence N bars
- Metronome alternates between audible and silent bars
- Visual pulse continues during silent bars
- Pattern repeats indefinitely

**Implementation approaches:**

1. **Audio-level muting**: Skip `playClick()` calls during silence bars
   - Pros: Simple, visual pulse unaffected
   - Cons: None significant
   - **Recommended**: This is the correct approach

2. **Gain node muting**: Use Web Audio API gain to fade out
   - Pros: Can do smooth fade in/out
   - Cons: More complex, potential for timing drift
   - **Alternative**: Can be combined with approach 1 for fade effects

**State machine:**
```
Playing → Play Phase (N bars with audio)
Play Phase → Silence Phase (N bars without audio)
Silence Phase → Play Phase (repeat)
```

**Critical requirement:** Visual pulse must continue during silence. This means:
- `onBeatScheduled` callback always fires
- Only `playClick()` is conditionally skipped
- UI receives beat updates for silent bars

### Mode Combinations

**Common combinations in professional metronomes:**

1. **Count-in + Auto-BPM**: Count-in at start BPM, then progressive speed begins
2. **Count-in + Silence**: Count-in audible, then silence pattern begins
3. **Auto-BPM + Silence**: Speed increases while alternating audible/silent bars
4. **All three**: Full training session

**Combination rules:**
- Count-in always happens first (at session start only)
- After count-in, other modes operate simultaneously
- Auto-BPM and Silence are independent state machines
- When Auto-BPM reaches target, it stops incrementing but Silence continues

**State management approach:**

Use a composite state machine where each mode manages its own state:

```typescript
type TrainingPhase = 'count-in' | 'playing';

interface TrainingSessionState {
  phase: TrainingPhase;
  currentBar: number;        // Total bars since start
  countInBarsRemaining: number;
  autoBpmCurrentBpm: number;
  autoBpmBarsUntilNext: number;
  silencePhase: 'play' | 'silence';
  silenceBarsRemaining: number;
}
```

## Scheduler Architecture for Training Modes

### Current Scheduler Analysis

The existing scheduler (`src/audio/scheduler.ts`) uses:
- `setInterval(schedule, 25)` for lookahead polling
- `audioContext.currentTime` for precise audio scheduling
- `nextNoteTime` for tracking scheduled audio time
- `currentBeat` for beat position within bar

This is the correct "look-ahead scheduler" pattern. Training modes extend this without changing the core timing mechanism.

### Required Extensions

**1. Bar Counting:**
```typescript
let currentBar = 1;

// In schedule() loop:
if (currentBeat > config.timeSignature.beats) {
  currentBeat = 1;
  currentBar++;
  if (onBarBoundary) {
    onBarBoundary(currentBar);
  }
}
```

**2. Training State Machine:**
```typescript
interface TrainingState {
  isCountIn: boolean;
  countInBarsLeft: number;
  silenceIsMuted: boolean;
  silenceBarsLeft: number;
  autoBpmBarsLeft: number;
  autoBpmCurrent: number;
}
```

**3. Bar Boundary Handler:**
```typescript
function handleBarBoundary(barNumber: number, training: TrainingState, config: SchedulerConfig): void {
  // Count-in logic
  if (training.isCountIn) {
    training.countInBarsLeft--;
    if (training.countInBarsLeft <= 0) {
      training.isCountIn = false;
      // Reset bar counter for main pattern
    }
    return;
  }

  // Silence logic
  if (config.training.silence.enabled) {
    training.silenceBarsLeft--;
    if (training.silenceBarsLeft <= 0) {
      training.silenceIsMuted = !training.silenceIsMuted;
      training.silenceBarsLeft = training.silenceIsMuted 
        ? config.training.silence.silenceBars 
        : config.training.silence.playBars;
    }
  }

  // Auto-BPM logic
  if (config.training.autoBpm.enabled) {
    training.autoBpmBarsLeft--;
    if (training.autoBpmBarsLeft <= 0) {
      training.autoBpmCurrent += config.training.autoBpm.increment;
      if (training.autoBpmCurrent >= config.training.autoBpm.targetBpm) {
        training.autoBpmCurrent = config.training.autoBpm.targetBpm;
      }
      config.bpm = training.autoBpmCurrent;
      training.autoBpmBarsLeft = config.training.autoBpm.everyNBars;
    }
  }
}
```

**4. Conditional Audio:**
```typescript
// In schedule() loop, before playClick():
const shouldMute = !training.isCountIn && 
                   config.training.silence.enabled && 
                   training.silenceIsMuted;

if (!shouldMute) {
  playClick(ctx, ctx.destination, config.soundConfig, isAccent, config.volume, subBeatTime);
}

// Always call visual callback
if (onBeatScheduled) {
  onBeatScheduled({ beatNumber: currentBeat, isAccent, scheduledTime: nextNoteTime });
}
```

## State Management Architecture

### Option A: Extend MetronomeContext

Add training state directly to existing context.

**Pros:**
- Simple integration
- Training config available everywhere
- Consistent with existing pattern

**Cons:**
- Makes context larger
- Mixes concerns

### Option B: Create TrainingContext

Separate context for training modes.

**Pros:**
- Clean separation of concerns
- Training logic isolated
- Can be tree-shaken if not used

**Cons:**
- More complex component tree
- Need to synchronize with MetronomeContext
- Overkill for v1.1

### Decision: Extend MetronomeContext (Option A)

Training modes are intrinsically linked to metronome playback. They affect:
- BPM (auto-BPM)
- Audio output (silence)
- Session start (count-in)
- Visual feedback (bar counter)

Extending the existing context is the pragmatic choice. Use a dedicated `useTraining` hook to manage training config state, but integrate it into `MetronomeContext` for global availability.

## Persistence Strategy

### Training Config Storage

Store training configuration in localStorage:
```typescript
const [trainingConfig, setTrainingConfig] = useLocalStorage('metronome-training', DEFAULT_TRAINING_CONFIG);
```

### Preset Integration

Extend `Preset` type to include optional training config:
```typescript
interface Preset {
  // ... existing fields ...
  trainingConfig?: TrainingConfig;
}
```

When loading a preset:
- If `preset.trainingConfig` exists, apply it
- If not, keep current training config or reset to defaults (per D-10)

When saving a preset:
- Always include current training config

### IndexedDB Migration

The preset storage uses IndexedDB with `DB_VERSION = 1`. Adding training config to presets does NOT require a schema migration because:
- IndexedDB is schemaless for object properties
- Existing presets without `trainingConfig` will simply have `undefined` for that field
- New presets will include the field

However, we should increment `DB_VERSION` to 2 as a best practice when modifying stored object shapes, with an `onupgradeneeded` handler that handles the migration gracefully.

## TypeScript Type Design

### TrainingConfig Interface

```typescript
export interface AutoBpmConfig {
  enabled: boolean;
  startBpm: number;
  targetBpm: number;
  increment: number;
  everyNBars: number;
}

export interface SilenceConfig {
  enabled: boolean;
  playBars: number;
  silenceBars: number;
}

export interface CountInConfig {
  enabled: boolean;
  measures: number; // 1, 2, or 4
}

export interface TrainingConfig {
  autoBpm: AutoBpmConfig;
  silence: SilenceConfig;
  countIn: CountInConfig;
}
```

### TrainingSessionState Interface

```typescript
export interface TrainingSessionState {
  isActive: boolean;
  currentBar: number;
  phase: 'count-in' | 'playing';
  countInBarsRemaining: number;
  silenceIsMuted: boolean;
  silenceBarsRemaining: number;
  autoBpmCurrentValue: number;
  autoBpmBarsUntilNext: number;
}
```

### Default Values

```typescript
export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  autoBpm: {
    enabled: false,
    startBpm: 80,
    targetBpm: 120,
    increment: 5,
    everyNBars: 4,
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
```

## Accessibility Considerations

Training modes add complexity for screen reader users:

1. **Count-in announcement**: Screen reader should announce "Count-in, bar X of Y"
2. **Auto-BPM announcement**: Announce BPM changes (but not every bar — only when BPM actually changes)
3. **Silence mode announcement**: Announce "Silent bars starting" and "Audible bars starting"
4. **Mode status**: Provide a live region for current training mode status

These will be implemented in Phase 6 (Training UI), but the state/data must be available from Phase 5.

## Common Pitfalls

1. **Mid-bar BPM changes**: Never change BPM mid-bar. Always wait for bar boundary.
2. **Bar counter drift**: Ensure bar counting is tied to audio scheduling, not visual callbacks or setInterval.
3. **Silence mode stops visual pulse**: Critical bug — visual pulse must continue during silence.
4. **Count-in timing gap**: Ensure seamless transition from count-in to main pattern.
5. **Mode combination conflicts**: Define clear precedence rules (count-in always first, then simultaneous operation).
6. **Persistence bloat**: Don't persist ephemeral session state (current bar, phase). Only persist configuration.
7. **Preset backward compatibility**: Old presets without training config must load gracefully.
8. **BPM bounds checking**: Auto-BPM must respect 40-240 BPM limits.

## References

- [Web Audio API Best Practices - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- [A Tale of Two Clocks - HTML5 Rocks](https://www.html5rocks.com/en/tutorials/audio/scheduling/) — Chris Wilson's lookahead scheduler pattern
- [Metronome implementation patterns](https://github.com/cwilso/metronome) — Reference implementation
- [Professional metronome features](https://www.soundbrenner.com/blog/metronome-features/) — Feature analysis

---

*Research complete for Phase 5: Training Engine*

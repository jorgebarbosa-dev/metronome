# Phase 6: Training UI & Fullscreen - Context

**Gathered:** Fri May 01 2026
**Status:** Ready for planning
**Source:** Requirements + Roadmap + Phase 5 Artifacts + Codebase Analysis

<domain>
## Phase Boundary

Phase 6 is the **UI and presentation layer** for the training engine built in Phase 5. All training logic (scheduler bar counting, mode state machines, BPM transitions, persistence) is already implemented and working. This phase builds the user-facing controls and visual feedback.

**Key constraint:** This phase is PURELY UI — no scheduler changes, no audio changes, no state management changes. All training data flows through existing `MetronomeContext`.

**Existing training state available via `useMetronome()`:**
- `trainingConfig: TrainingConfig` — current configuration (autoBpm, silence, countIn)
- `trainingSession: TrainingSessionState` — ephemeral session state from scheduler
- `trainingActions` — `updateAutoBpm()`, `updateSilence()`, `updateCountIn()`, `resetTraining()`

</domain>

<decisions>
## Implementation Decisions

### UI Architecture
- **D-01**: Training mode controls live in a dedicated collapsible panel, separate from main metronome controls — Locked (requirement UI-01)
- **D-02**: Active training modes are indicated by compact status badges visible at all times — Locked (requirement UI-02)
- **D-03**: Fullscreen view is triggered by existing browser fullscreen API; app shows clean UI when `document.fullscreenElement` is present — Locked
- **D-04**: Fullscreen view shows ONLY essential info: BPM (large), time signature, beat number, play/pause, large visual pulse — Locked (requirement FULL-01)
- **D-05**: Fullscreen view includes a training info overlay with bar counter and mode progress — Locked (requirement FULL-02)
- **D-06**: Visual beat indicator in fullscreen is significantly larger than normal view for distance viewing — Locked (requirement FULL-03)
- **D-07**: Escape key and dedicated exit button both exit fullscreen — Locked (requirement FULL-03)

### State Management
- **D-08**: Panel open/close state is local component state (not persisted) — Locked
- **D-09**: Fullscreen view renders conditionally based on `useFullscreen().isFullscreen` — Locked

### Accessibility
- **D-10**: All training controls are keyboard accessible (Tab navigation, Enter/Space toggles) — Locked
- **D-11**: Training panel uses `aria-expanded` on toggle button — Locked
- **D-12**: Screen reader announces active training mode changes via live region — Locked
- **D-13**: Fullscreen view maintains all ARIA live regions for beat/BPM announcements — Locked

### the agent's Discretion
- Exact visual design of mode badges (colors, icons, layout)
- Whether TrainingPanel slides in, drops down, or expands inline
- FullscreenView layout proportions and exact sizing
- Whether to show training overlay as persistent bar or floating panel
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before implementing.**

### Project Specs
- `.planning/REQUIREMENTS.md` — UI-01, UI-02, FULL-01 to FULL-03
- `.planning/ROADMAP.md` — Phase 6 goal and success criteria
- `AGENTS.md` — Accessibility requirements, keyboard navigation, ARIA labels

### Existing Code Patterns
- `src/context/MetronomeContext.tsx` — Training state and actions exposed via context
- `src/types/training.ts` — TrainingConfig, TrainingSessionState interfaces
- `src/hooks/useTraining.ts` — Training state management hook
- `src/hooks/useFullscreen.ts` — Fullscreen API wrapper (Phase 4)
- `src/components/FullscreenButton.tsx` — Existing fullscreen toggle button
- `src/components/BeatIndicators.tsx` — Visual pulse pattern
- `src/components/BpmDisplay.tsx` — BPM display pattern
- `src/components/PlayButton.tsx` — Play/pause button pattern
- `src/App.tsx` — Main app layout and component integration

### Key TypeScript Interfaces

**From `src/types/training.ts`:**
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
  measures: number;
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
}
```

**From `src/context/MetronomeContext.tsx`:**
```typescript
interface MetronomeContextType {
  state: MetronomeState;
  currentBeat: number;
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
```

### UI Patterns from Existing Components

**Button with icon and label:**
```tsx
<button
  onClick={...}
  aria-label="..."
  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium ... rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
>
  <Icon className="w-4 h-4" aria-hidden="true" />
  <span>Label</span>
</button>
```

**Toggle switch pattern (to use for mode enables):**
```tsx
<button
  role="switch"
  aria-checked={enabled}
  onClick={toggle}
  className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
>
  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
</button>
```

**ARIA live region for screen readers:**
```tsx
<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
  {announcement}
</div>
```
</canonical_refs>

<specifics>
## Specific Implementation Details

### TrainingPanel Component

Collapsible panel containing all training mode configuration controls.

**Sections:**
1. **Header** — Panel title + open/close toggle button
2. **Auto-BPM Section** — Enable toggle + start BPM, target BPM, increment, every N bars inputs
3. **Count-In Section** — Enable toggle + measures select (1, 2, 4)
4. **Silence Section** — Enable toggle + play bars, silence bars inputs
5. **Footer** — Reset to defaults button

**Input constraints:**
- BPM inputs: 40-240 range
- Increment: 1-20
- Every N bars: 1-32
- Measures: 1, 2, 4 (select)
- Play/silence bars: 1-16

**Validation:** Clamp values to valid ranges on change/blur.

### TrainingStatus Component

Compact bar showing active training modes and current session state.

**Idle state (not playing):**
- Shows mode badges for enabled modes only
- Badges: "Auto-BPM", "Count-In", "Silence" with small indicators

**Playing state:**
- Mode badges + session info
- Bar counter: "Bar: X" (when session is active)
- Phase indicator: "Count-in" or "Playing"
- Auto-BPM info: "BPM: current → target" (when auto-BPM active)
- Silence indicator: "Audible" / "Silent" (when silence active)

**Screen reader:**
- Live region announces phase changes and BPM changes
- Only announces when values actually change (not every render)

### FullscreenView Component

Rendered conditionally when `isFullscreen` is true. Replaces the entire normal app layout.

**Layout (centered, large):**
- Top: Time signature (large text)
- Center: Giant BPM display + giant beat number
- Middle: Large visual beat indicator (fills 30-40% of viewport)
- Bottom: Large play/pause button + exit fullscreen button

**Training overlay (positioned top-right or bottom):**
- Bar counter
- Current phase
- Mode-specific info (current/target BPM, audible/silent status)
- Only visible when training session is active

**Exit mechanisms:**
- Exit button in UI (visible, large touch target)
- Escape key (handled by browser fullscreen API)
- Clicking exit button calls `document.exitFullscreen()`

**Responsive considerations:**
- On mobile: even larger touch targets, simplified layout
- On desktop: centered layout with generous spacing
- Dark mode: use `dark:` variants for contrast

### Integration in App.tsx

```tsx
const { isFullscreen } = useFullscreen();

if (isFullscreen) {
  return <FullscreenView />;
}

// Normal layout with training panel and status
```

The normal layout adds:
- Training mode toggle button in the header area or near presets
- TrainingStatus component above or below main controls
- TrainingPanel component (collapsible) below presets or in dedicated section
</specifics>

<deferred>
## Deferred Ideas

- Training session history/statistics display — deferred, analytics not core
- Custom training program builder — beyond v1.1 scope
- Animated transitions for mode changes — nice to have, not essential
- Haptic feedback for beat in fullscreen on mobile — requires Vibration API, not universally supported
- Picture-in-picture metronome view — beyond scope
</deferred>

---

*Phase: 06-training-ui*
*Context gathered: Fri May 01 2026*

---
status: resolved
trigger: every dot should pulse independently when the respective note plays
created: 2026-05-01
updated: 2026-05-01
---

## Symptoms

- **Expected behavior**: Each dot should pulse independently when its respective note plays.
- **Actual behavior**: All dots pulse simultaneously instead of independently.
- **Error messages**: No errors visible.
- **Reproduction**: Start metronome with any rhythm.

## Current Focus

- hypothesis: 
- test: 
- expecting: 
- next_action: gather initial evidence
- reasoning_checkpoint: 
- tdd_checkpoint: 

## Evidence

- timestamp: 2026-05-01
  source: code-review
  detail: >
    scheduler.ts line 166-173 calls onBeatScheduled once per MAIN beat only,
    reporting beatNumber, isAccent, scheduledTime — no sub-beat index.
    All sub-beat clicks are scheduled in a loop (lines 148-163) but only
    the aggregate beat is reported to the UI.
- timestamp: 2026-05-01
  source: code-review
  detail: >
    MetronomeContext.tsx line 85 stores currentBeat as a single number.
    The onBeatScheduled callback (line 104-106) only sets currentBeat = beat.beatNumber.
    No sub-beat state is tracked.
- timestamp: 2026-05-01
  source: code-review
  detail: >
    BeatIndicators.tsx line 32 computes isActive = isBeatActive for ALL sub-dots
    within the current main beat. Every sub-dot in the active beat group pulses
    simultaneously because they share the same isActive flag.

## Eliminated

- Audio timing bug: The scheduler correctly schedules sub-beat audio clicks
  at distinct times (subBeatTime = nextNoteTime + subIndex * subInterval).
  The audio plays independently; the visual feedback does not.
- CSS animation issue: The pulse is a simple scale transform triggered by
  isActive. The CSS itself is fine; the problem is the shared isActive state.

## Current Focus

- hypothesis: The visual currentBeat state tracks only the main beat number, not the sub-beat index, causing all sub-dots in the active beat to pulse together.
- test: Examine BeatIndicators, MetronomeContext, and scheduler to verify sub-beat tracking gap.
- expecting: Confirmation that no sub-beat index flows from scheduler to UI.
- next_action: root cause identified — proceed to fix
- reasoning_checkpoint: The scheduler plays sub-beat audio independently but reports only the main beat to onBeatScheduled. The context stores only a main-beat number. BeatIndicators uses that number to set isActive for all sub-dots in the beat group. Therefore all sub-dots pulse simultaneously.

## Resolution

- root_cause: The scheduler's onBeatScheduled callback reports only the main beat number, and the UI state (currentBeat) stores only a number. BeatIndicators derives isActive from the main beat alone, so all sub-dots in the active beat group pulse together instead of independently.
- fix: Track sub-beat index through the scheduler callback → context state → BeatIndicators, so only the specific sub-dot matching the currently playing sub-beat pulses.
- verification: TypeScript passes (npx tsc --noEmit). Each sub-beat now triggers its own onBeatScheduled callback with subBeatIndex, and BeatIndicators uses subIndex === currentSubBeat for individual activation.
- files_changed: src/types/metronome.ts, src/audio/scheduler.ts, src/context/MetronomeContext.tsx, src/components/BeatIndicators.tsx 

---
status: resolved
trigger: o modo treino deveria ter um botão de iniciar, quando está no modo treino, escuto as batidas aumentando/diminuindo, mas não há indicação visual, por exemplo: se eu estiver no modo normal com 120bpm, e no modo treino eu inicio com 60bpm, o bpm na tela permanece 120 e não diminui/aumenta
created: 2026-05-02
updated: 2026-05-02
---

## Symptoms

- **Expected behavior**: O BPM na tela deveria atualizar em tempo real durante o modo treino, mostrando o valor atual que está sendo tocado. O modo treino deveria ter um botão de iniciar e indicação visual de que está no modo treino.
- **Actual behavior**: O BPM permanece travado no valor do modo normal (ex: 120 BPM) mesmo quando o treino está tocando em outro valor (ex: 60 BPM). Não há indicação visual do modo treino.
- **Error messages**: Nenhum erro visível.
- **Timeline**: Nunca funcionou.
- **Reproduction**: 1) Definir BPM em 120 no modo normal. 2) Ativar modo treino com BPM inicial diferente (ex: 60). 3) Iniciar o treino. 4) Observar que o BPM na tela não atualiza conforme o treino progride.

## Current Focus

- hypothesis: `BpmDisplay.tsx` and `FullscreenView.tsx` show `state.bpm` unconditionally and do not read `trainingSession.autoBpmCurrentValue` during active autoBPM training. Additionally, `TrainingStatus.tsx` exists but is never rendered.
- test: Verified by reading `BpmDisplay.tsx`, `FullscreenView.tsx`, `MetronomeContext.tsx`, `scheduler.ts`, and grepping for `TrainingStatus` usage.
- expecting: BPM display should show `trainingSession.autoBpmCurrentValue` when training is active with autoBPM enabled.
- next_action: present root cause to user and offer fix options

## Evidence

- `BpmDisplay.tsx` reads `bpm` from `state.bpm` (line 7) and never references `trainingSession`.
- `MetronomeContext.tsx` correctly updates `trainingSession.autoBpmCurrentValue` via scheduler callback (lines 170–182).
- `scheduler.ts` updates internal `config.bpm` to `tc.autoBpmCurrentValue` when autoBPM progresses (line 121), and passes the value back via `onBarBoundaryCallback`.
- `TrainingStatus.tsx` component exists and shows training info including current BPM, but is **never imported or rendered anywhere** in the app.
- `FullscreenView.tsx` also shows `state.bpm` unconditionally (line 100), missing the training BPM as well.

## Eliminated

- Not a scheduler bug: scheduler correctly tracks and reports `autoBpmCurrentValue`.
- Not a context bug: context correctly stores `trainingSession` with updated values.
- Not an audio engine bug: audio plays at correct tempo.

## Resolution

**Root cause:** The BPM display components (`BpmDisplay.tsx` and `FullscreenView.tsx`) unconditionally rendered `state.bpm`, ignoring `trainingSession.autoBpmCurrentValue` during active autoBPM training. Additionally, `TrainingStatus.tsx` existed but was never imported or rendered anywhere.

**Fix applied:**

1. **`src/components/BpmDisplay.tsx`**: Now reads `trainingSession` and `trainingConfig` from context. When training is active with autoBPM enabled, it displays `trainingSession.autoBpmCurrentValue` instead of `state.bpm`. The ARIA label also indicates when in training mode.

2. **`src/components/FullscreenView.tsx`**: Added `displayBpm` variable that uses `trainingSession.autoBpmCurrentValue` when autoBPM training is active, otherwise falls back to `state.bpm`. Applied to both the visual BPM display and the ARIA live region.

3. **`src/components/PlayerView.tsx`**: Imported and rendered `<TrainingStatus />` between the header and the center zone, providing visible badges for active training modes and real-time session info (bar, time, BPM, phase) when training is running.

**Verification:** Build (`npm run build`) completed successfully with zero TypeScript errors.

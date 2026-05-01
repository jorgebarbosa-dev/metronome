# Roadmap: Metrônomo Web

**Project:** Metrônomo Web
**Created:** Thu Apr 30 2026
**Granularity:** Coarse
**Mode:** YOLO

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-05-01)
- ✅ **v1.1 Training Modes** — Phases 5-6 (shipped 2026-05-01)
- 🚧 **v1.2 Native Mobile** — Phase 7 (in planning)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-05-01</summary>

### Phase 1: Core Engine

**Goal:** Metrônomo básico funcional com precisão de tempo
**Requirements:** BASIC-01 to BASIC-08, AUDIO-01 to AUDIO-03
**Plans:** 3 plans in 3 waves

- [x] `01-01-PLAN.md` — Project scaffold + Audio engine with lookahead scheduler (2026-04-30)
- [x] `01-02-PLAN.md` — State management with React Context, tap tempo, and persistence (2026-04-30)
- [x] `01-03-PLAN.md` — UI components, responsive layout, and accessibility (2026-04-30)

**Success Criteria:**
1. User can start/stop metronome and hear consistent clicks at any BPM between 40-240
2. Tap tempo calculates BPM accurately within 2 BPM of target
3. Time signature changes work correctly (beat 1 is always accented when enabled)
4. Volume control affects click loudness in real-time
5. Timing remains stable even when switching browser tabs or under CPU load
6. Audio starts on first user click without requiring second interaction

---

### Phase 2: Enhanced Experience

**Goal:** Sons variados, feedback visual rico e subdivisões rítmicas
**Requirements:** AUDIO-04, AUDIO-05, UI-01 to UI-04, SUBD-01 to SUBD-05
**Plans:** 4 plans in 4 waves

- [x] `02-01-PLAN.md` — Sound engine and type foundations (Wave 1) (2026-04-30)
- [x] `02-02-PLAN.md` — Scheduler subdivisions and context state (Wave 2) (2026-04-30)
- [x] `02-03-PLAN.md` — UI components: selectors, visual pulse, beat display (Wave 3) (2026-04-30)
- [x] `02-04-PLAN.md` — Integration and responsive layout (Wave 4) (2026-04-30)

**Success Criteria:**
1. User can switch between at least 3 distinct click sounds
2. Accented beat has clearly different timbre from unaccented beats
3. Visual pulse is synchronized with audio (no perceptible delay)
4. Current beat number is displayed and updates precisely on each beat
5. Subdivisions (quarter, eighth, triplets, sixteenth) play correctly within time signature
6. Interface is usable and visually correct on phone, tablet, and desktop screens

---

### Phase 3: UX & Persistence

**Goal:** Acessibilidade completa e capacidade de salvar configurações
**Requirements:** UI-05, UI-06, PRES-01 to PRES-05
**Plans:** 3 plans in 2 waves

- [x] `03-01-PLAN.md` — Accessibility: keyboard navigation, ARIA live regions, focus management (Wave 1) (2026-04-30)
- [x] `03-02-PLAN.md` — Preset data layer: IndexedDB storage, usePresets hook, settings persistence (Wave 1) (2026-04-30)
- [x] `03-03-PLAN.md` — Preset UI: save dialog, preset list, load/delete, App integration (Wave 2) (2026-04-30)

**Success Criteria:**
1. All controls are operable using only keyboard (Tab, Enter, Space, arrow keys)
2. Screen reader announces BPM, playing state, and time signature changes
3. User can save current settings as a named preset
4. User can load and delete saved presets
5. Presets persist after browser restart
6. Last used settings automatically restore on next visit

---

### Phase 4: PWA & Polish

**Goal:** Aplicação instalável e funcionamento completo offline
**Requirements:** PWA-01, PWA-02, PWA-03
**Plans:** 2 plans in 2 waves

- [x] `04-01-PLAN.md` — PWA core: vite-plugin-pwa, manifest, icons, service worker (Wave 1) (2026-05-01)
- [x] `04-02-PLAN.md` — Install prompt, offline indicator, fullscreen toggle (Wave 2) (2026-05-01)

**Success Criteria:**
1. App shows install prompt on supported browsers (Chrome, Edge, Safari)
2. After installation, app opens in standalone window without browser chrome
3. App functions completely without internet connection after first load
4. All previously saved presets and settings work offline
5. App handles fullscreen mode correctly on mobile and desktop

</details>

## v1.1 Training Modes (Phases 5-6)

### Phase 5: Training Engine

**Goal:** Modos de treino avançados para prática estruturada
**Requirements:** TRAIN-01 to TRAIN-08
**Depends on:** Phase 4 (PWA & Polish)
**Plans:** 3 plans in 3 waves

- [x] `05-01-PLAN.md` — Training types, useTraining hook, preset extension (Wave 1) (2026-05-01)
- [x] `05-02-PLAN.md` — Scheduler bar counting, count-in, silence, auto-BPM modes (Wave 2) (2026-05-01)
- [x] `05-03-PLAN.md` — Context integration, preset persistence, session state management (Wave 3) (2026-05-01)

**Success Criteria:**
1. User can configure automatic BPM increase (start BPM, increment, every N bars, target BPM)
2. Count-in plays 1-8 bars of clicks before main pattern starts
3. Silence mode plays N bars then silences for N bars, repeating automatically
4. Multiple training modes can be combined (e.g., count-in + auto-BPM)
5. Training session progress is displayed (current bar, target BPM, mode status)
6. Training configurations persist in browser storage

---

### Phase 6: Training UI & Fullscreen

**Goal:** Interface dedicada para modos de treino e tela cheia limpa
**Requirements:** UI-01, UI-02, FULL-01 to FULL-03
**Depends on:** Phase 5 (Training Engine)
**Plans:** 2 plans in 2 waves

- [x] `06-01-PLAN.md` — Training mode panel & active status indicators (Wave 1) (2026-05-01)
- [x] `06-02-PLAN.md` — Fullscreen performance view with large beat indicator (Wave 2) (2026-05-01)

**Success Criteria:**
1. Training mode controls are accessible and clearly distinguished from main controls
2. Active training mode status is visible during playback (progress, current/target BPM)
3. Clean fullscreen mode shows only essential info (BPM, time signature, pulse, play button)
4. Fullscreen training overlay displays bar counter and mode progress
5. Large visual beat indicator for distance viewing in fullscreen
6. All training UI is keyboard accessible and screen-reader friendly

---

## v1.2 Native Mobile (Phase 7)

### Phase 7: Native Mobile UI

**Goal:** Interface com aparência e comportamento de aplicativo nativo mobile
**Requirements:** MOB-01 to MOB-08
**Depends on:** Phase 4 (PWA & Polish)
**Plans:** 6 plans in 5 waves

- [x] `07-01-PLAN.md` — Foundation: viewport, CSS utilities, touch hooks (Wave 1) (2026-05-01)
- [x] `07-02-PLAN.md` — Design system primitives: ControlButton, SegmentedControl, BottomSheet, Slider (Wave 1) (2026-05-01)
- [ ] `07-03-PLAN.md` — Core visual components: PlayButton, BeatIndicator, BpmDisplay (Wave 2)
- [ ] `07-03-PLAN.md` — Core visual components: PlayButton, BeatIndicator, BpmDisplay (Wave 2)
- [ ] `07-04-PLAN.md` — Main layout: PlayerView, Header, App.tsx rewrite (Wave 3)
- [ ] `07-05-PLAN.md` — Settings, Training & Sheet content (Wave 4)
- [ ] `07-06-PLAN.md` — Fullscreen update, accessibility & verification (Wave 5)

**Success Criteria:**
1. App fills entire screen edge-to-edge on mobile (no floating card layout)
2. Dark mode is enforced/optimized for mobile
3. Touch targets meet minimum 56px for secondary, 88px for primary actions
4. Controls are positioned within thumb reach (bottom-oriented)
5. Gestures work: swipe to adjust BPM, tap to play/pause
6. Animations feel native (spring physics, pulse ring on beat)
7. Safe areas respected (notch, home indicator)
8. No hover-dependent interactions on touch devices

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Core Engine | v1.0 | 3/3 | ✅ Complete | 2026-04-30 |
| 2. Enhanced Experience | v1.0 | 4/4 | ✅ Complete | 2026-04-30 |
| 3. UX & Persistence | v1.0 | 3/3 | ✅ Complete | 2026-04-30 |
| 4. PWA & Polish | v1.0 | 2/2 | ✅ Complete | 2026-05-01 |
| 5. Training Engine | v1.1 | 3/3 | ✅ Complete | 2026-05-01 |
| 6. Training UI & Fullscreen | v1.1 | 2/2 | ✅ Complete | 2026-05-01 |
| 7. Native Mobile UI | v1.2 | 2/6 | 🚧 In Progress | 2026-05-01 |

**Total:** 7 phases | 31 requirements shipped | 13 v1.1 requirements planned | 8 v1.2 requirements planned

## Notes

- Phase order reflects technical dependencies: audio engine must be solid before visual polish
- PWA can technically be built in parallel but is placed last as final polish
- v1.1 focuses on training modes (auto-BPM, count-in, silence) and fullscreen UX
- v1.2 focuses on native mobile experience (full-screen layout, gestures, native feel)
- Setlists, polyrhythms, and swing remain deferred to v2.0
- Milestone archives available at `.planning/milestones/v1.0-ROADMAP.md` and `.planning/milestones/v1.1-ROADMAP.md`

# Requirements: Metrônomo Web

**Defined:** Fri May 01 2026
**Milestone:** v1.1 Training Modes
**Core Value:** A precisão do tempo é inegociável — se o metrônomo não mantém o tempo consistente, nada mais importa.

## v1.1 Requirements (ACTIVE)

### Training Engine

- [ ] **TRAIN-01**: User can set automatic BPM increase mode (start BPM, increment amount, every N bars, target BPM)
- [ ] **TRAIN-02**: User can enable count-in before starting (1-8 bars of clicks before main pattern)
- [ ] **TRAIN-03**: User can enable silence mode (play N bars, silence N bars, repeat)
- [ ] **TRAIN-04**: User can set automatic BPM decrease mode (reverse of TRAIN-01)
- [ ] **TRAIN-05**: Silence mode supports automatic fade in/out at transitions
- [ ] **TRAIN-06**: Training session displays bar counter and elapsed time
- [x] **TRAIN-07**: Training mode configurations persist in browser storage
- [x] **TRAIN-08**: Multiple training modes can be combined (e.g., count-in + auto-BPM + silence)

### Training UI

- [x] **UI-01**: Training mode controls panel is accessible and clearly distinguished from main controls
- [x] **UI-02**: Active training mode status is visible during playback (progress, current/target BPM, mode indicators)

### Fullscreen

- [x] **FULL-01**: User can enter clean fullscreen mode showing only BPM, time signature, pulse, and play button
- [x] **FULL-02**: Fullscreen mode displays training overlay (bar counter, mode progress, current/target BPM)
- [x] **FULL-03**: Fullscreen mode has large visual beat indicator optimized for distance viewing

## Out of Scope (v1.1)

| Feature | Reason |
|---------|--------|
| Setlists / multi-song playlists | Deferred to v2.0 — requires song management architecture |
| Polyrhythms (e.g., 3 against 2) | Deferred to v2.0 — requires scheduler rewrite for multiple simultaneous rhythms |
| Swing adjustment | Deferred to v2.0 — requires subdivision engine modification |
| Rhythmic patterns for odd time signatures | Deferred to v2.0 — requires pattern editor UI |
| Cloud sync / user accounts | MVP is local-first. Cloud adds complexity and privacy concerns. |
| MIDI / Ableton Link integration | Very advanced feature for small professional audience. High complexity. |
| Exercise library | Content creation is different product. Can be added later. |
| Detailed practice statistics | Analytics interesting but not core to metronome functionality. |
| Video tutorials / lessons | Out of product scope. |
| Social features / sharing | Metronome is personal tool, not social platform. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRAIN-01 | Phase 5 | 🚧 Planned |
| TRAIN-02 | Phase 5 | 🚧 Planned |
| TRAIN-03 | Phase 5 | 🚧 Planned |
| TRAIN-04 | Phase 5 | 🚧 Planned |
| TRAIN-05 | Phase 5 | 🚧 Planned |
| TRAIN-06 | Phase 5 | 🚧 Planned |
| TRAIN-07 | Phase 5 | ✅ Complete |
| TRAIN-08 | Phase 5 | ✅ Complete |
| UI-01 | Phase 6 | ✅ Complete |
| UI-02 | Phase 6 | ✅ Complete |
| FULL-01 | Phase 6 | ✅ Complete |
| FULL-02 | Phase 6 | ✅ Complete |
| FULL-03 | Phase 6 | ✅ Complete |

**Coverage:**
- v1.1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓
- Complete: 8/13

---
*Requirements defined: Fri May 01 2026*
*For v1.0 requirements archive, see .planning/milestones/v1.0-REQUIREMENTS.md*

# Project Milestones: Metrônomo Web

## v1.0 MVP (Shipped: 2026-05-01)

**Delivered:** Metrônomo web preciso e responsivo com engine de áudio Web Audio API, subdivisões rítmicas, presets salvos localmente e suporte PWA completo para uso offline.

**Phases completed:** 1-4 (12 plans total)

**Key accomplishments:**
- Engine de áudio com Web Audio API e lookahead scheduler (25ms/100ms) para precisão de tempo
- Interface responsiva com React + TypeScript + Tailwind CSS, acessível por teclado e screen readers
- Três sons distintos (Classic, Wood, Click) com acento no primeiro tempo
- Subdivisões rítmicas: quarter, eighth, triplet, sixteenth
- Sistema de presets com IndexedDB para persistência local
- PWA instalável com service worker, manifest e ícones para mobile e desktop
- Funcionamento completo offline após primeiro carregamento

**Stats:**
- 34 source files created/modified
- 1,988 lines of TypeScript/TSX
- 4 phases, 12 plans, ~45 tasks
- 1 day from start to ship (2026-04-30 → 2026-05-01)

**Git range:** `feat(01-01)` → `feat(04-02)`

**Known deferred items at close:** 1 (Phase 04 verification: 5 browser-specific tests require human verification)

**What's next:** v1.1 — modos de treino e tela cheia

---

## v1.1 Training Modes (In Planning)

**Planned:** Modos de treino avançados (auto-BPM, count-in, silence) e interface de tela cheia limpa

**Phases planned:** 5-6 (5-7 plans estimated)

**Key features:**
- Training Engine: auto-BPM increase/decrease, count-in bars, silence mode, combined modes
- Training UI: dedicated controls panel, status display, progress indicators
- Fullscreen: clean minimal view, training overlay, large visual beat indicator

**Target start:** 2026-05-01

**Requirements:** 13 (TRAIN-01 to TRAIN-08, UI-01, UI-02, FULL-01 to FULL-03)

---

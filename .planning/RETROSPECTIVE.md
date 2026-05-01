# Project Retrospective: Metrônomo Web

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-05-01
**Phases:** 4 | **Plans:** 12 | **Sessions:** 1

### What Was Built
- Engine de áudio com Web Audio API e lookahead scheduler para precisão de tempo
- Interface responsiva com React + TypeScript + Tailwind CSS
- Três sons distintos (Classic, Wood, Click) com acento no primeiro tempo
- Subdivisões rítmicas: quarter, eighth, triplet, sixteenth
- Sistema completo de presets com IndexedDB para persistência local
- PWA instalável com service worker, manifest, ícones e funcionamento offline
- Acessibilidade completa: keyboard navigation, ARIA live regions, roving tabindex, focus-visible

### What Worked
- Execução extremamente rápida: 4 phases em ~3.5 horas com 12 plans
- Web Audio API scheduling foi implementado corretamente desde o início
- Componentização React facilitou adição de novos controles em phases posteriores
- PWA com vite-plugin-pwa simplificou drasticamente a configuração de service worker
- IndexedDB para presets funcionou bem para persistência local sem backend

### What Was Inefficient
- Falta de testes automatizados de áudio (testes de timing são difíceis de automatizar)
- v2 features foram apenas listadas mas não detalhadas — vão precisar de research phase
- Alguns componentes UI cresceram mais do que o ideal (App.tsx, MetronomeContext)

### Patterns Established
- Custom hooks para lógica reutilizável (useTapTempo, usePresets, useKeyboardShortcuts)
- Reducer pattern para state management complexo
- Separação clara entre engine de áudio (src/audio) e UI (src/components)
- Acessibilidade como first-class citizen (não afterthought)

### Key Lessons
1. **Web Audio API precisa de user gesture** — AudioContext só pode ser resumido após interação do usuário; isso deve ser documentado e testado desde o início
2. **PWA é mais simples do que parece** — vite-plugin-pwa + configuração mínima = app instalável funcional
3. **IndexedDB é overkill para poucos dados** — localStorage seria suficiente para presets (~50 itens), mas IndexedDB é mais "correto" para dados estruturados
4. **Acessibilidade não atrasa desenvolvimento** — implementar ARIA e keyboard navigation durante a construção é mais rápido que retrofit

### Cost Observations
- Model mix: 100% k2p6 (executor)
- Sessions: 1 sessão contínua de ~3.5 horas
- Notable: Execução extremamente eficiente com workflow GSD; zero rework significativo

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 | 4 | Workflow GSD inicial estabelecido |

### Cumulative Quality

| Milestone | Source Files | LOC | Zero-Dep Additions |
|-----------|-------------|-----|-------------------|
| v1.0 | 34 | 1,988 | 0 (apenas vite-plugin-pwa para build) |

### Top Lessons (Verified Across Milestones)

1. Precisão de tempo via Web Audio API é non-negotiable — validado em todos os phases
2. React Context + useReducer é suficiente para state management deste escopo
3. Tailwind CSS acelera desenvolvimento de UI responsiva

---

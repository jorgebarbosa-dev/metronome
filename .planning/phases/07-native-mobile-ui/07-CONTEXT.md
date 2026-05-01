# Phase 7: Native Mobile UI - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Transformar a interface web atual (layout card centralizado, controles empilhados) em uma experiência nativa mobile full-screen com controles otimizados para touch, gestos e animações nativas. Manter toggle light/dark mas otimizar dark mode para mobile.
</domain>

<decisions>
## Implementation Decisions

### Layout Model
- **D-01:** Full-screen edge-to-edge em todos os dispositivos (mobile e desktop)
- **D-02:** Remover `max-w-2xl mx-auto` e constraints de largura
- **D-03:** Usar `100dvh`/`100dvw` com `viewport-fit=cover` para preencher notch
- **D-04:** Estrutura: Header (topo) / Center (BPM + Beat Indicator) / Bottom (controles)

### Controles na Parte Inferior
- **D-05:** Play button centralizado na parte inferior (88x88px mínimo)
- **D-06:** BPM +/- e TAP TEMPO em linha acima do play button
- **D-07:** Settings, Sound, Presets, Training em header/top bar
- **D-08:** Touch targets mínimos: 56px secundários, 88px primários

### Gestos Touch
- **D-09:** Long-press no BPM para mudança rápida contínua
- **D-10:** Swipe horizontal no BPM para incremento/decremento (±1)

### Visual e Animações
- **D-11:** Manter toggle light/dark, mas otimizar dark mode para mobile
- **D-12:** Pulse ring ao redor do beat indicator a cada batida
- **D-13:** Animações spring (cubic-bezier) nos botões e interações
- **D-14:** Sem feedback tátil/vibração
- **D-15:** Safe areas via `env(safe-area-inset-*)` para notch e home indicator

### Componentes
- **D-16:** Criar sistema de design base com componentes reutilizáveis:
  - `Button` (variants: primary, secondary, ghost)
  - `Card` / `Surface` (com elevação e bordas sutis)
  - `BottomSheet` (para settings e presets)
  - `SegmentedControl` (substituir selects nativos)
  - `Slider` (customizado para volume/BPM)
- **D-17:** Reescrever views principais usando os componentes base
- **D-18:** Manter componentes existentes como fallback durante transição

### the agent's Discretion
- Cores específicas do tema dark otimizado
- Tamanhos exatos de fontes e espaçamentos
- Duração específica das animações spring
- Implementação do long-press (timer ou hook)
</decisions>

<specifics>
## Specific Ideas

- Layout inspirado em apps de metrônomo nativos (Tempo, Pro Metronome, Soundbrenner)
- BPM deve ser o elemento visual mais dominante na tela
- Beat indicator central com pulse ring (círculo expansivo)
- Controles secundários devem ser discretos mas acessíveis
</specifics>

<canonical_refs>
## Canonical References

### PWA & Mobile
- `.planning/phases/04-pwa-polish/04-CONTEXT.md` — Decisões sobre PWA, manifest, offline
- `vite.config.ts` — Configuração do vite-plugin-pwa
- `public/manifest.webmanifest` — Manifest do PWA

### UI Components Existentes
- `src/App.tsx` — Layout atual (referência para reestruturação)
- `src/components/` — Componentes existentes (17 componentes)
- `src/context/MetronomeContext.tsx` — Estado global

### Sketch/Design
- `.sketch/mockups/native-mobile-concept.html` — Mockup interativo com conceito visual
- `.sketch/NATIVE_MOBILE_DESIGN.md` — Recomendações de design detalhadas
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MetronomeContext` — Estado global já estruturado
- `useFullscreen` — Hook de fullscreen já implementado
- `useKeyboardShortcuts` — Acessibilidade via teclado
- Componentes existentes: `BpmDisplay`, `PlayButton`, `BeatIndicators`, etc.

### Established Patterns
- React Context para state management
- Tailwind CSS para styling
- Componentes funcionais com TypeScript
- ARIA labels e acessibilidade já implementadas

### Integration Points
- Novos componentes base devem integrar com `MetronomeContext`
- Manter compatibilidade com presets e training modes (fases 5-6)
- Service worker PWA já configurado, apenas ajustar caminhos se necessário
</code_context>

<deferred>
## Deferred Ideas

- Customização de temas/cores pelo usuário — Phase 8
- Widget/mini player flutuante — Phase 8
- Animações avançadas (parallax, particles) — v2.0
</deferred>

---

*Phase: 07-native-mobile-ui*
*Context gathered: 2026-05-01*

# Phase 1: Core Engine - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Metrônomo básico funcional com play/pause, BPM (40-240), compasso (1/4 a 8/8), acento no primeiro tempo, controle de volume e tap tempo. Precisão de tempo via Web Audio API com scheduler lookahead. Interface responsiva e acessível desde o início.

**Escopo fixo:** Apenas metrônomo básico. Sons variados, subdivisões, presets, PWA e modos de treino são fases futuras.
</domain>

<decisions>
## Implementation Decisions

### Som do Metrônomo
- **D-01:** Gerar som sintético via OscillatorNode (Web Audio API nativo) — não usar AudioBuffer/samples no MVP
- **D-02:** Forma de onda: Square (quadrada) — som mais percussivo e seco
- **D-03:** Tempo forte (beat 1) usa frequência diferente do tempo fraco — pitch mais agudo para destacar
- **D-04:** O agente define o envelope (attack/decay) durante implementação — optar por click curto e percussivo

### Layout dos Controles
- **D-05:** Layout centralizado — BPM grande no centro, play/pause abaixo, controles secundários em linha
- **D-06:** Todos os controles visíveis por padrão — BPM, Play/Pause, Compasso, Volume e Acento
- **D-07:** Sem seção "avançada" oculta — todos os controles do Core Engine são essenciais

### Feedback Visual
- **D-08:** Indicadores de tempo como pequenos círculos dispostos em linha horizontal
- **D-09:** Beat 1 é visualmente destacado com cor diferente dos outros beats
- **D-10:** Display principal mostra BPM grande + botão Play/Pause integrado no centro

### Tap Tempo
- **D-11:** Calcular BPM usando média simples dos últimos 5+ toques
- **D-12:** Atualizar BPM em tempo real a cada novo toque (ficando mais preciso com mais toques)
- **D-13:** Resetar sequência de tap tempo após 2 segundos sem toques

### the agent's Discretion
- Frequências exatas para tempo forte vs tempo fraco
- Cores específicas para os indicadores visuais
- Posicionamento exato de cada controle no layout centralizado
- Tamanho do lookahead window e check interval do scheduler
</decisions>

<specifics>
## Specific Ideas

- Som deve ser percussivo (square wave), não musical
- Beat 1 precisa ser claramente diferente — tanto no som (frequência) quanto visual (cor)
- Layout deve funcionar em mobile (telas pequenas) e desktop
- Tap tempo precisa ser responsivo — mostrar resultado imediatamente, não esperar
</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — Requisitos BASIC-01 a BASIC-08, AUDIO-01 a AUDIO-03
- `.planning/PROJECT.md` — Visão do projeto, core value, constraints

### Pesquisa
- `.planning/research/SUMMARY.md` — Resumo da pesquisa de stack e arquitetura
- `.planning/research/ARCHITECTURE.md` — Detalhes do scheduler lookahead e geração de som
- `.planning/research/STACK.md` — Decisões de stack (React, Vite, Web Audio API)

### Roadmap
- `.planning/ROADMAP.md` — Phase 1: Core Engine (goal, success criteria)
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Nenhum código existente — projeto em estágio inicial
- Vite configurado (esperado durante implementação)

### Established Patterns
- Web Audio API nativo (sem Tone.js ou bibliotecas de alto nível)
- React Context para estado global (pesquisa recomenda)
- Tailwind CSS para estilização

### Integration Points
- AudioContext deve ser criado e resumido no primeiro gesto do usuário
- Estado do player (BPM, playing, compasso, volume, acento) via React Context
- Persistência de preferências (volume) via localStorage
</code_context>

<deferred>
## Deferred Ideas

- Sons realistas via AudioBuffer (samples) — Phase 2
- Subdivisões rítmicas — Phase 2
- Presets salvos — Phase 3
- PWA/offline — Phase 4
- Modos de treino avançados — v2
</deferred>

---

*Phase: 01-core-engine*
*Context gathered: 2026-04-30*

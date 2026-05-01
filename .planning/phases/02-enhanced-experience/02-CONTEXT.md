# Phase 2: Enhanced Experience - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Sons variados, feedback visual rico e subdivisões rítmicas.

Escopo fixo: 3+ sons de click distintos, pulso visual animado, display de número do tempo, subdivisões rítmicas (quarter/eighth/triplet/sixteenth). Não inclui presets, PWA, ou modos de treino (fases futuras).
</domain>

<decisions>
## Implementation Decisions

### Sound Variety (AUDIO-04, AUDIO-05)
- **D-01:** Usar múltiplas configurações de oscilador (wave types diferentes) para gerar 3+ sons distintos — não usar AudioBuffer/samples
- **D-02:** Mínimo de 3 sons: Classic (square wave, sharp/percussive), Wood (softer, rounder), Click (short, crisp)
- **D-03:** Cada som mantém a distinção de acento via frequência (tempo forte mais agudo que tempo fraco) — padrão estabelecido na Phase 1
- **D-04:** Configuração de som (SoundConfig) deve ser extensível para suportar múltiplos presets de som

### Visual Pulse (UI-01, UI-03)
- **D-05:** Animação de pulso via scale bounce no beat ativo — escala aumenta momentaneamente (ex: 1.2x) e retorna
- **D-06:** Todos os sub-beats (quando subdivisões ativadas) também devem pulsar visualmente, não apenas os beats principais
- **D-07:** Manter o esquema de cores existente: vermelho para beat 1, azul para outros beats

### Subdivisions (SUBD-01 a SUBD-05)
- **D-08:** UI de seleção de subdivisão via toggle buttons com ícones — quarter, eighth, triplet, sixteenth
- **D-09:** Estado de subdivisão é global — aplica-se a todas as assinaturas de tempo, não por assinatura
- **D-10:** Subdivisões devem ser agendadas pelo scheduler existente, não por scheduler paralelo

### Beat Number Display (UI-02)
- **D-11:** O agente decide o posicionamento ótimo do número do beat — considerar visibilidade, layout responsivo, e consistência visual

### Sound Selection UI
- **D-12:** O agente decide o padrão de UI para seleção de som — considerar usabilidade mobile e consistência com o design existente

### the agent's Discretion
- Posicionamento exato do display de número do beat
- Padrão de UI para seleção de som (icon buttons, dropdown, etc.)
- Frequências específicas para cada tipo de som (Classic, Wood, Click)
- Parâmetros exatos do envelope (attack/decay) para cada som
- Escala e duração exata da animação de pulso
- Ícones específicos para os toggle buttons de subdivisão
</decisions>

<specifics>
## Specific Ideas

- Som "Wood" deve ser perceptivelmente mais suave e redondo que o som "Classic" atual
- Som "Click" deve ser muito curto e preciso — ideal para gravações
- Animação de pulso deve ser rápida o suficiente para não atrasar o feedback visual (sync com áudio)
- Subdivisões triplet precisam de timing preciso — não arredondar para múltiplos de 2
</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — Requisitos AUDIO-04, AUDIO-05, UI-01 a UI-04, SUBD-01 a SUBD-05
- `.planning/PROJECT.md` — Visão do projeto, core value, constraints

### Contexto da Phase 1
- `.planning/phases/01-core-engine/01-CONTEXT.md` — Decisões de Phase 1 que se aplicam (Web Audio API, React Context, Tailwind)

### Roadmap
- `.planning/ROADMAP.md` — Phase 2: Enhanced Experience (goal, success criteria)

### Código existente
- `src/audio/sounds.ts` — Função playClick atual com oscilador square wave
- `src/audio/scheduler.ts` — Scheduler com lookahead, agendamento de beats
- `src/components/BeatIndicators.tsx` — Indicadores visuais atuais (círculos coloridos)
- `src/context/MetronomeContext.tsx` — Estado global e reducer pattern
- `src/types/metronome.ts` — Tipos SoundConfig, Beat, TimeSignature
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `playClick()` em `src/audio/sounds.ts` — pode ser estendida para suportar múltiplas configurações de som
- `SoundConfig` interface em `src/types/metronome.ts` — já suporta waveType, frequências, attack/decay
- `BeatIndicators` component — pode ser estendido para suportar animação de escala e subdivisões
- `MetronomeContext` — reducer pattern pronto para adicionar ações de som e subdivisão

### Established Patterns
- Web Audio API nativo (sem bibliotecas externas) — manter para sons
- React Context + useReducer para estado global
- Tailwind CSS com classes condicionais para estado visual
- Componentes funcionais simples com props explícitas

### Integration Points
- Scheduler deve ser estendido para agendar múltiplos clicks por beat (subdivisões)
- SoundConfig deve ser passado pelo contexto e atualizado via dispatch
- BeatIndicators deve receber informação de subdivisão via contexto
- Novos componentes (SoundSelector, SubdivisionSelector) devem seguir padrão de acessibilidade existente (ARIA labels, keyboard navigation)
</code_context>

<deferred>
## Deferred Ideas

- Samples de áudio reais (AudioBuffer) — poderia ser adicionado como modo avançado em fase futura
- Subdivisões por assinatura de tempo — mais complexo, pode ser revisitado
- Visualização gráfica de forma de onda — fora do escopo desta fase
- Sincronização visual de fase (waveform) — fase futura

None — discussion stayed within phase scope
</deferred>

---

*Phase: 02-enhanced-experience*
*Context gathered: 2026-04-30*

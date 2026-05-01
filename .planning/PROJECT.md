# Metrônomo Web

## What This Is

Um metrônomo web preciso e responsivo para músicos iniciantes e avançados. Oferece precisão de tempo via Web Audio API com scheduler lookahead, interface acessível, subdivisões rítmicas, presets salvos localmente e funciona completamente offline como PWA instalável.

## Core Value

A precisão do tempo é inegociável — se o metrônomo não mantém o tempo consistente, nada mais importa.

## Requirements

### Validated

- ✓ Metrônomo básico funcional com play/pause, BPM e compasso — v1.0
- ✓ Precisão de tempo via Web Audio API com scheduler lookahead — v1.0
- ✓ Interface responsiva e acessível (desktop, tablet, mobile) — v1.0
- ✓ Tap tempo, acento no primeiro tempo e controle de volume — v1.0
- ✓ Feedback visual de pulsação e número do tempo atual — v1.0
- ✓ Escolha de sons diferentes para tempos forte e fraco — v1.0
- ✓ Subdivisões rítmicas (colcheias, tercinas, semicolcheias) — v1.0
- ✓ Presets locais salvos no navegador — v1.0
- ✓ PWA instalável com funcionamento offline — v1.0
- ✓ Design simples para iniciantes, configurável para avançados — v1.0

### Active — v1.1 Training Modes

- [ ] Modos de treino: auto BPM (increase/decrease), silence mode, count-in — Phase 5
- [ ] Combinar múltiplos modos de treino simultaneamente — Phase 5
- [ ] Persistência de configurações de treino — Phase 5
- [ ] Interface dedicada para controles de treino — Phase 6
- [ ] Tela cheia limpa (apenas BPM, compasso, pulso, play) — Phase 6
- [ ] Indicador visual grande para visualização à distância — Phase 6

### Deferred — v2.0+

- [ ] Setlists com múltiplas músicas e troca rápida — v2
- [ ] Polirritmia e ajuste de swing — v2
- [ ] Padrões rítmicos para compassos ímpares (e.g., 7/8 = 2+2+3) — v2

### Out of Scope

- Sincronização na nuvem e contas de usuário — MVP foca em experiência local. Razão válida.
- Integração MIDI/Ableton Link — complexidade alta, público muito específico. Razão válida.
- Biblioteca de exercícios prontos — pode ser adicionado posteriormente
- Estatísticas detalhadas de prática — MVP foca em funcionalidade core
- Video tutorials / lessons — fora do escopo do produto
- Social features / sharing — metrônomo é ferramenta pessoal, não plataforma social

## Context

- Aplicação web pura, sem backend necessário para o MVP
- Público-alvo: músicos iniciantes e avançados que precisam de um metrônomo confiável
- Diferencial: simplicidade + configurabilidade, precisão técnica via Web Audio API
- Armazenamento local via localStorage/IndexedDB para preferências e presets
- **v1.0 shipped:** 1,988 LOC TypeScript/TSX, 34 arquivos, 12 plans em 4 phases
- **Build:** PASS | TypeScript: PASS | Accessibility: PASS
- **Testes:** 11/11 must-haves automatizados passam; 5 testes de browser aguardam verificação humana

## Constraints

- **Tech Stack**: React + TypeScript + Vite + Web Audio API + Tailwind CSS
- **Performance**: Precisão de tempo é crítica — não usar setInterval/setTimeout para áudio
- **Compatibilidade**: Deve funcionar nos principais navegadores modernos (Chrome, Edge, Firefox, Safari)
- **Acessibilidade**: Navegação por teclado, labels para screen readers, contraste adequado
- **Offline**: Funcionamento completo sem internet após primeiro carregamento

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web Audio API ao invés de setInterval | Precisão de tempo é o core value; setInterval atrasa | ✓ Validado — timing estável mesmo sob carga |
| PWA com offline first | Músicos usam em ensaios e palco onde internet é instável | ✓ Validado — service worker caching funciona |
| localStorage/IndexedDB para dados locais | MVP sem backend; dados persistentes no navegador | ✓ Validado — presets persistem entre sessões |
| React + TypeScript + Vite | Stack moderna, tipagem ajuda em lógica de áudio complexa | ✓ Validado — build rápido, types seguros |
| Lookahead scheduler (25ms/100ms) | Padrão estabelecido para precisão de tempo | ✓ Validado — sem drift perceptível |
| Square wave oscillator for clicks | Som claro e preciso para metrônomo | ✓ Validado — 3 presets com timbres distintos |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-01 after v1.0 milestone completion*

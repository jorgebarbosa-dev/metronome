# Phase 1: Core Engine - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the discussion.

**Date:** 2026-04-30
**Phase:** 01-core-engine
**Mode:** default
**Areas discussed:** Som do metrônomo, Layout dos controles, Feedback visual, Tap Tempo

## Discussion Log

### Som do Metrônomo

**Q1: Qual tipo de som para o MVP?**
- Options: Bipe sintético / Clique realista / Ambos (switchável)
- Selected: **Bipe sintético**

**Q2: Qual forma de onda?**
- Options: Sine / Square / Triangle / Sawtooth
- Selected: **Square (quadrada)** — som mais percussivo

**Q3: Como destacar tempo forte?**
- Options: Volume maior / Frequência diferente / Volume + frequência / Só volume
- Selected: **Frequência diferente** — pitch mais agudo

**Q4: Comportamento do envelope?**
- Options: Click curto / Bipe sustentado / Você decide
- Selected: **Você decide**

### Layout dos Controles

**Q1: Qual abordagem de layout?**
- Options: Minimalista / Completo visível / Progressivo
- Selected: **Progressivo**

**Q2: Quais controles visíveis por padrão?**
- Options: BPM+Play+Compasso / BPM+Play+Compasso+Volume / BPM+Play+Compasso+Volume+Acento / Você decide
- Selected: **BPM + Play/Pause + Compasso + Volume + Acento**

**Q3: O que na seção avançada?**
- Options: Apenas Tap Tempo / Tap Tempo + Detalhes técnicos / Não ter seção avançada / Você decide
- Selected: **Não ter seção avançada**

**Q4: Como organizar os controles?**
- Options: Centralizado / Grupos lógicos / Vertical simples
- Selected: **Centralizado**

### Feedback Visual

**Q1: Qual estilo de feedback visual?**
- Options: Círculo pulsando / Indicador de número / Pêndulo animado / Círculo + número
- Selected: **Pequenos círculos que mudam de cor** (opção free-text)

**Q2: Como organizar os círculos?**
- Options: Linha horizontal / Círculo/anel / Abaixo do BPM / Você decide
- Selected: **Linha horizontal**

**Q3: Como destacar beat 1?**
- Options: Cor diferente / Tamanho maior / Cor + tamanho / Você decide
- Selected: **Cor diferente**

**Q4: O que mais no display?**
- Options: BPM grande no centro / BPM + Play/Pause / Apenas círculos + BPM pequeno / Você decide
- Selected: **BPM + Play/Pause**

### Tap Tempo

**Q1: Como calcular BPM?**
- Options: 2 toques / 3 toques / 5+ toques / Tempo real
- Selected: **5+ toques**

**Q2: Mostrar BPM intermediário ou só final?**
- Options: Só resultado final / Em tempo real / Você decide
- Selected: **Em tempo real**

**Q3: Timeout de reset?**
- Options: 2 segundos / 3 segundos / 5 segundos / Você decide
- Selected: **2 segundos**

**Q4: Método de cálculo?**
- Options: Média simples / Mediana / Você decide
- Selected: **Média simples**

## Corrections Made

Nenhuma — todas as decisões foram tomadas na primeira opção apresentada.

## Scope Creep Handled

Nenhum — discussão permaneceu dentro do escopo do Core Engine.

## Auto-Resolved

N/A — modo interativo, não --auto.

## External Research

Nenhuma pesquisa externa foi necessária. As decisões foram baseadas nas preferências do usuário e na pesquisa já existente em `.planning/research/`.

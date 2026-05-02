---
status: resolved
trigger: quando inicio o modo de treino, as primeiras batidas não mudam nada, somente na ultima batida do compasso que muda, as barras também não refletem o compasso quando está na terceira batida de um compasso 4/4 já altera
created: 2026-05-02
updated: 2026-05-02
---

## Symptoms

- **Expected behavior**: Quando inicia o modo treino, o BPM visual deveria mudar imediatamente na primeira batida. O contador de barras deveria refletir o compasso atual corretamente (barra 1 durante o primeiro compasso, barra 2 durante o segundo, etc.).
- **Actual behavior**: As primeiras batidas do modo treino mostram o BPM antigo do modo normal. O BPM só muda visualmente na última batida do primeiro compasso. O contador de barras está deslocado - mostra mudança de barra antes do final do compasso.
- **Error messages**: Nenhum erro visível.
- **Timeline**: Problema existente após o fix anterior de BPM display.
- **Reproduction**: 1) Definir BPM em 120 no modo normal. 2) Ativar modo treino autoBPM com startBpm diferente (ex: 60). 3) Iniciar o metrônomo. 4) Observar que durante as primeiras batidas o display ainda mostra 120 BPM. 5) Observar que o contador de barras não corresponde ao compasso atual.

## Current Focus

- hypothesis: O `trainingSession` só fica `isActive: true` após o primeiro callback de barra do scheduler. Durante o primeiro compasso inteiro, o estado inicial (`createInitialSessionState`) tem `isActive: false` e `currentBar: 0`, então o display mostra o BPM normal e barra 0. Além disso, o scheduler incrementa `currentBar` antes de chamar o callback, causando deslocamento de uma barra.
- test: Verificar `createInitialSessionState`, `MetronomeContext.tsx` linha 151, e `scheduler.ts` linhas 126 e 188-192.
- expecting: O estado do treino deve ser ativo imediatamente quando o play inicia com treino configurado. O callback deve reportar a barra correta (sem deslocamento).
- next_action: Aplicar fix nos arquivos identificados.

## Evidence

- `createInitialSessionState` retorna `isActive: false` e `currentBar: 0` — quando o metrônomo inicia com treino, o estado do React fica inativo até o primeiro callback de barra (linha 151 de `MetronomeContext.tsx`).
- O scheduler chama `handleBarBoundary` que incrementa `currentBar++` e depois dispara o callback com o valor já incrementado — fazendo o display "pular" uma barra.
- O callback `onBarBoundaryCallback` era chamado síncronamente durante o agendamento (lookahead de 100ms), o que fazia a atualização da barra acontecer antes mesmo da última batida do compasso tocar (ex: durante a batida 3).

## Eliminated

- Não é problema de renderização do React: o estado estava correto, só era atualizado tarde demais.
- Não é problema do scheduler interno: o agendamento de áudio estava correto.

## Resolution

**Root cause:** O `trainingSession` só era ativado (`isActive: true`) após o primeiro callback de barra do scheduler. Durante o primeiro compasso inteiro, o display mostrava o BPM normal (`state.bpm`) e barra 0. Além disso, o callback era disparado síncronamente durante o agendamento, fazendo a barra atualizar visualmente antes do final do compasso.

**Fix applied:**

1. **`src/context/MetronomeContext.tsx`**: Quando o play inicia com treino configurado, o estado inicial agora é criado com `isActive: true` e `currentBar: 1`, garantindo que o display reflita imediatamente o BPM do treino e a barra correta desde a primeira batida.

2. **`src/audio/scheduler.ts`**: O callback `onBarBoundaryCallback` agora é agendado via `setTimeout` para o momento exato em que a última sub-batida do compasso toca, em vez de ser chamado imediatamente durante o lookahead. Isso sincroniza a atualização visual com o áudio.

**Verification:** Build (`npm run build`) completado com sucesso, zero erros TypeScript.

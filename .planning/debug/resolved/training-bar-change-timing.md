---
status: resolved
trigger: ainda está errado a mudança da barra, exemplo: 4/4 1 (toca) 2, 3 (toca) 4 (muda barra, toca). e repete, deveria trocar a barra somente na primeira batida de cada barra
created: 2026-05-02
updated: 2026-05-02
---

## Symptoms

- **Expected behavior**: A barra deveria mudar na primeira batida de cada compasso. Ex: compasso 4/4, durante todas as 4 batidas do compasso 1, o display mostra "Barra 1". Na primeira batida do compasso 2, o display muda para "Barra 2".
- **Actual behavior**: A barra muda na última batida (batida 4) do compasso anterior, em vez de na primeira batida do próximo compasso.
- **Error messages**: Nenhum erro visível.
- **Timeline**: Problema persistiu após o fix anterior.
- **Reproduction**: 1) Configurar compasso 4/4. 2) Ativar modo treino. 3) Iniciar o metrônomo. 4) Observar que durante a batida 4, o display já mostra a próxima barra.

## Current Focus

- hypothesis: O callback `onBarBoundaryCallback` está sendo disparado no momento errado - possivelmente durante a batida 4 em vez de na batida 1 do próximo compasso. Ou há outro mecanismo atualizando o display prematuramente.
- test: Verificar o timing exato do callback no scheduler.ts e se há outros triggers de atualização do estado.
- expecting: O callback deve ser disparado na primeira batida de cada compasso, não na última.
- next_action: Investigar o timing do callback e identificar se há outros triggers.

## Evidence

- O callback `onBarBoundaryCallback` estava sendo disparado via `setTimeout` com delay calculado como `Math.max(0, (nextNoteTime - ctx.currentTime) * 1000)`. Quando o scheduler estava atrasado ou quando a primeira batida do próximo compasso já estava dentro do lookahead, o delay podia ser zero ou muito pequeno, fazendo o callback disparar imediatamente durante a batida 4.
- O `handleBarBoundary` incrementava `currentBar` na última batida do compasso, e o callback reportava o valor já incrementado. Se o callback disparasse antes da primeira batida do próximo compasso, o display mostrava a nova barra na batida 4.

## Eliminated

- Não é problema de renderização do React: o estado estava correto, só era atualizado no momento errado.
- Não é problema do agendamento de áudio: as batidas são agendadas corretamente.

## Resolution

**Root cause:** O callback de mudança de barra era disparado via `setTimeout`, que não é garantido de ser preciso. Quando o delay era zero ou muito pequeno (ex: scheduler atrasado, ou primeira batida do próximo compasso já dentro do lookahead), o callback disparava imediatamente durante a batida 4, em vez de esperar pela primeira batida do próximo compasso.

**Fix applied:**

1. **`src/audio/scheduler.ts`**: Substituído o mecanismo de `setTimeout` por um sistema de callback pendente:
   - Adicionadas variáveis `pendingBarBoundary` e `pendingBarBoundaryTime`
   - Quando `handleBarBoundary` é chamado na última batida, o callback não é mais disparado imediatamente. Em vez disso, marca-se `pendingBarBoundary = true` e `pendingBarBoundaryTime = nextNoteTime` (tempo da primeira batida do próximo compasso)
   - No início de cada chamada de `schedule()` (a cada 25ms), verifica-se se há um callback pendente e se `ctx.currentTime >= pendingBarBoundaryTime`. Só então o callback é disparado
   - Isso garante que a barra só mude quando a primeira batida do próximo compasso realmente começar a tocar
   - Limpeza do estado pendente adicionada na função `stop()`

**Verification:** Build (`npm run build`) completado com sucesso, zero erros TypeScript.

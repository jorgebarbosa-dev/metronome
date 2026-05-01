# Pitfalls Research: Metrônomo Web

## Pitfall 1: Drift de Tempo

**O problema:** setInterval/setTimeout são imprecisos. O navegador pode atrasar callbacks quando a aba não está focada ou o sistema está sob carga.

**Sinais de alerta:**
- Metrônomo acelera ou atrasa durante uso prolongado
- Inconsistência perceptível após mudar de aba

**Prevenção:**
- Usar Web Audio API com scheduling lookahead
- NUNCA usar setInterval para disparar sons diretamente
- Agendar sons no AudioContext.currentTime (clock independente)

**Fase que deve tratar:** Phase 1 (Audio Engine + Scheduler)

## Pitfall 2: AudioContext Suspended

**O problema:** Browsers modernos suspendem AudioContext até interação do usuário (autoplay policy). O metrônomo pode não tocar no primeiro clique.

**Sinais de alerta:**
- Clique em "play" mas não ouve som
- Funciona após segundo clique

**Prevenção:**
- Chamar AudioContext.resume() no primeiro gesto do usuário
- Feedback visual imediato mesmo que áudio ainda não esteja pronto
- Indicador de estado do audio context

**Fase que deve tratar:** Phase 1 (Audio Engine)

## Pitfall 3: Mobile Performance

**O problema:** Dispositivos móveis têm restrições de CPU e gestão de energia agressiva. Timers podem ser atrasados quando a tela está bloqueada ou app está em background.

**Sinais de alerta:**
- Metrônomo inconsistente em celulares
- Parada quando tela bloqueia

**Prevenção:**
- Usar Wake Lock API para manter tela acesa durante uso
- Testar extensivamente em dispositivos reais
- Considerar Service Worker para manter scheduling em background

**Fase que deve tratar:** Phase 2 (UI/Responsividade)

## Pitfall 4: Complexidade Prematura

**O problema:** Adicionar muitos recursos avançados antes do básico estar sólido. Polirritmia, swing, MIDI são sedutores mas distraem do core.

**Sinais de alerta:**
- Muitos botões na interface
- Bugs no timing básico enquanto se trabalha em features avançadas
- Usuários confusos com excesso de opções

**Prevenção:**
- Priorizar ferocimente o MVP
- Validar precisão de tempo antes de adicionar subdivisões
- Interface progressiva (mostrar opções avançadas sob demanda)

**Fase que deve tratar:** Todas as fases — manter foco no core value

## Pitfall 5: Acessibilidade Negligenciada

**O problema:** Sem considerar acessibilidade desde o início, retrofit é caro e incompleto.

**Sinais de alerta:**
- Controles que não funcionam com teclado
- Leitores de tela não anunciam BPM ou estado
- Cores como único indicador de estado

**Prevenção:**
- Semantic HTML desde o início
- ARIA labels em todos os controles
- Testar com teclado (Tab, Enter, Space)
- Contraste adequado desde o design inicial

**Fase que deve tratar:** Phase 2 (UI/Responsividade)

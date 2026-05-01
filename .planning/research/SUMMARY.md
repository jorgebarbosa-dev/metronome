# Research Summary: Metrônomo Web

## Stack

**React 18 + TypeScript + Vite + Web Audio API**

Build tool Vite 5+ para desenvolvimento rápido. Web Audio API nativo é não-negociável para precisão de tempo — nenhuma biblioteca de áudio de alto nível justifica a abstração para simples cliques. Tailwind CSS para estilização rápida e responsiva. Persistência via localStorage/IndexedDB.

## Table Stakes

Play/pause, BPM (40-240), tap tempo, compasso (1/4 a 8/8), acento no primeiro tempo, volume, feedback visual, escolha de som. São o mínimo para qualquer metrônomo funcional.

## Watch Out For

1. **Drift de tempo** — setInterval é impreciso. Web Audio API com lookahead scheduling é obrigatório.
2. **AudioContext suspended** — Browsers suspendem áudio até interação do usuário. Tratar desde o início.
3. **Mobile performance** — Gestão de energia agressiva em celulares. Wake Lock API pode ajudar.
4. **Complexidade prematura** — Polirritmia e MIDI são sedutores mas o core (precisão) deve vir primeiro.
5. **Acessibilidade** — Mais barato fazer desde o início que retrofit depois.

## Architecture

Scheduler com lookahead (verifica a cada 25ms, agenda próximos 100ms) conectado a AudioContext.currentTime. OscillatorNode para MVP (sem assets), AudioBuffer como melhoria futura. Estado via React Context.

## Build Order

1. Audio Engine (fundamento)
2. Scheduler (timing)
3. State Management (controles)
4. UI Components (interface)
5. PWA/Offline (paralelizável)

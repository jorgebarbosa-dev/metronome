# Architecture Research: Metrônomo Web

## Componentes Principais

```
┌─────────────────────────────────────────┐
│              UI Layer                    │
│  (React components - controls, display) │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           State Layer                  │
│  (React Context - BPM, playing, etc.)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Scheduler Layer                │
│  (Lookahead scheduler - Web Audio API) │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Audio Engine                  │
│  (AudioContext, Oscillators/Buffers)   │
└─────────────────────────────────────────┘
```

## Data Flow

1. **User input** → UI Layer (clique em play, alteração de BPM)
2. **State update** → Context atualiza estado global
3. **Scheduler** → Observa mudanças de estado, agenda próximos beats
4. **Audio Engine** → Executa sons no momento exato via AudioContext.currentTime

## Build Order (Dependências)

1. **Audio Engine** — Fundação. Sem som preciso, nada funciona.
2. **Scheduler** — Depende do Audio Engine. Lógica de timing.
3. **State Management** — Depende do Scheduler. Controla o que toca.
4. **UI Components** — Depende do State. Interface de usuário.
5. **PWA/Offline** — Independente. Pode ser feito em paralelo.

## Detalhes Técnicos

### Scheduler Pattern (Lookahead)

```
setInterval(25ms) → verifica próximos 100ms → agenda via Web Audio API
```

- **Lookahead window**: 100ms (suficiente para precisão, não excessivo)
- **Check interval**: 25ms (balance entre precisão e CPU)
- **Audio scheduling**: Usa AudioContext.currentTime (clock monotônico de alta precisão)

### Geração de Som

**Opção A: OscillatorNode**
- Pros: Geração em tempo real, sem assets
- Cons: Som sintético, pouco "orgânico"

**Opção B: AudioBuffer (samples pré-gravados)**
- Pros: Som mais realista (clique de madeira, cowbell)
- Cons: Requer arquivos de áudio, carregamento inicial

**Recomendação:** OscillatorNode para MVP (simplifica deploy), AudioBuffer como melhoria.

### Persistência

```
localStorage:
  - Último BPM
  - Volume
  - Som selecionado
  - Compasso
  - Tema claro/escuro

IndexedDB (ou localStorage como fallback):
  - Presets do usuário
  - Preferências avançadas
```

# Stack Research: Metrônomo Web

## Standard 2025 Stack

### Frontend Framework
**React 18+ com TypeScript**
- Componentização facilita organização de controles do metrônomo
- Ecossistema maduro para PWA e acessibilidade
- Hooks simplificam gerenciamento de estado do áudio

**Alternativa considerada:** Vanilla TS — rejeitada porque UI complexa com múltiplos controles se beneficia de componentização

### Bundler / Build Tool
**Vite 5+**
- Hot reload rápido para iteração
- Suporte nativo a TypeScript
- Configuração mínima para PWA (com plugin vite-plugin-pwa)

### Áudio
**Web Audio API nativo**
- Única opção para precisão de tempo sub-milissegundo
- AudioContext.currentTime para scheduling lookahead
- OscillatorNode ou AudioBuffer para geração de sons

**NÃO usar:** Bibliotecas de áudio de alto nível (Tone.js etc.) — adicionam abstração desnecessária para simples cliques

### Estado e Dados
**React Context + localStorage/IndexedDB**
- Context para estado global do player (BPM, compasso, etc.)
- localStorage para preferências simples
- IndexedDB para presets e dados estruturados

### Estilização
**CSS Modules ou Tailwind CSS**
- Tailwind recomendado para protótipo rápido e responsividade
- CSS Modules se preferir separação explícita

### PWA
**vite-plugin-pwa**
- Service worker automático
- Manifest.json configurável
- Cache strategies para offline

### Testes
**Vitest + React Testing Library**
- Vitest integrado nativamente com Vite
- Testing Library para testes de componente

## Decisões de Stack

| Componente | Escolha | Confiança |
|------------|---------|-----------|
| Framework | React 18 + TypeScript | Alta |
| Build | Vite 5+ | Alta |
| Áudio | Web Audio API nativo | Alta |
| Estado | React Context + hooks | Alta |
| Persistência | localStorage + IndexedDB | Alta |
| Estilos | Tailwind CSS | Média-Alta |
| PWA | vite-plugin-pwa | Média-Alta |
| Testes | Vitest + RTL | Alta |

## O que NÃO usar

- **Tone.js** — Overkill para simples cliques de metrônomo
- **Redux/Zustand** — Context suficiente para estado relativamente simples
- **Backend/DB** — MVP é 100% client-side
- **setInterval/setTimeout para áudio** — Impreciso, causa drift

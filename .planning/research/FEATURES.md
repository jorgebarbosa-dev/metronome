# Features Research: Metrônomo Web

## Table Stakes (Must Have)

Funcionalidades que todo metrônomo decente tem. Sem elas, usuários abandonam.

| Feature | Complexidade | Notas |
|---------|--------------|-------|
| Play/Pause | Baixa | Elemento principal da UI |
| Controle de BPM (40-240) | Baixa | Input numérico + slider + botões |
| Tap Tempo | Baixa | Cálculo médio dos últimos toques |
| Seleção de compasso | Baixa | 1/4 a 8/8 |
| Acento no primeiro tempo | Baixa | Som diferente para tempo 1 |
| Controle de volume | Baixa | Slider + mute |
| Feedback visual | Baixa | Círculo piscando, número do tempo |
| Escolha de som | Média | 3-5 opções de timbre |

## Differentiators (Competitive Advantage)

Funcionalidades que destacam o produto.

| Feature | Complexidade | Notas |
|---------|--------------|-------|
| Subdivisões (colcheias, tercinas, semicolcheias) | Média | Agrega valor para estudo |
| Presets salvos | Média | localStorage/IndexedDB |
| PWA instalável | Baixa-Média | vite-plugin-pwa simplifica |
| Modo offline | Baixa | Após primeiro carregamento |
| Tela cheia | Baixa | Fullscreen API |
| Padrões rítmicos para compassos ímpares | Média | 5/4 = 3+2, 7/8 = 2+2+3 etc. |

## Anti-features (Deliberadamente NÃO construir)

Funcionalidades que parecem boas mas complicam sem agregar valor core.

| Feature | Por que não |
|---------|-------------|
| Rede social / compartilhamento | Fora do escopo de metrônomo |
| Vídeo/aulas integradas | Produto diferente |
| Afinador integrado | Foco no metrônomo, não em multi-tool |
| Anúncios | MVP sem monetização |

## Dependências entre Features

```
Metrônomo básico (play, BPM, compasso, acento)
    ↓
Subdivisões (precisa do scheduler básico)
    ↓
Presets (precisa de todas as configurações anteriores)
    ↓
PWA/Offline (independente, pode ser feito em paralelo)
```

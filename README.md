# Metrônomo Web

A precise web metronome for musicians, built with React, TypeScript, and Web Audio API. Fully functional offline as a PWA (Progressive Web App).

**Demo:** [https://seu-usuario.github.io/metronome/](https://seu-usuario.github.io/metronome/)

## Features

- **Precise timing** — Scheduling via Web Audio API (never `setInterval`)
- **Adjustable BPM** — 40 to 240 BPM, with +/- controls and tap tempo
- **Time signatures** — Support for multiple time signatures (4/4, 3/4, 6/8, etc.)
- **Subdivisions** — Quarter, eighth, triplet, sixteenth notes
- **Training Modes**
  - **Auto-BPM** — Automatically increases or decreases BPM every N bars
  - **Silence** — Alternates between audible and silent periods
  - **Count-In** — Countdown before starting
- **Fullscreen Mode** — Clean screen for study/practice
- **PWA** — Installable on mobile, works offline
- **Accessibility** — Full keyboard and screen reader support

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling
- **Web Audio API** — Audio engine and scheduling
- **vite-plugin-pwa** — Automatic service worker generation
- **gh-pages** — Deploy to GitHub Pages

## Getting Started

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Preview the build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

```
src/
├── audio/
│   ├── engine.ts          # AudioContext and volume control
│   ├── scheduler.ts       # Beat scheduling (Web Audio API)
│   └── sounds.ts          # Metronome sound generation
├── components/
│   ├── BpmDisplay.tsx     # Main BPM display
│   ├── BeatIndicator.tsx  # Visual beat indicator
│   ├── TrainingPanel.tsx  # Training mode configuration
│   ├── TrainingStatus.tsx # Real-time training status
│   ├── FullscreenView.tsx # Fullscreen practice view
│   └── ...
├── context/
│   └── MetronomeContext.tsx  # Global state and audio integration
├── hooks/
│   ├── useTapTempo.ts     # Tap tempo BPM detection
│   ├── useTraining.ts     # Training mode configuration
│   └── useFullscreen.ts   # Fullscreen control
├── types/
│   ├── metronome.ts       # Metronome types
│   └── training.ts        # Training mode types
└── App.tsx
```

## Training Modes

### Auto-BPM
Gradually increases or decreases BPM during practice:
- **Start BPM** — Starting tempo
- **Target BPM** — Desired final tempo
- **Increment** — How much BPM changes per cycle
- **Every N bars** — Frequency of the change
- **Direction** — Increase (↑) or Decrease (↓)

### Silence
Practice time consistency by alternating between audible and silent periods:
- **Playing bars** — How many bars you hear
- **Silent bars** — How many bars without sound

### Count-In
Countdown before the start:
- **Number of bars** — 1 to 8 bars of count-in

## PWA (Progressive Web App)

The app can be installed directly on your phone:

1. Open in your phone's browser
2. Tap "Add to Home Screen" or "Install App"
3. Use offline, even without internet

## Deployment

The project is configured for automatic deployment to GitHub Pages:

```bash
npm run deploy
```

**Required configuration:**
- GitHub repository
- GitHub Pages enabled (branch `gh-pages`)
- `base: '/metronome/'` set in `vite.config.ts`

## Technical Notes

- **Never uses `setInterval`/`setTimeout`** for audio scheduling — always Web Audio API
- `AudioContext` is resumed on the first user gesture
- Persistence via `localStorage` (BPM, volume, sound, etc.)

## License

MIT

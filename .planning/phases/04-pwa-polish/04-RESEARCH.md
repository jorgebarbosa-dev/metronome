# Phase 4: PWA & Polish - Research

**Researched:** Thu Apr 30 2026
**Phase:** 4 — PWA & Polish

---

## Technology Stack

### PWA Framework: vite-plugin-pwa

**Decision:** Use `vite-plugin-pwa` for service worker and manifest generation.

**Why:**
- Native Vite integration — minimal configuration
- Workbox under the hood — battle-tested caching strategies
- Generates manifest.json automatically from config
- Handles service worker registration
- Supports both `generateSW` (automatic) and `injectManifest` (custom SW) modes

**Installation:**
```bash
npm install -D vite-plugin-pwa
```

**Configuration (vite.config.ts):**
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Metrônomo',
        short_name: 'Metrônomo',
        description: 'A precise web metronome',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ]
})
```

**Service Worker Registration:**
```typescript
// In main.tsx
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    // Show update available notification
  },
  onOfflineReady() {
    // App is ready to work offline
  }
})
```

### Icon Generation

**Options considered:**
1. Generate PNG icons from SVG using a tool (sharp, satori, etc.)
2. Use inline SVG and let vite-plugin-pwa generate icons
3. Create simple colored squares with text using HTML Canvas
4. Use existing project favicon and duplicate at required sizes

**Decision:** Create a simple SVG icon and use a script or manual conversion to generate PNGs at required sizes. For MVP, use a single high-quality SVG and let the browser scale, or generate 192x192 and 512x512 PNGs.

**Required sizes:**
- 192x192 — Home screen icon on Android
- 512x512 — Splash screen on Android, Microsoft Store

### Install Prompt

**Browser Support:**
- Chrome/Edge (desktop + Android): Full support via `beforeinstallprompt`
- Safari (iOS): No `beforeinstallprompt` — user must use "Add to Home Screen" manually
- Firefox: Limited support

**Implementation approach:**
```typescript
let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install button
});

async function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
}
```

### Offline Detection

**Standard API:**
```typescript
const isOnline = navigator.onLine;

window.addEventListener('online', () => { /* show online */ });
window.addEventListener('offline', () => { /* show offline */ });
```

**Limitations:**
- `navigator.onLine` only detects network interface status, not actual internet connectivity
- For a metronome that works entirely offline, this is sufficient
- No need for fetch-based connectivity checks

### Fullscreen API

**Standard:**
```typescript
element.requestFullscreen?.() ||
element.webkitRequestFullscreen?.() ||
// etc.
```

**Exit:**
```typescript
document.exitFullscreen?.() ||
document.webkitExitFullscreen?.()
```

**State:**
```typescript
const isFullscreen = !!document.fullscreenElement;
```

**Events:**
```typescript
document.addEventListener('fullscreenchange', handler);
```

**iOS Safari limitation:** iOS Safari does not support Fullscreen API. Use `webkitEnterFullscreen` only for video elements. For the metronome app, fullscreen on iOS is achieved via the PWA standalone mode (`display: standalone` in manifest).

---

## Architecture Decisions

### Caching Strategy

**For a metronome app:**
- All static assets: Cache-first (app shell)
- No API calls to cache (app is entirely client-side)
- IndexedDB data is already persisted locally

**Workbox configuration:**
```javascript
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
  // No runtime caching needed — no API calls
}
```

### Offline-First Verification

**Key question:** Does the app truly work offline?

**Checklist:**
- [x] No external API dependencies
- [x] All audio generated via Web Audio API (not fetched)
- [x] All data stored in localStorage/IndexedDB
- [x] All assets bundled by Vite (no CDN dependencies)
- [x] No external fonts or analytics

**Conclusion:** Yes, the metronome is inherently offline-capable. The PWA layer only needs to cache static assets.

---

## Implementation Plan

### Plan 01: PWA Core Infrastructure
1. Install and configure `vite-plugin-pwa`
2. Create app icons (192x192, 512x512)
3. Update `index.html` with theme-color meta tag
4. Register service worker in `main.tsx`
5. Configure manifest with app metadata
6. Test build generates service worker and manifest

### Plan 02: Install Prompt, Offline Indicator, Fullscreen
1. Create `useInstallPrompt` hook for `beforeinstallprompt`
2. Create `InstallButton` component
3. Create `useOfflineStatus` hook
4. Create `OfflineIndicator` component
5. Create `useFullscreen` hook
6. Create `FullscreenButton` component
7. Integrate all into App.tsx
8. Test install flow, offline mode, fullscreen

---

## Common Pitfalls

1. **Missing `display: standalone` in manifest** — app opens in browser tab instead of standalone window
2. **Icons without transparent background** — may look bad on certain launchers
3. **`beforeinstallprompt` not firing** — requires HTTPS, manifest with valid icons, service worker with fetch handler
4. **Service worker not updating** — users see old version; use `registerType: 'autoUpdate'` and prompt for refresh
5. **iOS Safari quirks** — no install prompt API, must use "Add to Home Screen" manually; fullscreen only works in standalone mode
6. **Theme color not matching app** — status bar color mismatch on Android

---

## References

- [vite-plugin-pwa docs](https://vite-pwa-org.netlify.app/)
- [Workbox docs](https://developer.chrome.com/docs/workbox/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [MDN: BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)
- [MDN: Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)

---

*Research complete for Phase 4: PWA & Polish*

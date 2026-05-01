# Phase 4: PWA & Polish - Context

**Gathered:** Thu Apr 30 2026
**Status:** Ready for planning
**Source:** Requirements + Roadmap

<domain>
## Phase Boundary

This phase makes the metronome a fully installable Progressive Web App that works offline.
The app is already entirely client-side (Web Audio API, no server dependencies, IndexedDB for presets), so offline support is primarily about asset caching and installability.

</domain>

<decisions>
## Implementation Decisions

### PWA Core
- **D-01**: Use `vite-plugin-pwa` for service worker generation and manifest management — Locked
- **D-02**: App must work offline after first load (all assets cached) — Locked
- **D-03**: App must show install prompt on supported browsers — Locked
- **D-04**: After installation, app opens in standalone window without browser chrome — Locked
- **D-05**: All previously saved presets and settings must work offline — Locked (already works via IndexedDB)
- **D-06**: App must handle fullscreen mode correctly on mobile and desktop — Locked

### UX Polish
- **D-07**: Add offline status indicator visible to user — Locked
- **D-08**: Add install button/prompt when PWA install criteria are met — Locked
- **D-09**: Add fullscreen toggle button — Locked

### the agent's Discretion
- Icon generation approach (can use generated SVG icons or simple PNGs)
- Exact offline indicator design and placement
- Whether to show install prompt automatically or via user-initiated button
- Fullscreen button placement in UI
- Theme color selection

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/REQUIREMENTS.md` — PWA-01 to PWA-03 requirements
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria

### Existing Code Patterns
- `vite.config.ts` — Current Vite configuration (no PWA plugin yet)
- `src/main.tsx` — Entry point (no service worker registration yet)
- `index.html` — HTML template (no manifest link yet)
- `src/App.tsx` — Main app component
- `src/hooks/useLocalStorage.ts` — Existing persistence pattern
- `src/storage/` — IndexedDB storage layer

</canonical_refs>

<specifics>
## Specific Ideas

- Use `vite-plugin-pwa` with `generateSW` strategy (Workbox generates service worker)
- Manifest must include: name, short_name, start_url, display: standalone, background_color, theme_color, icons
- Icons needed: 192x192 and 512x512 at minimum
- Service worker should cache all static assets for offline use
- Install prompt: Use `beforeinstallprompt` event to capture the prompt, then show a custom install button
- Offline indicator: Use `navigator.onLine` + `online`/`offline` events
- Fullscreen: Use Fullscreen API with vendor prefixes (`requestFullscreen` / `webkitRequestFullscreen`)

</specifics>

<deferred>
## Deferred Ideas

- Push notifications (not needed for metronome)
- Background sync (no server to sync with)
- Periodic background sync (not applicable)
- App shortcuts / jump lists (nice to have, not essential)
- Custom splash screen beyond manifest defaults

</deferred>

---

*Phase: 04-pwa-polish*
*Context gathered: Thu Apr 30 2026*

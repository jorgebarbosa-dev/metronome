---
status: root_cause_found
trigger: quando acesso pelo meu smartphone, não aparece a opção de instalar o pwa, a aplicação já está no github actions
created: 2026-05-01
updated: 2026-05-01
---

# Debug Session: PWA install option not showing on mobile

## Symptoms

1. **Expected behavior**: Ao acessar a aplicação no smartphone (via navegador), deveria aparecer o prompt ou opção para instalar o PWA (Add to Home Screen / Install app)
2. **Actual behavior**: A opção de instalar o PWA não aparece no smartphone
3. **Error messages**: Nenhuma mensagem de erro visível
4. **Timeline**: A aplicação foi deployada no GitHub Actions recentemente, mas o PWA não funciona no mobile
5. **Reproduction**: Acessar a URL do GitHub Pages pelo smartphone; a opção de instalar não é oferecida

## Current Focus

- hypothesis: "Os caminhos dos ícones no manifest estão absolutos e ignoram o base path /metronome/, causando falha no critério de instalabilidade do PWA"
- test: "Verificar conteúdo do manifest.webmanifest gerado no build"
- expecting: "Ícones devem ser acessíveis na URL correta sob /metronome/"
- next_action: "Corrigir caminhos dos ícones em vite.config.ts e rebuildar"
- reasoning_checkpoint: {status: "root_cause_found"}
- tdd_checkpoint: {}

## Evidence

- timestamp: 2026-05-01T13:12Z
  what: "Build output inspection"
  finding: "manifest.webmanifest and sw.js are generated in dist/. index.html includes <link rel=\"manifest\" href=\"/metronome/manifest.webmanifest\">. Service worker registration is injected in the JS bundle."

- timestamp: 2026-05-01T13:12Z
  what: "manifest.webmanifest content inspection"
  finding: "Icon src paths are absolute: /icon-192x192.png, /icon-512x512.png, /icon-maskable-192x192.png, /icon-maskable-512x512.png. These do not include the /metronome/ base path."

- timestamp: 2026-05-01T13:12Z
  what: "vite.config.ts inspection"
  finding: "base is set to '/metronome/'. Manifest icons are configured with absolute paths starting with '/'."

## Eliminated

- "Manifest not linked in HTML" — vite-plugin-pwa injects the link correctly in dist/index.html
- "Service worker missing" — sw.js is generated and registration code is present in the bundle
- "Icons missing from build" — all icon files are present in dist/

## Specialist Review

None — no specialist skills available in this environment.

## Resolution

- root_cause: "The PWA manifest references icon images with absolute paths (/icon-192x192.png etc.) that ignore the Vite base path (/metronome/). When served from GitHub Pages under /metronome/, the browser requests icons from the domain root (e.g. https://user.github.io/icon-192x192.png) instead of /metronome/icon-192x192.png, causing 404s. Chrome's PWA installability check fails because required icons are unreachable, so the install prompt never appears on mobile."
- fix: "Change the icon src values in vite.config.ts from absolute paths (/icon-xxx.png) to relative paths (icon-xxx.png) so they resolve correctly against the manifest location under /metronome/. Then rebuild and redeploy."

# Project: Metrônomo Web

## Context

This is a web metronome application built with React, TypeScript, and Web Audio API.

**Core value:** Timing precision is non-negotiable.

**Current phase:** Phase 1 — Core Engine

## GSD Workflow

This project uses the GSD (Get Shit Done) workflow.

- Planning artifacts live in `.planning/`
- Use `/gsd-plan-phase N` to create plans
- Use `/gsd-execute-phase N` to execute plans
- Use `/gsd-progress` to check status

## Tech Stack

- React 18+ with TypeScript
- Vite (build tool)
- Web Audio API (audio engine)
- Tailwind CSS (styling)
- localStorage/IndexedDB (persistence)

## Critical Technical Notes

- **NEVER use setInterval/setTimeout for audio timing** — always use Web Audio API scheduling
- AudioContext must be resumed on first user gesture
- Test on real mobile devices for performance
- Accessibility (keyboard navigation, ARIA labels) is required from the start

## Project Files

- `.planning/PROJECT.md` — Project vision and requirements
- `.planning/ROADMAP.md` — Phase breakdown
- `.planning/REQUIREMENTS.md` — Checkable requirements with REQ-IDs
- `.planning/STATE.md` — Current project state

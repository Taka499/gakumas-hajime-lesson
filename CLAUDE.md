# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in _docs/PLANS.md) from design to implementation.

## Project Overview

A web-based parameter calculator for 学園アイドルマスター (Gakuen Idol Master) 初LEGEND mode. Users select Challenge P-Items and lesson parameter choices to see calculated Vocal/Dance/Visual gains across 5 Legend Lessons (weeks 4, 7, 12, 14, 16).

### Architecture
- **Engine** (`src/engine/`): Pure TypeScript calculation logic. ZERO DOM or UI imports. Testable independently.
- **UI** (`src/components/`): Preact components consuming engine functions. State managed via Preact Signals.
- **Build**: Vite + @preact/preset-vite + @tailwindcss/vite. Bun as runtime and test runner (not bundler).
- **Deploy**: GitHub Actions builds and deploys to GitHub Pages on push to main.

### Key game mechanics
- Slot 2/3 P-Item "パラメータ上昇量増加 +X%" = rival score buff in exams, NOT parameter gains from lessons
- HP/stamina tracking is out of scope
- Parameter cap: 2,800 per stat

### Reference docs
- `_docs/GAME_MECHANICS.md` — game system reference
- `_docs/DATA_COLLECTION.md` — verified data with gap tracking
- `_docs/EXECPLAN_LESSON_CALCULATOR.md` — Phase 1 execution plan (completed)
- `_docs/PLANS.md` — ExecPlan formatting requirements

## COMMIT DISCIPLINE
- Follow Git-flow workflow to manage the branches
- Use small, frequent commits rather than large, infrequent ones
- Only add and commit affected files. Keep untracked other files as are
- Never add Claude Code attribution in commit

## Setup and Development

```
bun install          # Install dependencies
bun run dev          # Start Vite dev server (http://localhost:5173)
bun test             # Run engine unit tests
bun run build        # Production build to dist/
bun run preview      # Preview production build
```

### Custom slash commands
- `/add-item <item details>` — Add a new P-Item to the engine
- `/test-engine` — Run and diagnose engine tests
- `/scrape-wiki <page>` — Extract data from gakumas wiki

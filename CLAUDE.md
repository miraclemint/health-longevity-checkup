# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a **single-page Next.js 16 app** (App Router) with all logic in one file: [src/app/page.tsx](src/app/page.tsx).

The app is a Thai-language health longevity quiz game branded "BEYONDE HEALTH LONGEVITY CHECKUP". It renders entirely client-side (`"use client"`).

### Game State Machine

The component cycles through these states via a `gameState` string:

```
intro → form → stageIntro → playing → calculating → result
```

- **intro**: Landing screen
- **form**: Collects user info (name, gender, age category, estimated health age)
- **stageIntro**: Category introduction screen shown before each of the 8 stages
- **playing**: Swipeable question cards — drag right = Yes, drag left = No; buttons also provided
- **calculating**: 2.5-second animated delay
- **result**: Radar chart + Longevity Score + Health Age + share/copy actions

### Data Model

`STAGES` array (8 items) defines all quiz content. Each stage has:
- `icon`, `title`, `desc`, `maxScore`
- `questions[]` — each with `text` (Thai) and `point` value

Score accumulates in `selections: Record<stageIndex, questionIndex[]>`. Total is capped at 100.

### Scoring Logic

- `calculateTotalScore()` — sums points from selected questions across all stages
- `calculateRadarData()` — converts each stage score to 0–100 percentage for the radar chart
- `calculateHealthAge(ageCategory, score)` — maps age bracket + score to a "health age" using a modifier table (-8 to +10)
- `getResultData(score)` — returns result tier (Thriving/Balanced/At Risk/Critical) with Thai labels, colors, and description

### Result Export

- **Screenshot/Share**: `html2canvas` captures the `shareRef` div; tries Web Share API for mobile, falls back to download link
- **Copy Invite**: Copies a Thai invite message with the app URL to clipboard

### Key Libraries

| Library | Purpose |
|---|---|
| `framer-motion` | Page transitions and draggable question cards |
| `recharts` | Radar chart on result screen |
| `html2canvas` | Screenshot the result card for sharing |
| `lucide-react` | Icons throughout |
| `clsx` + `tailwind-merge` | Utility class helpers (imported in deps but not currently used in page.tsx) |

### Styling

Tailwind CSS v4 with PostCSS. No custom theme config — uses default Tailwind palette. Fonts are Geist Sans and Geist Mono via `next/font/google`.

### Known TODOs

- `src/app/layout.tsx` still has default Next.js metadata ("Create Next App") — not yet updated to match the app's branding.
- `clsx` and `tailwind-merge` are listed in dependencies but not used in `page.tsx` — no utility wrapper pattern exists yet.

### Deployment

Deployed on Vercel (`.vercel/project.json` present). URL referenced in share copy text: `https://health-longevity-checkup.vercel.app`

Recent changes and upcoming tasks are tracked in [update.md](update.md).

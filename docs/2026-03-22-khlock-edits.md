# Khlock Progress Summary — 2026-03-22

## Current State
The app is live at https://khlock.pages.dev/ and auto-deploys from GitHub `main` via Cloudflare Pages.

**Latest commit:** `9f0809b` — Align sidebar close icon exactly with header drawer toggle

## What Was Done This Session (March 21–22)

### Sidebar Menu (New Feature)
- Implemented sidebar menu that slides in from the right, overlaying the body
- Includes: 24-hour clock toggle, east-to-west sort toggle, dark/light/system appearance mode
- Sidebar spans full viewport height with ~28px padding top and bottom
- On mobile, sidebar spans full viewport width
- Smooth expand/collapse animation; no animation on initial page load
- Drawer icon position stays consistent between open/closed states

### Long-Press Tile Drag
- Added long-press-and-hold to initiate drag on clock tiles (in addition to existing grip handle)

### Bug Fixes (March 21–22)
- Fixed mobile temperature display getting truncated — now spans full tile width
- Pinned drawer icon to header top so it doesn't shift during scroll
- Fixed header top padding to prevent drawer icon from moving on scroll
- Aligned sidebar close icon exactly with header drawer toggle position
- Fixed sidebar close animation playing on initial page load

## What Was Done Earlier (March 18–21)
- Hero clock redesign to match Figma (bordered edit UI, responsive gaps, typography)
- Clock tile edit UI fixes (duplicate AM/PM removed, input styling, alignment)
- Time input refactored to single `type="time"` input
- Mobile time input alignment fixes (webkit pseudo-element styling)
- "Reset Time" text link, full-width city menu, ellipsis-based remove, day badges
- Tile spacing refinements to match Figma specs
- Editing UI redesign with highlighted displayed cities, max raised to 16

## Outstanding PRD Items (Not Yet Implemented)
Refer to `docs/PRD.md` for full details. Key remaining items:

### Track 1: Web UI
- [ ] Cloud sync / user accounts (deferred — sidebar has account UI but it's non-functional)
- [ ] Any remaining PRD checklist items not yet checked off

### Track 2: iOS Native App
- [ ] SwiftUI app with feature parity
- [ ] Home/lock screen widgets
- [ ] Cloud sync

## Known Issues / Notes
- `HANDOFF.md` contains a GitHub PAT — treat it as sensitive
- The sidebar account/login UI is designed but intentionally not implemented yet
- `tailwindcss-animate` injects `transition: all` on `*` — neutralized in `index.css`
- Binary `isScrolled` + CSS transition approach for header causes snap at animation end — current scroll-position-driven approach works well, don't revert

## Key Files
| File | Purpose |
|------|---------|
| `client/src/pages/world-clock.tsx` | Main page, sticky header, scroll-driven animation |
| `client/src/components/digital-clock.tsx` | Clock tile rendering (grid layout) |
| `client/src/components/time-zone-converter.tsx` | DnD, state management, clock tick |
| `client/src/components/sidebar.tsx` | Sidebar menu component |
| `client/src/index.css` | CSS base layer overrides |
| `client/src/hooks/use-weather.ts` | Open-Meteo weather API (no key needed) |

## Repo & Deployment
- **Repo:** https://github.com/khoivinh/Khlock
- **Live:** https://khlock.pages.dev/
- **Stack:** Vite + React + TypeScript + Tailwind (static frontend only, no backend)
- **Deploy:** Push to `main` → Cloudflare Pages auto-deploys

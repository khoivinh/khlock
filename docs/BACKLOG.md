# Happyhour Backlog

## Track 1: Web UI

- [x] **Add Cities menu should overlay content** — Shipped: menu now overlays clock tiles instead of pushing them down.
- [x] **Rename "World Khlock" to "Khlock"** — Update PRD title, any in-code references to "World Khlock", page title, etc.
- [x] **Rename "Khlock" to "Happyhour"** — Full rebrand shipped 2026-04-20: new domain `happyhour.day`, favicon, OpenGraph image, header logo, Happy Mode theme.
- [x] **Add supporting graphics** — OpenGraph thumbnail, favicon, and any other meta images needed for link previews and browser tabs.
- [ ] **Add copyright and footer** — Add a footer section with copyright information at the bottom of the page.
- [~] **Sync rel-time toggle to cloud** — Code complete 2026-04-21: D1 migration `0002_add_show_rel_time.sql` added, `api/src/routes/preferences.ts` now reads/writes/validates `show_rel_time`, client `CloudPreferences.showRelativeTime` is required. Backlog note's claim that `world-clock.tsx` needed plumbing was a misread — its localStorage handling matches `use24h` and `sortEastToWest` (local mirror + cloud overlay when signed in). **Pending user action:** apply migration to D1 + deploy API. From `api/`: `npx wrangler d1 migrations apply happyhour-db --local` then `--remote`.

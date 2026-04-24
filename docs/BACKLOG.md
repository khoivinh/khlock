# Happyhour Backlog

## Track 1: Web UI

- [x] **Add Cities menu should overlay content** — Shipped: menu now overlays clock tiles instead of pushing them down.
- [x] **Rename "World Khlock" to "Khlock"** — Update PRD title, any in-code references to "World Khlock", page title, etc.
- [x] **Rename "Khlock" to "Happyhour"** — Full rebrand shipped 2026-04-20: new domain `happyhour.day`, favicon, OpenGraph image, header logo, Happy Mode theme.
- [x] **Add supporting graphics** — OpenGraph thumbnail, favicon, and any other meta images needed for link previews and browser tabs.
- [x] **Add copyright and footer** — Shipped 2026-04-23 (`d194419` + `a5d7afb`): universal `SiteFooter` component on home + `/about` `/privacy` `/support` pages, per Figma 272:4560.
- [~] **Sync rel-time toggle to cloud** — Code complete 2026-04-21: D1 migration `0002_add_show_rel_time.sql` added, `api/src/routes/preferences.ts` now reads/writes/validates `show_rel_time`, client `CloudPreferences.showRelativeTime` is required. Backlog note's claim that `world-clock.tsx` needed plumbing was a misread — its localStorage handling matches `use24h` and `sortEastToWest` (local mirror + cloud overlay when signed in). **Pending user action:** apply migration to D1 + deploy API. From `api/`: `npx wrangler d1 migrations apply happyhour-db --local` then `--remote`.
- [ ] **Redesign cookie consent preferences UI** — The cookie **bar** (initial banner) was restyled to match Figma `280:4647` on 2026-04-23 via CSS overrides in `client/src/styles/silktide-overrides.css`. The Silktide **preferences modal** (opened from the "Preferences" link in the bar, or from the post-consent nudge icon `#stcm-icon`) still renders with Silktide's default styling. Need: Figma designs for the modal in light / dark / happy modes, then extend `silktide-overrides.css` to cover `#stcm-modal` + its toggles, close button, and inner buttons. Consent-storage wiring stays intact; purely visual work. Keep the GA `gtag('consent', 'update', …)` hook that fires from Silktide's own internal listeners (not affected by CSS).

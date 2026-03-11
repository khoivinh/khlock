# World Khlock — Product Requirements Document

## Context

World Khlock is a world clock and timezone converter web app (React/TypeScript/Tailwind, deployed on Cloudflare Pages). Phases 1-2 (codebase cleanup, deployment, mobile UX fixes) are complete. The scroll-driven header animation is confirmed smooth. This PRD covers two tracks:

1. **Phase 3: Visual Design & Layout Polish + Cloud Sync** — refine clock tiles, overall page layout, and add user accounts with cloud-synced preferences
2. **iOS Native App** — SwiftUI app with feature parity + home/lock screen widgets + cloud sync

---

## Track 1: Visual Design & Layout Polish + Cloud Sync (Web)

### Goal
Refine the current minimal aesthetic — better visual hierarchy, spacing, and tile design without changing the app's identity. Add user accounts and cloud-synced preferences so clock configurations persist across devices.

### Scope: Clock Tile Design
**Files:** `client/src/components/digital-clock.tsx`, `client/src/index.css`

- [ ] Vertically align the grabber icon, the city name and the remove button
- [ ] Refine hover/focus states (desktop only, respecting `@media(hover:hover)`)
- [ ] Remove the blue indicator that appears when the user drags a clock tile

### Scope: Overall Page Layout
**Files:** `client/src/pages/world-clock.tsx`, `client/src/components/time-zone-converter.tsx`

- [ ] Consider improving the grid spacing and breakpoint behavior (currently 3-col desktop, 1-col mobile)
- [ ] Consider a 2-column layout for tablet/medium screens
- [ ] Polish the "Add Time Zone" button/popover placement

### Scope: Cloud Sync & User Accounts
**Auth:** Clerk (Google + Apple social login, passkeys)
**Backend:** Cloudflare Workers + D1

- [ ] Integrate Clerk for authentication (sign in / sign up / sign out)
- [ ] Add sign-in UI to the header (avatar when signed in, "Sign In" button when not)
- [ ] Create Cloudflare Worker API endpoints:
  - `GET /api/preferences` — fetch user's saved zones + order
  - `PUT /api/preferences` — save zones + order
- [ ] Create D1 schema: `user_preferences` table (user_id, zones JSON, updated_at)
- [ ] Sync logic: on sign-in, merge localStorage with cloud; on change, debounce-save to cloud
- [ ] Graceful fallback: unauthenticated users continue using localStorage only

### Out of Scope (Phase 3)
- Theme/color palette changes (current palette is close to final)
- New features or interactions beyond cloud sync

---

## Track 2: iOS Native App

### Goal
Build a native SwiftUI iOS app with full feature parity to the web app, plus home screen and Lock Screen widgets. Share user accounts and synced preferences with the web app.

### Core Features (Parity with Web)

1. **World Clock Display**
   - Hero clock showing local timezone with large digital time
   - Additional clocks grid (reorderable)
   - Live time with seconds display
   - Custom time mode (tap to edit, "Show Live Time" to reset)

2. **City Management**
   - Search and add cities (same 1500-city dataset from city-timezones)
   - Remove cities
   - Drag-to-reorder
   - Max 12 clocks
   - Cloud sync of city list and order via Clerk account (cross-platform with web)

3. **Weather Integration**
   - Temperature display per city via Open-Meteo API (free, no auth)
   - Color-coded temperature

4. **Meeting Planner**
   - Plan meetings across timezones
   - Color-coded availability (green: 6am-9pm, red: night)
   - Date/time pickers

5. **Appearance**
   - Light/dark/system theme support
   - Minimal, clean design matching web app aesthetic
   - Smooth animations and transitions

### iOS-Specific Features

6. **Home Screen Widgets**
   - Small widget: single city clock + weather
   - Medium widget: 2-3 city clocks
   - Large widget: up to 6 city clocks
   - Configurable city selection per widget

7. **Lock Screen Widgets**
   - Inline widget: single city time
   - Circular widget: city abbreviation + time
   - Rectangular widget: city + time + weather

### Technical Architecture

- **Language:** Swift 6
- **UI Framework:** SwiftUI
- **Minimum iOS:** 17.0 (for latest widget APIs)
- **Data Persistence:** SwiftData or UserDefaults + App Groups (for widget data sharing)
- **Networking:** URLSession + async/await for Open-Meteo API and sync API
- **City Database:** Bundle the city-timezones dataset as JSON, load at launch
- **Widget Framework:** WidgetKit with TimelineProvider
- **Cloud Sync:** Clerk iOS SDK for auth + Cloudflare Workers API (shared with web)

### Project Structure (Proposed)
```
Khlock/
├── KhlockApp/
│   ├── App/                    # App entry, navigation
│   ├── Models/                 # City, Clock, Weather models
│   ├── Views/
│   │   ├── WorldClockView      # Main screen
│   │   ├── ClockTileView       # Individual clock tile
│   │   ├── HeroClockView       # Large hero clock
│   │   ├── CitySearchView      # City search/add
│   │   └── MeetingPlannerView  # Meeting planner sheet
│   ├── ViewModels/             # ObservableObject view models
│   ├── Services/
│   │   ├── WeatherService      # Open-Meteo API client
│   │   ├── SyncService         # Cloudflare Workers API client for preference sync
│   │   └── CityDatabase        # City lookup & search
│   └── Resources/
│       └── cities.json         # Bundled city database
├── KhlockWidgets/
│   ├── KhlockWidgets.swift     # Widget bundle
│   ├── HomeScreenWidget.swift  # Small/Medium/Large
│   └── LockScreenWidget.swift  # Inline/Circular/Rectangular
└── Shared/
    └── Models/                 # Shared between app & widgets
```

### Phased Delivery (iOS)
1. **MVP:** World clock display, city search, add/remove, drag-to-reorder
2. **V1.0:** Weather integration, meeting planner, custom time mode, theme support, cloud sync
3. **V1.1:** Home screen & Lock Screen widgets

---

## Verification

### Web (Track 1)
- Visual inspection on Chrome mobile emulator (390x844 iPhone 14)
- Test both light and dark modes
- Verify grid, list, and responsive layouts at 375px, 768px, 1024px, 1440px
- Confirm drag-to-reorder still works smoothly after layout changes
- Deploy to https://khlock.pages.dev/ and test on real device
- Sign in with Google, add cities, sign out, sign back in — verify cities restored
- Test unauthenticated fallback (localStorage still works without sign-in)
- Test merge behavior when localStorage and cloud have different cities

### iOS (Track 2)
- Run in Xcode Simulator (iPhone 15 Pro, iPhone SE)
- Test widget rendering in widget gallery
- Verify Open-Meteo API calls work on device
- Test drag-to-reorder with haptic feedback
- Test light/dark mode transitions
- Sign in with same account as web, verify same cities appear
- Test offline behavior (local changes sync when back online)

---

## Recommended Next Step
Start with **Track 1** (web visual polish) since it's lower risk and builds momentum. Begin with clock tile alignment and hover states, then move to page layout refinements. Cloud sync can be implemented after the visual polish is complete, as it's independent. Once the web design and sync API are finalized, use them as the definitive reference for the iOS app.

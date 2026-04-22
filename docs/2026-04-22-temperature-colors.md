# Temperature Colors

Hex values for the temperature label colors displayed beneath each clock, across all three theme modes.

Bands are defined in `client/src/hooks/use-weather.ts` (`getTemperatureColor`). Light and dark modes share the default Tailwind 500-shades; Happy Mode overrides yellow/orange/green for contrast against the `#ffd900` background (see `client/src/index.css`).


**Revised 2026-04-22**
| Band     | Range (°C) | Light mode | Dark mode | Happy (yellow) mode |
|----------|------------|------------|-----------|---------------------|
| Freezing | ≤ 0        | `#3b82f6`  | `#3b82f6` | `#3b82f6`           |
| Cold     | 1–10       | `#06b6d4`  | `#06b6d4` | `#06b6d4`           |
| Mild     | 11–18      | `#22c55e`  | `#22c55e` | `#00B946`           |
| Warm     | 19–24      | `#eab308`  | `#eab308` | `#C68A1A`           |
| Hot      | 25–30      | `#f97316`  | `#f97316` | `#CA6100`           |
| Very hot | > 30       | `#ef4444`  | `#ef4444` | `#B51818`           |


**Previous Version 2026-04-21**
| Band      | Range (°C) | Tailwind class   | Light mode | Dark mode | Happy (yellow) mode |
|-----------|------------|------------------|------------|-----------|---------------------|
| Freezing  | ≤ 0        | `text-blue-500`  | `#3b82f6`  | `#3b82f6` | `#3b82f6`           |
| Cold      | 1–10       | `text-cyan-500`  | `#06b6d4`  | `#06b6d4` | `#06b6d4`           |
| Mild      | 11–18      | `text-green-500` | `#22c55e`  | `#22c55e` | `#166534`           |
| Warm      | 19–24      | `text-yellow-500`| `#eab308`  | `#eab308` | `#8b5a00`           |
| Hot       | 25–30      | `text-orange-500`| `#f97316`  | `#f97316` | `#b45309`           |
| Very hot  | > 30       | `text-red-500`   | `#ef4444`  | `#ef4444` | `#ef4444`           |

# Architecture

## Components
- `web/app`: Next.js App Router shell and client dashboard.
- `web/lib/alert-engine.ts`: pure threshold, event transition and trend rules.
- `web/lib/simulation.ts`: deterministic/randomized demo readings.
- `web/lib/analytics.ts`: derived counts and durations.
- `web/lib/storage.ts`: versioned localStorage adapter; replaceable by a remote repository later.
- `firmware/smart-grain-storage`: standalone Arduino/Wokwi implementation.

## Data flow
The client generates or accepts simulated readings, rejects invalid values, passes valid samples through the alert engine, updates one active event, appends the sample, and persists the snapshot. The display derives status and analytics from that state. Firmware reads DHT11 locally and drives GPIO outputs; serial output is for debugging only.

Both pages share `web/lib/use-monitor.ts`, a hook owning the snapshot lifecycle (load, persist, sample interval, threshold application, acknowledgment) plus a `storage` event listener that reloads the snapshot when another tab writes it — that is how the dashboard and the hardware simulator stay in sync. `web/lib/hardware-state.ts` is a pure module mirroring the firmware's UNKNOWN/SAFE/BREACH enum and its LED/buzzer/acknowledgment rules; both pages derive their output pills and the SVG circuit from it, so the browser behaviour and the sketch cannot drift apart.

Styling follows the pastel-retro system documented in `docs/DESIGN.md` (fonts via `next/font`, tokens in `web/app/globals.css`).

## Limits
Browser local storage is per-browser/device and is not a backup or multi-user database. Dashboard Demo Mode and Wokwi do not exchange data. Trend estimates use a short rolling linear slope and are indicative only; they do not account for ventilation, crop type, sensor error or environmental causes.

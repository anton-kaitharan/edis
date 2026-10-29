# Dashboard

Node.js 20+ recommended. Run `npm install`, `npm run dev`, then visit http://localhost:3000. `npm run build` creates the production build; `npm test` runs unit tests. The dashboard's Demo Mode is independent of Wokwi, reads are generated every three seconds, and all browser-side state is persisted in versioned localStorage.

Humidity limits default to 40–65% RH for demonstration only. Invalid manual values are ignored; the sensor validation range is 0–100% RH and −20–80°C. No real sensor integration is implemented.

## Hardware simulator

`/hardware` renders an interactive SVG of the ESP32 circuit and mirrors the firmware alert behaviour. It shares state with the dashboard via `lib/use-monitor.ts`, the hook backing both pages (snapshot persistence plus a `storage` listener for cross-tab sync). `lib/hardware-state.ts` is the pure state machine matching the firmware's UNKNOWN/SAFE/BREACH enum, button acknowledgment and LED/buzzer outputs. `npm test` runs unit tests including `lib/hardware-state.test.ts`.

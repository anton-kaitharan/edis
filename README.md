# Smart Grain Storage Monitor

A software-first grain storage monitor with two independent demonstrations: a Next.js dashboard simulation and an ESP32/Wokwi firmware simulation. Dashboard values are generated or entered in the browser; the Wokwi serial output is not connected to the dashboard.

## Run the dashboard

Requirements: Node.js 20+ and npm.

```powershell
cd web
npm install
npm run dev
```

Open http://localhost:3000. The default 40â€“65% RH range is a **demo setting**, not an agricultural storage recommendation. Configure limits for your crop and storage conditions. Data is saved in this browser's local storage.

## Hardware simulator

The dashboard includes an interactive Hardware Simulator at http://localhost:3000/hardware. It visualises the ESP32 circuit (container, DHT sensor, LED, buzzer, ACK button) and mirrors the firmware's alert rules: LED on during a breach, buzzer until acknowledged, button silences the buzzer only. It shares the same browser state as the dashboard, so actions on either page are reflected on the other. This web simulator re-implements the firmware's alert rules in the browser — it does not run the ESP32 firmware or receive live Wokwi sensor data.

## Run the ESP32 simulation

Open `firmware/smart-grain-storage/` in Wokwi (VS Code extension or wokwi.com), install the libraries listed in that folder's README, then start the simulation and inspect the Serial Monitor. Adjust the demo range in the sketch to test high and low breaches. The virtual pushbutton acknowledges a breach.

The two modes are separate. A future serial/WebSocket/HTTP adapter could forward validated readings to a backend; no such bridge is included here.

## Project map

- `web/`: Next.js App Router dashboard, simulation/alert engine, local storage and analytics.
- `firmware/smart-grain-storage/`: Arduino ESP32 sketch and Wokwi circuit.
- `docs/`: product requirements, architecture, circuit notes and repeatable test plan.

See [web/README.md](web/README.md) and [firmware README](firmware/smart-grain-storage/README.md) for detailed run instructions.

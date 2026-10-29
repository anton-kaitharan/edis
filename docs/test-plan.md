# Repeatable test plan

## Dashboard
1. Start `cd web; npm install; npm run dev`, open the page and confirm the interface labels readings as simulated.
2. With default demo bounds 40–65% RH, set humidity to 50: status safe and LED/buzzer off.
3. Set to 70, verify one active breach, LED and buzzer on; repeatedly change within breach and verify event count stays one.
4. Acknowledge: buzzer off, LED on; change humidity again and verify monitoring continues and buzzer remains silenced.
5. Set to 50: event resolves with recovery time/duration; alert and acknowledgment clear.
6. Set to 30 and verify low breach. Set bounds in the UI and verify evaluation follows them.
7. Pause, wait more than one interval and confirm no automatic points; manual controls remain usable. Resume.
8. Raise humidity gradually and inspect trend warning; this is an estimate, not a breach.
9. Reload and confirm settings, sample history and events remain.
10. Unit tests cover transition, invalid readings, trend, and analytics.

## Wokwi
Open the firmware folder with Wokwi, start simulation and use Serial Monitor. Observe periodic records. Change the virtual DHT humidity above/below `MIN_HUMIDITY`/`MAX_HUMIDITY`; LED and buzzer should activate. Press the virtual button: buzzer silences while LED remains lit; monitoring continues. Return humidity to range to clear outputs. Verify invalid sensor values are logged and never treated as safe. Wokwi execution must be performed manually where simulator access is available.

## Hardware Simulator
1. Open http://localhost:3000/hardware; confirm the diagram, metrics, GPIO table and disclaimer render, and the nav tab marks the page active.
2. Move the humidity slider inside the range: SAFE, LED and buzzer off.
3. Use "Trigger high breach": state pill shows BREACH, LED glows red, buzzer arcs animate, serial log line ends in BREACH.
4. Press the on-diagram button or the "Press ACK button" control: buzzer shows SILENCED, LED stays on; continue sampling within the breach and verify it stays silenced.
5. "Restore safe": outputs off, state SAFE, acknowledgment cleared. Trigger a low breach ("Trigger low breach") and verify the new episode starts unacknowledged.
6. Change Min/Max and Apply: the same humidity value re-evaluates against the new thresholds.
7. With the dashboard open in another tab, trigger a breach in the simulator and confirm the dashboard reflects it (and vice versa); navigate between tabs and confirm state persists.
8. Resize to ~360 px width: metrics collapse, the SVG scales, sliders remain usable.
9. Confirm the dashboard chart and alert history still work and record simulator-driven events.

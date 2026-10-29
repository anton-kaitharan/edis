# Product requirements — Smart Grain Storage Monitor

## Goal
Demonstrate humidity and temperature monitoring, configurable limits, alert acknowledgment, breach history, simple analytics, and a trend estimate without physical hardware.

## Users and scope
The prototype is for demonstration and software evaluation. Dashboard Demo Mode is the primary end-to-end experience. ESP32 Simulator Mode runs independently in Wokwi. Sensor values are explicitly simulated; this product makes no claim of real measurements or universal crop safety thresholds.

## Requirements
- Show current RH, temperature, status, virtual LED/buzzer, acknowledgment and update time.
- Read/update the browser simulation every three seconds; allow pause/resume and manual value controls.
- Evaluate configurable inclusive safe humidity bounds. Out-of-range values open one event per continuous breach; recovery resolves it.
- Acknowledge/silence the buzzer while continuing monitoring and retaining the visual LED indication.
- Persist settings, samples and breach events locally across reloads.
- Chart recent humidity and temperature and show breach statistics over stored events.
- Estimate threshold approach from a sustained, time-based humidity trend and label it as a rule-based estimate.
- Provide an independently runnable ESP32 sketch with DHT, LED, buzzer and button.

## Out of scope
Cloud sync, user accounts, real sensor ingestion, calibration, crop-specific recommendations, machine learning and claims of food safety.

## Acceptance
The dashboard runs locally, controls affect alert state/history, event records survive reload, and the test plan covers safe/breach/acknowledgment/recovery/invalid inputs/trend/pause. Wokwi execution is subject to manual simulator verification.

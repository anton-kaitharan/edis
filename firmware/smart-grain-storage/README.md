# ESP32 / Wokwi simulation

This is a separate demonstration from the Next.js dashboard. It reports simulated DHT values to the Serial Monitor and drives virtual GPIO outputs; no serial bridge to the dashboard is included.

## Run in Wokwi

Open this directory as a Wokwi project using the Wokwi VS Code extension or create a project at wokwi.com and add `smart-grain-storage.ino` and `diagram.json`. For ESP32, install **DHT sensor library for ESPx** and its dependency **Adafruit Unified Sensor**. Select an ESP32 DevKit board / Arduino framework, start simulation and open Serial Monitor at 115200 baud.

For a local Arduino CLI build, install the ESP32 core and libraries, then compile from this directory:

```sh
arduino-cli core update-index
arduino-cli core install esp32:esp32
arduino-cli lib install "DHT sensor library for ESPx" "Adafruit Unified Sensor"
arduino-cli compile --fqbn esp32:esp32:esp32 --output-dir build .
```

The Wokwi CLI config points to the expected `build/` binary and ELF. Wokwi VS Code can also build the sketch itself when the project is opened in the extension.

The circuit uses a Wokwi DHT22-compatible sensor with the Adafruit `DHT` driver configured as `DHT22`. To use a DHT11 component, change the component in the diagram and set `DHT_TYPE` to `DHT11`. Sensor DATA is GPIO 4. LED GPIO 2 includes a 220-ohm series resistor; buzzer is GPIO 5; button GPIO 15 uses `INPUT_PULLUP` and connects to ground.

Set virtual humidity above 65% or below 40% to trigger an alert. Press the button to silence the buzzer while leaving the LED on. Return to range to reset acknowledgment. Thresholds are examples for demonstration only, not universal safe storage standards.

`wokwi.toml` identifies the sketch entry point for local Wokwi CLI use. Simulator availability and component pin validation require manual Wokwi execution.

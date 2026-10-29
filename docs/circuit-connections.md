# Circuit connections

| Device pin | ESP32 | Notes |
|---|---:|---|
| DHT11 VCC | 3V3 | Sensor supply |
| DHT11 GND | GND | Common ground |
| DHT11 SDA/DATA | GPIO 4 | Data pin |
| LED anode | GPIO 2 through 220 Ω | Series current limiting resistor |
| LED cathode | GND | |
| Buzzer pin 2 (+) | GPIO 5 | Wokwi buzzer pin 2 is positive |
| Buzzer pin 1 (−) | GND | |
| Pushbutton pin 1 | GPIO 15 | `INPUT_PULLUP`, active low |
| Pushbutton pin 2 | GND | Press pulls input low |

Wokwi's DHT22 part provides the same DATA/VCC/GND interface and accepts simulated humidity/temperature; the sketch uses the compatible DHT library and `DHT22` type. Pin names in `diagram.json` identify the component pins. The sketch's constants are the source of GPIO assignment.

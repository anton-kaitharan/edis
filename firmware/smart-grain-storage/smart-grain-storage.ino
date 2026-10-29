#include <DHT.h>

// Demo values only. Choose limits for the intended crop and storage conditions.
constexpr uint8_t DHT_PIN = 4;
constexpr uint8_t LED_PIN = 2;
constexpr uint8_t BUZZER_PIN = 5;
constexpr uint8_t BUTTON_PIN = 15;
constexpr float MIN_HUMIDITY = 40.0f;
constexpr float MAX_HUMIDITY = 65.0f;
constexpr unsigned long SAMPLE_INTERVAL_MS = 3000;
constexpr unsigned long DEBOUNCE_MS = 40;
#define DHT_TYPE DHT22 // Wokwi DHT22-compatible sensor; change to DHT11 for a DHT11 component.
DHT dht(DHT_PIN, DHT_TYPE);

enum AlertState : uint8_t { UNKNOWN, SAFE, BREACH };
AlertState alertState = UNKNOWN;
bool acknowledged = false;
bool buttonStable = HIGH;
bool buttonLastRead = HIGH;
unsigned long buttonChangedAt = 0;
unsigned long lastSampleAt = 0;
unsigned long bootAt = 0;

bool valid(float humidity, float temperature) {
  return !isnan(humidity) && !isnan(temperature) && humidity >= 0.0f && humidity <= 100.0f && temperature >= -20.0f && temperature <= 80.0f;
}

bool outsideRange(float humidity) {
  return humidity < MIN_HUMIDITY || humidity > MAX_HUMIDITY;
}

void applyOutputs() {
  digitalWrite(LED_PIN, alertState == BREACH ? HIGH : LOW);
  digitalWrite(BUZZER_PIN, alertState == BREACH && !acknowledged ? HIGH : LOW);
}

void checkButton(unsigned long now) {
  const bool reading = digitalRead(BUTTON_PIN);
  if (reading != buttonLastRead) {
    buttonLastRead = reading;
    buttonChangedAt = now;
  }
  if (now - buttonChangedAt >= DEBOUNCE_MS && reading != buttonStable) {
    buttonStable = reading;
    if (buttonStable == LOW && alertState == BREACH) {
      acknowledged = true;
      applyOutputs();
      Serial.println("Button pressed: buzzer silenced; monitoring continues.");
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  applyOutputs();
  dht.begin();
  bootAt = millis();
  Serial.println("Smart Grain Storage Monitor — SIMULATED SENSOR DATA");
  Serial.println("Demo threshold only; configure for the storage context.");
  Serial.println("timestamp_ms,humidity_pct,temperature_c,alert,acknowledged");
}

void loop() {
  const unsigned long now = millis();
  checkButton(now); // Keep input responsive between sensor samples.
  if (now - lastSampleAt < SAMPLE_INTERVAL_MS) return;
  lastSampleAt = now;

  const float humidity = dht.readHumidity();
  const float temperature = dht.readTemperature();
  if (!valid(humidity, temperature)) {
    Serial.print(now - bootAt);
    Serial.println(",INVALID,INVALID,UNKNOWN,UNKNOWN — DHT read invalid; prior alert state retained");
    return; // Never infer safe conditions from failed sensor data.
  }

  if (outsideRange(humidity)) {
    if (alertState == SAFE) acknowledged = false; // New breach episode.
    alertState = BREACH;
  } else {
    alertState = SAFE;
    acknowledged = false;
  }
  applyOutputs();
  Serial.print(now - bootAt);
  Serial.print(','); Serial.print(humidity, 1);
  Serial.print(','); Serial.print(temperature, 1);
  Serial.print(','); Serial.print(alertState == BREACH ? "BREACH" : "SAFE");
  Serial.print(','); Serial.println(acknowledged ? "ACKNOWLEDGED" : "NOT_ACKNOWLEDGED");
}

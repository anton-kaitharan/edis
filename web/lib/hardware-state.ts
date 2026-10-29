import { isBreach, isValidReading } from './alert-engine';

export type AlertLevel = 'UNKNOWN' | 'SAFE' | 'BREACH';
export type HardwareState = { alert: AlertLevel; acknowledged: boolean };
export type HardwareOutputs = { led: boolean; buzzer: boolean; silenced: boolean };

export const initialHardwareState = (): HardwareState => ({ alert: 'UNKNOWN', acknowledged: false });

export function hardwareSample(state: HardwareState, humidity: number, temperature: number, min: number, max: number): HardwareState {
  if (!isValidReading(humidity, temperature)) return state;
  if (isBreach(humidity, min, max)) {
    return { alert: 'BREACH', acknowledged: state.alert === 'SAFE' ? false : state.acknowledged };
  }
  return { alert: 'SAFE', acknowledged: false };
}

export function pressButton(state: HardwareState): HardwareState {
  if (state.alert !== 'BREACH') return state;
  return { ...state, acknowledged: true };
}

export function deriveOutputs(breach: boolean, acknowledged: boolean): HardwareOutputs {
  return { led: breach, buzzer: breach && !acknowledged, silenced: breach && acknowledged };
}

export function outputsFor(state: HardwareState): HardwareOutputs {
  return deriveOutputs(state.alert === 'BREACH', state.acknowledged);
}

export type PinoutRow = { component: string; pin: string; gpio: string; note: string };
export const PINOUT: PinoutRow[] = [
  { component: 'DHT11/DHT22 sensor', pin: 'VCC', gpio: '3V3', note: 'Sensor supply' },
  { component: 'DHT11/DHT22 sensor', pin: 'DATA (SDA)', gpio: 'GPIO 4', note: 'Humidity/temperature data' },
  { component: 'DHT11/DHT22 sensor', pin: 'GND', gpio: 'GND', note: 'Common ground' },
  { component: 'LED', pin: 'Anode (+)', gpio: 'GPIO 2', note: 'Through 220 Ω series resistor' },
  { component: '220 Ω resistor', pin: 'Resistor → LED cathode', gpio: 'GND', note: 'Cathode to ground' },
  { component: 'Piezo buzzer', pin: 'Pin 2 (+)', gpio: 'GPIO 5', note: 'Wokwi buzzer pin 2 is positive' },
  { component: 'Piezo buzzer', pin: 'Pin 1 (−)', gpio: 'GND', note: '' },
  { component: 'Pushbutton', pin: 'Pin 1', gpio: 'GPIO 15', note: 'INPUT_PULLUP, active low' },
  { component: 'Pushbutton', pin: 'Pin 2', gpio: 'GND', note: 'Press pulls input low' },
];

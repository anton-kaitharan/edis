import { describe, it, expect } from 'vitest';
import { deriveOutputs, hardwareSample, initialHardwareState, outputsFor, pressButton } from './hardware-state';

describe('hardware state machine', () => {
  it('turns LED and buzzer on for a high breach', () => {
    const s = hardwareSample(initialHardwareState(), 70, 24, 40, 65);
    expect(s.alert).toBe('BREACH');
    expect(outputsFor(s)).toEqual({ led: true, buzzer: true, silenced: false });
  });
  it('turns LED and buzzer on for a low breach', () => {
    const s = hardwareSample(initialHardwareState(), 39, 24, 40, 65);
    expect(s.alert).toBe('BREACH');
    expect(outputsFor(s)).toEqual({ led: true, buzzer: true, silenced: false });
  });
  it('silences the buzzer on button press while monitoring continues', () => {
    let s = hardwareSample(initialHardwareState(), 70, 24, 40, 65);
    s = pressButton(s);
    expect(s.acknowledged).toBe(true);
    expect(outputsFor(s)).toEqual({ led: true, buzzer: false, silenced: true });
    s = hardwareSample(s, 72, 24, 40, 65);
    expect(s.alert).toBe('BREACH');
    expect(s.acknowledged).toBe(true);
    expect(outputsFor(s).buzzer).toBe(false);
  });
  it('clears alert and acknowledgment on recovery', () => {
    let s = hardwareSample(initialHardwareState(), 70, 24, 40, 65);
    s = pressButton(s);
    s = hardwareSample(s, 55, 24, 40, 65);
    expect(s).toEqual({ alert: 'SAFE', acknowledged: false });
    expect(outputsFor(s)).toEqual({ led: false, buzzer: false, silenced: false });
  });
  it('starts a new breach after recovery unacknowledged', () => {
    let s = hardwareSample(initialHardwareState(), 70, 24, 40, 65);
    s = pressButton(s);
    s = hardwareSample(s, 55, 24, 40, 65);
    s = hardwareSample(s, 70, 24, 40, 65);
    expect(s.alert).toBe('BREACH');
    expect(s.acknowledged).toBe(false);
    expect(outputsFor(s).buzzer).toBe(true);
  });
  it('ignores button presses outside a breach', () => {
    const unknown = initialHardwareState();
    expect(pressButton(unknown)).toBe(unknown);
    const safe = hardwareSample(unknown, 50, 24, 40, 65);
    expect(pressButton(safe)).toBe(safe);
  });
  it('retains prior state on invalid readings', () => {
    const s = hardwareSample(initialHardwareState(), 70, 24, 40, 65);
    expect(hardwareSample(s, NaN, 24, 40, 65)).toBe(s);
    expect(hardwareSample(s, 101, 24, 40, 65)).toBe(s);
  });
  it('evaluates the same humidity against the configured thresholds', () => {
    expect(hardwareSample(initialHardwareState(), 60, 24, 40, 65).alert).toBe('SAFE');
    expect(hardwareSample(initialHardwareState(), 60, 24, 40, 55).alert).toBe('BREACH');
  });
  it('derives outputs for every breach/acknowledged combination', () => {
    expect(deriveOutputs(false, false)).toEqual({ led: false, buzzer: false, silenced: false });
    expect(deriveOutputs(false, true)).toEqual({ led: false, buzzer: false, silenced: false });
    expect(deriveOutputs(true, false)).toEqual({ led: true, buzzer: true, silenced: false });
    expect(deriveOutputs(true, true)).toEqual({ led: true, buzzer: false, silenced: true });
  });
});

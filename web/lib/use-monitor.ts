import { useCallback, useEffect, useState } from 'react';
import type { Snapshot, Reading } from './types';
import { emptySnapshot, loadSnapshot, saveSnapshot, SNAPSHOT_KEY } from './storage';
import { isBreach, isValidReading, trendWarning, updateBreach } from './alert-engine';
import { nextReading } from './simulation';
import { deriveOutputs } from './hardware-state';

export function useMonitor() {
  const [state, setState] = useState<Snapshot>(emptySnapshot);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadSnapshot());
    setReady(true);
    const onStorage = (e: StorageEvent) => { if (e.key === SNAPSHOT_KEY) setState(loadSnapshot()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => { if (ready) saveSnapshot(state); }, [ready, state]);

  const sample = useCallback((humidity: number, temperature: number) => {
    if (!isValidReading(humidity, temperature)) return;
    const now = Date.now();
    const r: Reading = { id: `r-${now}-${Math.random().toString(36).slice(2, 6)}`, timestamp: now, humidity: Number(humidity.toFixed(1)), temperature: Number(temperature.toFixed(1)) };
    setState(s => {
      const next = updateBreach(s.events, r, s.minHumidity, s.maxHumidity, s.acknowledged);
      return { ...s, humidity: r.humidity, temperature: r.temperature, readings: [...s.readings, r].slice(-2000), events: next.events, acknowledged: next.acknowledged };
    });
  }, []);

  useEffect(() => {
    if (!ready || state.paused) return;
    const id = window.setInterval(() => {
      setState(s => {
        const r = nextReading(s.humidity, s.temperature);
        const out = updateBreach(s.events, r, s.minHumidity, s.maxHumidity, s.acknowledged);
        return { ...s, humidity: r.humidity, temperature: r.temperature, readings: [...s.readings, r].slice(-2000), events: out.events, acknowledged: out.acknowledged };
      });
    }, 3000);
    return () => clearInterval(id);
  }, [ready, state.paused]);

  const breach = isBreach(state.humidity, state.minHumidity, state.maxHumidity);
  const active = state.events.find(e => e.status === 'Active');
  const trend = trendWarning(state.readings, state.maxHumidity, Date.now());
  const outputs = deriveOutputs(breach, state.acknowledged);

  const applyBounds = useCallback((min: number, max: number) => {
    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max > 100 || min >= max) return false;
    setState(s => ({ ...s, minHumidity: min, maxHumidity: max }));
    return true;
  }, []);

  const ack = useCallback(() => setState(s => ({ ...s, acknowledged: true, events: s.events.map(e => e.status === 'Active' ? { ...e, acknowledged: true } : e) })), []);
  const setPaused = useCallback((paused: boolean) => setState(s => ({ ...s, paused })), []);
  const togglePause = useCallback(() => setState(s => ({ ...s, paused: !s.paused })), []);
  const restore = useCallback((temperature?: number) => {
    sample((state.minHumidity + state.maxHumidity) / 2, temperature ?? state.temperature);
  }, [sample, state.minHumidity, state.maxHumidity, state.temperature]);

  return { state, ready, breach, active, trend, sample, ack, restore, setPaused, togglePause, applyBounds, outputs };
}

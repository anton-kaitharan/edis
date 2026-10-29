'use client';
import { useState } from 'react';
import { Activity, BellRing, Cpu, Pause, Play, RotateCcw, ShieldCheck, Thermometer, Waves } from 'lucide-react';
import { useMonitor } from '@/lib/use-monitor';
import { isBreach } from '@/lib/alert-engine';
import { PINOUT } from '@/lib/hardware-state';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import HardwareDiagram from '@/components/HardwareDiagram';

const fmt = (time: number | null) => time ? new Date(time).toLocaleString() : '—';

export default function HardwarePage() {
  const { state, breach, sample, ack, restore, togglePause, applyBounds, outputs } = useMonitor();
  const [bounds, setBounds] = useState({ min: '', max: '' });
  const [grain, setGrain] = useState<'rice' | 'wheat'>('rice');
  const alertLevel = breach ? 'BREACH' : 'SAFE';
  const last = state.readings.at(-1);
  const log = state.readings.slice(-8).map(r => `t+${(r.timestamp - (state.readings[0]?.timestamp ?? r.timestamp))}ms,${r.humidity.toFixed(1)},${r.temperature.toFixed(1)},${isBreach(r.humidity, state.minHumidity, state.maxHumidity) ? 'BREACH' : 'SAFE'}`);

  return <main className="shell">
    <header className="topbar">
      <div className="brand"><div className="logo"><Cpu size={18} /></div><span className="wordmark">grain monitor</span></div>
      <Nav />
    </header>
    <Hero eyebrow="Hardware Simulator" title="The circuit, in your browser." subtitle="A virtual ESP32 rig that mirrors the firmware's alert rules — it does not run real firmware.">
      <span className="pill"><span style={{ width: 7, height: 7, borderRadius: 9, background: '#00ca92' }} /> SIMULATED DATA</span>
      <span className="pill">{state.paused ? 'Paused' : 'Live'}</span>
      <span className={`pill ${breach ? 'bad' : 'ok'}`}>{alertLevel}{state.acknowledged && breach ? ' · ACK' : ''}</span>
    </Hero>

    <section className="grid metrics">
      <div className="card"><div className="row metric-label"><Waves size={18} /> Humidity</div><div className="metric-value">{state.humidity.toFixed(1)}%</div><div className={`muted ${breach ? 'bad' : ''}`}>Safe range {state.minHumidity}–{state.maxHumidity}%</div></div>
      <div className="card"><div className="row metric-label"><Thermometer size={18} /> Temperature</div><div className="metric-value">{state.temperature.toFixed(1)}°C</div><div className="muted">Simulated sensor reading</div></div>
      <div className="card"><div className="row metric-label"><ShieldCheck size={18} /> Sensor status</div><div style={{ margin: '17px 0 12px' }}><span className="pill ok">DHT read valid · GPIO 4</span></div><div className="muted">Last reading {last ? fmt(last.timestamp) : 'waiting'}</div></div>
      <div className="card"><div className="row metric-label"><Activity size={18} /> Outputs</div><div style={{ marginTop: 15, display: 'flex', gap: 8, flexWrap: 'wrap' }}><span className={`pill ${outputs.led ? 'bad' : 'ok'}`}>LED {outputs.led ? 'ON' : 'OFF'}</span><span className={`pill ${outputs.buzzer ? 'bad' : outputs.silenced ? 'warn' : 'ok'}`}>Buzzer {outputs.buzzer ? 'ON' : outputs.silenced ? 'SILENCED' : 'OFF'}</span></div><div className="muted" style={{ marginTop: 12 }}>Firmware outputs · GPIO 2 / GPIO 5</div></div>
    </section>

    <section className="grid main-grid">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div><h2 className="heading" style={{ marginBottom: 4 }}>Circuit diagram</h2><div className="muted">ESP32 DevKit · mirrors the Wokwi wiring</div></div>
          <label className="muted">Grain <select aria-label="Grain type" value={grain} onChange={e => setGrain(e.target.value as 'rice' | 'wheat')} style={{ border: '1px solid #e5e7eb', borderRadius: 5, padding: 3 }}><option value="rice">Rice</option><option value="wheat">Wheat</option></select></label>
        </div>
        <HardwareDiagram humidity={state.humidity} temperature={state.temperature} led={outputs.led} buzzer={outputs.buzzer} silenced={outputs.silenced} breach={breach} acknowledged={state.acknowledged} grain={grain} minHumidity={state.minHumidity} maxHumidity={state.maxHumidity} onPressButton={ack} />
      </div>

      <div className="card">
        <h2 className="heading">Controls</h2>
        <div className="muted" style={{ marginBottom: 6 }}>Humidity · {state.humidity.toFixed(1)}%</div>
        <div className="controls">
          <button className="control" onClick={() => sample(state.humidity + 5, state.temperature)}>+5%</button>
          <button className="control" onClick={() => sample(state.humidity - 5, state.temperature)}>−5%</button>
        </div>
        <input aria-label="Humidity slider" type="range" min="0" max="100" step="0.5" value={state.humidity} onChange={e => sample(Number(e.target.value), state.temperature)} style={{ width: '100%', marginTop: 10 }} />
        <div className="muted" style={{ margin: '12px 0 6px' }}>Temperature · {state.temperature.toFixed(1)}°C</div>
        <div className="controls">
          <button className="control" onClick={() => sample(state.humidity, state.temperature + 1)}>+1°</button>
          <button className="control" onClick={() => sample(state.humidity, state.temperature - 1)}>−1°</button>
        </div>
        <input aria-label="Temperature slider" type="range" min="10" max="40" step="0.5" value={state.temperature} onChange={e => sample(state.humidity, Number(e.target.value))} style={{ width: '100%', marginTop: 10 }} />

        <div className="controls" style={{ marginTop: 12 }}>
          <button className="control primary" onClick={() => sample(Math.min(100, state.maxHumidity + 8), state.temperature)}><BellRing size={15} /> Trigger high breach</button>
          <button className="control" onClick={() => sample(Math.max(0, state.minHumidity - 8), state.temperature)}>Trigger low breach</button>
        </div>
        <div className="controls" style={{ marginTop: 8 }}>
          <button className="control" onClick={() => restore()}><RotateCcw size={15} /> Restore safe</button>
          <button className="control" onClick={togglePause}>{state.paused ? <Play size={15} /> : <Pause size={15} />} {state.paused ? 'Resume' : 'Pause'}</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button aria-label="Press ACK button (GPIO 15)" disabled={!breach || state.acknowledged} onClick={ack}
            style={{ width: 110, height: 110, borderRadius: '50%', border: '3px solid #8b6fa3', background: breach && !state.acknowledged ? '#d6c3dd' : '#e5e7eb', color: breach && !state.acknowledged ? '#2a2330' : '#9ca3af', fontWeight: 700, fontSize: 13, cursor: breach && !state.acknowledged ? 'pointer' : 'default' }}>
            Press ACK<br />button<br />(GPIO 15)
          </button>
          <div className="muted" style={{ marginTop: 8 }}>Button only silences the buzzer during a breach;<br />LED stays on and monitoring continues.</div>
        </div>

        <h3 className="heading" style={{ marginTop: 20, marginBottom: 10 }}>Demo humidity range</h3>
        <div className="row">
          <label className="muted">Min %<input aria-label="Minimum safe humidity" className="input" type="number" min="0" max="99" placeholder={String(state.minHumidity)} value={bounds.min} onChange={e => setBounds(v => ({ ...v, min: e.target.value }))} /></label>
          <label className="muted">Max %<input aria-label="Maximum safe humidity" className="input" type="number" min="1" max="100" placeholder={String(state.maxHumidity)} value={bounds.max} onChange={e => setBounds(v => ({ ...v, max: e.target.value }))} /></label>
          <button className="control" style={{ alignSelf: 'end' }} onClick={() => { if (applyBounds(Number(bounds.min === '' ? state.minHumidity : bounds.min), Number(bounds.max === '' ? state.maxHumidity : bounds.max))) setBounds({ min: '', max: '' }); }}>Apply</button>
        </div>
        <p className="muted">Current thresholds: {state.minHumidity}–{state.maxHumidity}% RH.</p>

        <div style={{ marginTop: 14 }}>
          <div className="stat-row"><span className="muted">Humidity</span><span>{state.humidity.toFixed(1)}%</span></div>
          <div className="stat-row"><span className="muted">Temperature</span><span>{state.temperature.toFixed(1)}°C</span></div>
          <div className="stat-row"><span className="muted">Configured range</span><span>{state.minHumidity}–{state.maxHumidity}%</span></div>
          <div className="stat-row"><span className="muted">Firmware state</span><span>{alertLevel}</span></div>
          <div className="stat-row"><span className="muted">Acknowledgment</span><span>{state.acknowledged ? 'Acknowledged' : 'Not acknowledged'}</span></div>
        </div>
      </div>
    </section>

    <section className="grid main-grid section">
      <div className="card">
        <h2 className="heading">GPIO connections</h2>
        <div className="table-wrap"><table><thead><tr><th>Component</th><th>Component pin</th><th>ESP32</th><th>Note</th></tr></thead>
          <tbody>{PINOUT.map((r, i) => <tr key={i}><td>{r.component}</td><td>{r.pin}</td><td className="mono">{r.gpio}</td><td className="muted">{r.note}</td></tr>)}</tbody></table></div>
      </div>
      <div className="card">
        <h2 className="heading">Serial-style log</h2>
        <div className="muted" style={{ marginBottom: 10 }}>Derived from browser readings, formatted like the firmware's serial output</div>
        <pre className="mono" style={{ fontSize: 12, margin: 0, whiteSpace: 'pre-wrap' }}>{log.length ? log.join('\n') : 'No readings yet.'}</pre>
      </div>
    </section>

    <section className="section card">
      <h2 className="heading">Run the real firmware in Wokwi</h2>
      <p className="muted" style={{ lineHeight: 1.6 }}>
        A standalone Wokwi project lives in <code className="mono">firmware/smart-grain-storage/</code>. Open that folder with the Wokwi VS Code extension, or create a project at{' '}
        <a href="https://wokwi.com" target="_blank" rel="noreferrer">wokwi.com</a> and add <code className="mono">smart-grain-storage.ino</code> and <code className="mono">diagram.json</code>,
        install the two libraries from <code className="mono">libraries.txt</code> (DHT sensor library for ESPx, Adafruit Unified Sensor), then run the simulation and open the Serial Monitor at 115200 baud.
      </p>
      <p className="muted" style={{ lineHeight: 1.6 }}><strong>This web simulator re-implements the firmware's alert rules in the browser. It does not run the ESP32 firmware or receive live Wokwi sensor data.</strong></p>
    </section>

    <p className="footer">Hardware Simulator · Browser-generated data only, sharing state with the dashboard. Wokwi firmware runs separately; no data bridge is configured.</p>
  </main>;
}

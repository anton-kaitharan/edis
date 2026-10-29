'use client';

export type HardwareDiagramProps = {
  humidity: number;
  temperature: number;
  led: boolean;
  buzzer: boolean;
  silenced: boolean;
  breach: boolean;
  acknowledged: boolean;
  grain: 'rice' | 'wheat';
  minHumidity: number;
  maxHumidity: number;
  onPressButton: () => void;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function grains(kind: 'rice' | 'wheat') {
  const rand = mulberry32(kind === 'rice' ? 11 : 47);
  const out: { x: number; y: number; rx: number; ry: number; rot: number; fill: string }[] = [];
  const fills = kind === 'rice' ? ['#f3ead3', '#ece0c2', '#f7f0dd'] : ['#d9a441', '#c8912f', '#e2b457'];
  for (let i = 0; i < 140; i++) {
    const x = 62 + rand() * 176;
    const y = 238 + rand() * 168;
    const rot = rand() * 180;
    const rx = kind === 'rice' ? 7 + rand() * 3 : 5.5 + rand() * 2;
    const ry = kind === 'rice' ? 3 + rand() * 1 : 4 + rand() * 1.5;
    out.push({ x, y, rx, ry, rot, fill: fills[i % fills.length] });
  }
  return out;
}

const GRAIN = { rice: grains('rice'), wheat: grains('wheat') };
const T = { fontFamily: "Consolas,'Courier New',monospace" } as const;
const pinLabel = { ...T, fontSize: 11, fill: '#9ca3af' } as const;
const textLabel = { fontSize: 12, fill: '#374151', fontFamily: 'var(--font-pixel)' } as const;

export default function HardwareDiagram({ humidity, temperature, led, buzzer, silenced, breach, acknowledged, grain, minHumidity, maxHumidity, onPressButton }: HardwareDiagramProps) {
  const headspace = humidity > maxHumidity ? 'rgba(255,111,112,0.15)' : humidity < minHumidity ? 'rgba(0,179,240,0.15)' : 'rgba(148,163,184,0.08)';
  return (
    <svg viewBox="0 0 960 540" width="100%" style={{ height: 'auto' }} role="img" aria-label="ESP32 grain storage circuit diagram">
      <defs>
        <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6f70" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6f70" stopOpacity="0" />
        </radialGradient>
        <pattern id="gridp" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#eef2f7" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="960" height="540" fill="#ffffff" />
      <rect x="0" y="0" width="960" height="540" fill="url(#gridp)" />

      {/* ===== Sealed grain container ===== */}
      <text x="46" y="36" style={{ ...textLabel, fontWeight: 700 }}>Sealed grain container — {grain === 'rice' ? 'Rice' : 'Wheat'}</text>
      <rect x="52" y="96" width="196" height="320" rx="14" fill="#fdf6e3" stroke="#e5e7eb" strokeWidth="2" />
      <rect x="52" y="96" width="196" height="140" rx="14" fill={headspace} />
      <rect x="52" y="196" width="196" height="40" fill={headspace} />
      <rect x="44" y="84" width="212" height="20" rx="8" fill="#efe6cf" stroke="#e5e7eb" strokeWidth="2" />
      <line x1="52" y1="108" x2="248" y2="108" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5 4" />
      {GRAIN[grain].map((g, i) => <ellipse key={i} cx={g.x} cy={g.y} rx={g.rx} ry={g.ry} fill={g.fill} transform={`rotate(${g.rot} ${g.x} ${g.y})`} stroke="#00000018" />)}
      <line x1="52" y1="236" x2="248" y2="236" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />

      {/* DHT sensor inside container */}
      <g>
        <rect x="118" y="128" width="64" height="56" rx="4" fill="#3a6ea8" stroke="#274d77" strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={130 + (i % 4) * 14} cy={140 + Math.floor(i / 4) * 12} r="3" fill="#274d77" />)}
        <line x1="128" y1="184" x2="128" y2="198" stroke="#666" strokeWidth="2" />
        <line x1="150" y1="184" x2="150" y2="198" stroke="#666" strokeWidth="2" />
        <line x1="172" y1="184" x2="172" y2="198" stroke="#666" strokeWidth="2" />
        <text x="122" y="209" style={{ ...T, fontSize: 9, fill: '#6b7280' }}>VCC</text>
        <text x="142" y="209" style={{ ...T, fontSize: 9, fill: '#6b7280' }}>DATA</text>
        <text x="166" y="209" style={{ ...T, fontSize: 9, fill: '#6b7280' }}>GND</text>
        <text x="60" y="120" style={{ ...textLabel, fontSize: 11 }}>DHT11 humidity/temperature sensor</text>
        <text x="60" y="134" style={{ ...textLabel, fontSize: 10 }}>(DHT22 part in Wokwi)</text>
        <text x="190" y="152" style={{ ...T, fontSize: 11, fill: '#0f6b4f' }}>{`RH ${humidity.toFixed(1)}%`}</text>
        <text x="190" y="168" style={{ ...T, fontSize: 11, fill: '#0f6b4f' }}>{`${temperature.toFixed(1)} °C`}</text>
      </g>

      {/* ===== ESP32 DevKit ===== */}
      <g>
        <rect x="390" y="140" width="190" height="270" rx="8" fill="#2b3440" stroke="#1f2937" strokeWidth="2" />
        <rect x="440" y="170" width="90" height="70" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="440" y="170" width="90" height="14" fill="#94a3b8" />
        <text x="450" y="214" style={{ ...T, fontSize: 11, fill: '#2b3440' }}>ESP32-</text>
        <text x="450" y="228" style={{ ...T, fontSize: 11, fill: '#2b3440' }}>WROOM</text>
        <rect x="452" y="126" width="66" height="20" rx="3" fill="#9aa0a2" stroke="#767c7e" strokeWidth="1.5" />
        <rect x="464" y="132" width="42" height="8" fill="#5c6264" />
        <text x="452" y="120" style={{ ...textLabel, fontSize: 11 }}>USB</text>
        <text x="414" y="160" style={{ ...T, fontSize: 12, fill: '#fff', fontWeight: 700 }}>ESP32 DevKit</text>
        {/* left header pins */}
        {[262, 292, 322, 352].map((y, i) => (
          <g key={i}>
            <circle cx="402" cy={y} r="4" fill="#c9a94e" stroke="#000" strokeWidth="0.5" />
          </g>
        ))}
        <text x="388" y="258" style={pinLabel}>3V3</text>
        <text x="388" y="318" style={pinLabel}>GND</text>
        <text x="382" y="348" style={pinLabel}>GPIO15</text>
        {/* right header pins */}
        {[262, 292, 322, 352].map(y => <circle key={y} cx="568" cy={y} r="4" fill="#c9a94e" stroke="#000" strokeWidth="0.5" />)}
        <text x="540" y="258" style={pinLabel}>GPIO4</text>
        <text x="540" y="288" style={pinLabel}>GPIO2</text>
        <text x="540" y="318" style={pinLabel}>GPIO5</text>
        <text x="546" y="348" style={pinLabel}>GND</text>
        <circle cx="402" cy="382" r="4" fill="#c9a94e" stroke="#000" strokeWidth="0.5" />
        <text x="388" y="400" style={pinLabel}>GND</text>
      </g>

      {/* ===== Wires ===== */}
      {/* 3V3 -> DHT VCC */}
      <polyline points="402,258 340,258 340,110 128,110 128,128" fill="none" stroke="#c8442e" strokeWidth="2.5" />
      <text x="300" y="250" style={{ ...T, fontSize: 10, fill: '#c8442e' }}>3V3 → DHT VCC</text>
      {/* GPIO4 -> DHT DATA */}
      <polyline points="568,258 640,258 640,88 150,88 150,128" fill="none" stroke="#2e7d4f" strokeWidth="2.5" />
      <text x="610" y="80" style={{ ...T, fontSize: 10, fill: '#2e7d4f' }}>GPIO 4 → DHT DATA</text>
      {/* GND -> DHT GND */}
      <polyline points="402,382 320,382 320,230 172,230 172,198" fill="none" stroke="#222" strokeWidth="2.5" />
      <text x="300" y="376" style={{ ...T, fontSize: 10, fill: '#222' }}>GND → DHT GND</text>
      {/* GPIO2 -> resistor -> LED */}
      <polyline points="568,292 680,292 680,180 740,180" fill="none" stroke="#2e7d4f" strokeWidth="2.5" />
      <text x="640" y="172" style={{ ...T, fontSize: 10, fill: '#2e7d4f' }}>GPIO 2 → 220 Ω → LED</text>
      {/* resistor to GND */}
      <polyline points="790,232 790,330 660,330 660,352 574,352" fill="none" stroke="#222" strokeWidth="2.5" />
      {/* GPIO5 -> buzzer + */}
      <polyline points="568,318 700,318 700,380 740,380" fill="none" stroke="#2e7d4f" strokeWidth="2.5" />
      <text x="640" y="312" style={{ ...T, fontSize: 10, fill: '#2e7d4f' }}>GPIO 5 → Buzzer +</text>
      {/* buzzer - to GND */}
      <polyline points="830,392 850,392 850,352 574,352" fill="none" stroke="#222" strokeWidth="2.5" />
      {/* GPIO15 -> button */}
      <polyline points="402,348 340,348 340,470 760,470 760,452" fill="none" stroke="#2e7d4f" strokeWidth="2.5" />
      <text x="400" y="486" style={{ ...T, fontSize: 10, fill: '#2e7d4f' }}>GPIO 15 → Button</text>
      {/* button to GND */}
      <polyline points="830,452 830,470 402,470 402,386" fill="none" stroke="#222" strokeWidth="2.5" />

      {/* ===== LED + resistor ===== */}
      <g>
        {led && <circle cx="770" cy="168" r="34" fill="url(#ledGlow)" />}
        <path d="M748 180 A22 22 0 0 1 792 180 L792 186 L748 186 Z" className={led ? 'led-on' : ''} fill={led ? '#ff6f70' : '#e5e7eb'} stroke="#d1d5db" strokeWidth="1.5" />
        <line x1="758" y1="186" x2="758" y2="196" stroke="#888" strokeWidth="2" />
        <line x1="782" y1="186" x2="782" y2="196" stroke="#888" strokeWidth="2" />
        <text x="800" y="172" style={{ ...textLabel, fontWeight: led ? 700 : 400, fill: led ? '#b3261e' : '#6b7280' }}>{led ? 'LED ON' : 'LED off'}</text>
        <rect x="750" y="196" width="80" height="20" rx="9" fill="#d9c49a" stroke="#a89263" strokeWidth="1.5" />
        <rect x="762" y="196" width="6" height="20" fill="#c0392b" />
        <rect x="774" y="196" width="6" height="20" fill="#c0392b" />
        <rect x="786" y="196" width="6" height="20" fill="#7b4a1e" />
        <rect x="816" y="196" width="6" height="20" fill="#c8a13c" />
        <text x="752" y="232" style={{ ...textLabel, fontSize: 11 }}>220 Ω</text>
      </g>

      {/* ===== Buzzer ===== */}
      <g>
        {buzzer && <g className="buzz">
          <circle cx="785" cy="386" r="34" fill="none" stroke="#73abc5" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="785" cy="386" r="42" fill="none" stroke="#73abc5" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="785" cy="386" r="50" fill="none" stroke="#73abc5" strokeWidth="1" strokeDasharray="6 6" />
        </g>}
        <circle cx="785" cy="386" r="26" fill="#262a28" stroke="#0d100e" strokeWidth="2" />
        <circle cx="785" cy="386" r="8" fill="#0d100e" />
        <line x1="740" y1="380" x2="756" y2="380" stroke="#888" strokeWidth="2" />
        <line x1="830" y1="392" x2="814" y2="392" stroke="#888" strokeWidth="2" />
        <text x="740" y="368" style={{ ...T, fontSize: 9, fill: '#6b7280' }}>+(2)</text>
        <text x="816" y="406" style={{ ...T, fontSize: 9, fill: '#6b7280' }}>−(1)</text>
        {buzzer && <text x="824" y="370" style={{ ...textLabel, fontWeight: 700, fill: '#73abc5' }}>BUZZING</text>}
        {silenced && <g>
          <text x="824" y="370" style={{ ...textLabel, fontWeight: 700, fill: '#6b7280' }}>SILENCED</text>
          <path d="M846 388 h6 l7 -8 v24 l-7 -8 h-6 z" fill="#8a938c" />
          <line x1="842" y1="382" x2="866" y2="406" stroke="#ff6f70" strokeWidth="2.5" />
        </g>}
        {!buzzer && !silenced && <text x="824" y="370" style={{ ...textLabel, fill: '#6b7280' }}>buzzer off</text>}
        {silenced && <text x="742" y="436" style={{ ...textLabel, fontSize: 11, fill: '#6b7280' }}>(acknowledged)</text>}
      </g>

      {/* ===== Pushbutton ===== */}
      <g onClick={onPressButton} style={{ cursor: 'pointer' }} role="button" aria-label="Press ACK button (GPIO 15)">
        <rect x="758" y="452" width="74" height="30" rx="4" fill="#3a3f3c" stroke="#0d100e" strokeWidth="1.5" />
        <rect x="772" y="452" width="46" height="8" fill="#2a2e2b" />
        <rect x="780" y="436" width="30" height="16" rx="3" className={acknowledged ? 'btn-pressed' : ''} fill={acknowledged ? '#8b6fa3' : '#d6c3dd'} stroke="#8b6fa3" strokeWidth="1.5" />
        <text x="742" y="502" style={textLabel}>ACK button → GPIO 15</text>
        <text x="762" y="516" style={{ ...textLabel, fontSize: 11, fill: '#6b7280' }}>(INPUT_PULLUP, active-low)</text>
      </g>

      {/* ===== Legend ===== */}
      <g>
        <rect x="640" y="24" width="300" height="34" rx="8" fill="#fff" stroke="#e4eae3" />
        <line x1="656" y1="41" x2="680" y2="41" stroke="#c8442e" strokeWidth="3" />
        <text x="686" y="45" style={{ ...textLabel, fontSize: 11 }}>3V3</text>
        <line x1="726" y1="41" x2="750" y2="41" stroke="#222" strokeWidth="3" />
        <text x="756" y="45" style={{ ...textLabel, fontSize: 11 }}>GND</text>
        <line x1="800" y1="41" x2="824" y2="41" stroke="#2e7d4f" strokeWidth="3" />
        <text x="830" y="45" style={{ ...textLabel, fontSize: 11 }}>signal</text>
      </g>

      {breach && <text x="390" y="128" style={{ ...T, fontSize: 12, fill: '#b3261e', fontWeight: 700 }}>ALERT: BREACH{acknowledged ? ' (ACK)' : ''}</text>}
    </svg>
  );
}

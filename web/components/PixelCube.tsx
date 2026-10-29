const COLORS = ['#d6c3dd', '#f8ccd4', '#bfe9db', '#73abc5'];

function face(seed: number) {
  const cells: string[] = [];
  for (let i = 0; i < 16; i++) cells.push(COLORS[(i * 7 + seed * 5) % 4]);
  return cells;
}

const TRANSFORMS = [
  'rotateY(0deg) translateZ(48px)',
  'rotateY(90deg) translateZ(48px)',
  'rotateY(180deg) translateZ(48px)',
  'rotateY(-90deg) translateZ(48px)',
  'rotateX(90deg) translateZ(48px)',
  'rotateX(-90deg) translateZ(48px)',
];

export default function PixelCube() {
  return (
    <div className="cube-float" aria-hidden="true">
      <div className="cube-scene">
        <div className="cube">
          {TRANSFORMS.map((t, i) => (
            <div key={i} className="cube-face" style={{ transform: t }}>
              {face(i).map((c, j) => <div key={j} style={{ background: c }} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

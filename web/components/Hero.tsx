import type { ReactNode } from 'react';
import PixelCube from './PixelCube';

export default function Hero({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children?: ReactNode }) {
  return (
    <section className="hero-wrap">
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />
      <div className="hero">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="display">{title}</h1>
          <p className="hero-sub">{subtitle}</p>
          {children && <div className="row hero-pills">{children}</div>}
        </div>
        <div className="hero-cube"><PixelCube /></div>
      </div>
    </section>
  );
}

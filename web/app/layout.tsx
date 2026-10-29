import './globals.css';
import type { Metadata } from 'next';
import { Inter, Pixelify_Sans, Caveat } from 'next/font/google';

const ui = Inter({ subsets: ['latin'], weight: ['400', '600', '800'], variable: '--font-ui', display: 'swap' });
const pixel = Pixelify_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-pixel', display: 'swap' });
const hand = Caveat({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-hand', display: 'swap' });

export const metadata: Metadata = { title: 'Smart Grain Storage Monitor', description: 'Simulated grain storage humidity and temperature monitoring dashboard' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${ui.variable} ${pixel.variable} ${hand.variable}`}>{children}</body></html>; }

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Dashboard' },
  { href: '/hardware', label: 'Hardware Simulator' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="tabs" aria-label="Pages">
      {tabs.map(t => <Link key={t.href} href={t.href} className={`tab${pathname === t.href ? ' active' : ''}`}>{t.label}</Link>)}
    </nav>
  );
}

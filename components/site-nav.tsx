'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/lab/', label: 'Lab' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export default function SiteNav({ name, initials }: { name: string; initials: string }) {
  const pathname = usePathname() || '/';
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 50);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        button.current?.focus();
      }
    };
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', dismiss);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', dismiss);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={header} data-compact={compact} data-menu-open={menuOpen} data-home={pathname === '/'}>
      <div className="nav-rail">
        <a href="/" className="brand" aria-label={name + ' home'}>
          <span className="brand-mark" aria-hidden="true">{initials}</span>
          <span className="brand-name">{name}</span>
        </a>
        <button
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          type="button"
          ref={button}
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}<i aria-hidden="true" />
        </button>
        <nav className="primary-nav" id="main-navigation" aria-label="Primary">
          {nav.map(({ href, label }) => {
            const active = pathname === href.slice(0, -1) || pathname.startsWith(href);
            return (
              <a href={href} key={href} aria-current={active ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                {label}{label === 'Contact' && <span className="diagonal" aria-hidden="true" />}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

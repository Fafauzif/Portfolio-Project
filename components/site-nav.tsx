'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import './site-nav.css';

const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/lab/', label: 'Lab' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

const navy = [38, 51, 73];
const slate = [92, 108, 134];
const paper = [245, 242, 233];
const ink = [37, 43, 54];

function unit(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smooth(start: number, end: number, point: number) {
  const fraction = unit((point - start) / (end - start));
  return fraction * fraction * (3 - 2 * fraction);
}

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map(channel => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const inkLuminance = luminance(ink);

function palette(light: number) {
  const coolPhase = light <= 0.46;
  const from = coolPhase ? navy : slate;
  const to = coolPhase ? slate : paper;
  const amount = coolPhase ? light / 0.46 : (light - 0.46) / 0.54;
  const rgb = from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
  const surfaceLuminance = luminance(rgb);
  let foreground = '#000';
  if ((surfaceLuminance + 0.05) / (inkLuminance + 0.05) >= 4.5) foreground = 'var(--ink)';
  else if (1.05 / (surfaceLuminance + 0.05) >= 4.5) foreground = '#fff';
  return { surface: `rgb(${rgb.join(' ')})`, foreground };
}

export default function SiteNav({ name, initials }: { name: string; initials: string }) {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const rail = header.current;
    if (!rail) return;
    const hero = pathname === '/' ? document.querySelector<HTMLElement>('[data-hero-root]') : null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkCase = Boolean(document.querySelector("main[data-category='builds']"));
    let staticHeroEnd = 0;
    let previous = '';
    let readingFrame = 0;
    let scrollRange = 0;

    function updateReadingProgress() {
      readingFrame = 0;
      rail?.style.setProperty('--reading-progress', String(scrollRange ? unit(window.scrollY / scrollRange) : 0));
    }

    function scheduleReadingProgress() {
      if (!reduced.matches && !readingFrame) readingFrame = requestAnimationFrame(updateReadingProgress);
    }

    function update() {
      if (!rail) return;
      const fold = !reduced.matches ? hero?.dataset.foldProgress : undefined;
      const followingFold = Boolean(fold);
      const scrollProgress = unit(window.scrollY / 168);
      const progress = followingFold ? unit(Number(fold)) : scrollProgress;
      const signature = `${progress.toFixed(3)}:${reduced.matches}:${followingFold}:${window.scrollY >= staticHeroEnd}`;
      if (signature === previous) return;
      previous = signature;

      const shape = reduced.matches ? 0 : followingFold
        ? smooth(0.03, 0.79, progress)
        : smooth(0.06, 1, progress);
      const fill = hero || darkCase ? 1 : unit(window.scrollY / 28);
      const light = followingFold
        ? smooth(0.15, 0.72, progress)
        : hero ? Number(window.scrollY >= staticHeroEnd)
        : darkCase ? (reduced.matches ? Number(window.scrollY > 90) : smooth(0.12, 1, progress))
        : 1;
      const { surface, foreground } = palette(light);

      rail.style.setProperty('--nav-shape', shape.toFixed(4));
      rail.style.setProperty('--nav-fill', fill.toFixed(3));
      rail.style.setProperty('--nav-surface', surface);
      rail.style.setProperty('--nav-ink', foreground);
      rail.dataset.navProgress = progress.toFixed(3);
      rail.dataset.compact = String(shape >= 0.995);
    }

    function refreshGeometry() {
      staticHeroEnd = hero ? Math.max(1, hero.offsetTop + hero.offsetHeight - 64) : 0;
      previous = '';
      const scroller = document.scrollingElement;
      scrollRange = scroller ? Math.max(0, scroller.scrollHeight - scroller.clientHeight) : 0;
      update();
      scheduleReadingProgress();
    }

    function onScroll() {
      if (reduced.matches || !hero?.hasAttribute('data-fold-progress')) update();
      scheduleReadingProgress();
    }

    const foldObserver = hero ? new MutationObserver(update) : null;
    if (hero) foldObserver?.observe(hero, { attributes: true, attributeFilter: ['data-fold-progress'] });
    const geometryObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refreshGeometry) : null;
    geometryObserver?.observe(document.body);
    if (hero) geometryObserver?.observe(hero);

    refreshGeometry();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', refreshGeometry, { passive: true });
    window.addEventListener('pageshow', refreshGeometry);
    reduced.addEventListener('change', refreshGeometry);
    return () => {
      cancelAnimationFrame(readingFrame);
      foldObserver?.disconnect();
      geometryObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', refreshGeometry);
      window.removeEventListener('pageshow', refreshGeometry);
      reduced.removeEventListener('change', refreshGeometry);
    };
  }, [pathname]);

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
    <header
      className="site-header"
      ref={header}
      data-compact="false"
      data-menu-open={menuOpen}
      data-home={pathname === '/'}
      onBlur={event => {
        if (menuOpen && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
      }}
    >
      <div className="nav-rail">
        <span className="nav-reading-progress" aria-hidden="true" />
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
          <span>{menuOpen ? 'Close' : 'Menu'}</span><i aria-hidden="true" />
        </button>
        <nav className="primary-nav" id="main-navigation" aria-label="Primary">
          {nav.map(({ href, label }) => {
            const exact = pathname === href.slice(0, -1) || pathname === href;
            const current = exact ? 'page' : pathname.startsWith(href) ? 'location' : undefined;
            return (
              <a href={href} key={href} aria-current={current} onClick={() => setMenuOpen(false)}>
                {label}{label === 'Contact' && <span className="diagonal" aria-hidden="true" />}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

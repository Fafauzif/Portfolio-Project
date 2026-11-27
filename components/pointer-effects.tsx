"use client";

import { useEffect, useRef } from "react";
import "./pointer-effects.css";

const supportedPointer = "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)";
const zones = "[data-pointer-zone='cover'],[data-pointer-zone='lab'],[data-pointer-zone='button']";
const quietTargets = "input, textarea, select, [contenteditable]:not([contenteditable='false']), dialog[open]";
const lightIdleMs = 380;

function lightTone(target: Element) {
  if (target.closest('[data-pointer-tone="navy"]')) return 'navy';
  const hero = target.closest<HTMLElement>('[data-hero-stage]')?.closest<HTMLElement>('[data-hero-root]');
  return hero && Number(hero.dataset.foldProgress ?? '0') < .42 ? 'navy' : 'paper';
}

/** Lights the surface at the native cursor's position while a fine pointer moves. */
export function PointerEffects() {
  const surface = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const light = surface.current;
    if (!light) return;

    const media = window.matchMedia(supportedPointer);
    let zone: HTMLElement | null = null;
    let pending: { target: Element; x: number; y: number } | null = null;
    let frame = 0;
    let idle = 0;

    function clearZone() {
      zone?.removeAttribute("data-pointer-active");
      zone = null;
    }

    function hideLight() {
      light?.removeAttribute("data-pointer-light-active");
    }

    function clear() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
      window.clearTimeout(idle);
      hideLight();
      clearZone();
    }

    function paint() {
      frame = 0;
      if (!light || !pending) return;
      const { target, x, y } = pending;
      pending = null;
      if (!target.isConnected) return;
      const element = target.closest<HTMLElement>(zones);
      const rect = element?.getBoundingClientRect();
      window.clearTimeout(idle);

      if (target.closest("[data-dragging='true']")) {
        clear();
        return;
      }

      idle = window.setTimeout(clear, lightIdleMs);
      if (!element || !rect?.width || !rect.height) {
        clearZone();
        light.style.setProperty("--pointer-light-x", `${x}px`);
        light.style.setProperty("--pointer-light-y", `${y}px`);
        light.dataset.pointerTone = lightTone(target);
        light.dataset.pointerLightActive = "true";
        return;
      }

      hideLight();
      if (zone !== element) clearZone();
      element.style.setProperty("--pointer-x", `${(x - rect.left) * element.clientWidth / rect.width}px`);
      element.style.setProperty("--pointer-y", `${(y - rect.top) * element.clientHeight / rect.height}px`);
      if (zone !== element) {
        element.dataset.pointerActive = "true";
        zone = element;
      }
    }

    function move(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || event.pointerType === "touch" || event.buttons !== 0 || target.closest(quietTargets)) {
        clear();
        return;
      }

      pending = { target, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function leave(event: PointerEvent) {
      const next = event.relatedTarget;
      if (!(next instanceof Node)) clear();
      else if (zone && !zone.contains(next)) clearZone();
    }

    function stop() {
      clear();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointerdown", clear);
      window.removeEventListener("pointercancel", clear);
      window.removeEventListener("keydown", clear);
      window.removeEventListener("scroll", clear, true);
      window.removeEventListener("blur", clear);
      window.removeEventListener("pagehide", clear);
    }

    function listen() {
      if (!media.matches) {
        stop();
        return;
      }
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerout", leave, { passive: true });
      window.addEventListener("pointerdown", clear, { passive: true });
      window.addEventListener("pointercancel", clear, { passive: true });
      window.addEventListener("keydown", clear, { passive: true });
      window.addEventListener("scroll", clear, { passive: true, capture: true });
      window.addEventListener("blur", clear);
      window.addEventListener("pagehide", clear);
    }

    listen();
    media.addEventListener("change", listen);
    return () => {
      stop();
      media.removeEventListener("change", listen);
    };
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const prints = document.querySelectorAll('[data-reveal-print]');
    const marks = document.querySelectorAll<SVGElement>('[data-ink-reveal]');
    if (!prints.length && !marks.length) return;

    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const flightLayout = window.matchMedia('(min-width: 960px)');
    const arrivals = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio < .18) continue;
        observer.unobserve(entry.target);
        if (entry.target instanceof SVGElement) {
          entry.target.dataset.inkState = 'shown';
          continue;
        }
        if (flightLayout.matches && CSS.supports('grid-template-columns', 'subgrid')
          && entry.target.hasAttribute('data-fold-landing')) continue;
        const image = entry.target.querySelector<HTMLImageElement>(':scope > img');
        if (!motion.matches || !image?.animate) continue;

        const animation = image.animate([
          { translate: '0 6px', scale: '1.04' },
          { translate: '0 0', scale: '1' },
        ], { duration: 380, easing: 'cubic-bezier(.18,.65,.23,1)' });
        arrivals.add(animation);
        void animation.finished.then(() => arrivals.delete(animation), () => arrivals.delete(animation));
      }
    }, { threshold: .18 });

    function cancelArrivals() {
      for (const animation of arrivals) animation.cancel();
      arrivals.clear();
    }

    prints.forEach(print => observer.observe(print));
    marks.forEach(mark => {
      mark.dataset.inkState = motion.matches ? 'waiting' : 'shown';
      observer.observe(mark);
    });
    motion.addEventListener('change', cancelArrivals);
    return () => {
      observer.disconnect();
      marks.forEach(mark => delete mark.dataset.inkState);
      cancelArrivals();
      motion.removeEventListener('change', cancelArrivals);
    };
  }, []);

  return <span ref={surface} aria-hidden="true" data-pointer-light />;
}

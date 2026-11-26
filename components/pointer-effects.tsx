"use client";

import { useEffect, useRef } from "react";
import "./pointer-effects.css";

const supportedPointer = "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)";
const zones = "[data-pointer-zone='paper'],[data-pointer-zone='cover'],[data-pointer-zone='lab'],[data-pointer-zone='button']";
const quietTargets = "input, textarea, select, [contenteditable]:not([contenteditable='false']), dialog[open]";
const traceIdleMs = 340;

/** Moves the small ink ring and one opted-in surface while a fine pointer is moving. */
export function PointerEffects() {
  const tracer = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mark = tracer.current;
    if (!mark) return;

    const media = window.matchMedia(supportedPointer);
    let zone: HTMLElement | null = null;
    let pending: { element: HTMLElement | null; x: number; y: number } | null = null;
    let frame = 0;
    let idle = 0;

    function clearZone() {
      zone?.removeAttribute("data-pointer-active");
      zone = null;
    }

    function hideTracer() {
      mark?.removeAttribute("data-pointer-live");
    }

    function clear() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
      window.clearTimeout(idle);
      hideTracer();
      clearZone();
    }

    function paint() {
      frame = 0;
      if (!mark || !pending) return;
      const { element, x, y } = pending;
      pending = null;

      const left = x + 27 < window.innerWidth ? x + 15 : Math.max(0, x - 22);
      const top = y + 24 < window.innerHeight ? y + 11 : Math.max(0, y - 21);
      mark.toggleAttribute("data-pointer-glide", mark.hasAttribute("data-pointer-live"));
      mark.style.setProperty("--trace-x", `${left}px`);
      mark.style.setProperty("--trace-y", `${top}px`);
      mark.dataset.pointerLive = "true";
      window.clearTimeout(idle);
      idle = window.setTimeout(hideTracer, traceIdleMs);

      if (!element?.isConnected || element.closest("[data-pointer-paused], [data-dragging='true']")) {
        clearZone();
        return;
      }

      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
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

      pending = { element: target.closest<HTMLElement>(zones), x: event.clientX, y: event.clientY };
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
    if (!prints.length) return;

    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const arrivals = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio < .18) continue;
        observer.unobserve(entry.target);
        const image = entry.target.querySelector<HTMLImageElement>(':scope > img');
        if (!motion.matches || !image?.animate) continue;

        const animation = image.animate([
          { translate: '-0.8% 0.95%', scale: '1.055' },
          { translate: '0 0', scale: '1' },
        ], { duration: 490, easing: 'cubic-bezier(.18,.65,.23,1)' });
        arrivals.add(animation);
        void animation.finished.then(() => arrivals.delete(animation), () => arrivals.delete(animation));
      }
    }, { threshold: .18 });

    function cancelArrivals() {
      for (const animation of arrivals) animation.cancel();
      arrivals.clear();
    }

    prints.forEach(print => observer.observe(print));
    motion.addEventListener('change', cancelArrivals);
    return () => {
      observer.disconnect();
      cancelArrivals();
      motion.removeEventListener('change', cancelArrivals);
    };
  }, []);

  return <span ref={tracer} aria-hidden="true" data-pointer-tracer />;
}

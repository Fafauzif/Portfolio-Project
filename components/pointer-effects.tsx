"use client";

import { useEffect } from "react";
import "./pointer-effects.css";

const supportedPointer = "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)";
const zones = "[data-pointer-zone='paper'],[data-pointer-zone='cover'],[data-pointer-zone='lab'],[data-pointer-zone='button']";

/** Paints one opted-in surface per frame while a fine pointer is moving. */
export function PointerEffects() {
  useEffect(() => {
    const media = window.matchMedia(supportedPointer);
    let zone: HTMLElement | null = null;
    let pending: { element: HTMLElement; x: number; y: number } | null = null;
    let frame = 0;

    function clearZone() {
      zone?.removeAttribute("data-pointer-active");
      zone = null;
    }

    function clear() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
      clearZone();
    }

    function paint() {
      frame = 0;
      if (!pending) return;
      const { element, x, y } = pending;
      pending = null;
      if (!element.isConnected || element.closest("[data-pointer-paused], [data-dragging='true']")) {
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
      if (event.pointerType === "touch" || event.buttons !== 0) {
        clear();
        return;
      }

      const element = event.target instanceof Element ? event.target.closest<HTMLElement>(zones) : null;
      if (!element) {
        clear();
        return;
      }
      pending = { element, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function leave(event: PointerEvent) {
      const next = event.relatedTarget;
      if (!(next instanceof Node) || (zone && !zone.contains(next))) clear();
    }

    function stop() {
      clear();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointerdown", clear);
      window.removeEventListener("pointercancel", clear);
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

  return null;
}

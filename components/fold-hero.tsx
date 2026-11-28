"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FoldMarks, RegisterMark } from "./print-marks";
import styles from "./fold-hero.module.css";

type FoldHeroProps = {
  cover: string;
  name: string;
  role: string;
  headline?: string;
  workHref?: string;
};

const defaultHeadline = "What happens after the deck?";
const posterScale = 0.74;
// The paper keeps its own pace: a hard flick moves the page, not the fold. These
// three numbers decide how much of the transition a reader is guaranteed to see.
const foldRate = 1.4;
const foldEase = 0.07;
const foldSnap = 0.0012;

function unit(value: number) {
  return Math.min(1, Math.max(0, value));
}

function ramp(value: number, start = 0, finish = 1) {
  const t = unit((value - start) / (finish - start));
  return t * t * (3 - 2 * t);
}

function headlineLines(headline: string) {
  const clean = headline.replace(/\s+/g, " ").trim() || defaultHeadline;
  const preferredBreak = clean.search(/\s+(?:after|at)\s+the\b/i);
  if (preferredBreak > 0) {
    return [clean.slice(0, preferredBreak), clean.slice(preferredBreak).trim()];
  }

  const words = clean.split(/\s+/);
  const split = Math.max(1, Math.ceil(words.length / 2));
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
}

export default function FoldHero({
  cover,
  name,
  role,
  headline = defaultHeadline,
  workHref = "#selected",
}: FoldHeroProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const flight = useRef<HTMLDivElement>(null);
  const flightImage = useRef<HTMLImageElement>(null);
  const [first, second] = headlineLines(headline);
  const finalSpace = second.lastIndexOf(" ");
  const last = finalSpace >= 0 ? second.slice(0, finalSpace) : "";
  const emphatic = second.slice(finalSpace + 1);
  const question = emphatic.endsWith("?");

  useEffect(() => {
    const scene = root.current;
    const frame = stage.current;
    const carry = flight.current;
    const carryImage = flightImage.current;
    if (!scene || !frame || !carry || !carryImage) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px)");
    const landing = document.querySelector<HTMLElement>("[data-fold-landing]");
    const poster = landing?.querySelector("img");
    const projectLink = landing?.closest("a");
    const desktop = window.matchMedia("(min-width: 960px)");
    const canTurnPaper = window.CSS?.supports("transform-style", "preserve-3d")
      && window.CSS.supports("overflow", "clip")
      && window.CSS.supports("position", "sticky");
    let animationFrame = 0;
    let start = 0;
    let track = 1;
    let dirtyGeometry = true;
    let previousProgress = -1;
    let disposed = false;
    let printAspect = 0;
    let frameWidth = 1;
    let frameHeight = 1;
    let restHeight = 1;
    let settledAt = Infinity;
    let shown = -1;
    let lastPaint = 0;
    let destination: { left: number; top: number; width: number; height: number } | undefined;
    let frameLeft = 0;
    let flightStart = 0;
    let flightEnd = 0;

    function clearFlight() {
      scene?.removeAttribute("data-fold-flight");
      scene?.removeAttribute("data-fold-cleared");
      landing?.removeAttribute("data-print-in-flight");
    }

    function paint(now?: number) {
      animationFrame = 0;
      if (!scene || !frame || !carry || !carryImage) return;
      if (motion.matches || !canTurnPaper) {
        scene.removeAttribute("data-fold-ready");
        scene.removeAttribute("data-fold-progress");
        scene.removeAttribute("data-fold-art-visible");
        scene.removeAttribute("data-fold-cta-passed");
        clearFlight();
        previousProgress = -1;
        settledAt = Infinity;
        shown = -1;
        lastPaint = 0;
        return;
      }

      if (!scene.hasAttribute("data-fold-ready")) scene.dataset.foldReady = "true";
      const scroll = window.scrollY;
      if (dirtyGeometry) {
        const frameBox = frame.getBoundingClientRect();
        frameLeft = frameBox.left;
        frameWidth = frame.clientWidth;
        frameHeight = frame.clientHeight;
        start = scene.getBoundingClientRect().top + scroll;
        track = Math.max(1, scene.clientHeight - frameHeight);
        restHeight = compact.matches ? Math.min(1, frameWidth / (frameHeight * 4 / 3)) : 1;
        printAspect = poster?.naturalHeight ? poster.naturalWidth / poster.naturalHeight : 0;
        destination = undefined;
        if (desktop.matches && landing && poster?.naturalWidth) {
          const target = landing.getBoundingClientRect();
          destination = { left: target.left, top: target.top + scroll, width: target.width, height: target.height };
          flightStart = start + 0.76 * track;
          const section = landing.closest("section");
          const anchorTop = (section?.getBoundingClientRect().top ?? target.top) + scroll;
          const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          flightEnd = Math.max(flightStart + 1, Math.min(anchorTop - scrollPadding - 4, destination.top - 0.38 * frameHeight));
          carry.style.width = `${frameWidth * posterScale}px`;
          carry.style.height = `${frameHeight * posterScale}px`;
          carryImage.style.width = `${poster.naturalWidth}px`;
          carryImage.style.height = `${poster.naturalHeight}px`;
        }
        previousProgress = -1;
        dirtyGeometry = false;
      }

      const p = unit((scroll - start) / track);
      const time = now ?? performance.now();
      const dt = lastPaint ? Math.min(0.05, Math.max(0.004, (time - lastPaint) / 1000)) : 0;
      lastPaint = time;
      // Once the stage has mostly left the viewport there is nothing left to show,
      // so the paper stops pretending to animate and takes the reader's position.
      const stageLeaving = frame.getBoundingClientRect().bottom < frameHeight * 0.25;
      // The print is already in the air here; the sheet has to finish turning under
      // it, so the cap opens up instead of lagging behind the handoff.
      const chasing = Boolean(destination) && scroll >= flightStart;

      if (shown < 0 || stageLeaving) shown = p;
      else {
        const distance = p - shown;
        if (Math.abs(distance) <= foldSnap) shown = p;
        else {
          const step = distance * (1 - Math.exp(-dt / foldEase));
          const limit = distance > 0 ? foldRate * dt * (chasing ? 6 : 1) : Infinity;
          shown = unit(shown + (Math.abs(step) > limit ? limit : step));
        }
      }
      const g = shown;

      // One beat at a time: tip the sheet, hold it, then turn it over. Ramps this
      // heavily overlapped read as one smear when the page is moving quickly.
      const fold = ramp(g, 0.05, 0.32) * (1 - ramp(g, 0.48, 0.72));
      const expose = ramp(g, 0.46, 0.76);
      const identify = ramp(g, 0.005, 0.2);
      const size = 1 - (1 - posterScale) * ramp(g, 0.06, 0.78);
      const shorten = 1 - (1 - restHeight) * ramp(g, 0.42, 0.8);

      if (Math.abs(previousProgress - g) > 0.0001) {
        const punctuation = ramp(g, 0, 0.052) * (1 - ramp(g, 0.11, 0.27));
        const corner = ramp(g, 0.035, 0.13) * (1 - ramp(g, 0.28, 0.46));
        scene.style.setProperty("--question-tip", `${9 * punctuation}deg`);
        scene.style.setProperty("--question-lift", `${-0.052 * punctuation}em`);
        scene.style.setProperty("--corner-lift", `${-8 * corner}px`);
        scene.style.setProperty("--corner-turn", `${-10 * corner}deg`);
        scene.style.setProperty("--page-ink", ramp(g, 0.07, 0.42).toFixed(4));
        scene.style.setProperty("--fold-light", identify.toFixed(4));
        scene.style.setProperty("--press-opacity", (0.79 * ramp(g, 0.12, 0.59)).toFixed(4));
        scene.style.setProperty("--press-shift", `${-66 + 66 * expose}px`);
        scene.style.setProperty("--press-offset", `${-96 + 96 * expose}px`);
        scene.style.setProperty("--compact-drift", `${compact.matches ? 5 * expose : 0}vw`);
        scene.style.setProperty("--top-fold", `${-23 * fold}deg`);
        scene.style.setProperty("--bottom-fold", `${37 * fold}deg`);
        scene.style.setProperty("--sheet-pitch", `${-7 * fold}deg`);
        scene.style.setProperty("--sheet-yaw", `${180 * expose}deg`);
        scene.style.setProperty("--sheet-roll", `${-5 * fold}deg`);
        scene.style.setProperty("--sheet-scale", size.toFixed(4));
        scene.style.setProperty("--sheet-vertical-scale", (size * shorten).toFixed(4));
        if (compact.matches && printAspect) {
          const printWidth = Math.max(frameWidth, frameHeight * shorten * printAspect);
          scene.style.setProperty("--paper-print-size", `${printWidth}px ${printWidth / (printAspect * shorten)}px`);
        } else {
          scene.style.removeProperty("--paper-print-size");
        }
        scene.dataset.foldProgress = g.toFixed(3);
        previousProgress = g;
      }
      scene.toggleAttribute("data-fold-art-visible", g > 0.15);
      scene.toggleAttribute("data-fold-cta-passed", g >= 0.32);
      const carrying = Boolean(destination && scroll >= flightStart && scroll < flightEnd
        && !projectLink?.contains(document.activeElement));
      if (destination && carrying && poster) {
        const slide = ramp(scroll, flightStart, Math.min(start + track, flightEnd));
        const drop = ramp(scroll, flightStart, flightEnd);
        const width = frameWidth * posterScale;
        const height = frameHeight * posterScale;
        const fromX = frameLeft + (frameWidth - width) / 2;
        const fromY = (frameHeight - height) / 2;
        const x = fromX + (destination.left - fromX) * slide;
        const y = fromY + (destination.top - scroll - fromY) * drop - 54 * drop * (1 - drop);
        const scaleX = 1 + (destination.width / width - 1) * slide;
        const scaleY = 1 + (destination.height / height - 1) * drop;
        carry.style.transform = `translate3d(${x}px,${y}px,0) scale(${scaleX},${scaleY})`;

        const coverScale = Math.max(width * scaleX / poster.naturalWidth, height * scaleY / poster.naturalHeight);
        const cropX = (width - poster.naturalWidth * coverScale / scaleX) / 2;
        const cropY = (height - poster.naturalHeight * coverScale / scaleY) / 2;
        carryImage.style.transform = `translate3d(${cropX}px,${cropY}px,0) scale(${coverScale / scaleX},${coverScale / scaleY})`;
      }
      scene.toggleAttribute("data-fold-flight", carrying);
      scene.toggleAttribute("data-fold-cleared", Boolean(destination && scroll >= flightStart));
      landing?.toggleAttribute("data-print-in-flight", carrying);
      const end = destination ? flightEnd : start + track;
      settledAt = scroll >= end ? end : Infinity;
      // Keep the clock running until the paper has caught up with the page.
      if (Math.abs(p - shown) > foldSnap) schedule();
    }

    function schedule() {
      if (!disposed && !animationFrame) animationFrame = requestAnimationFrame(paint);
    }

    function onScroll() {
      if (!motion.matches && canTurnPaper && window.scrollY < settledAt) schedule();
    }

    function remeasure() {
      dirtyGeometry = true;
      schedule();
    }

    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(remeasure) : null;
    observer?.observe(scene);
    observer?.observe(frame);
    if (landing) observer?.observe(landing);
    const selectedHeading = landing?.closest("section")?.querySelector(".selected-head");
    if (selectedHeading) observer?.observe(selectedHeading);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    poster?.addEventListener("load", remeasure);
    motion.addEventListener("change", remeasure);
    compact.addEventListener("change", remeasure);
    desktop.addEventListener("change", remeasure);
    document.addEventListener("focusin", schedule);
    void document.fonts?.ready.then(remeasure);
    paint();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      clearFlight();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      poster?.removeEventListener("load", remeasure);
      motion.removeEventListener("change", remeasure);
      compact.removeEventListener("change", remeasure);
      desktop.removeEventListener("change", remeasure);
      document.removeEventListener("focusin", schedule);
    };
  }, []);

  const imageStyle = { "--fold-art": `url(${JSON.stringify(cover)})` } as CSSProperties;

  return (
    <section className={styles.root} ref={root} aria-labelledby="paper-headline" data-hero-root style={imageStyle}>
      <div className={styles.stage} ref={stage} data-hero-stage>
        <div className={styles.backdrop} aria-hidden="true" />
        <FoldMarks />
        <div className={styles.castShadow} aria-hidden="true" />
        <h1 className={styles.sheet} id="paper-headline" data-hero-sheet aria-label={[first, second].filter(Boolean).join(" ")}>
          <span className={`${styles.panel} ${styles.upper}`}>
            <span className={styles.ink}><span className={styles.line}>{first}</span></span>
            <span className={styles.verso} aria-hidden="true"><span /></span>
          </span>{second && " "}
          <span className={`${styles.panel} ${styles.lower}`}>
            <span className={styles.ink}>
              <span className={styles.line}>
                {last}{last && " "}<em className={last ? styles.emphasisLine : undefined}>
                  {question ? emphatic.slice(0, -1) : emphatic}
                  {question && <span className={styles.question} data-hero-question>?</span>}
                </em>
              </span>
              <span className={styles.corner} aria-hidden="true" />
            </span>
            <span className={styles.verso} aria-hidden="true"><span /></span>
          </span>
        </h1>
        <RegisterMark className="hero-register" variant="crop" />
        <div className={styles.actions}>
          <p className={styles.byline}><strong>{name}</strong><span>{role}</span></p>
          <a className={styles.workLink} href={workHref} data-hero-cta>See selected work <span aria-hidden="true" /></a>
        </div>
      </div>
      <div className={styles.flyingPrint} ref={flight} data-hero-flight aria-hidden="true">
        <img src={cover} ref={flightImage} alt="" decoding="async" fetchPriority="low" />
      </div>
    </section>
  );
}

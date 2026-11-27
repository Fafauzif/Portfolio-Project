"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FoldMarks } from "./print-marks";
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
    const canFly = window.CSS?.supports("grid-template-columns", "subgrid");
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
    let destination: { left: number; top: number; width: number; height: number } | undefined;
    let frameLeft = 0;
    let flightStart = 0;
    let flightEnd = 0;

    function clearFlight() {
      scene?.removeAttribute("data-fold-flight");
      scene?.removeAttribute("data-fold-cleared");
      landing?.removeAttribute("data-print-in-flight");
    }

    function paint() {
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
        if (desktop.matches && canFly && landing && poster?.naturalWidth) {
          const target = landing.getBoundingClientRect();
          destination = { left: target.left, top: target.top + scroll, width: target.width, height: target.height };
          flightStart = start + 0.76 * track;
          flightEnd = Math.max(flightStart + 0.32 * frameHeight, destination.top - 0.38 * frameHeight);
          carry.style.width = `${frameWidth * posterScale}px`;
          carry.style.height = `${frameHeight * posterScale}px`;
          carryImage.style.width = `${poster.naturalWidth}px`;
          carryImage.style.height = `${poster.naturalHeight}px`;
        }
        previousProgress = -1;
        dirtyGeometry = false;
      }

      const p = unit((scroll - start) / track);
      const fold = ramp(p, 0.06, 0.36) * (1 - ramp(p, 0.43, 0.7));
      const expose = ramp(p, 0.25, 0.71);
      const identify = ramp(p, 0.005, 0.24);
      const size = 1 - (1 - posterScale) * ramp(p, 0.04, 0.72);
      const shorten = 1 - (1 - restHeight) * ramp(p, 0.35, 0.74);

      if (Math.abs(previousProgress - p) > 0.0001) {
        const punctuation = ramp(p, 0, 0.052) * (1 - ramp(p, 0.11, 0.27));
        const corner = ramp(p, 0.035, 0.13) * (1 - ramp(p, 0.28, 0.46));
        scene.style.setProperty("--question-tip", `${9 * punctuation}deg`);
        scene.style.setProperty("--question-lift", `${-0.052 * punctuation}em`);
        scene.style.setProperty("--corner-lift", `${-8 * corner}px`);
        scene.style.setProperty("--corner-turn", `${-10 * corner}deg`);
        scene.style.setProperty("--page-ink", ramp(p, 0.07, 0.42).toFixed(4));
        scene.style.setProperty("--fold-light", identify.toFixed(4));
        scene.style.setProperty("--press-opacity", (0.66 * ramp(p, 0.14, 0.64)).toFixed(4));
        scene.style.setProperty("--press-shift", `${-46 + 46 * expose}px`);
        scene.style.setProperty("--press-offset", `${-84 + 84 * expose}px`);
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
        scene.dataset.foldProgress = p.toFixed(3);
        previousProgress = p;
      }
      scene.toggleAttribute("data-fold-art-visible", p > 0.15);
      scene.toggleAttribute("data-fold-cta-passed", p >= 0.32);
      const carrying = Boolean(destination && scroll >= flightStart && scroll < flightEnd
        && !projectLink?.contains(document.activeElement));
      if (destination && carrying && poster) {
        const slide = ramp(scroll, flightStart, start + track);
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

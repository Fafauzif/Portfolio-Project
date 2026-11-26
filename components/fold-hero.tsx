"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./fold-hero.module.css";

type FoldHeroProps = {
  cover: string;
  role: string;
  headline?: string;
  workHref?: string;
};

const defaultHeadline = "I don’t stop at the deck.";
const revealEnd = 0.76;
const landingScale = 0.74;

function unit(value: number) {
  return Math.min(1, Math.max(0, value));
}

function ramp(value: number, start = 0, finish = 1) {
  const t = unit((value - start) / (finish - start));
  return t * t * (3 - 2 * t);
}

function headlineLines(headline: string) {
  const clean = headline.trim() || defaultHeadline;
  const preferredBreak = clean.search(/\s+at\s+the\b/i);
  if (preferredBreak > 0) {
    return [clean.slice(0, preferredBreak), clean.slice(preferredBreak).trim()];
  }

  const words = clean.split(/\s+/);
  const split = Math.max(1, Math.ceil(words.length / 2));
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
}

function measureLanding(landing: HTMLElement, height: number, scroll: number, start: number, track: number, compact: boolean) {
  const targetY = landing.getBoundingClientRect().top + scroll;
  const begin = start + revealEnd * track;
  return {
    begin,
    finish: Math.max(begin + 0.3 * height, targetY - (compact ? 0.82 : 0.7) * height),
  };
}

export default function FoldHero({
  cover,
  role,
  headline = defaultHeadline,
  workHref = "#selected",
}: FoldHeroProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const proxy = useRef<HTMLDivElement>(null);
  const proxyImage = useRef<HTMLImageElement>(null);
  const [first, second] = headlineLines(headline);
  const firstWords = first.split(" ");
  const leadWord = firstWords.pop();
  const lead = firstWords.join(" ");
  const secondWords = second.split(" ");
  const emphatic = secondWords.pop();
  const last = secondWords.join(" ");

  useEffect(() => {
    const scene = root.current;
    const frame = stage.current;
    const carried = proxy.current;
    const carriedImage = proxyImage.current;
    if (!scene || !frame || !carried || !carriedImage) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px)");
    const landing = document.querySelector<HTMLElement>("[data-fold-landing]");
    const canTurnPaper = window.CSS?.supports("transform-style", "preserve-3d")
      && window.CSS.supports("overflow", "clip")
      && window.CSS.supports("position", "sticky");
    let animationFrame = 0;
    let start = 0;
    let track = 1;
    let flight = { begin: 0, finish: 1 };
    let dirtyGeometry = true;
    let previousProgress = -1;
    let disposed = false;
    let arrivalActive = false;
    let imageSize: { width: number; height: number } | undefined;
    let frameWidth = 1;
    let frameHeight = 1;
    let restHeight = 1;

    function release() {
      if (!arrivalActive) return;
      landing?.removeAttribute("data-fold-arrival");
      scene?.removeAttribute("data-fold-flight");
      arrivalActive = false;
    }

    function paint() {
      animationFrame = 0;
      if (!scene || !frame || !carried || !carriedImage) return;
      if (motion.matches || !canTurnPaper) {
        release();
        scene.removeAttribute("data-fold-ready");
        scene.removeAttribute("data-fold-progress");
        scene.removeAttribute("data-fold-complete");
        scene.removeAttribute("data-fold-dark-controls");
        scene.removeAttribute("data-fold-unfolded");
        scene.removeAttribute("data-fold-art-visible");
        scene.removeAttribute("data-fold-chrome-passed");
        previousProgress = -1;
        return;
      }

      if (!scene.hasAttribute("data-fold-ready")) scene.dataset.foldReady = "true";
      const scroll = window.scrollY;
      if (dirtyGeometry) {
        frameWidth = frame.clientWidth;
        frameHeight = frame.clientHeight;
        start = scene.getBoundingClientRect().top + scroll - (parseFloat(getComputedStyle(frame).top) || 0);
        track = Math.max(1, scene.clientHeight - frameHeight);
        restHeight = compact.matches ? Math.min(1, frameWidth / (frameHeight * 4 / 3)) : 1;
        carried.style.width = `${frameWidth * landingScale}px`;
        carried.style.height = `${frameHeight * landingScale * restHeight}px`;
        if (carriedImage.naturalWidth && carriedImage.naturalHeight) {
          imageSize = { width: carriedImage.naturalWidth, height: carriedImage.naturalHeight };
          carriedImage.style.width = `${imageSize.width}px`;
          carriedImage.style.height = `${imageSize.height}px`;
        }
        if (landing) flight = measureLanding(landing, frameHeight, scroll, start, track, compact.matches);
        previousProgress = -1;
        dirtyGeometry = false;
      }

      const p = unit((scroll - start) / track);
      const fold = ramp(p, 0.06, 0.36) * (1 - ramp(p, 0.43, 0.7));
      const expose = ramp(p, 0.25, 0.71);
      const identify = ramp(p, 0.005, 0.24);
      const size = 1 - (1 - landingScale) * ramp(p, 0.04, 0.72);
      const shorten = 1 - (1 - restHeight) * ramp(p, 0.35, 0.74);
      const phase = ramp(scroll, flight.begin, flight.finish);
      const focusedProject = landing?.closest("a, article")?.contains(document.activeElement)
        || landing?.contains(document.activeElement);
      const inFlight = Boolean(landing && !focusedProject &&
        scroll >= flight.begin && scroll < flight.finish);
      const hasLanded = Boolean(landing && p >= revealEnd && scroll >= flight.finish);

      let carryPose: string | undefined;
      let imagePose: string | undefined;
      if (landing && inFlight) {
        const from = frame.getBoundingClientRect();
        const to = landing.getBoundingClientRect();
        const width = from.width * landingScale;
        const height = from.height * landingScale * restHeight;
        const x = from.left + (from.width - width) / 2;
        const y = from.top + (from.height - height) / 2;

        const scaleX = 1 + (to.width / width - 1) * phase;
        const scaleY = 1 + (to.height / height - 1) * phase;
        const drop = compact.matches ? phase ** 3 : phase;
        carryPose = `translate3d(${x + (to.left - x) * phase}px,${y + (to.top - y) * drop}px,0) scale(${scaleX},${scaleY})`;

        // Counter the frame's two-axis resize so the print keeps its proportions.
        if (imageSize) {
          const displayWidth = width * scaleX;
          const displayHeight = height * scaleY;
          const coverScale = Math.max(displayWidth / imageSize.width, displayHeight / imageSize.height);
          const left = (displayWidth - imageSize.width * coverScale) / (2 * scaleX);
          const top = (displayHeight - imageSize.height * coverScale) / (2 * scaleY);
          imagePose = `translate3d(${left}px,${top}px,0) scale(${coverScale / scaleX},${coverScale / scaleY})`;
        }
      }

      if (Math.abs(previousProgress - p) > 0.0001) {
        scene.style.setProperty("--page-ink", ramp(p, 0.07, 0.42).toFixed(4));
        scene.style.setProperty("--fold-light", identify.toFixed(4));
        scene.style.setProperty("--top-fold", `${-23 * fold}deg`);
        scene.style.setProperty("--bottom-fold", `${37 * fold}deg`);
        scene.style.setProperty("--sheet-pitch", `${-7 * fold}deg`);
        scene.style.setProperty("--sheet-yaw", `${180 * expose}deg`);
        scene.style.setProperty("--sheet-roll", `${-5 * fold}deg`);
        scene.style.setProperty("--sheet-scale", size.toFixed(4));
        scene.style.setProperty("--sheet-vertical-scale", (size * shorten).toFixed(4));
        scene.style.setProperty("--fold-progress", p.toFixed(4));
        if (compact.matches && imageSize) {
          const aspect = imageSize.width / imageSize.height;
          const printWidth = Math.max(frameWidth, frameHeight * shorten * aspect);
          scene.style.setProperty("--paper-print-size", `${printWidth}px ${printWidth / (aspect * shorten)}px`);
        } else {
          scene.style.removeProperty("--paper-print-size");
        }
        scene.dataset.foldProgress = p.toFixed(3);
        previousProgress = p;
      }
      if (landing && carryPose) {
        carried.style.transform = carryPose;
        if (imagePose) carriedImage.style.transform = imagePose;
        carried.toggleAttribute("data-fold-image-ready", Boolean(imagePose));
        if (!arrivalActive) {
          landing.dataset.foldArrival = "receiving";
          scene.dataset.foldFlight = "true";
          arrivalActive = true;
        }
      } else {
        release();
      }

      scene.toggleAttribute("data-fold-complete", hasLanded);
      scene.toggleAttribute("data-fold-dark-controls", p > 0.27);
      scene.toggleAttribute("data-fold-art-visible", p > 0.15);
      scene.toggleAttribute("data-fold-unfolded", p >= revealEnd);
      scene.toggleAttribute("data-fold-chrome-passed", scroll > start + track + frameHeight * 0.12);
    }

    function schedule() {
      if (!disposed && !animationFrame) animationFrame = requestAnimationFrame(paint);
    }

    function remeasure() {
      dirtyGeometry = true;
      schedule();
    }

    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(remeasure) : null;
    observer?.observe(scene);
    observer?.observe(frame);
    if (landing) observer?.observe(landing);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    carriedImage.addEventListener("load", remeasure);
    motion.addEventListener("change", remeasure);
    compact.addEventListener("change", remeasure);
    void document.fonts?.ready.then(remeasure);
    paint();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      release();
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      carriedImage.removeEventListener("load", remeasure);
      motion.removeEventListener("change", remeasure);
      compact.removeEventListener("change", remeasure);
    };
  }, []);

  const imageStyle = { "--fold-art": `url(${JSON.stringify(cover)})` } as CSSProperties;

  return (
    <section className={styles.root} ref={root} aria-labelledby="paper-headline" data-hero-root style={imageStyle}>
      <div className={styles.stage} ref={stage} data-hero-stage>
        <div className={styles.backdrop} aria-hidden="true" />
        <div className={styles.castShadow} aria-hidden="true" />
        <h1 className={styles.sheet} id="paper-headline" data-hero-sheet aria-label={[first, second].filter(Boolean).join(" ")}>
          <span className={`${styles.panel} ${styles.upper}`}>
            <span className={styles.ink}><span className={styles.line}>{lead}{lead && " "}<span className={lead ? styles.leadWord : undefined}>{leadWord}</span></span></span>
            <span className={styles.verso} aria-hidden="true"><span /></span>
          </span>{second && " "}
          <span className={`${styles.panel} ${styles.lower}`}>
            <span className={styles.ink}>
              <span className={styles.line}>{last}{last && " "}<em>{emphatic}</em></span>
              <span className={styles.corner} aria-hidden="true" />
            </span>
            <span className={styles.verso} aria-hidden="true"><span /></span>
          </span>
        </h1>
        <div className={styles.margin}>
          <p className={styles.role}>{role}</p>
          <div className={styles.actions}>
            <a className={styles.workLink} href={workHref}>See selected work <span aria-hidden="true" /></a>
            <p className={styles.scrollCue} aria-hidden="true" data-fold-scroll-cue>Scroll to unfold<span /></p>
          </div>
        </div>
      </div>
      <div className={styles.proxy} ref={proxy} data-hero-proxy aria-hidden="true">
        <img className={styles.proxyImage} ref={proxyImage} src={cover} alt="" decoding="async" fetchPriority="low" />
      </div>
    </section>
  );
}

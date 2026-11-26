"use client";

import { useEffect, useState } from "react";
import styles from "./case-study.module.css";

type Heading = { id: string; title: string };

export default function CaseSections({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const sections = headings.map(heading => document.getElementById(heading.id)).filter(element => element !== null);
    let animationFrame = 0;
    let lastId: string | undefined;

    function syncActive() {
      animationFrame = 0;
      const readingLine = Math.min(200, Math.max(120, window.innerHeight * .25));
      let current: string | undefined;
      for (const section of sections) {
        if (section.getBoundingClientRect().top >= readingLine) break;
        current = section.id;
      }
      if (lastId === current) return;
      lastId = current;
      setActive(current);
    }

    function moveReadingLine() {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(syncActive);
    }

    syncActive();
    window.addEventListener("scroll", moveReadingLine, { passive: true });
    window.addEventListener("resize", moveReadingLine);
    return () => {
      window.removeEventListener("scroll", moveReadingLine);
      window.removeEventListener("resize", moveReadingLine);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [headings]);

  const links = headings.map(({ id, title }) => (
    <a href={`#${id}`} key={id} aria-current={active === id ? "location" : undefined}>{title}</a>
  ));

  return (
    <>
      <nav className={`${styles.sections} ${styles.desktopSections}`} aria-label="On this page">
        <p>In this case</p>
        {links}
      </nav>
      <details className={styles.mobileSections}>
        <summary>In this case</summary>
        <nav className={styles.sections} aria-label="On this page">{links}</nav>
      </details>
    </>
  );
}

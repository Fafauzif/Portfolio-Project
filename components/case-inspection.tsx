"use client";

import { useEffect, useState } from "react";
import styles from "./case-inspection.module.css";

const views = [
  { label: "Full artifact", scale: 1, x: 0, y: 0 },
  { label: "Detail A", scale: 1.52, x: 25, y: 42 },
  { label: "Detail B", scale: 1.52, x: 75, y: 54 },
] as const;

export default function CaseInspection({ cover, imageAlt, transitionName }: { cover: string; imageAlt: string; transitionName: string }) {
  const [current, setCurrent] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const view = views[current];
  useEffect(() => setEnhanced(true), []);

  return (
    <figure className={styles.inspection}>
      <div className={styles.frame} data-case-cover style={{ viewTransitionName: transitionName }}>
        <img
          src={cover}
          alt={imageAlt}
          width={1200}
          height={900}
          fetchPriority="high"
          style={{ transform: `scale(${view.scale})`, transformOrigin: `${view.x}% ${view.y}%` }}
        />
      </div>
      <figcaption className={styles.controls} data-enhanced={enhanced}>
        <span>Artifact view</span>
        <div role="group" aria-label="Inspect artifact">
          {views.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={current === index}
              onClick={() => setCurrent(index)}>
              {item.label}
            </button>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

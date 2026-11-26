"use client";

import { useState, type CSSProperties } from "react";
import styles from "./lab.module.css";

export default function LabFoldStudy() {
  const [expanded, setExpanded] = useState(false);
  const [angle, setAngle] = useState(-24);
  const [fold, setFold] = useState(57);

  const pose = {
    "--fold-view": `${angle}deg`,
    "--fold-opening": `${fold}deg`,
  } as CSSProperties;

  return (
    <section className={styles.study} aria-labelledby="fold-study-title">
      <noscript><style>{`.${styles.study} [data-fold-interaction]{display:none}`}</style></noscript>
      <div className={styles.studyCopy}>
        <p className={styles.kicker}>Spatial study</p>
        <h2 id="fold-study-title">Where the paper bends</h2>
        <p>One cut sheet, two creases.<span data-fold-interaction> Change the angle and see when the lines stop reading as one image.</span></p>
        <button type="button" data-fold-interaction aria-expanded={expanded} aria-controls="fold-study-controls" onClick={() => setExpanded((current) => !current)}>
          {expanded ? "Hide controls" : "Open fold controls"} <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>

        <div className={styles.studyControls} id="fold-study-controls" hidden={!expanded}>
          <label className={styles.range} htmlFor="lab-view-angle">
            <span>View angle <span className={styles.rangeValue} aria-hidden="true">{angle}°</span></span>
            <input id="lab-view-angle" type="range" min="-55" max="55" value={angle} aria-valuetext={`${angle} degrees`} onChange={(event) => setAngle(Number(event.currentTarget.value))} />
          </label>
          <label className={styles.range} htmlFor="lab-fold-angle">
            <span>Fold angle <span className={styles.rangeValue} aria-hidden="true">{fold}°</span></span>
            <input id="lab-fold-angle" type="range" min="0" max="92" value={fold} aria-valuetext={`${fold} degrees`} onChange={(event) => setFold(Number(event.currentTarget.value))} />
          </label>
        </div>
      </div>
      <div className={styles.studyArt} role="img" aria-label="A pale blue sheet with concentric cobalt contours, folded backward and forward along two parallel creases." style={pose}>
        <div className={styles.studyObject} aria-hidden="true">
          <div className={styles.panelLeft}><span /></div>
          <div className={styles.panelMiddle}><span /></div>
          <div className={styles.panelRight}><span /></div>
        </div>
      </div>
    </section>
  );
}

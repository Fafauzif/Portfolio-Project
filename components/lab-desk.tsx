"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./lab.module.css";

type View = "desk" | "list";

export type LabPiece = {
  slug: string;
  title: string;
  summary: string;
  kind: string;
  cover: string;
  imageAlt: string;
  inspectCover?: string;
  inspectAlt?: string;
  year: string | number;
};

type Position = { x: number; y: number; level: number };
type Gesture = {
  slug: string;
  pointerId: number;
  origin: Position;
  clientX: number;
  clientY: number;
  width: number;
  height: number;
  element: HTMLElement;
  latest: Position;
};

const defaultLayout = [
  { x: .04, y: .06, tilt: -6 },
  { x: .50, y: .025, tilt: 4 },
  { x: .965, y: .13, tilt: -4 },
  { x: .06, y: .96, tilt: 5 },
  { x: .52, y: .89, tilt: -4 },
  { x: .962, y: 1, tilt: 5 },
];

const compactLayout = [
  { x: .04, y: .01, tilt: -4 },
  { x: .96, y: .025, tilt: 4 },
  { x: .045, y: .46, tilt: -3 },
  { x: .96, y: .49, tilt: 4 },
  { x: .04, y: .956, tilt: -3 },
  { x: .96, y: .965, tilt: 4 },
];

const labels: Record<string, string> = {
  "3d": "Spatial study",
  build: "Digital build",
  "webapp": "Web app",
  "web-app": "Web app",
  extension: "Browser extension",
  experimental: "Experiment",
  tool: "Tool",
  prototype: "Prototype",
  editorial: "Editorial study",
  automation: "Automation",
};

const describe = (kind: string) => labels[kind] ?? kind.replace(/-/g, " ");
const clamp = (value: number) => Math.max(0, Math.min(1, value));

function writePosition(element: HTMLElement, position: Position) {
  element.style.setProperty("--lab-x", String(position.x));
  element.style.setProperty("--lab-y", String(position.y));
}

export default function LabDesk({ pieces }: { pieces: LabPiece[] }) {
  const [view, setView] = useState<View | null>(null);
  const [compact, setCompact] = useState(false);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [active, setActive] = useState<LabPiece | null>(null);
  const [ink, setInk] = useState(0);
  const [notice, setNotice] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const drawFrame = useRef<number | null>(null);
  const layer = useRef(10);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      if (drawFrame.current !== null) cancelAnimationFrame(drawFrame.current);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active && dialog && !dialog.open) dialog.showModal();
  }, [active]);

  const currentView = view ?? (compact ? "list" : "desk");
  const layout = compact ? compactLayout : defaultLayout;
  const deskPieces = pieces.slice(0, defaultLayout.length);
  const inspectCover = active?.inspectCover ?? active?.cover;
  const inspectAlt = active?.inspectCover ? (active.inspectAlt ?? active.imageAlt) : active?.imageAlt;

  function origin(slug: string, index: number) {
    const layoutPosition = layout[index];
    const centeredX = deskPieces.length === 5
      ? compact
        ? (index === 4 ? .50 : layoutPosition.x)
        : ([.04, .50, .965, .23, .75][index] ?? layoutPosition.x)
      : layoutPosition.x;
    return positions[slug] ?? { x: centeredX, y: layoutPosition.y, level: index + 1 };
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, slug: string, index: number) {
    if (!event.isPrimary || event.button !== 0 || gesture.current) return;
    const stage = stageRef.current;
    const element = event.currentTarget.closest<HTMLElement>("[data-lab-piece]");
    if (!stage || !element) return;

    const start = { ...origin(slug, index), level: ++layer.current };
    const width = Math.max(1, stage.clientWidth - element.offsetWidth - 24);
    const height = Math.max(1, stage.clientHeight - element.offsetHeight - 24);
    gesture.current = {
      slug, pointerId: event.pointerId, origin: start, latest: start, element,
      clientX: event.clientX, clientY: event.clientY, width, height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    element.dataset.dragging = "true";
    element.style.setProperty("--lab-level", String(start.level));
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag.latest = {
      x: clamp(drag.origin.x + (event.clientX - drag.clientX) / drag.width),
      y: clamp(drag.origin.y + (event.clientY - drag.clientY) / drag.height),
      level: drag.origin.level,
    };
    if (drawFrame.current === null) {
      drawFrame.current = requestAnimationFrame(() => {
        if (gesture.current) writePosition(gesture.current.element, gesture.current.latest);
        drawFrame.current = null;
      });
    }
  }

  function stopDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drawFrame.current !== null) cancelAnimationFrame(drawFrame.current);
    drawFrame.current = null;
    gesture.current = null;
    delete drag.element.dataset.dragging;
    writePosition(drag.element, drag.latest);
    setPositions((previous) => ({ ...previous, [drag.slug]: drag.latest }));
  }

  function moveByKey(event: KeyboardEvent<HTMLButtonElement>, piece: LabPiece, index: number) {
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    };
    const movement = steps[event.key];
    if (!movement) return;

    event.preventDefault();
    const start = origin(piece.slug, index);
    const step = event.shiftKey ? .16 : .045;
    const next = {
      x: clamp(start.x + movement[0] * step),
      y: clamp(start.y + movement[1] * step),
      level: ++layer.current,
    };
    setPositions((previous) => ({ ...previous, [piece.slug]: next }));
    const direction = event.key.slice(5).toLowerCase();
    setNotice(next.x === start.x && next.y === start.y
      ? `${piece.title} is at the edge of the desk.`
      : `Moved ${piece.title} ${direction}.`);
  }

  function resetDesk() {
    setPositions({});
    layer.current = 10;
    setNotice("The desk is reset.");
  }

  function inspect(piece: LabPiece, trigger: HTMLButtonElement) {
    opener.current = trigger;
    setInk(0);
    setActive(piece);
  }

  function finishInspect() {
    setActive(null);
    opener.current?.focus({ preventScroll: true });
    opener.current = null;
  }

  if (!pieces.length) {
    return (
      <section className={styles.empty} aria-labelledby="lab-title">
        <h2 id="lab-title">Workbench</h2>
        <p>The table is clear. Find the finished pieces in <a href="/work/">Selected Work</a>.</p>
      </section>
    );
  }

  return (
    <section className={styles.workbench} aria-labelledby="lab-title">
      <div className={styles.workbenchHead}>
        <div>
          <h2 id="lab-title">Workbench</h2>
          <p id="lab-help">
            {currentView === "desk"
              ? "Move the prints by their handles, or inspect a cover."
              : "Open a project to see how the experiment worked."}
          </p>
        </div>
        <div className={styles.tabs} role="group" aria-label="Workbench layout">
          <button type="button" aria-pressed={currentView === "desk"} onClick={() => setView("desk")}>Desk</button>
          <button type="button" aria-pressed={currentView === "list"} onClick={() => setView("list")}>List</button>
        </div>
      </div>

      <div className={styles.workbenchModes} data-view={view ?? "auto"}>
        <div className={styles.deskView}>
          <div className={styles.desk} ref={stageRef} aria-label="Draggable project prints">
            <span className={styles.deskMark} aria-hidden="true">+</span>
            {deskPieces.map((piece, index) => {
              const position = origin(piece.slug, index);
              const vars = {
                "--lab-x": position.x,
                "--lab-y": position.y,
                "--lab-level": position.level,
                "--lab-turn": `${layout[index].tilt}deg`,
              } as CSSProperties;
              return (
                <article key={piece.slug} className={styles.print} style={vars} data-lab-piece={piece.slug}>
                  <button type="button" className={styles.printImage} aria-label={`Inspect ${piece.title}`}
                    onClick={(event) => inspect(piece, event.currentTarget)}>
                    {/* Local, pre-sized WebP covers also work when exported to static HTML. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={piece.cover} width="660" height="440" alt={piece.imageAlt} draggable={false} />
                  </button>
                  <div className={styles.printCaption}>
                    <a href={`/work/${piece.slug}/`} title={piece.title}>{piece.title}</a>
                    <button type="button" className={styles.move}
                      aria-label={`Move ${piece.title}`} aria-describedby="lab-keyboard-help"
                      onPointerDown={(event) => startDrag(event, piece.slug, index)}
                      onPointerMove={moveDrag}
                      onPointerUp={stopDrag}
                      onPointerCancel={stopDrag}
                      onLostPointerCapture={stopDrag}
                      onKeyDown={(event) => moveByKey(event, piece, index)}
                      onClick={(event) => {
                        if (event.detail === 0) setNotice("Use arrow keys to move the print.");
                      }}>
                      <span aria-hidden="true">⠿</span> Move
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <div className={styles.deskFoot}>
            <span>{deskPieces.length}{pieces.length > deskPieces.length ? ` of ${pieces.length}` : ""} on the desk</span>
            <button type="button" onClick={resetDesk}>Reset positions</button>
          </div>
          <span className={styles.screenReader} id="lab-keyboard-help">Use arrow keys to move. Hold Shift to move farther.</span>
          <span className={styles.screenReader} role="status">{notice}</span>
        </div>

        <ul className={styles.index}>
          {pieces.map((piece, index) => (
            <li key={piece.slug}>
              <a href={`/work/${piece.slug}/`} className={styles.indexLink}>
                <span className={styles.indexArt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={piece.cover} width="398" height="264" alt="" loading={index < deskPieces.length ? "eager" : "lazy"} />
                </span>
                <span className={styles.indexCopy}>
                  <span className={styles.indexKind}>{describe(piece.kind)} <span>·</span> {piece.year}</span>
                  <strong>{piece.title}</strong>
                  <span>{piece.summary}</span>
                </span>
                <span className={`${styles.indexArrow} diagonal`} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialogRef} className={styles.inspector} aria-labelledby="artifact-title" onClose={finishInspect}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        {active && (
          <div className={styles.inspectorInner}>
            <header>
              <p className={styles.kicker}>{describe(active.kind)}</p>
              <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()} autoFocus>Close <span aria-hidden="true">×</span></button>
            </header>
            <div className={styles.inkStudy} style={{ "--ink-amount": ink / 100 } as CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={inspectCover} width="960" height="640" alt={inspectAlt} />
              {ink > 0 && (
                <span aria-hidden="true" className={styles.channels}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={inspectCover} alt="" width="960" height="640" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={inspectCover} alt="" width="960" height="640" />
                </span>
              )}
            </div>
            <div className={styles.inspectorCopy}>
              <div>
                <h2 id="artifact-title">{active.title}</h2>
                <p>{active.summary}</p>
                <a href={`/work/${active.slug}/`}>Read the case study <span className="diagonal" aria-hidden="true" /></a>
              </div>
              <label className={styles.range} htmlFor="lab-ink-amount">
                <span>Ink separation <span className={styles.rangeValue} aria-hidden="true">{ink}%</span></span>
                <input id="lab-ink-amount" type="range" min="0" max="100" value={ink} aria-valuetext={`${ink}%`} onChange={(event) => setInk(Number(event.currentTarget.value))} />
              </label>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

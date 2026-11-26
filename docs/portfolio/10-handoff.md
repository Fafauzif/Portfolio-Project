# 10 — Handoff

**Read this first, then `00-positioning.md`, then `reference/`.** This document exists because the SIGNAL homepage was built and Fauzi's verdict on it was: *"this looks ass but I don't wanna argue with you or anything. I mean no further revisions here."* No further revisions were made in that direction. A new session picks it up from here.

Everything below is organised so you can decide what to keep without re-litigating what already happened.

---

## 1. What exists right now

A working, tested, single-page homepage at the repo root.

| Path | What it is |
|---|---|
| `index.html` | The whole homepage. Instrument panel (100svh) + report below + sheet dialog |
| `assets/css/tokens.css` | Palette, type, motion, the `--u` scale. **Source of truth for colour** |
| `assets/css/base.css` | Font faces, reset, type utilities, mask primitive, reduced motion |
| `assets/css/instrument.css` | Top bar, panel, bands, scale, needle, readout, card, metrics, meter |
| `assets/css/report.css` | Proof strip, work rows, ledger table, contact, footer |
| `assets/css/sheet.css` | The sheet that grows out of the card |
| `assets/js/metrics.js` | Pure maths: `springStep`, `freqToUnit`, `nearestStation`, `meterGeometry` |
| `assets/js/data.js` | 14 placeholder stations, 3 bands. Every figure invented |
| `assets/js/engine.js` | One rAF loop, one spring, wheel/drag/keys |
| `assets/js/instrument.js` | Builds the scale, bands, readout, meter, static burst |
| `assets/js/sheet.js` | `insetFromRects` + open/close with clip-path from the card's real rect |
| `assets/js/report.js` | Mask reveals + count-up |
| `assets/js/main.js` | Boot and wiring |
| `assets/fonts/` | 6 self-hosted woff2, 120KB total |
| `test/` | 25 tests, all passing. `node --test` |
| `tools/serve.mjs` | 40-line dependency-free static server |

**Run it:**

```bash
cd "/c/Users/fauzi/OneDrive/Documents/GitHub/Portfolio-Project"
node tools/serve.mjs          # → http://127.0.0.1:4321/
node --test                   # 25 tests
```

Committed as `c7de67d` on `main`. Nothing has been pushed.

### What is genuinely good in it, and worth carrying forward

Do not throw these away with the design:

- **The token architecture.** Dark-side and printed-side token sets, no colour crossing the seam, every contrast ratio measured and annotated in the file. A test computes the ratios from the stylesheet, so a dimmed token fails CI rather than shipping an unreadable word.
- **The spring engine.** One rAF loop, per-property behaviour, `dt` capped at `.033`, settle at `1e-3`. It survived a hostile audit and is correct now.
- **`insetFromRects` + the sheet.** The sheet grows out of the card's actual `getBoundingClientRect()` and closes back into it. This is the single best mechanic on the page.
- **Masks, not fades.** Content arrives by sliding out of a mask. No opacity fade on any content.
- **The `--u` unit.** One number drives every margin, size and radius; desktop and mobile each have one.
- **The honesty marker.** `PLACEHOLDER FIGURES` in the panel foot, so an invented number can never be mistaken for a claim.

---

## 2. Why it doesn't land (my read — not Fauzi's words)

He did not itemise the problem, so this is my diagnosis. Treat it as an argument, not a verdict; he may disagree with all of it.

**The metaphor carries navigation but not meaning.** You tune to a station and the station is called "Still, We Grow" with invented metrics. A tuning instrument is only impressive if there is something on the frequency. With 14 placeholder names it is a toy: you interact, you learn nothing. Folio Room works because the twelve books have titles, authors, notes, covers and scores — the objects are *real enough to browse*.

**There is no material anywhere.** All four references ground themselves in stuff you can see: warm paper and hardcover books; a wall of worn VHS boxes with photographed art; a sea, mist, petals, real site screenshots. This build is hairlines, mono labels and one radial gradient on a flat navy field. That is a **dashboard**, not an editorial page. "Editorial feel" was Fauzi's own phrase and it is the thing most absent from the result.

**The palette is a lighting palette, not a paper palette.** `#091540 / #1B2CC1 / #7692FF / #ABD2FA` is a beautiful ramp, but it is what a lit screen looks like, not what a printed page looks like. Combined with cobalt glow and mono micro-labels it pushed the page further toward sci-fi console. This matters because of an unresolved tension in the brief: **editorial + 3D wizardry + this blue.** Those can coexist — but only if typography, content and photography do the editorial work while the blue is the *ground*, not the subject. Right now the blue is the subject.

**The first screen tells a visitor nothing about him.** A recruiter giving it ten seconds sees a radio scale, three invented numbers and an empty card. Nothing says *marketing strategist*. Nothing shows work. The most human facts about him — TEDxUI Director of Marketing, five competition placings, a 32-page strategy — are all below the fold or absent.

**Too much micro-label.** Uppercase 11px mono with `.09em` tracking appears on nearly every line: bands, counter, frequencies, kicker, metric labels, meter labels, hints, footer, ledger heads. In the references this is a rare accent. Here it is the default voice, which reads as instrumentation rather than authorship.

**The artifact card is empty.** The most promising object on the page — a document's cover, tilted, with page-edge stripes — has a title and the words "STRATEGY · 32 PP" on it. It is a placeholder pretending to be an artifact.

**The meter is decorative.** Its maths is honest (it refuses to invent a baseline) but visually it is a full-width bar with a notch in it. Nobody reads it as "signal against noise floor."

---

## 3. What Fauzi actually wants

### In his words, across the whole conversation

- "I love how everything is so dynamic and there's genuine good animations and stuff" — on `openrouter.ai` and `treg.to`.
- "I like the book library concept but I want something else, something related to me."
- "I like the color blue."
- "Think we can make the SIGNAL kind of thing?"
- "Sounds so interesting, I'll prolly want this to be a multiple page porto."
- "Make it really great, use as many subagents as needed, have critique subagents, have animation specialists."
- "Just use placeholders for info and stuff."
- On the finished build: **"this looks ass."**

### Settled decisions (do not re-ask)

1. **Multi-page portfolio.** Case-study pages will exist at their own URLs later. The homepage is the first build.
2. **The homepage scrolls.** The instrument fills the first `100svh`, then an editorial report document follows below. Framed as "tuning ends, the report begins."
3. **Bands both filter the tuner and act as navigation.** `About` and `CV` pinned top-right.
4. **Real-looking broadcast frequencies** (88.1–107.1 on a scale of 87.5–108.0), not channel numbers.
5. **No custom cursor.** (Explicitly rejected — Leon Vasari's ring cursor is out.)
6. **Placeholder content is fine for now.** No case-study pages this round.
7. **Palette:** `#091540` navy · `#1B2CC1` cobalt · `#7692FF` periwinkle · `#ABD2FA` sky. **He chose this and it should be kept** unless he says otherwise. Four blues = one ramp.
8. **Type:** Newsreader (serif) · Inter Tight (grotesque) · Geist Mono (data). All self-hosted.
9. **Stack:** hand-coded static HTML/CSS/JS, no framework, no build step. GitHub Pages eventually.
10. **Positioning line:** *"I don't stop at the deck."*
11. **Motion law:** masks and clips only — zero opacity fades on content.

---

## 4. What to keep, demote, or drop

### Keep, as-is
The token/test discipline, the spring engine, the sheet mechanic, the mask rule, the `--u` scale, the honesty marker, the palette.

### Demote
**The tuning instrument from "the whole homepage" to "a component."** The band filter and the needle are good ideas. The 14-frequency printed scale as the hero object is what reads as a machine. A 200px strip that selects among real projects would keep the concept and lose the console.

### Drop, or rebuild from scratch
- The station names as invented fiction with no content behind them.
- The three-metric + meter block as the primary content of the first screen.
- Anything that puts instrument chrome above the answer to "who is this and what has he done."

---

## 5. Open questions that only Fauzi can settle

Ask these before building anything, one at a time:

1. **What specifically made it look bad?** He has not said. A screenshot with three things circled would be worth more than any amount of guessing. Do not assume my §2 is right.
2. **Is SIGNAL still wanted at all**, or was "looks ass" a verdict on the metaphor too? There is a real difference between "the tuner is a good idea badly dressed" and "I don't want a tuner."
3. **Photography.** Does he have any? The references lean on real images heavily. Without photographs of him, of events, of documents, an editorial page is very hard. If he has none, that is a decision to make early, not late.
4. **Does the homepage need to show a project on the first screen?** That single answer changes the whole layout.
5. **Domain, and the availability line** — still open from `README.md`.

---

## 6. Three directions, in the order I would try them

1. **Keep SIGNAL, put real content in it.** Stations become actual projects with real one-line results. The scale becomes a thin rail; the readout becomes the hero; the card holds a real document cover. Least rework, keeps the tested engine.
2. **Demote SIGNAL to a signature.** The band filter and needle survive as a compact project selector. Above it, editorial-led: real type at scale, a real photograph, one sentence about who he is. The blue ramp stays as the ground.
3. **Borrow Noa's structure outright.** A photographed ground (not a sea — Jakarta, a stage, a workshop) with a sentence whose nouns are the controls, and cards that tilt and open. The craft rules in `08` are already extracted for exactly this.

**Whatever you pick: one idea, executed completely.** That is the law all four references obey and the reason they feel like worlds. The current build has a metaphor, a report document, a ledger table, a sheet dialog and a meter — five ideas, none of them finished.

---

## 7. Read next

| Doc | Why |
|---|---|
| `00-positioning.md` | The strategy and the honesty constraint. Still valid |
| `08-craft-rules.md` | **The practices.** Read before planning anything |
| `reference/` | The four prompts themselves. The specificity is the lesson |
| `01-site-architecture.md` | Page map and the 90-second path. Still valid |
| `02-content-inventory.md` · `03-case-studies.md` | The real material that has to end up on the page |
| `09-concept-signal.md` | The SIGNAL spec. Valid as a description of what was built; **do not treat it as an approved direction** |
| `05`, `06` | Superseded. Component grammar and perf/a11y budget are the useful parts |

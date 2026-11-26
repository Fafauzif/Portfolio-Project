# 09 — Concept: SIGNAL

**The direction.** Replaces the "Ink & Signal" direction in `05`/`06` and the old 3D moments. Built to the rules in `08-craft-rules.md`.

---

## 1. The concept

> **A tuning instrument. You tune across a scale to find a signal.**

His whole job is making signal out of noise — that's what a communications strategist *does*. Every claim in his LinkedIn is a signal-over-baseline claim: +154% above historical benchmark, 62.2% reach from non-followers, 69% of applicants from owned channels. He doesn't just run campaigns; he finds which channel is actually transmitting.

So the site is a **receiver**. The scale card is typeset with his actual sections and projects. The needle is the cursor. Static is the transition between stations. A **signal meter** renders the gap between the noise floor and his result.

And blue isn't a preference pasted on top — it's the backlight of the instrument, and the whole page is built out of four depths of it. That's why it earns its place.

### The scoping decision that makes it buildable

**Don't build a radio. Build an instrument.**

No wood cabinet, no dial knob the size of a dinner plate, no speaker grille, no bakelite. Just the **tuning face**: a printed scale card, a needle, a readout, a meter, and the glow behind them. Think the front panel of a laboratory receiver, not a 1950s kitchen radio.

That's more modern, far more editorial, and about a fifth of the CSS. A printed instrument face is a *document* — which is exactly the typographic world already established.

### Why not the two alternatives

| Concept | What it was | Why it loses |
|---|---|---|
| **The Wall** | A studio pinboard you move a 3D camera across; artifacts pinned at depth | Honest and easy, but it's a *layout* with depth, not a world. No interaction model of its own — you'd just be scrolling a fancy grid. |
| **The Loop** | A 3D ring of his five method steps, campaigns as beads | Elegant and abstract — but it's the closest to Noa's ring, so it would read as derived, and abstraction with no object to hold loses the "object you can touch" pull that makes all four references work. |

**SIGNAL wins because** the metaphor is a physical object (tactile), it's *his* discipline (channels, transmission, measurement), the interaction is obvious and learnable in one line of mono text, and blue is structurally justified rather than decorative.

---

## 2. Palette — measured

> **Supersedes the palette in `05-visual-system.md`.** The vermillion "Ink & Signal" direction, its warm paper, cream, mint and coral, and its one-accent budget are all gone — `09` replaced the direction, not just its accent. `assets/css/tokens.css` is the palette now, and where any document disagrees with it, the stylesheet wins.

The palette is colorhunt `091540 / 1B2CC1 / 7692FF / ABD2FA`, used verbatim:

`--navy #091540` · `--cobalt #1B2CC1` · `--peri #7692FF` · `--sky #ABD2FA`

No swatch is nudged, tinted or matched. Every other value in the system is one of those four, or one of those four at a stated opacity.

### One ramp, not four hues

Four blues is not four hues. It is one ramp, so the page is one material and every colour on it is a depth in that material. Nothing is a second colour arriving to decorate the first. There is no separate accent colour in the sense `05` used the phrase — there is the near end of the blue and the far end of it.

The site is lit from behind. Navy is the dark the instrument sits in. Cobalt is the lamp. Periwinkle is the spill where the lamp falls off. Sky is what the light lands on. Every surface is one of those four positions; a colour asked to do a fifth job is a bug.

### The tonal flip

The page is two sides and a seam.

- **The instrument is dark.** The panel is navy `--deep` `#091540`, laid on an even darker page `--deep-3` `#050D2C`, so the panel reads as a lit plane rather than a hole.
- **The report prints.** Below the seam, `--paper` is sky `#ABD2FA` and its ink is `--ink`, the same navy `#091540`. Sky is a paper here, not a highlight.
- **The seam is the event.** It is a hard edge with no fade between them: tuning ends, the report begins.

Because the two sides invert, the system only needs two colours. Panel text is report paper; report text is panel face. Nothing needed a third value to tell them apart, which is why nothing was added.

### The four swatches

| Token | Hex | Position in the ramp |
|---|---|---|
| `--navy` | `#091540` | the dark: panel face, report ink |
| `--cobalt` | `#1B2CC1` | the lamp: fills on the dark side, ink on the printed side |
| `--peri` | `#7692FF` | the spill: descriptions, inactive bands, the middle of the meter |
| `--sky` | `#ABD2FA` | what the light lands on: panel text, report paper |

### Instrument side (dark)

| Token | Value | Job |
|---|---|---|
| `--deep` | `--navy` `#091540` | panel face |
| `--deep-2` | `#0C1C4E` | raised cell: card well, meter track |
| `--deep-3` | `#050D2C` | the page under the instrument |
| `--stage-line` | `#24376F` | unlit tick |
| `--on-deep` | `--sky` `#ABD2FA` | **11.18** AAA — headlines, slider value |
| `--dim-deep` | `--peri` `#7692FF` | **6.14** AA — descriptions, inactive band |
| `--mute-deep` | `#6480D4` | **4.68** AA — micro-labels, hints, frequencies |
| `--glow` | `--sky` `#ABD2FA` | needle and focus ring inside the panel |
| `--rule-deep` | `rgba(171, 210, 250, .16)` | hairline on navy |
| `--edge-deep` | `rgba(171, 210, 250, .10)` | the panel's lit 1px edge |

`--deep-2` and `--deep-3` are not new colours. They are navy one step up into a cell and one step down into the page.

### Report side (printed)

| Token | Value | Job |
|---|---|---|
| `--paper` | `--sky` `#ABD2FA` | report sheet |
| `--paper-sunk` | `#A6CEFA` | band, table hover, thumb well |
| `--ink` | `--navy` `#091540` | **11.18** AAA — body |
| `--ink-soft` | `#16295E` | **8.81** AAA — secondary |
| `--mute` | `#34508F` | **4.96** AA — captions, table heads; **4.77** AA on `--paper-sunk` |
| `--accent` | `--cobalt` `#1B2CC1` | **6.12** AA — rules, links, figures |
| `--on-accent` | `--sky` `#ABD2FA` | **6.12** AA — text on a cobalt fill |
| `--rule` | `rgba(9, 21, 64, .18)` | hairline on sky |

### Measured pairs

| ink | surface | ratio | grade |
|---|---|---|---|
| `#ABD2FA` on-deep | `#091540` | 11.18 | AAA |
| `#7692FF` dim-deep | `#091540` | 6.14 | AA |
| `#6480D4` mute-deep | `#091540` | 4.68 | AA |
| `#091540` ink | `#ABD2FA` paper | 11.18 | AAA |
| `#16295E` ink-soft | `#ABD2FA` paper | 8.81 | AAA |
| `#34508F` mute | `#ABD2FA` paper | 4.96 | AA |
| `#1B2CC1` accent | `#ABD2FA` paper | 6.12 | AA |
| `#ABD2FA` on-accent | `#1B2CC1` | 6.12 | AA |
| `#34508F` mute | `#A6CEFA` paper-sunk | 4.77 | AA |

### The rules that fall out

1. **Cobalt is a FILL, never type on the dark side.** It measures only **1.83:1** against navy. On the panel it is the active band indicator, the origin of the meter ramp, and the lamp in the backlight — fills, not letters. When a cobalt fill needs words, the words are `--sky` at **6.12:1**.
2. **Sky prints, navy inks.** Every reading surface under the seam is `--paper` with `--ink`. Links, rules and figures are `--accent` cobalt at 6.12 — AA at any size, not only ≥16px — and anything sitting on a cobalt fill is `--on-accent` sky.
3. **Periwinkle is the middle.** It is the first step off navy (`--dim-deep`, 6.14) and the 62% stop of the meter's ramp. It dims a line; it never grounds one, and it is never a large field on either side.
4. **Navy is the only dark, sky the only light.** `--deep-2` and `--deep-3` are navy at two depths; `--paper-sunk` is sky at one depth. There is no black, white, cream or grey in the palette — a neutral would read as a second material.
5. **The old accent budget is gone.** "One accent colour, under 5% of surface" described one hue against a neutral ground, and there is no neutral ground any more. Restraint now comes from placement, not area: cobalt is a fill on the dark side or ink on the printed side, and never a border, a hover tint or a second background.
6. **These numbers are enforced, not remembered.** `test/tokens.test.js` parses `assets/css/tokens.css`, resolves the `var()` aliases, checks the four swatches against their hexes, and fails if any ink drops below AA on the surface it is painted on. It also pins cobalt below 3:1 against navy, so the fill rule cannot be "fixed" into an invisible link.

---

## 3. Type — three registers, same as the references

| Register | Face | Job |
|---|---|---|
| **Serif** | **Newsreader** (variable, 300–500 + italic) | Station titles, prose, case study titles, pull quotes, the wordmark |
| **Grotesque** | **Inter Tight** 500/600 | Nav, buttons, body UI, station descriptions |
| **Mono** | **Geist Mono** or **DM Mono** | Frequency numerals, ticks, every number, `CH 03`, hints, meters, tags |

Newsreader appears in three of the four references. It's the current consensus choice for "editorial but not costume drama," and it has a genuinely beautiful italic.

### The instrument face is typeset, not drawn

The scale card's tick marks and numerals are **HTML and CSS**, not an SVG or an image:

```css
.tick       { width: 1px; height: 8px;  background: var(--stage-line); }
.tick--mid  { height: 14px; }
.tick--major{ height: 22px; background: var(--mute-deep); }
.freq       { font: 400 var(--fs-freq)/1 "Geist Mono"; letter-spacing: .12em; color: var(--mute-deep); }
```

That matters: text ticks are crisp at every DPI, selectable-by-search (if we want), themeable, and free. It's also why the instrument reads as *printed*.

That block is dark-side CSS, so it reads only dark-side tokens: unlit ticks in `--stage-line`, major ticks and frequencies in `--mute-deep` (4.68 on navy). `--mute` is the report's caption colour at 4.96 on sky and falls below AA on the panel, so it never crosses the seam.

### Scale

| Token | Value | Face |
|---|---|---|
| `--fs-wordmark` | `clamp(20px, 2vw, 26px)` | Newsreader 500, −0.02em |
| `--fs-station` | `clamp(38px, 5.6vw, 84px)` | Newsreader 400, −0.03em, lh .98 |
| `--fs-metric` | `clamp(40px, 6vw, 92px)` | Geist Mono 400, −0.04em, tabular |
| `--fs-body` | `clamp(15px, 1.15vw, 17px)` | Inter Tight 400, lh 1.5 |
| `--fs-desc` | `clamp(16px, 1.5vw, 20px)` | Newsreader 400, lh 1.35 |
| `--fs-lbl` | `10.5px` | Inter Tight 600, .09em, uppercase |
| `--fs-freq` | `10px` | Mono, .12em |
| `--fs-hint` | `10px` | Mono, .09em, uppercase |

---

## 4. Stage anatomy (one 100vh screen)

**Layout:** a dark page (`--deep-3` `#050D2C`) → a **navy panel** (`--deep` `#091540`) inset `clamp(10px, 2vw, 22px)` with a `22px` radius, `clip-path: inset(0 round 22px)`. Everything instrument-related lives inside the panel, and the page around it is the darker navy, so the panel reads as a lit plane rather than a hole. Editorial type outside the panel sits in `--on-deep` sky.

Below the panel the page flips: `--paper` sky, `--ink` navy, `--rule` hairlines, printed report for the whole scroll. That seam is the whole composition, and it is a hard edge — the only things that cross it are the artifact card, which is already a piece of the report resting on the instrument, and the sheet, which is the report opening.

```
┌─ page #050D2C ────────────────────────────────────────────┐
│  FAUZI FADHLURROHMAN  ·  MARKETING & COMMS STRATEGIST       │  mono, --mute-deep
│ ┌─ panel #091540 navy ────────────────────────────────────┐ │
│ │                  ch 003                                 │ │  mono --mute-deep
│ │                                                         │ │
│ │  ││││  │ │││  ││ ││││  │ │  │││  │││   │││ ││           │ │  ticks + freqs
│ │ ──┼───────────────────────────────────────────────      │ │  ← needle (--sky)
│ │  88    92    96    100   104   108   112   116          │ │
│ │                                                         │ │
│ │  STILL, WE GROW                                         │ │  Newsreader, huge
│ │  A 32-page marketing strategy for seven programs.       │ │  Newsreader desc
│ │                                                         │ │
│ │  557,080          62.2%           +154%                 │ │  mono metrics
│ │  VIEWS            NON-FOLLOWERS   VS BENCHMARK          │ │
│ │                                                         │ │
│ │  SIGNAL  ├──────────────▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← meter        │ │
│ │          ▲ noise floor                 +154%            │ │
│ └─────────────────────────────────────────────────────────┘ │
│  DRAG TO TUNE · SCROLL TO TUNE · ENTER TO OPEN   W · R      │  hints --mute-deep + band
└─────────────────────────────────────────────────────────────┘
```

### The band switch (top-right)
Three boxed labels: `WORK` · `WRITING` · `RECORD` — styled exactly like Leon Vasari's decade tabs, with a **cobalt block indicator** that animates `width` + `translateX` to the active tab. The block is a fill with `--on-accent` sky on it (6.12); the labels beside it are `--dim-deep` periwinkle.

Bands are real: tuning across a band boundary triggers a **longer static burst** (280ms vs 120ms) and the readout clears for a beat before the new station resolves. That's the radio grammar doing information architecture work.

### The needle
- A `2px` bar, full height of the scale, `--glow` core with a `12px` soft gradient aura. `--glow` resolves to `--sky`, so the needle is the same light as the panel's type — no fifth colour enters the bloom.
- A `6px` triangular marker above.
- `box-shadow: 0 0 24px -4px var(--glow)` for the backlight bloom.
- Tracks the spring value exactly. **Underdamped, so it overshoots ~3px and settles** — that tiny failure to stop is the entire tactile illusion.

### The signal meter (the meaning)
A horizontal track, `0 → 100%`:
- A **hairline at the noise floor** (`--stage-line`), labelled `NOISE FLOOR` in 9px mono.
- A filled bar from the floor to the result, gradient `--cobalt → --peri` at 62% `→ --glow`. The meter is the ramp drawn: lamp, spill, landed light.
- The gap is bracketed and labelled `+154%` in `--glow`.
- For stations with no numeric lift, the meter shows absolute reach against a "typical" floor instead — and the label says so honestly.

**This is the single most on-brand element on the site.** It turns "154% above benchmark" from a sentence into an instrument reading, and it's the one place where his strategist identity is *visible* rather than asserted.

---

## 5. Physics

One `rAF` loop. One scalar state.

| Quantity | Value |
|---|---|
| `tune` | position along the scale, in station units |
| `target` | where the needle should be |
| Spring constant | `5.2` normally, `18` while dragging |
| Integrator | `tune += (target − tune) × (1 − e^(−k·dt))`, `dt` capped at `.033` |
| Snap | within `1e-4` of an integer |
| Release momentum | `pointer velocity × 0.35` added to target, then snapped |
| Wheel | `target += largestDelta / unitWidth × 0.5`; snap after 160ms idle |
| Drag | `target = start − dx / unitWidth`, fast spring; snap on release |

Constants are lifted from Leon Vasari because they're proven: `5.2` gives a ~0.9s settle, `18` makes a drag feel 1:1.

**No auto-drift, no autoplay.** Nothing moves unless he moves it. (Folio Room's ring drifts by design; a tuning dial that tunes itself is broken.)

---

## 6. Station change

1. **Needle springs** to the new station (underdamped overshoot).
2. **Static burst.** A 120ms noise shimmer over the readout: an `feTurbulence` overlay whose `opacity` spikes from 0 to `.35` and back, plus a 1px horizontal `translateY` jitter. This is the signature micro-moment and costs one element.
3. **Readout swaps in masks.** Kicker, title, description, each metric: `translateY(dir × 110%) → 0`, **650ms** `cubic-bezier(.2,.8,.2,1)`, staggered `0 / 60 / 120 / 180ms`. Old and new overlap inside the mask so fast tuning shows every intermediate pass. `dir` follows travel direction, exactly as in Leon Vasari.
4. **Artifact card rotates in.** `rotateY −12° → 0`, `translateZ −40px → 0`, spring `160/18`.
5. **Meter animates** its fill width over 900ms, and the `+154%` label counts up.
6. **`aria-live="polite"`** announces the new station name. Always.

---

## 7. Opening a station

Click the readout, press Enter, or click the artifact card.

**The sheet.** Take the artifact card's real `getBoundingClientRect()`, and grow a paper sheet out of it — `--paper` sky, `--ink` navy, the same print as the report below:

```js
from: { clipPath: `inset(${t}px ${r}px ${b}px ${l}px round 3px)`, transform: 'rotate(-2.5deg)' }
to:   { clipPath: 'inset(0px 0px 0px 0px round 0px)',          transform: 'rotate(0deg)' }
duration: 1050, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both'
```

A blank page the exact size and tilt of the card straightens and expands to fill the screen. Straight out of Leon Vasari, and still the best moment in any of the four.

**Inside the sheet**, content arrives in masks:
- Title, meta, metric band, prose: `620ms + index × 75ms`, 900ms each.
- Artifact images: a **clip-path wipe** from the bottom, not a fade.
- Close reverses to the *current* card rect over **850ms**, then unmounts.

**Not a modal fade.** Never an overlay with `opacity: 0 → 1`. That's the whole point.

---

## 8. Placeholders — the concept needs no real content

This is why SIGNAL is the right call right now. The instrument works fully with invented stations, so design and build can proceed today and swap content later.

**Station data shape** (`content/stations.js`):

```js
{ band: 'work', ch: 3, freq: '98.6',
  title: 'Still, We Grow',
  desc: 'A 32-page marketing strategy aligning seven programs.',
  tag: 'BRAND STRATEGY · 2026',
  metrics: [{ v: '557,080', l: 'VIEWS' },
            { v: '62.2%',   l: 'NON-FOLLOWERS' },
            { v: '+154%',   l: 'VS BENCHMARK' }],
  lift: 154, floorLabel: 'HISTORICAL BASELINE',
  artifact: 'placeholder',          // or a real image path
  href: '/work/tedxui/' }
```

Placeholder stations get a **deliberately beautiful** placeholder artifact: a typographic card in the site's own system — a boxed label, the channel number, the title in Newsreader, hairline rules. It should look *designed*, not like a grey box, so the site is presentable at any stage. Twelve stations ship on day one, half of them placeholders, and nobody can tell which is which.

**Rule:** a placeholder is never `lorem ipsum` and never an empty grey rect. It's a real composition with real typography that simply doesn't have a photo in it yet.

---

## 9. Mobile

The dial goes **vertical**. That's the whole responsive strategy, and it's the right one — a horizontal scale is unusable at 390px.

- Scale card on the left edge, ticks rotated 90°, frequencies reading upward.
- Needle becomes horizontal, sliding up/down.
- Readout below the scale: kicker, title, description, then metrics in a 3-up row.
- Artifact card sits above the readout at `min(78vw, 300px)`, `rotateY(-12°)` static.
- Meter spans full width under the metrics.
- Band switch moves to the bottom, centred; hints shorten to `DRAG TO TUNE`.
- No custom cursor (touch). The needle is the only pointer affordance.
- Sheet-open uses the same clip-path move but **with `rotate(0deg)`** — rotation looks wrong at phone widths.

---

## 10. What carries over from the earlier plan

Unchanged and still correct:
- Positioning, honesty constraint, site architecture, case study template (`00`–`03`)
- Static hand-coded build, 80-line Node templating step, GitHub Pages (`07`)
- Mobile-first performance discipline, accessibility targets
- Measured-palette methodology, now checked by `test/tokens.test.js`

Superseded by this doc:
- The "Ink & Signal" direction, its vermillion accent, warm cream paper and "one accent under 5% of surface" budget → now one blue ramp: navy instrument on a darker page, report printed on sky, cobalt as fill. The homepage is a stage, not a scroll document
- "The Stack" and "The Post Field" 3D moments → replaced by the instrument + the signal meter
- Opacity+translateY reveals → **masks only**

---

## 11. Acceptance checklist

- [ ] One metaphor (a receiver), no secondary gimmick
- [ ] Tuning is the navigation; bands are the sections
- [ ] Instrument is CSS/DOM — no WebGL needed unless the needle glow proves cheaper in canvas
- [ ] One ramp of four blues, used verbatim: navy panel on a darker page, report printed on sky with navy ink; no second colour, and no gradients except the needle and the meter
- [ ] Cobalt is a fill on the dark side and never type there; every cobalt fill carries `--sky` text at 6.12
- [ ] The seam from panel to report is a hard edge, no fade; the only paper above it is the artifact card
- [ ] Grain overlay, `soft-light`, over both sides — paper on the sky side, glass on the navy side
- [ ] Newsreader / Inter Tight / Geist Mono in three distinct registers
- [ ] Boxed micro-labels with hairline borders on every tag — `--rule-deep` on navy, `--rule` on sky
- [ ] Frequency ticks are real text, crisp at any DPI
- [ ] Needle overshoots and settles
- [ ] Static burst between stations; longer across bands
- [ ] Readout swaps via masks, direction follows travel
- [ ] Sheet grows from the artifact card's real rect
- [ ] Meter shows signal against a labelled noise floor, drawn in the ramp: cobalt → periwinkle → sky
- [ ] Twelve placeholder stations ship, none looking like a placeholder
- [ ] `aria-live` on station change, `aria-modal` on the sheet
- [ ] Reduced motion: needle snaps, static off, sheet instant, all information present
- [ ] Font floor 11px, tap floor 24px
- [ ] The pairs in §2 are the pairs `test/tokens.test.js` measures
- [ ] Looks correct from 320px to 2560px

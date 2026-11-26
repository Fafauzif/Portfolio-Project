# 08 — Craft Rules

Extracted from four reference builds (Folio Room, Leon Vasari, Zestwell, Noa Ellsworth). These are **practices**, not content. Everything in `09` is built to obey them.

The value isn't "make it 3D." It's that all four do the same nine things, and none of the nine is decoration.

---

## 1. The five laws

### Law 1 — One idea, executed completely
Each reference is a single metaphor and *nothing else*: books orbiting a headline, an endless VHS shelf, a curved gallery corridor, a ring of previews over a sea. No second metaphor, no "also there's a grid somewhere."

What dies: a hero with a 3D orbit **and** a masonry grid **and** a typewriter effect. Pick one and go all the way.

### Law 2 — The metaphor is the navigation
This is the actual insight. In these builds you don't click a menu to browse work:
- Folio Room: you **spin the ring**, click a book → it swings open.
- Leon Vasari: you **scroll/drag the shelf** → a tape physically turns → a paper sheet grows out of it.
- Zestwell: you **walk a corridor** → click a print → camera glides to it.
- Noa: you **spin a ring** → cards tilt → click opens.

Navigation *is* the concept. That's why they feel like worlds instead of pages with effects.

### Law 3 — CSS 3D for objects, WebGL for spaces
- Hardcover books, faces, spines, page edges → **pure CSS 3D** (`preserve-3d`, `translateZ`, `rotateY`, `repeating-linear-gradient` for page stripes). Zero WebGL in Folio Room.
- A corridor of walls, or 16 video cards around a camera → **three.js**.

The rule: if the object could sit in your hand, CSS is enough and it's faster. Reach for WebGL only when you need perspective *space*.

### Law 4 — Realness comes from material, not from 3D
What makes these feel expensive isn't depth. It's:
- **paper grain** over everything (`feTurbulence`, `mix-blend-mode: multiply`),
- **hairlines** instead of shadows,
- **shading that changes as an object turns** (a `--shade` black overlay whose opacity is driven by the rotation),
- **reflections** (`-webkit-box-reflect`, inset shadow "halos"),
- a **cast floor shadow** that moves away and fades as a book lifts.

### Law 5 — Motion is physics with one owner
One `requestAnimationFrame` loop. Spring state per property. Explicit stiffness/damping. No CSS keyframes for interaction.

> Folio Room: `x/y 120, z 140, rx/ry 160, rz 120, s 170, o 90, open 110`, damping `17/20/18/15/21/19/20`, **4 substeps**, `dt` capped at `.033`.

Each property gets its *own* stiffness — that's why the motion looks alive rather than uniform. And when a user throws something, it's `pointer velocity × 60` on release.

---

## 2. Type

All four use the **same three-register system**. This is the single most transferable thing here.

| Register | Faces used | Job |
|---|---|---|
| **Serif** | Newsreader (3 of 4) | logos, titles, prose, captions, synopses — the *voice* |
| **Tight grotesque** | Inter Tight, Geist, Oswald | UI, labels, nav, buttons |
| **Mono** | Geist Mono, DM Mono | every number, date, tag, micro-label, hint |

**The label system** (Leon Vasari, copy it exactly):

```
.lbl { font: 600 10.5px/1 "Inter Tight"; letter-spacing: .09em; text-transform: uppercase; }
.box { display: inline-flex; height: 21px; padding: 0 8px; border: 1px solid var(--rule); }
```

That "boxed uppercase micro-label with a hairline border" is what makes a page read as a *printed catalogue* rather than a brochure. It appears in all four references.

Further type rules:
- Display serif gets **negative tracking** (−0.02 to −0.045em). Large serifs set loose look amateur.
- Mono gets **positive tracking** (.08–.14em) at small sizes.
- **Font-size floors**: Zestwell wraps every size ≤20 units as `max(11px, …)`. Nothing renders below 11px, ever.
- Subset the Japanese/Chinese fonts to exactly the glyphs used (they got Noto Sans JP to ~14KB and a 5-character logo to ~2KB). Same discipline for our Latin subsets.

---

## 3. Colour & material

The shared recipe, and it's remarkably consistent:

| | Folio Room | Leon Vasari | Zestwell | Noa |
|---|---|---|---|---|
| paper | `#f4f1ea` | `#EDEBE6` | `#FFF9EC` | `#0A0E11` (dark) |
| ink | `#141414` | `#141414` | `#3A3550` | `#EEF4F6` |
| mute | `#86827a` | `#6D6A63` | `—` | `#647C8A` |
| **one accent** | black | **cobalt `#1F3FB0`** | plum ink | aqua `#3AA8D0` |

Three of four are **warm off-white + near-black + exactly one accent**. No gradients. No glass. No purple.

**The grain is not optional.** Every one of them puts an `feTurbulence` overlay above the content with `mix-blend-mode: multiply`. It's what turns flat CSS into printed paper. Leon Vasari sets it at `opacity .55`, `rgb(.45,.42,.38)` at `alpha .22`, `baseFrequency .85`.

**Shading is faked, cheaply.** Zestwell uses `MeshBasicMaterial` (unlit) for *everything* and gets its light from canvas gradient textures — zero lighting cost. Folio Room fakes it with a `--shade` overlay opacity. Nobody uses real lights.

---

## 4. Reveals — masks, never fades

Leon Vasari states it flatly:

> *"There is no opacity fade anywhere; every reveal is a mask slide, a clip or a scale."*

How it's done:

```css
.mask { display: inline-block; overflow: hidden; padding-bottom: .08em; margin-bottom: -.08em; }
.mask > span { display: block; transform: translateY(110%); }
/* then animate the span to translateY(0) */
```

Details that matter:
- **Direction follows travel.** `translateY(dir × 105%)`, `dir = +1` when moving right (text comes up from below), `−1` when moving left.
- **Old and new overlap inside the mask**, absolutely positioned, so a rapid run of changes shows every intermediate pass through.
- Timings used: **650ms** caption swap, **900ms** text rise with `delays 620 + index × 75`, **1050ms** sheet open, **850ms** close.
- Easing vocabulary: `cubic-bezier(.2,.8,.2,1)` (Leon Vasari), `cubic-bezier(.16,1,.3,1)` (Folio Room).

Our earlier plan said `opacity 0→1, translateY(16px)`. **That was the wrong instinct.** Masks read as printed matter; fades read as a website.

---

## 5. The transition is the craft

The single best moment across all four, from Leon Vasari:

> A **sheet of paper grows out of the cover** — `clip-path: inset(top right bottom left round 3px)` matched to the cover's real `getBoundingClientRect()`, plus `rotate(-4.5deg)` — and animates to `inset(0)` and `rotate(0)` over **1050ms `cubic-bezier(.76,0,.18,1)`**. A blank rectangle of paper, exactly the size and tilt of the cover, straightens and expands until it fills the screen.

Then the content arrives *inside* it: text rises line by line from 620ms, and the poster bleeds in as **seven ink blots** — `feTurbulence` + `feDisplacementMap scale 120` on growing circles, radii 0 → 720, each with its own delay, ease `1−(1−p)³`.

Other transition techniques worth stealing:
- **Camera glides with per-component easing** (Zestwell): angle uses quartic out, yaw quadratic, radius/height cubic — so "the travel leads and the turn lags." That's a director's note, not a developer's.
- **Flyer div** (Zestwell): a DOM clone of the artifact is placed at the *projected screen rect* of the 3D object, then animated to its destination. Bridges 3D→DOM invisibly.
- **Camera step-on-load** (Zestwell): the intro starts `r − 0.35` behind and eases in — "a gentle step forward into the passage."

---

## 6. Components with a signature

| Move | Reference | Why it works |
|---|---|---|
| **Custom cursor as state machine** | Leon Vasari | 58px ring; shrinks to `.72` over spines, `.55` over buttons, becomes a **filled cobalt disc with "OPEN / 開く"** over the cover. Follows with `1−e^(−16dt)`. Replaces hover states entirely. |
| **Tooltips in mono with a caret** | Folio Room | Black pill, follows cursor, `title — author` |
| **Toast microcopy with personality** | Folio Room | *"Nice throw." / "It always comes back." / "Gravity: optional."* |
| **Odometer loader** | Noa | Digits slide `.7s`; a percentage that's actually tied to asset loading |
| **Flying wordmark** | Noa | Loader name flies into the nav wordmark over 1.3s `cubic-bezier(.65,0,.35,1)` |
| **Magnetic button** | Noa | Send button translates `0.3 × dx`, `0.4 × dy` toward cursor |
| **Sliding block indicator** | Leon Vasari | Cobalt block behind tabs animates `width` + `translateX` from the active tab's `offsetWidth/offsetLeft`, `.6s` |

---

## 7. The scaling system — one unit for everything

Every reference derives all geometry from one number:

- Zestwell: `--u = min(100vw/1440, 100vh/900)`
- Noa: `--u = min(100vw, 160svh)/1440`
- Folio Room / Leon Vasari: a single `--H` (tape height) from which spine width, cover width and gaps are all computed (`ws = H×142/840`, `d = H×474/900`).

**Why it matters:** the composition holds identically at any viewport. Nothing drifts, nothing "looks wrong at 1366px." It's the difference between a designed page and a responsive page.

---

## 8. Layout of a single-screen stage

All four: `html, body { height: 100%; overflow: hidden }`, everything `position: fixed`, positioned from viewport centre. It's a **stage**, not a document.

Corner anatomy (all four agree):
- top-left: a boxed label / counter
- top-centre: wordmark
- bottom-left: hints in 10px mono, `.09em`, uppercase — *"Drag to throw · Scroll to spin · Click to open"*
- bottom-right: a segmented toggle
- footer: hairline-separated, `© NAME. ALL RIGHTS RESERVED.` and two social links

**The hints line is doing real work.** It teaches the interaction in one mono line, so the site never needs an onboarding overlay.

---

## 9. Craft in the invisible places

- **Copy specificity.** Leon Vasari invents 12 films with romaji, kanji, genre, runtime and a one-line synopsis. Specificity is what makes fiction believable — and it's the same discipline as a real case study needing real numbers.
- **Reduced motion is lossless.** In all four: springs become instant (`k = 1`), kinematics stop, but **every piece of information is still present**. Leon Vasari even starts the ink animation "5s in the past" so the poster is fully visible at once.
- **A11y is built in**: `aria-live="polite"` on the changing caption, `role="dialog" aria-modal="true"`, real `<button>`, `aria-current="page"`, `aria-label` on icon buttons, SVG decorations `aria-hidden`.
- **Tap targets** floored at `max(24px, …)`; fonts at `max(11px, …)`.
- **Dark mode done properly** (Noa): `color-scheme: dark`, full token swap, and the *one* exception handled explicitly — text sitting directly on the bright photo stays dark navy `#0E2A3B` in both modes.

---

## 10. Anti-patterns — what none of them do

Worth stating because it's the whole difference:

| Never appears in any of the four | Because |
|---|---|
| A gradient button | Reads as bootstrap |
| Glassmorphism cards | Same |
| `opacity` fades for reveals | Masks are strictly better |
| CSS keyframes for interactive motion | Can't be interrupted |
| Scroll-jacking / `scroll-behavior: smooth` hijack | Feels broken on mobile |
| An auto-advancing carousel | It's a wait |
| Drop shadows on flat UI | Hairlines instead |
| A loading spinner | They choreograph loaders instead |
| Rounded corners above ~24px | Reads as mobile app, not editorial |
| Icons standing in for meaning | They use type |

---

## 11. Checklist we hold `09` to

- [ ] One metaphor, no secondary gimmick
- [ ] Navigation *is* the metaphor
- [ ] CSS 3D for the object; no WebGL unless space is needed
- [ ] Paper grain overlay, `multiply`
- [ ] Warm paper + near-black + one accent, no gradients
- [ ] Serif / grotesque / mono in three distinct registers
- [ ] Boxed uppercase micro-labels with hairline borders
- [ ] Negative tracking on display, positive on mono
- [ ] One `rAF` loop, per-property spring constants, 4 substeps, `dt ≤ .033`
- [ ] Every reveal is a mask, a clip, or a scale — **zero opacity fades**
- [ ] Reveal direction follows travel direction
- [ ] One hero transition that is genuinely inventive
- [ ] A signature cursor or pointer state
- [ ] Mono hints line teaching the interaction
- [ ] One design unit drives all geometry
- [ ] Reduced motion = same information, zero animation
- [ ] Real `<button>`s, `aria-live`, `aria-modal`
- [ ] Font floor 11px, tap floor 24px

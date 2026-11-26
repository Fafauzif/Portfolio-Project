# 06 — Motion & 3D

> ⚠️ **SUPERSEDED.** "The Stack" and "The Post Field" are replaced by the tuning instrument and signal meter in [`09-concept-signal.md`](09-concept-signal.md). Also superseded: the opacity+translateY reveal system here — the references prove **masks only**, see [`08-craft-rules.md`](08-craft-rules.md) §4.
>
> Still valid and worth reading: the **performance budget** (§5) and **accessibility** (§6). Those constraints did not change with the direction.

How the site earns the word "wow" without becoming a video that a recruiter has to wait for.

---

## 1. The governing idea

Two 3D moments. Not three, not "a bit everywhere". Both carry meaning; neither is decoration.

> **Rule: no 3D object appears on this site unless it is an artifact from his real work, or a visualisation of his real numbers.**

So: no torus, no floating blobs, no particle field, no glowing grid, no "abstract tech background". Every object has a source.

**Moment 1 — the hero — "The Stack":** his actual documents as physical objects.
**Moment 2 — the dark band — "The Post Field":** his actual campaign performance as a physical terrain.

Everything between them is restrained DOM motion. That contrast is what makes the 3D land: a page this quiet suddenly does something physical.

---

## 2. Moment 1 — "The Stack" (hero)

**Concept.** Four real artifacts float in a shallow depth of field, lit like paper on a desk under a single raking light:

1. The TEDxUI 32-page strategy — first spread as a texture
2. The Puri Depok Mas 20-slide deck — title slide
3. The Finvation essay — first page
4. A speech cue card

They begin stacked and slightly fanned, in near-darkness at the top of the frame. They're rendered *behind* the hero type. As you scroll, they separate and rotate to a loose horizontal fan, catching more light, then dissolve to make room for the proof strip.

**Why this works:** it's honest (these are objects that exist), it's editorial (paper, light, physical documents), and it's not a mood-piece — the 3D *is* the portfolio.

**Interaction:** pointer position applies a very small rotation offset (max ~4°, damped). Not a "camera follows mouse" 3D postcard — a light source and a parallax. Subtle enough to read as physicality rather than as a gimmick.

### The three tiers — this is how the flex stays robust

| Tier | Trigger | What renders |
|---|---|---|
| **A — full** | WebGL2 available, `deviceMemory ≥ 4`, no `prefers-reduced-motion`, viewport ≥ 768px | three.js scene, 4 textured planes, real lighting, damped pointer + scroll parallax |
| **B — light** | Mobile, or low memory, or WebGL1 only | No WebGL. CSS `transform: translate3d` + `rotate3d` parallax on the *same* page images. Reads 80% as good at ~2% of the cost. |
| **C — flat** | `prefers-reduced-motion: reduce`, no canvas, or JS failed | A clean editorial composition of the four page images. No animation. Looks deliberate, not broken. |

**Every tier shows the same content and nothing is hidden behind an animation.** Text is always readable before the canvas paints.

**Text-first rule:** hero type is real DOM above the canvas, `opacity: 1` from first paint. The canvas fades in behind it only after the first frame renders. LCP is therefore the H1, not the scene — which is the single most important performance decision on the site.

**Texture cost:** the four page images must be `≤ 1024px` wide, JPEG or WebP, pre-exported. Do not render a PDF to canvas in the browser. Total texture budget: **≤ 320KB**.

---

## 3. Moment 2 — "The Post Field" (dark band)

**Concept.** Every post from his campaigns as a small luminous plane in 3D space:

- **x** = time
- **y** = engagement rate
- **z** = reach

A single hairline plane cuts through the field horizontally — **the historical benchmark**. Most of his posts sit above it. The camera orbits slowly; on scroll it rises so you see, from the side, the posts sitting above the line.

**Caption, in mono:** `Each mark is a post. The plane is the benchmark it was measured against.`

**Why it's the better 3D moment:** it's a chart, and it's true. The "154% above benchmark" claim stops being a number in a sentence and becomes something you can see. That's the difference between a portfolio that reports results and one that demonstrates them.

**Data:** a JSON file of ~34 posts — date, engagement, reach. No PII, no per-post content. Total **< 4KB**.

**Practical:**
- 34 meshes, or one `InstancedMesh`. Geometry is a 2-triangle quad. This will hold 60fps on a mid-range Android.
- No post-processing. No bloom, no DOF. The glow is a radial-gradient sprite, if anything.
- Hairline plane = a single transparent plane with an edge drawn as a `LineSegments`.
- Label the axes in DOM, not in 3D. 3D text is expensive and always looks wrong.
- Static camera if `prefers-reduced-motion`. Same information, still readable.

---

## 4. DOM motion system

Restraint is the point. One easing vocabulary, one duration scale, no exceptions.

### Easing tokens

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.30, 1);   /* entrances, reveals */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);    /* color/hairline fades */
--ease-linear:   linear;                             /* scroll-linked only */
```

### Duration scale

| Token | Value | Use |
|---|---|---|
| `--t-micro` | `120ms` | Hover, underline, focus |
| `--t-short` | `220ms` | Buttons, link states |
| `--t-med` | `420ms` | Reveals, nav shrink |
| `--t-long` | `700ms` | The dark band inversion |

**Nothing on this site animates longer than 700ms** except scroll-linked scenes, which are bound to input and so can't be "waited for".

### The full motion inventory

Only these. Anything else is scope creep.

1. **Hero canvas fade-in** — once the first frame renders, the canvas fades `0→1` over `600ms`. The headline is already there; the scene arrives behind it. **No auto-advancing carousel, no typed text, no intro animation the reader must sit through.**
2. **Scroll reveals** — opacity `0→1`, `translateY(16px→0)`, `--t-med`, `--ease-out-expo`. Fires **once**. Uses `IntersectionObserver`, not a scroll handler.
3. **Number count-up** — proof strip and metric bands. 900ms, `--ease-out-expo`, fires once, respects reduced motion by showing the final value. No bounce, no spring, no odometer roll.
4. **Hairline draw** — rules scale in on the x-axis from the left, `400ms`.
5. **Link underline** — `--signal`, `scaleX(0→1)`, origin left, `--t-micro`.
6. **Nav shrink** — 72px → 56px height on scroll past 80px, `--t-med`.
7. **Dark band inversion** — a clipped `--dark` panel expands upward as it enters the viewport. `--t-long` equivalent, scroll-bound.
8. **Shared-element page transition** — the case study card's image morphs into the case study hero. See below.
9. **Focus states** — `2px --signal-deep` outline, `2px` offset. Instant, never animated.

### Scrolling

Native scrolling. **No scroll-jacking.** No Lenis, no smooth-scroll hijack.

Reason: on a mid-range Android, hijacked scrolling is the number one cause of a "wow" site feeling broken. The site must scroll like a phone scrolls. Use `scroll-driven animations` (`animation-timeline: view()`) where supported, falling back to `IntersectionObserver`. Both are native and cheap.

### Seamless page transitions — the actual "seamlessness"

The thing he liked about openrouter.ai is that navigation *doesn't feel like a page load*. Reproduce that with the **View Transitions API**, ~15 lines:

```css
@view-transition { navigation: auto; }

.case-card__thumb   { view-transition-name: var(--thumb); }
.case-hero__figure  { view-transition-name: var(--thumb); }
```

The card's image becomes the case study's hero figure, morphing between pages. Chrome and Edge get it. Safari and Firefox get a normal navigation. **Progressive enhancement with zero fallback cost** — the best kind of flex.

Plus: `cross-document` transitions, and `<link rel="prerender">` on the top three case study links so the next page is already there.

---

## 5. Performance budget — non-negotiable

The primary audience is Indonesian recruiters on a mid-range Android over 4G. A 6-second site is a site nobody sees. This is the constraint that decides whether the ambition is achievable or merely aspirational.

| Asset | Budget |
|---|---|
| **JS, base page (no 3D)** | ≤ 30KB gzip |
| **JS, hero 3D chunk (lazy)** | ≤ 140KB gzip — `three` core only, no examples bundle |
| **JS, post-field chunk (lazy)** | ≤ 60KB gzip |
| **CSS** | ≤ 24KB gzip |
| **Fonts** | ≤ 120KB total, 3 files, subset to Latin |
| **Textures (hero)** | ≤ 320KB |
| **Images per case study** | ≤ 900KB total, responsive `srcset`, AVIF + WebP |
| **LCP (mid-range Android, 4G)** | < 2.5s |
| **CLS** | < 0.05 |
| **INP** | < 200ms |
| **Mobile Lighthouse performance** | ≥ 90 |

### How that's actually achieved

1. **HTML is the LCP.** Hero headline is server-rendered static text. The canvas never delays it.
2. **Three.js is dynamically `import()`ed** and only after the hero text paints, `requestIdleCallback`, and only if the tier check passes.
3. **No `three` examples module** (`OrbitControls` etc.) — hand-roll the ~20 lines needed. Saves ~80KB.
4. **Textures pre-exported** and served at exact sizes. No client-side PDF rasterising.
5. **`content-visibility: auto`** on below-fold sections.
6. **Font subsetting** to Latin + the specific punctuation used. Three files max.
7. **Images as static `<img>`** with width/height set. No JS-driven image loading for above-fold content.

### The mobile-first rule

**Design the phone layout first, in the browser, on a throttled connection.** Then build up. If the phone version is merely "acceptable", the site fails, because most of the audience will only ever see that version.

The 3D moment must be impressive *at 375×812*. That means the composition is vertical, the artifacts are larger relative to frame, and the camera is closer. A desktop-first scene cropped for mobile always looks like a crop.

---

## 6. Accessibility (a flex piece that fails a11y is a liability)

- `prefers-reduced-motion: reduce` → Tier C. All content present, nothing animated, dark band not inverted by scroll.
- All canvas content is `aria-hidden="true"`. The numbers live in real DOM text.
- The post-field has a text equivalent: a `<table>` of the 34 posts, visually hidden but screen-reader accessible. **A visualisation that isn't in the DOM is data no one with a screen reader can reach.**
- Keyboard: visible focus everywhere, logical tab order, skip link.
- Contrast: per the measured table in `05-visual-system.md`. Small accent text uses `--signal-deep`.
- No motion triggered on hover only — keyboard users get identical states via `:focus-visible`.
- Target WCAG 2.2 AA.

---

## 7. Motion do / don't

| Do | Don't |
|---|---|
| One easing curve everywhere | A different spring per component |
| Reveal once, then stay | Re-trigger on every scroll direction |
| Bind scroll animation to input | Hijack the scroll or smooth-scroll it |
| Animate opacity + transform only | Animate `height`, `top`, `width`, or `filter: blur` |
| Instant `prefers-reduced-motion` fallback | "Reduced motion" that still moves, just slower |
| 3D that shows his artifacts or his data | 3D that shows a shape nobody asked for |
| Loading that's invisible | A loading spinner on a marketing site |

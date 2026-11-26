# 05 — Visual System

> ⚠️ **SUPERSEDED for palette, type and direction.** This document is the original vermillion "Ink & Signal" direction. The live direction is **SIGNAL** in [`09-concept-signal.md`](09-concept-signal.md) — blue, and a tuning-instrument stage instead of a scrolling homepage.
>
> Kept for two things `09` still relies on: the **component grammar** (§5) and the **anti-template tell list** (§6). Ignore the colours here.

**Direction name: "Ink & Signal"**

Editorial print craft, engineered with product-grade precision, with exactly two moments of real 3D.

---

## 1. What we're actually chasing

He said: *editorial feel*, but also the *modernity, seamlessness and 3D wizardry* of openrouter.ai and treg.to.

Here's the honest read on those references:

| Reference | What it actually does | What to steal |
|---|---|---|
| **openrouter.ai** | Near-monochrome. Hairline rules. Mono for anything technical. Dense, real product information. Almost zero decoration. Its "modern" feeling comes from *typographic precision and information density*, not from 3D or gradients. | The restraint. The density. Mono as a signal of technical honesty. Zero ornament. |
| **treg.to** | Same family (its own title is "OpenRouter for agent tools and data, pay per call"), so the same DNA — a developer-tool aesthetic where the product *is* the hero. | Product-as-hero. Confidence through flatness. |

**The uncomfortable conclusion:** the two sites he likes most are the ones that *don't* do 3D. Their wow is not spectacle; it's the feeling that nothing is unnecessary.

So the direction can't be "openrouter but with a spinning thing." It has to resolve the tension. The resolution:

> **Restraint everywhere, and then two moments of genuine depth that earn their place by carrying meaning, not decoration.**

That's how you get a flex piece that doesn't read as showing off. The flex is that a page this quiet can suddenly do something physical — and that the physical thing is *his data*.

### The rule for 3D

> **No 3D object appears unless it is an object from his actual work, or a visualisation of his actual numbers.**

That single rule kills every "abstract glowing torus" impulse and makes the 3D feel like evidence rather than a mood.

---

## 2. Colour

Measured in OKLCH, with real contrast ratios. These are computed values, not vibes.

### Base palette

| Token | Hex | OKLCH | Role |
|---|---|---|---|
| `--paper` | `#F7F5F0` | `oklch(97.0% 0.0070 88.6)` | Page base. Warm off-white, **not** pure white |
| `--paper-sunk` | `#EFEBE2` | `oklch(94.1% 0.0128 86.8)` | Recessed panels, table zebra, quote blocks |
| `--ink` | `#111110` | `oklch(17.7% 0.0020 106.6)` | Primary text. Warm near-black, not `#000` |
| `--ink-soft` | `#3A3935` | `oklch(34.4% 0.0070 95.3)` | Secondary headings |
| `--muted` | `#6B6A63` | `oklch(52.3% 0.0108 100.1)` | Captions, metadata, mono labels |
| `--signal` | `#E23D28` | `oklch(60.5% 0.2048 30.8)` | The accent. Vermillion |
| `--signal-deep` | `#B92E1E` | `oklch(51.9% 0.1781 30.5)` | Accent when it must carry small text |
| `--dark` | `#0D0D0C` | `oklch(15.9% 0.0021 106.6)` | The inverted band |
| `--dark-text` | `#F2EFE9` | `oklch(95.3% 0.0086 84.6)` | Text on `--dark` |

### Why vermillion and not blue, purple, or lime

Red-orange is the colour of an **editor's pen** — the mark in the margin that says *this matters*. On warm paper it reads as print, proof, annotation. It's also the one loud colour that never looks like a SaaS gradient, and it makes the mono numbers feel like they were stamped rather than rendered.

It also happens to be the least-used accent in student marketing portfolios, which are overwhelmingly blue, purple, or black-and-neon. Being the site with the red pen mark is a memory hook.

### Measured contrast — and the rules that follow

| Pair | Ratio | Verdict |
|---|---|---|
| ink on paper | **17.34** | AAA. Body text. |
| ink-soft on paper | **10.61** | AAA. Subheads. |
| muted on paper | **4.98** | AA. Fine for body. |
| signal-deep on paper | **5.55** | **AA. Use for any small accent text.** |
| signal on paper | **3.91** | ⚠️ **Fails AA for body text.** Large text (≥24px / 18.66px bold) only. |
| paper on signal | **3.91** | ⚠️ Same. Light text on a signal-filled button must be ≥18.66px bold, or use `--dark` on signal instead. |
| dark-text on dark | **16.94** | AAA |
| signal on dark | **4.57** | AA. The accent works on the dark band. |
| muted on dark | **3.58** | ⚠️ **Fails AA.** Decorative / large only. Use `--dark-text` at reduced opacity for captions. |

**Hard rules that fall out of this:**

1. **`--signal` never sets body copy.** It's for large type, rules, marks, fills, and the placing text on award pages (which is large and bold).
2. **`--signal-deep` is the accent for anything under 24px.** Links, small labels, inline emphasis.
3. **Never place `--signal` text on `--signal`.** No exception.
4. **The accent covers less than 5% of any viewport.** One heading, one rule, one button, one metric — not all four at once.
5. **`--muted` on dark is decorative only.** Captions on the dark band use `--dark-text` at 70% opacity instead.

### Colour do / don't

| Do | Don't |
|---|---|
| Warm paper base with warm near-black ink | Pure `#FFF` and `#000` — it's the fastest way to look like a template |
| One accent, used sparingly, consistently | A second accent "for the awards section" |
| Let hairlines do the dividing | Drop shadows on cards |
| Invert to `--dark` for exactly two bands | Dark mode as a toggle nobody asks for |

---

## 3. Type

Three roles, three faces. This is the whole "editorial + modern" trick in one decision.

| Role | Face | Why |
|---|---|---|
| **Display** | **Instrument Serif** (or *Newsreader* as the backup) | High-contrast, contemporary serif. Reads editorial and literary without the costume-drama feel of Playfair. Its italic is genuinely beautiful — use it for pull quotes and one or two emphasis moments. |
| **UI / body** | **Geist** (fallback: *Satoshi*, then system grotesque) | Modern product grotesque. Neutral, tight, made for interfaces. Pairs cleanly with a high-contrast serif because it has none of the serif's drama. |
| **Data / mono** | **Geist Mono** (fallback: *JetBrains Mono*) | Every number, date, metric, tag, and technical string. This is the openrouter move: mono means "this is a fact, not a feeling." |

**Why not Inter for body.** Inter is the default of every AI-generated page and every Tailwind starter on the internet. It's not a bad face; it's a *tell*. Geist is close enough to be safe and different enough to not read as a default.

**Why not a single typeface.** One-face sites look modern and cold. The serif/grotesque/mono triple is what makes a page read as *designed* rather than *generated*: narrative gets the serif, interface gets the grotesque, evidence gets the mono. Three registers, three jobs.

### Self-hosting
Subset and self-host all three. `woff2`, `font-display: swap`, preload only the two used above the fold (display roman + UI regular). Never load from a third-party CDN — it costs a DNS lookup and a privacy story on an Indonesian mobile connection.

### Type scale

Fluid, `clamp()` based. Ratios are deliberate: display jumps hard, body stays tight.

| Token | Size | Face | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `--fs-display` | `clamp(3.2rem, 11vw, 9rem)` | Serif | 400 | `-0.03em` | Hero line only |
| `--fs-h1` | `clamp(2.4rem, 6vw, 4.5rem)` | Serif | 400 | `-0.02em` | Page titles |
| `--fs-h2` | `clamp(1.8rem, 3.6vw, 2.75rem)` | Serif | 400 | `-0.015em` | Section heads |
| `--fs-h3` | `clamp(1.25rem, 2vw, 1.6rem)` | Geist | 500 | `-0.01em` | Sub-sections, card titles |
| `--fs-body` | `clamp(1rem, 1.15vw, 1.125rem)` | Geist | 400 | `0` | Prose |
| `--fs-small` | `0.875rem` | Geist | 400 | `0` | Captions |
| `--fs-mono` | `0.8125rem` | Mono | 400 | `0.02em` | Labels, tags, metadata |
| `--fs-metric` | `clamp(2.75rem, 7vw, 5.5rem)` | Mono | 500 | `-0.03em` | The big numbers |

**Rules:**
- Serif display gets **negative tracking**. Large serifs set loose look amateur; the letters must almost touch.
- Mono gets **positive tracking** at small sizes so labels don't clump.
- Body line-height `1.6`; headings `1.05` for display, `1.15` for h2/h3.
- **Measure: 62–72 characters.** Editorial sites get this wrong constantly. `max-width: 68ch` on prose.
- **Never centre body text.** Centred prose is a résumé tell.
- **Sentence case for all headings.** Title Case Is A Brochure.

---

## 4. Layout

### Grid
12 columns, `1440px` max content width, `clamp(20px, 5vw, 72px)` gutters.

But the editorial move is that **content rarely spans all 12.** Text sits in columns 2–8. Metrics and artifacts break out full-bleed. That asymmetry is what makes a page feel composed rather than filled.

```
┌──────────────────────────────────────────────┐
│  nav                                    CV → │
├──────────────────────────────────────────────┤
│      ┌────────────────────────────┐          │
│      │  h1 in cols 1–8            │          │
│      │  supporting line, mono     │          │
│      └────────────────────────────┘          │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  artifact, full-bleed, 100%             │  │
│  └────────────────────────────────────────┘  │
│                                              │
│      ┌──────────────────────────┐            │
│      │ prose, 68ch, cols 2–7    │            │
│      └──────────────────────────┘            │
└──────────────────────────────────────────────┘
```

### Spacing
8px base. Section rhythm is **generous and consistent**: `--s-section: clamp(96px, 12vh, 180px)` between major sections.

The single most common failure in student portfolios is cramped, inconsistent vertical rhythm. Section gaps must be identical everywhere, large, and never adjusted "to fit."

### Hairlines
`1px` at `rgba(17,17,16,0.12)` on paper, `rgba(242,239,233,0.14)` on dark. Hairlines replace shadows entirely. There is **no box-shadow anywhere on this site** except the sticky nav's bottom edge on scroll.

---

## 5. Component grammar

**Nav** — hairline bottom border. Left: name in mono. Right: four links + `CV`. Shrinks on scroll, never hides.

**Buttons — two types only:**
- *Primary*: solid `--ink`, paper text, `2px` radius, `44px` min height. One per screen.
- *Text link*: `--ink` with a `--signal` underline that animates in from the left on hover.

**Metric block** — mono number at `--fs-metric`, mono label beneath at `--fs-mono` in `--muted`, hairline above. No boxes, no cards, no background fills. **No icons.**

**Case study row** — full width, hairline above, three columns: `01` (mono, muted) / title (serif, 2 lines max) / dominant metric (mono, right-aligned). Whole row is the hit area, and the whole row gets a subtle `--paper-sunk` fill on hover.

**Award ledger** — a real `<table>`. Mono year, mono placing in `--signal-deep`, name in Geist medium, discipline in `--muted`. Row hover: hairline turns `--signal`. **No badges, no laurels, no flags.**

**Pull quote** — serif italic, `--fs-h2`, `--ink-soft`, hanging a quote mark in `--signal`. Max one per page.

**Artifact figure** — image full-bleed, caption in mono below-left, `⟨source⟩` credit. Images get a `1px` hairline border, zero radius, zero shadow. Print-like.

---

## 6. What makes it look like it wasn't made by a template

Concrete, checkable list:

1. **Warm paper, not white.** The base colour is the signature.
2. **Serif display + grotesque body + mono data.** Three registers.
3. **Negative tracking on display type.** Nobody templating does this.
4. **Asymmetric grid.** Text in 2–8, artifacts full-bleed.
5. **Hairlines instead of shadows and cards.**
6. **Numbers set in mono at huge sizes.** The metrics *are* the ornament.
7. **One accent, under 5% coverage.**
8. **No icons.** At all. If a concept needs an icon, it needs a sentence.
9. **No rounded corners above 2px.**
10. **Section rhythm identical on every page.**

And the negatives — the tells to actively avoid:

| Tell | Why it's fatal here |
|---|---|
| Inter + Playfair Display | The default AI/Canva pairing |
| Purple → blue gradient | Reads as 2023 SaaS template |
| Glassmorphism cards | Same |
| Laurel wreath award badges | Stock student-portfolio template |
| Three-column icon features | Shopify theme, 2019 |
| "Passionate about creating impactful experiences" | Says nothing; every applicant writes it |
| Fake dashboard screenshots | Dishonest, and readers can tell |
| Autoplay background video | Slow on mobile, unreadable text over it |
| A "skills" bar chart at 90% | Meaningless and absurd |
| Emoji as bullets | Undermines an editorial voice instantly |

---

## 7. Dark band specification

The inversion is the site's one big structural move: paper → ink → paper, scroll-driven. It exists on the homepage (S6) and on case study pages for the metric moment.

- Background `--dark`, text `--dark-text`
- Accent becomes `--signal` (4.57:1 — passes AA at body size on dark)
- Hairlines at 14% white
- The 3D scene lives here, and only here, on the homepage
- Transition: the band's top edge follows the scroll, no hard cut, no fade-through-white. Use a clipped `--dark` panel expanding upward as it enters.

**Reduced motion:** the inversion is instant, not animated. Content is identical.

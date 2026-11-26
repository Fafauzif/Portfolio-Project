# 01 — Site Architecture

Structure built so a recruiter reaches a conclusion in 90 seconds, and a curious one can go 30 minutes deep.

---

## 1. The two reading paths

Every page must serve both.

**The 90-second path (recruiter, phone, distracted):**
Hero → proof strip → three selected works → awards strip → contact.
That is *one scroll* on mobile. No clicks required to reach a conclusion.

**The 10-minute path (hiring manager, curious, or someone who clicked through from a post):**
Hero → one case study read in full → the method → about → CV.

**Design rule:** the 90-second path must never depend on the 10-minute path loading. Nothing on the homepage may require a click, a hover, or a 3D scene to have finished.

---

## 2. Page map

```
/                          Home
/work/                     Selected work index
/work/tedxui/              "Still, We Grow" — annual strategy
/work/gandeng/             Recruitment system + referral engine
/work/mavenpro/            Puri Depok Mas consulting engagement
/work/tumbuh/              (pending info)
/work/writing/             Copy + SEO + essay work, grouped
/awards/                   All five competitions, one surface
/awards/young-entrepreneur-bpc/     2nd national, business plan
/awards/bpc-vol-2/                  2nd national, business plan
/awards/finvaton-essay/             3rd national, essay
/awards/atamerica-speech/           3rd national, speech
/awards/padjadjaran-speech/         International finalist, speech
/about/                    The person + the method
/cv.pdf                    Download
```

Ten content pages. Deliberately not more. `Selepas Sekolah`, `IELS`, `StudentsCatalyst`, `IMUN`, `UI SDGs Summit` and `Future Brand Leaders` **do not get their own pages** — they become evidence inside `/work/writing/` and `/about/`. Reason: a 4-post internship does not deserve the same real estate as a 32-page strategy, and pretending otherwise flattens the hierarchy.

**Why awards get their own nested pages:** they're the rare assets, they're currently invisible, and no other candidate will have five pages of judged work. It's the single most defensible thing on the site.

---

## 3. Homepage, section by section

### S1 — Hero
Full viewport. The one place the 3D lives.

- Name: **Fauzi Fadhlurrohman**
- Positioning line, large, editorial serif: **"I don't stop at the deck."**
- One supporting line, small, mono or grotesque: *Marketing & communications strategist. Research → strategy → execution → measurement.*
- Location + availability: *Jakarta, Indonesia · open to internships and graduate roles, 2027*
- Two actions only: `See the work` and `Download CV`
- Behind it: the 3D artifact scene (see `06-motion-and-3d.md`). Must be decorative-only; the text is real DOM and readable before any canvas paints.

**8-second test:** a recruiter must get "marketing strategist, Jakarta, UI, ships real campaigns" from S1 alone.

### S2 — Proof strip
Four figures, mono, huge, hairline-separated. Scroll-triggered count-up, once, no bounce.

```
557,080     views, TEDxUI, 30 days
691         applicants, Gandeng intake
+154%       median engagement vs. historical benchmark
5×          national & international placings
```

**Rule: every number is footnoted with its window and its source org.** "557,080 views" without "TEDxUI, latest 30-day reporting period" is a claim; with it, it's evidence.

### S3 — Selected work (three cards)
Full-bleed rows, not a grid. Each row: number (`01`), title, one-line problem, one dominant metric, and a hairline rule. Since three is the count, do it as a stacked list — it reads editorial and it's faster than a card grid.

1. **Still, We Grow** — 7 programs, one marketing strategy, 32 pages. `557k views · 62.2% non-followers`
2. **The Referral Engine** — recruited 691 people, then built the tool to do it again. `691 applicants · 69% owned-channel discovery`
3. **Puri Depok Mas** — a developer whose comms problem got named correctly. `40-respondent survey · 20-slide client deck`

Note the titling strategy: title by **the thing that happened**, not the org. "The Referral Engine" outperforms "Gandeng Foundation — Program Branding Manager" every time.

### S4 — The method
One horizontal band: `Research → Insight → Strategy → System → Measurement`. Each step gets 8–12 words. This is where he reads as a thinker. Keep it to a single screen-height strip, no cards.

### S5 — Awards
The flex, done as a ledger — a table, not badges. Mono dates, the placing in the accent colour, the competition name in full, the discipline in a muted column.

```
2025  [2nd]   Young Entrepreneur Business Plan Competition   National   Business plan
2025  [2nd]   Business Plan Competition Vol. 2              National   Business plan
2025  [3rd]   Finvation National Essay Competition          National   Essay
2025  [3rd]   Atamerica Speech Contest                      National   Speech
2024  [Intl finalist]  Padjadjaran English Competition      International  Speech
```

A ledger reads like a record. A row of five identical laurel badges reads like a stock template. **Never use laurel icons.**

### S6 — Inversion: the dark band
Where the second 3D / data moment lives. Full-bleed near-black. The 3D terrain of his campaign performance (see `06`). Short line of copy: *"Every campaign above has a baseline. Find out what it was."* → link to one case study. This is the seam: paper → ink → paper.

### S7 — About teaser
One portrait, three sentences, the English-studies-to-marketing bridge, link to `/about/`.

### S8 — Contact
No form. Direct: email, LinkedIn, and a line stating what he's open to. Forms add friction and lose the lead.

### Footer
Nav, CV, email, LinkedIn, and a one-line colophon: typefaces, stack, `Built by hand`. Colophon is a craft signal that costs nothing.

---

## 4. Case study template (same for all three + awards)

Consistent, so a reader can skim a second one at speed.

1. **Header** — title, org, role, dates, discipline tags, one-line problem
2. **The metric band** — 3 numbers, immediately, before any prose
3. **The brief** — what was actually asked, in the client's words if possible
4. **The constraint** — team size, timeline, budget, format limits. Constraints make results legible.
5. **The insight** — the one thing he figured out. This is the strategist's page.
6. **What I made** — the artifact, shown. Deck spreads, post grid, the Apps Script architecture diagram, the strategy page.
7. **What it moved** — the numbers, with windows and baselines stated
8. **What I'd do differently** — two sentences, honest. This is the single most credibility-building block on the whole site, and almost nobody includes it.
9. **Next** → the adjacent case study

**Every case study has exactly one thing it's proving.** TEDxUI proves he can write and run a strategy at scale. Gandeng proves he builds systems. MavenPRO proves he can lead a team and sell a diagnosis. If a case study tries to prove three things it proves nothing.

---

## 5. `/about/` — the page that does the most work per word

Structure:

- **The bridge.** English Literature → marketing. Not a pivot to explain away; the reason he's good. Close reading is audience analysis. Rhetoric is positioning. Thesis construction is strategy.
- **The method**, expanded to a paragraph per step.
- **The record** — full timeline, every role, compact, mono dates. Chronology lives here so the homepage doesn't have to.
- **The person** — one paragraph, human, no adjectives like "passionate". Something true.
- **What he's looking for** — explicit. Team, function, kind of problem.
- **CV download**

---

## 6. Navigation

Four items, no more: `Work` · `Awards` · `About` · `Contact`.

Mobile: a full-screen sheet, serif, large, with the CV at the bottom. **Not** a hamburger that opens a small dropdown — that's the tell of a template.

Persistent small element: the `CV` link, always reachable, desktop and mobile.

---

## 7. Copy rules (apply to every page)

- **Concrete nouns, real verbs.** "Wrote a 32-page strategy" not "was responsible for strategic planning."
- **No "passionate about."** Ever.
- **No adjective without a number behind it.** "Significant growth" is banned; state the figure.
- **First person.** "I led" beats "the team was led by."
- **Short paragraphs.** Max 3 sentences on mobile.
- **Numbers get units and windows.** "691 applicants", "557,080 views in 30 days."
- **Sentence case for headings.** Title Case Everywhere reads like a 2012 brochure.
- **Say the obvious thing once.** Redundancy is not emphasis.

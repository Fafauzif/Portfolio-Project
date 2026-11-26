# 03 — Case Studies (drafted)

Deep drafts built from what the LinkedIn already proves. `⟨GAP⟩` marks where Fauzi supplies the missing piece. Each is written to the template in `01-site-architecture.md` §4.

---

# 3.1 — "Still, We Grow"
### TEDxUniversitasIndonesia · Director of Marketing · May 2026 – present

**One-line problem:** Seven TEDxUI programs, seven separate marketing efforts, one brand — and no shared strategy to hold them together.

**Discipline tags:** Brand strategy · Campaign planning · Content system · Analytics

### The metric band (before any prose)
| 557,080 | 62.2% | +154% |
|---|---|---|
| views in the latest 30-day reporting period | of those views came from non-followers | median engagement rate vs. historical benchmark |

### The brief
TEDxUI runs seven distinct programs across a year. Each program had its own marketing instinct, its own tone, and its own idea of what good looked like. Nobody could answer "what does TEDxUI marketing look like in 2026, and how would we know if it worked?"

`⟨GAP⟩` *Confirm: was the strategy an assignment from the board, a self-initiated document, or a response to a specific failure? This is the opening sentence of the whole page — it needs to be true.*

### The constraint
- Seven programs, one person in the director seat, one term
- Zero historical benchmarks to beat at the start — he had to establish the baseline himself
- A student org's resources: no paid media, no agency, no budget for testing
- Content had to satisfy both internal stakeholders (seven program leads) and an external audience

### The insight
`⟨GAP⟩` — but the evidence points at it. The account's results were **~154% above its own historical median engagement**, with **62.2% of views from non-followers**. Reach from non-followers at that ratio means the content was doing discovery work, not just serving people who already followed. So the strategy was almost certainly built for *distribution* rather than *announcement* — making posts worth sharing to people who'd never heard of the org, which is the only thing that grows a student org account.

**Draft the page around that idea:** most student org marketing announces things to people who already know. His strategy made TEDxUI content travel.

### What I made

**1. A 32-page annual marketing strategy.** Aligning seven programs under one direction — "Still, We Grow." Authored and secured approval. `⟨GAP⟩ Show 4–6 spreads: the direction, the program map, the content pillars, the measurement framework. Redact internal names and budget lines.`

**2. The first 17 official-term posts.** A coordinated set, not a scatter. `⟨GAP⟩ Show the grid, 3×3 or 4×4 crop.`

**3. A measurement framework.** This is the part worth showing off. Median reach 49.7%. Median engagement rate benchmarked against historical performance. He set up the comparison, then reported against it.

### What it moved
| Metric | Value | Window |
|---|---|---|
| Views | 557,080 | latest 30-day reporting period |
| Viewers | 140,307 | same |
| Interactions | 17,084 | same |
| Non-follower share of views | 62.2% | same |
| Views, first 17 posts | 471,738 | official term to date |
| Engagements, first 17 posts | 18,459 | same |
| Attributed follows | 504 | same |
| Median reach | 49.7% | same |
| Median engagement rate | ~154% above historical benchmark | same |

`⟨GAP⟩ Screenshot every one of these with the date visible. A metric without a screenshot is a claim.`

### What I'd do differently
`⟨GAP⟩` — needs one true thing. Two candidates worth considering:
- The 504 attributed follows against 471,738 views is a **weak conversion ratio**. Views were won at the top of the funnel and not converted at the bottom. That's an honest, sophisticated observation and saying it out loud would immediately separate him from every portfolio that only reports wins.
- 17 posts is a small sample to declare a strategy successful. Acknowledging that is equally credible.

Pick one. Saying it is worth more than the metric.

---

# 3.2 — "The Referral Engine"
### Gandeng Foundation · Program Branding Manager · May 2026 – present

**One-line problem:** A foundation needed 691 people to apply. The campaign worked. So the next question was how to do it again without doing it by hand.

**Discipline tags:** Campaign · Systems · Apps Script · Audience research

> **Framing decision:** lead with the tool, not the campaign. A marketing candidate who shipped a working referral system is a category away from a marketing candidate who ran a good Instagram campaign. The campaign is the credential; the engine is the differentiator.

### The metric band
| 691 | 69% | 357,491 |
|---|---|---|
| applicants | cited Gandeng-owned Instagram as their discovery source | impressions across 14 posts |

### The brief
Recruit applicants for Gandeng Foundation programmes. Owned channels only.

### The constraint
- 14 posts. A fixed output budget.
- Referral mechanics needed to scale beyond what a person could administer manually — tracking who referred whom, validating codes, paying benefits correctly.
- No budget for a referral SaaS product.

### The insight
Two insights, and the second one is the good one.

**Insight 1 — measure discovery, not just volume.** Hit 691 applicants and *then* asked where they came from. Result: **69% cited Gandeng-owned Instagram.** That justified the owned-channel investment and told them exactly what to protect for the next intake. Most campaigns never ask this question, so they never learn which channel did the work.

**Insight 2 — the manual part is the bottleneck, so automate it.** If referrals drove a big share of intake, the limiting factor becomes administration, not reach. So he built the administration.

### What I made

**1. The 14-post recruitment campaign.** 357,491 impressions · 144,731 summed post-level reach · 11,116 engagements · 691 applicants. `⟨GAP⟩ Post grid screenshots.`

**2. The referral system.** Ideated, coded, and deployed — in Google Apps Script, which means it ran on infrastructure the foundation already had at no extra cost. Capabilities:

```
  ┌─────────┐   ┌──────────────┐   ┌───────────────┐
  │ Signup  │──▶│ Unique code  │──▶│ Personalised  │
  │  form   │   │  generation  │   │     email     │
  └─────────┘   └──────────────┘   └───────────────┘
                        │
                        ▼
  ┌─────────────────────────────────────────────────┐
  │ Validation: code exists · not expired · not     │
  │ self-referred · not a duplicate submission      │
  └─────────────────────────────────────────────────┘
                        │
                        ▼
  ┌──────────────────────────┐   ┌─────────────────┐
  │ Benefit assignment per   │──▶│ Automated       │
  │ referrer                 │   │ referral ledger │
  └──────────────────────────┘   └─────────────────┘
```

**The engineering detail worth writing down on the page:** "not self-referred" and "not a duplicate" are the two failure modes that break naive referral schemes, and he handled both deliberately. A reviewer who knows the domain will notice. Say it explicitly:

> *The two things that break a referral programme are people referring themselves to farm the benefit, and the same code being submitted twice. Both are validated before a benefit is assigned, and every event is written to a ledger rather than held in a spreadsheet someone has to maintain.*

`⟨GAP⟩ Publish an architecture diagram + redacted screenshots. Not the code, unless it's scrubbed — never expose spreadsheet IDs, deploy URLs, tokens, or applicant data. Offer the code on request.`

### What it moved
| Metric | Value |
|---|---|
| Impressions | 357,491 |
| Summed post-level reach | 144,731 |
| Engagements | 11,116 |
| Applicants | 691 |
| Applicants sourced via owned IG | ~69% |

`⟨GAP⟩ Did referrals actually produce a measurable share of the 691? If yes, that number completes the story and this page becomes genuinely special. If it isn't available, don't invent it — the system's existence is still the point.`

### What I'd do differently
`⟨GAP⟩` — one honest option: the referral engine was built *after* the campaign proved referral demand existed, so the two never ran together at full strength. Building the instrument before the next intake is the obvious next move.

---

# 3.3 — "Naming the Problem"
### Puri Depok Mas × MavenPRO Communications Consulting Club UI · Project Leader · Apr 2026 – present

**One-line problem:** A property developer knew buyers weren't converting. They didn't know why, and they were describing the problem as a design problem.

**Discipline tags:** Client research · Comms strategy · Team leadership · Conversion

### The metric band
| 40 | 3 | 20 |
|---|---|---|
| respondents surveyed | competitors benchmarked | slides in the delivered strategy |

### The brief
Puri Depok Mas needed a communications strategy. `⟨GAP⟩ Confirm whether MavenPRO was approached by the client, or pitched to them. The answer changes the page's opening — "we won the engagement" is a different story from "we were handed a project".`

### The constraint
- Five-person team, and he was responsible for its output
- Three phases
- Academic-adjacent deadline structure with a real external client at the end
- A student consultancy has no authority: the client adopts the recommendation or doesn't

### The insight
The research design is the interesting part. He didn't guess: **brand and content audit + 40-respondent survey + 2 exploratory interviews + customer-journey mapping + benchmarking against three property competitors.** That's a five-method triangulation, run by a five-person team, on a real business. Most student consulting decks have one survey.

Then the core communications strategy got written by him, and team output got heavily revised into something the client could act on.

**The deliverable shape is the flex:**
- 3 strategic pillars
- 8 content and conversion mockups
- a 4-week content system
- an implementation roadmap
- conversion-oriented KPIs

That's not a recommendations deck. That's an operating plan with a schedule and a measurement scheme. **Lead with that distinction** — most consulting work stops at "here's what you should do"; this one includes "here's the four weeks and the numbers you'll watch."

### What I made
`⟨GAP⟩ Deck spreads. Prioritise in this order: the journey map, the competitor benchmark table, the 3 pillars, one content mockup, the roadmap, the KPI sheet. Six pages tell the whole story.`

### What it moved
- The client affirmed, after the presentation, that the identified communication problems accurately reflected real business challenges.

**How to frame a qualitative result honestly:** don't dress it up. The first deliverable in consulting is a correct diagnosis — being told "you're right about what's wrong" is the win that unlocks the rest. State it as: *"The client confirmed the diagnosis matched their real business problem."* That's true, it's specific, and it's more credible than a synthetic percentage.

`⟨GAP⟩ A written client quote is worth more than anything else on this page. Ask Puri Depok Mas for two sentences. If they say yes, this page is done.`

### What I'd do differently
`⟨GAP⟩` — an honest candidate: the engagement ended at the roadmap, not at a measured outcome. There's no post-implementation data, because the four-week system ran after the team's involvement. Saying that shows he understands that a strategy isn't finished until it's measured.

---

# 3.4 — "Writing for 134,000 people"
### One page for the copy and SEO thread: StudentsCatalyst · IELS · Selepas Sekolah · Future Brand Leaders

**Why this page exists:** it gives the writing capability a home without four thin role pages. It's also the page that makes the English Literature degree legible as a professional asset instead of a detour.

### Structure

**Open with scale, not job titles.**
> *A 134,000-follower community. Twelve Instagram scripts a month. Two SEO articles a week. Copy that had to work on people who had no reason to care.*

**Block 1 — Voice at scale.** StudentsCatalyst. 134k+ community. Storytelling averaging 1,200+ engagement per post; a recruitment announcement at 3,300+ likes. `⟨GAP⟩ 3–4 post screenshots.`

**Block 2 — The architecture underneath the voice.** Future Brand Leaders. A three-pillar system — *Marketing Theories · Campaign Case Studies · Behind The Project* — with performance tracking and iteration. Frame the point: most social accounts have a calendar; this one had an architecture, and the difference is that an architecture tells you what to post next week without inventing it from scratch.

**Block 3 — Writing that gets found.** IELS. Two SEO articles weekly for five months ≈ 40+ pieces. Keyword trend analysis, competitor strategy, search-intent mapping. `⟨GAP⟩ 3 article links.`

**Block 4 — Writing that moves a small number honestly.** Selepas Sekolah. Twelve tailored scripts monthly; engagement +25%; 600+ likes on a 1,200-follower account. Include it precisely because the numbers are small — a 25% lift against a stated baseline is a real analytical habit, and recruiters notice when a candidate reports a small number accurately instead of omitting it.

**Close with the bridge sentence** — the one that turns English Literature into a credential:
> *Literature is the study of how a sentence makes someone feel something they didn't plan on feeling. Marketing is the same skill with a deadline and a metric.*

---

## 3.5 — Case study writing rules

1. **Problem before work.** Never open with the role title. Open with what was wrong in the world.
2. **The metric band comes before the prose.** A recruiter who reads only three numbers should still get it.
3. **One capability per page.** If you can't name it in five words, the page isn't finished.
4. **Show the artifact.** Screenshots, deck spreads, the diagram. A case study without an artifact is a paragraph.
5. **Name the constraint that hurt.** Constraints make results legible and they signal self-awareness.
6. **Include what you'd do differently.** It is the highest-credibility block on the page and almost nobody writes it.
7. **Never round up.** "Approximately 691" destroys trust in the other nine numbers.

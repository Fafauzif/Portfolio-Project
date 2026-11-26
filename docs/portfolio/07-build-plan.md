# 07 — Build Plan

Hand-coded static HTML/CSS/JS. This is the plan for actually making it.

---

## 1. Stack decisions

| Choice | Decision | Why |
|---|---|---|
| **Output** | Static HTML/CSS/JS, no client framework | Fastest possible LCP, nothing to hydrate, deployable anywhere forever |
| **Templating** | ~80-line Node script + `content/*.json` | Ten pages with shared chrome. Hand-duplicating the nav 10× guarantees drift. A tiny build step keeps it static output, which is what "hand-coded static" means in practice. |
| **3D** | three.js, dynamically imported, hero + post field only | The only place the budget permits it |
| **CSS** | Hand-written, custom properties, no Tailwind | The design is bespoke; a utility framework would push it toward defaults |
| **JS** | Vanilla ES modules, no bundler required | Native `import()` gives code splitting for free in modern browsers |
| **Deploy** | GitHub Pages from `main` (or `/docs`) | Repo already exists. Free, stable, no build service dependency. |

**Why not Next.js/Astro:** each adds a Node toolchain, a build dependency, and a hydration cost for a 10-page site that changes monthly. The one thing a build step must do — stamp a shared layout — is 80 lines of Node. Keep the surface small.

**The one accepted cost:** he has to run `node build.js` after editing content. Acceptable, and it will be one documented command.

---

## 2. File structure

```
Portfolio-Project/
├─ build.js                  ~80 lines: JSON → HTML, minify, output to /dist
├─ content/
│  ├─ site.json              name, positioning, nav, links, CV path
│  ├─ metrics.json           the proof-strip numbers
│  ├─ work/
│  │  ├─ tedxui.json
│  │  ├─ gandeng.json
│  │  ├─ mavenpro.json
│  │  ├─ tumbuh.json
│  │  └─ writing.json
│  ├─ awards/
│  │  ├─ young-entrepreneur-bpc.json
│  │  ├─ bpc-vol-2.json
│  │  ├─ finvaton-essay.json
│  │  ├─ atamerica-speech.json
│  │  └─ padjadjaran-speech.json
│  └─ posts.json             the 34 posts for the post field (date, eng, reach)
├─ src/
│  ├─ templates/
│  │  ├─ base.html           <head>, nav, footer, slot
│  │  ├─ home.html
│  │  ├─ case-study.html
│  │  ├─ award.html
│  │  ├─ index-work.html
│  │  ├─ index-awards.html
│  │  └─ about.html
│  ├─ css/
│  │  ├─ tokens.css          colour, type, spacing, easing — ALL variables
│  │  ├─ base.css            reset, typography, layout primitives
│  │  ├─ components.css      nav, buttons, metric, ledger, case row, figure
│  │  └─ pages.css           per-page overrides (kept minimal)
│  ├─ js/
│  │  ├─ main.js             nav, reveals, count-up, view transitions
│  │  ├─ hero-scene.js       lazy-imported three.js — "The Stack"
│  │  ├─ post-field.js       lazy-imported three.js — "The Post Field"
│  │  └─ tier.js             capability detection → A / B / C
│  └─ fonts/                 Instrument Serif, Geist, Geist Mono (woff2, subset)
├─ public/
│  ├─ img/
│  │  ├─ work/tedxui/*.avif
│  │  ├─ work/gandeng/*.avif
│  │  ├─ awards/*/*.avif
│  │  └─ portrait.avif
│  ├─ tex/                   the 4 hero textures, ≤1024px, ≤320KB total
│  └─ cv.pdf
└─ dist/                     build output, committed for GitHub Pages
```

---

## 3. The build script, in essence

```js
// build.js — no dependencies
const fs = require('fs');
const { readJSON, render, minifyCSS } = require('./lib');

const base    = fs.readFileSync('src/templates/base.html', 'utf8');
const data    = readJSON('content/site.json');
const metrics = readJSON('content/metrics.json');

const pages = [
  ...readJSON('content/work/*.json').map(w => ({
    out: `dist/work/${w.slug}/index.html`,
    tpl: 'case-study.html', data: w,
  })),
  ...readJSON('content/awards/*.json').map(a => ({
    out: `dist/awards/${a.slug}/index.html`,
    tpl: 'award.html', data: a,
  })),
  { out: 'dist/index.html', tpl: 'home.html',   data: { metrics } },
  { out: 'dist/work/index.html',   tpl: 'index-work.html',   data: {} },
  { out: 'dist/awards/index.html', tpl: 'index-awards.html', data: {} },
  { out: 'dist/about/index.html',  tpl: 'about.html',        data: {} },
];

for (const p of pages) {
  fs.mkdirSync(require('path').dirname(p.out), { recursive: true });
  fs.writeFileSync(p.out, render(base, p.tpl, { ...data, ...p.data }));
}
```

That's it. Content is data; layout is one file; ten pages come out. Adding a sixth award = adding one JSON file.

---

## 4. Component inventory to build

Ordered by what unblocks the most.

**Tokens & primitives**
- [ ] `tokens.css` — every colour/tree/space/easing from `05` and `06`, no hardcoded values anywhere else
- [ ] Reset + fluid type scale
- [ ] Grid: 12-col, `1440` max, asymmetric content columns
- [ ] Hairline utility
- [ ] Prose wrapper at `68ch max`

**Components**
- [ ] Nav (shrinking, mobile full-screen sheet, always-present CV link)
- [ ] Button primary + text-link with animated underline
- [ ] Metric block (mono number + label + hairline)
- [ ] Proof strip (4 metrics, count-up once)
- [ ] Case study row (full-width, 3-col, whole-row hover, `view-transition-name`)
- [ ] Award ledger (`<table>`, mono, no badges)
- [ ] Artifact figure (full-bleed, hairline border, mono caption)
- [ ] Pull quote (serif italic, hanging signal quote mark)
- [ ] Dark band (clipped reveal + slot for the post field)
- [ ] Award header (placing in `--signal-deep`, large)
- [ ] Footer with colophon
- [ ] Skip link + focus rings

**Scenes**
- [ ] `tier.js` — WebGL2 / memory / reduced-motion / viewport → A | B | C
- [ ] `hero-scene.js` — 4 textured planes, one raking light, damped pointer, scroll fan-out, fade-in after first frame
- [ ] `post-field.js` — instanced quads from `posts.json`, benchmark plane, slow orbit, scroll-locked camera, hidden `<table>` equivalent
- [ ] Tier B CSS parallax fallback
- [ ] Tier C flat composition

---

## 5. Build order

Each step ends at something he can look at. Never more than one step without a visual.

| # | Step | Done when |
|---|---|---|
| 1 | `tokens.css` + reset + type scale | A specimen page showing every token and type step |
| 2 | `base.html` + nav + footer | A blank page with real chrome, desktop + mobile |
| 3 | Homepage S1–S2, static, no 3D | Hero type + proof strip readable at 375px |
| 4 | Homepage S3–S5 (case rows, method, awards ledger) | 90-second path complete on a phone |
| 5 | Case study template + TEDxUI page | One real page end to end |
| 6 | Gandeng + MavenPRO pages | Three pages, identical grammar |
| 7 | `/awards/` index + first award page | The ledger works |
| 8 | All five award pages | Placeholder text where artifacts are pending |
| 9 | `/about/` + CV | |
| 10 | Tier system + hero scene | Hero 3D on desktop, CSS parallax on mobile |
| 11 | Post field in the dark band | The inversion works |
| 12 | View transitions + prerender | Card → page morphs |
| 13 | A11y + perf pass | Lighthouse ≥ 90 mobile, axe clean, keyboard-only run |
| 14 | Deploy to GitHub Pages | Live URL, then the custom domain |

**Steps 1–9 are the site.** Steps 10–12 are the flex. That ordering is deliberate: if the schedule slips, he ships a beautiful, complete, fast editorial site rather than a half-finished 3D demo. Never let the flex block the fundamentals.

---

## 6. Content pipeline

Before build step 3, `content/*.json` needs real values. That means the asset gathering from `02` and `04`:

1. **Competition submissions** — five folders, `submission` + `brief` + `result` each
2. **Tumbuh description**
3. **TEDxUI strategy spreads** (redacted)
4. **Gandeng architecture diagram** + redacted screenshots
5. **Metrics screenshots with dates visible**
6. **Portrait**
7. **Puri Depok Mas quote in writing**

Missing items become `⟨TODO⟩` markers in the JSON that the build script warns about. The site builds with gaps visible in the console rather than silently shipping "Lorem ipsum".

---

## 7. Deployment

```
GitHub Pages, from /dist on main
Build: node build.js        (run locally before pushing)
```

Checklist:
- [ ] `CNAME` for the custom domain if he wants one (`fauzifadhlurrohman.com` or similar)
- [ ] HTTPS enforced
- [ ] `404.html` in the editorial style, linking home
- [ ] `robots.txt` + `sitemap.xml`
- [ ] Open Graph images per page — **the OG image matters more than the site for LinkedIn shares.** 1200×630, paper background, serif headline, one metric
- [ ] `<title>` and `<meta description>` written per page, not templated generically
- [ ] Plausible or GoatCounter analytics (cookieless, no banner needed)

---

## 8. Maintenance reality

- **Content changes:** edit a JSON file, run `node build.js`, push. ~5 minutes.
- **Adding a role:** drop a file in `content/work/`, add a template if the shape differs, rebuild.
- **Adding an award:** drop a file in `content/awards/`, rebuild. Zero layout work.
- **Dependency risk:** three.js is the only dependency, pinned to a version, loaded lazily. If it breaks, Tier C still works and the site is intact.

---

## 9. Definition of done

- [ ] Ten pages live
- [ ] A recruiter on a phone understands the positioning in 8 seconds
- [ ] Every metric has a window and an org
- [ ] Every award page has its artifact, or states plainly that it's a reconstruction
- [ ] Mobile Lighthouse ≥ 90, perf and a11y
- [ ] `prefers-reduced-motion` version looks good, not broken
- [ ] Keyboard-only navigation completes every page
- [ ] CV reachable in ≤ 2 taps from every page
- [ ] OG image renders correctly in a LinkedIn preview
- [ ] Zero placeholder text shipped

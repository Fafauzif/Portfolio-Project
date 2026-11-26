# Portfolio workspace

This is Fauzi Fadhlurrohman's static, multi-page portfolio. The live design is **Campaign Posters**. Read [the design and motion notes](docs/portfolio/campaign-posters.md) and [positioning](docs/portfolio/00-positioning.md) before altering it. The SIGNAL plan and handoff are historical records.

## Run and check

```sh
node tools/serve.mjs
node --test
```

The site ships static HTML, CSS and browser JavaScript modules with no build step. Keep navigation relative so it works under a repository subpath.

## Design and content

- The four chosen blues are `#091540`, `#1B2CC1`, `#7692FF`, and `#ABD2FA`. Cobalt is a fill on the dark side. Keep accessible foreground contrast.
- Newsreader, Inter Tight and Geist Mono are self-hosted. Keep the opening hierarchy centered on the headline, role and real work link.
- Use a single owner for the poster timeline. Derive pose from native scroll. Keep content visible, keyboard-reachable and usable with reduced motion and with scripts disabled. Use clips and transforms for content entrances. Leave the system pointer intact.
- Mark original site illustrations where they could be mistaken for campaign deliverables. Keep project claims supportable and distinguish student-led work from employment. The supplied profile and reference screenshots are working material.
- Validate the real site at 1440 × 900 and 390 × 844, reflow at 320 px, the reduced-motion and no-script routes, and deep links. Inspect the forward and reverse paper sequence as well as the first frame.

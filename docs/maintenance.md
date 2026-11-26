# Maintain the interface

## Opening print

| Change | File |
| --- | --- |
| Headline text | `content/site.json` → `tagline` |
| Line breaks, scroll timing, mark and fold lifecycle | `components/fold-hero.tsx` |
| Type fit, paper planes, seam, turn, corner and poster light | `components/fold-hero.module.css` |
| Landing tile and Selected Work | `app/page.tsx`, `app/globals.css` |
| Featured project, hero poster, and optional lighter image | `content/site.json` → `heroProject`; chosen project → `cover`, `previewCover` |
| Mobile navigation and full name | `components/site-nav.tsx`, `app/globals.css` |

The default title reads “What happens / after the deck?” on desktop. On a narrow portrait screen it can use “What happens / after the / deck?”. `fold-hero.tsx` recognizes the phrases `after the` and `at the` for intentional breaks, with a balanced fallback for other wording. Only a final question mark uses the opening tip. In the CSS module, `--hero-type-size` controls the scale. The CTA retires about one third of the way through the fold as the poster starts to appear.

Preserve the title's single accessible reading order if changing line breaks. The hero's native anchor should work immediately if JavaScript is disabled. Keep one `[data-fold-landing]` target and test both scroll directions after changing it.

## Pointer, buttons, and Lab

- `app/layout.tsx` mounts one shared `PointerEffects` controller. `components/pointer-effects.tsx` handles eligible pointer zones and sets local `--pointer-x` and `--pointer-y` values.
- `components/pointer-effects.css` sets the size and intensity of the `cover`, `lab`, and `button` profiles. The Home `paper` profile uses these coordinates in `components/fold-hero.module.css`. Add `data-pointer-zone` to the intended surface. Use `data-pointer-control` for restrained press and focus styling.
- The moving light is scoped to a surface and activates with a fine hover pointer when reduced motion is off. Touch and reduced motion use static press or focus feedback. Check that Lab dragging, keyboard placement, tooltips, and text selection still work after any pointer change.
- Reusable buttons live in `components/ui/button.tsx`. Footer CTA layout is in `components/site-footer.tsx` and `app/globals.css`. Use an anchor with a real destination for navigation and a button for an action. Keep a visible focus outline and a comfortable touch target.
- Work card arrows, Quick View, search, and category navigation live in `components/work-archive.tsx` and `components/work-archive.module.css`. Lab desk and list layout live in `components/lab-desk.tsx` and `components/lab.module.css`; the separate fold study lives in `components/lab-fold-study.tsx`.

## Diagnose a regression

| Symptom | First place to inspect |
| --- | --- |
| Headline cropped or gap near the fold | Hero line splitting and media queries in the hero module. Check short landscape and 320 px portrait. |
| Poster remains floating or appears twice | The landing target or its dimensions changed. Check the home card marker and flight geometry. |
| Unexpected card, Lab item, or empty case route | Check `featured`, `lab`, `heroProject`, `labProject`, and the current build's publication filter. |
| Link falls back to a preview URL | Check the real HTTPS `url` in `content/site.json` and the route's metadata. Rebuild. |
| Changes are absent on the old root `index.html` | Use the production preview command or visit the Vercel output. |

The Paper Current figure was rendered in Blender and lives under `public/portfolio-media/`. Running `blender -b --factory-startup --python-exit-code 1 --python tools/blender-verify.py` checks the optional Blender tooling. The portfolio build itself requires Node.js and the lockfile.

# Maintain the interface

## Opening print

| Change | File |
| --- | --- |
| Headline text | `content/site.json` → `tagline` |
| Line breaks, scroll timing, mark and fold lifecycle | `components/fold-hero.tsx` |
| Type fit, paper planes, seam, turn, corner and poster light | `components/fold-hero.module.css` |
| Landing tile and Selected Work | `app/page.tsx`, `app/globals.css` |
| Featured project, hero poster, and optional lighter image | `content/site.json` → `heroProject`; chosen project → `cover`, `previewCover` |
| Navigation, mobile menu, and compact rail | `components/site-nav.tsx`, `components/site-nav.css` |

The default title reads “What happens / after the deck?” on desktop. On a narrow portrait screen it can use “What happens / after the / deck?”. `fold-hero.tsx` recognizes the phrases `after the` and `at the` for intentional breaks, with a balanced fallback for other wording. Only a final question mark uses the opening tip. In the CSS module, `--hero-type-size` controls the scale. The CTA retires about one third of the way through the fold as the poster starts to appear.

Preserve the title's single accessible reading order if changing line breaks. The hero's native anchor should work immediately if JavaScript is disabled. Keep one `[data-fold-landing]` target and test both scroll directions after changing it.

## Typography and reflow

The previous build exposed three failures that a page-level scroll-width check missed. On a wide About layout, `Fadhlurrohman` ended with a lone `n` on the next line. Home's two-column Selected Work lost part of the right card and its year. The MavenPRO case broke its title into a large middle line containing only `× Puri`. Use these records as repeatable visual fixtures after changing copy, type sizes, or grid geometry.

| Fixture | First files to inspect | Accept when |
| --- | --- | --- |
| `/about/`, the Home profile, and `/resume/` | `content/site.json`, `components/profile-heading.tsx`, and `app/globals.css` | Fauzi and Fadhlurrohman wrap as complete words. The full surname fits its line beside the portrait and on the smallest screen. |
| Home Selected Work and `/work/` | `app/page.tsx`, `app/globals.css`, `components/work-archive.tsx`, and `components/work-archive.module.css` | All title words, images, years, and arrows fit each track, including the narrower companion card. The archive has room for TEDxUniversitasIndonesia and covers the empty filter state. |
| `/work/mavenpro-puri-depok-mas/` and a long case such as `/work/tedxuniversitasindonesia-2027/` | `app/work/[slug]/page.tsx` and `components/case-study.module.css` | The title, separator, project facts, and image have room. Each named party reads as a unit as the layout shifts. The single H1 has the complete title in reading order. |
| Lab, Experience, Recognition, Contact, and the case related cards | Page component, its local styles, or `app/globals.css` | Long labels and body text wrap within their own areas. Controls retain visible focus and remain within the available width. |

Use this repair order when adding a name or title, including content copied from a template.

1. Inspect the size of the actual heading, flex item, or grid track after spacing and images take their share. Prefer tracks that can shrink such as `minmax(0, 1fr)` and `min-inline-size: 0` on the relevant child. Give the heading a wider track or stack the columns earlier if the layout has room to change.
2. Adjust the display scale against the usable container, keeping a readable floor at narrow widths. Use more lines and allow their full line height. Inspect the short landscape hero separately from portrait and desktop.
3. Group words at meaningful boundaries. Keep a surname or named organization together where it fits. Prefer breaking between the collaborating entities in a title containing `×`, with the separator attached to the second entity where practical. Keep all actual text and spaces in the accessible heading.
4. Use reflow as the final fallback for a genuinely long, unbroken token. Scope an emergency rule such as `overflow-wrap: anywhere` to the affected text. Keep `overflow: hidden` and clipping local to decorative artwork. Verify any ordinary word that still wraps character by character.

`ProfileHeading` estimates fit from the longest word and passes `--profile-fit` to its container-based CSS. `CaseTitle` uses the title in project frontmatter. A spaced ` × ` gives it a meaningful line break. Its `--title-fit` estimates room for the longest word or the separator with the first word that follows it. Keep the work type in `kind`, the contribution in `role`, and the date in `year`. Those fields appear as project facts near the case summary. The case's squared **All work** and category links lead to real destinations. For a new template, preview a short title, a long organization name, and a collaboration with a long second party. Check the full case as well as every card where that title appears.

Take screenshots after fonts load, with the entire heading or row visible. Check 320, 390, and 430 px portrait, a short landscape phone, 768 and 1024 px, 1280 and 1536 px, and 1920 to 2048 px. Test just below and above any layout breakpoint you changed. Use browser text enlargement to 200% where available. If the browser runner cannot do text-only zoom, increase the root font size for a separate stress check and record that method. Check any supported width below 320 with the display at its narrowest.

This optional DevTools check helps locate a split word or overflowing text. Change the selector to the exact heading or element, run at rest after fonts load, and inspect the screenshot as well. A wrapping heading can fail this check even when the page has no horizontal scrollbar.

```js
await document.fonts.ready;
const element = document.querySelector('.about-layout h1');
if (!element) throw new Error('Choose an existing heading selector.');
const bounds = element.getBoundingClientRect();
const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
const issues = [];
let text;
while ((text = walker.nextNode())) {
  for (const word of text.data.matchAll(/\S+/gu)) {
    const range = document.createRange();
    range.setStart(text, word.index);
    range.setEnd(text, word.index + word[0].length);
    const fragments = Array.from(range.getClientRects());
    const lines = new Set(fragments.map(box => Math.round(box.top)));
    const outside = fragments.some(box => box.left < bounds.left - 1 || box.right > bounds.right + 1);
    if (lines.size > 1 || outside) issues.push({ word: word[0], lines: lines.size, outside });
  }
}
console.table(issues);
```

The table flags hyphenated words as well. Judge deliberate hyphen breaks and title-phrase grouping from the screenshot. Also inspect the outer grid and local overflow boundaries, including artwork, the year, link arrows, dialogs, and fixed navigation.

## Shared navigation and page endings

- `components/site-nav.tsx` observes `[data-hero-root][data-fold-progress]` on Home and sends progress to `components/site-nav.css`. The rail changes shape from about 3% to 79% fold progress and changes background from about 15% to 72%. Its code chooses a foreground for each resulting surface. Check navy, a middle shade, and paper in both scroll directions. Check actual foreground contrast at each state.
- Test keyboard access and the mobile menu with the rail at the top and after scrolling. After direct `/#selected` entry, a work-category visit, or browser Back, check that the visible rail fits and focused links remain visible.
- Reduced motion uses a steady rail and changes the theme after the static cover. Without JavaScript, `app/layout.tsx` provides static navigation with working links. Test both paths independently.
- `app/contact/page.tsx`, `app/globals.css`, and `components/site-footer.tsx` control the Contact ending. Check a short Contact page at the viewport bottom and a long one after text enlargement. The contact area should take up the remaining space when it is short. The footer ends the page cleanly and follows the content when it is long.

## Pointer, buttons, and Lab

- `app/layout.tsx` mounts one shared `PointerEffects` controller. `components/pointer-effects.tsx` handles eligible pointer zones and sets local `--pointer-x` and `--pointer-y` values.
- `components/pointer-effects.css` sets the size and intensity of `data-pointer-light` and the local `cover`, `lab`, and `button` zones. The shared light is centered on the native pointer's click coordinates. Use its paper color by default and `data-pointer-tone="navy"` on dark surfaces. The hero chooses its tone from the fold progress. The nearest eligible local zone takes over while hovered. Use `data-pointer-control` for restrained press feedback.
- The light fades on idle and clears for selection, typing, dialogs, keyboard input, and dragging. Check its center on a plain navy and paper area and near viewport edges, then check local light, dragging, and clicks. Touch and reduced motion have the same content and controls through static states.
- Put `data-reveal-print` on a selected static artwork wrapper with a direct image child. The artwork is visible in rendered HTML. Its short movement runs once. `data-motion-link` opts an existing directional glyph into a small response on a real link. Test the first visit, reentry, no JavaScript, and reduced motion. Keep title and body text steady during reading.
- Reusable buttons live in `components/ui/button.tsx`. Footer CTA layout is in `components/site-footer.tsx` and `app/globals.css`. Use an anchor with a real destination for navigation and a button for an action. Keep a visible focus outline and a comfortable touch target.
- Work card arrows, Quick View, search, and category navigation live in `components/work-archive.tsx` and `components/work-archive.module.css`. Lab desk and list layout live in `components/lab-desk.tsx` and `components/lab.module.css`. The separate fold study lives in `components/lab-fold-study.tsx`.
- The Lab desk keeps each print inside its own movement area across three, two, and one-column layouts. Check moving a print by touch, clicking or tapping its **Move** control, using the keyboard arrows with and without Shift, and resetting it. With JavaScript disabled the Lab should present the linked List and a static fold preview.
- Add Lab entries through Markdown with `lab: true`. The site gives visitors controls for viewing projects and temporarily rearranging prints.

## About portrait

`content/site.json` sets `portrait.src`, `alt`, `width`, `height`, `treatment`, and `mirror`. `app/about/page.tsx` composes the portrait and `app/globals.css` styles `.portrait-frame` and `.portrait-stock`. Keep the cutout separate from the CSS paper layers so future portraits can be replaced without editing the backdrop. Review the face, hair, headphones, and both hands at 320 px, 390 px, and desktop. Read the [content guide](editing.md) for swapping to a regular photo.

## Diagnose a regression

| Symptom | First place to inspect |
| --- | --- |
| Headline cropped or gap near the fold | Hero line splitting and media queries in the hero module. Check short landscape and 320 px portrait. |
| Poster overlaps the section heading or persists too long | Check the hero stage clipping, the print exit, and the cover reveal in its own frame. |
| Unexpected card, Lab item, or empty case route | Check `featured`, `lab`, `heroProject`, `labProject`, and the current build's publication filter. |
| Link falls back to a preview URL | Check the real HTTPS `url` in `content/site.json` and the route's metadata. Rebuild. |
| Changes are absent on the old root `index.html` | Use the production preview command or visit the Vercel output. |

The Paper Current figure was rendered in Blender and lives under `public/portfolio-media/`. Running `blender -b --factory-startup --python-exit-code 1 --python tools/blender-verify.py` checks the optional Blender tooling. The portfolio build itself requires Node.js and the lockfile.

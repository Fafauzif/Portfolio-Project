# Campaign Posters

## Design

The first screen pairs the approved headline and role with **Fieldwork**, an original print that belongs to the site even when the projects change. Newsreader carries the main voice. Inter Tight handles navigation and paragraphs. Geist Mono appears in the role, location and project context. The four chosen blues anchor the print and interface, with a quiet paper surface for the work itself.

The Work index and three project routes introduce TEDxUI, the Gandeng Foundation referral tool, and MavenPRO's research work. The graphic previews were made for the website. The profile supplied in the repository supports the public email, LinkedIn URL, and basic biographical context. The next editorial step is replacing or supplementing these illustrations with permission-cleared submissions and case material.

## Motion and artwork

- **Desktop.** Native document scroll lifts the print and opens two hinges. As the paper flattens, a horizontal mask changes the personal print into the lead work illustration. A decorative copy travels from the poster bounds to the real project image, where the live card takes over.
- **Mobile.** One hinge, a shorter scroll distance and a square composition. Fieldwork settles flat and leaves with the page as the first project arrives.
- **Accessibility.** Reduced motion displays the open print and the same links. Without JavaScript, a folded still holds the opening composition. The Work anchor and project routes remain ordinary HTML links.
- **Implementation.** CSS 3D and a single scheduled animation frame sample the scroll position. Work links, first paint and content do not depend on a timeline library. CSS can animate small supporting graphic movements where view timelines are available. Cross-document view transitions enhance project navigation where the browser supports them.
- **Original files.** `poster-print.webp` and `poster-print-mobile.webp` are the flat print textures. `poster-start.webp` and `poster-start-mobile.webp` are Cycles stills. `poster-fieldwork.blend` includes the packed print texture, paper surfaces, scene lights and camera. Use Blender 4.3 or later to reopen it.

## Design references

The project-supplied Folio Room, Leon Vasari and Zestwell examples informed tactile geometry, continuity and the staging of movement. Studio Dumbar's DEMO work informed the decision to keep the print legible while its silhouette changes. The artwork and implementation are original. See [DEMO](https://studiodumbar.com/work/demo) and the [reference notes](reference/README.md).

## Review record

Self-assessments are out of 10. Each pass considered hierarchy, art and motion, responsive access, navigation, and delivery.

| Pass | Score | What changed |
| --- | --- | --- |
| 1. First render | 8.0 | Real desktop and mobile captures exposed paper encroaching on the header and action, invisible arrow glyphs, and a hidden mobile name. |
| 2. Responsive composition | 8.5 | Refined the folded pose, gave mobile the full name, drew the arrows with CSS, and aligned the lead work image with the poster track. |
| 3. Fast paths and fallback | 8.8 | Reserved the scroll region at first paint, corrected the reduced-motion poster dimensions, and checked direct Work links under throttling. |
| 4. Handoff and interaction | 9.1 | Moved the desktop illustration into the measured Work image, made the mobile fold independent, and gave each project one keyboard stop. |
| 5. Release candidate | 9.2 | Verified the stretched cover link, compact work layout, real routes, poster switch, and reduced-motion and no-script fallbacks. |

Browser review used Chromium at 1440 × 900, 390 × 844 and 320 px, including keyboard and touch emulation. A throttled run with 4× CPU slowdown, 1.4 Mbps download and 80 ms latency measured mobile LCP around 2.0s and CLS around 0.005. The direct mobile Work link settled within 1 px of the section top. These timings describe the local emulated setup. Run device testing if the site moves to a production host.

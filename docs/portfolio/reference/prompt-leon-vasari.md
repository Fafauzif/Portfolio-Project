# Leon Vasari — VHS filmography shelf hero

> **Partial.** The intro, the four asset sheets and their exact URLs are verbatim. The 24 crop boxes and everything from the shelf physics onward were cut off in transit. Ask Fauzi to re-paste the original and replace this file. Do not reconstruct the missing parts.

---

## What it is (verbatim)

Give me the superdetailed exact prompt to recreate this page exactly as it is, including the correct asset URL, all elements, animations, and fonts. This is that prompt.

Build a single-screen **filmography hero** for a fictional film director, Leon Vasari. Use plain HTML, CSS and vanilla JavaScript in one file, with no framework, no build step and no libraries.

The page is a warm off-white sheet of paper. Across its middle runs a long, endless shelf of worn VHS tape boxes standing side by side, spine out. One tape, the active film, is pulled out of the shelf and **physically turned in 3D** so its illustrated front cover faces you. It is tilted a few degrees, lifted slightly and pushed towards the viewer.

- **Changing film:** click any spine, the arrows, a decade tab, scroll, drag or use the keyboard. The shelf slides, the open tape turns back into a spine, and the new one turns out to show its cover.
- **Caption:** the film's title, romanised Japanese title, kanji title and year sit under the shelf and slide up through a mask whenever the film changes.
- **Cursor:** a large custom ring cursor follows the mouse. It shrinks over spines and becomes a filled cobalt "OPEN / 開く" disc over the active cover.
- **Opening a film:** click the cover, the play ring or press Enter. A sheet of paper grows out of the cover, rotating from the cover's tilt to straight, until it fills the screen. It becomes a detail page whose poster bleeds in like ink blots spreading on paper, while each line of text rises out of its own mask.

Everything is driven by one `requestAnimationFrame` loop plus the Web Animations API, with no CSS keyframes. There is no opacity fade anywhere; every reveal is a mask slide, a clip or a scale.

## Media: every asset URL (verbatim)

All 24 images come from **four Higgsfield GPT Image 2.5 generation sheets** with transparent backgrounds. Each sheet is loaded through the Higgsfield image proxy as WebP, and the alpha is kept. The art is fictional, unbranded VHS art, with no real studios or logos.

Never use separate image files. Each spine and cover is a **rectangle cut out of one of these sheets** with CSS background cropping, using the exact pixel boxes below.

### Sheets

| Sheet id | Size (px) | Contents | URL |
|---|---|---|---|
| covers | 1744 × 2336 | all 12 covers in a 4 × 3 grid | https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010644_837e04ca-2418-45c1-b8e0-0233265c4cd5.png&w=1744&q=85 |
| spines | 2688 × 1152 | 12 spines in one row (9 are used: all except river, observer and storm) | https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010738_a3e47ead-18f2-4974-9468-06d16a25edc5.png&w=2688&q=85 |
| fix | 1520 × 2688 | re-drawn spines; the first one, RIVER OF SALT, is used | https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010831_3ebb874b-93dc-433e-87ed-6299aba720f0.png&w=1520&q=85 |
| fix2 | 1520 × 2688 | re-drawn spines THE OBSERVER and LIGHT IN THE STORM | https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_092020_f96bc094-db7b-46de-9298-074a24e0a3b8.png&w=1520&q=85 |

### Crop boxes

**[MISSING — this is where the source was cut off.]**

The boxes are in sheet pixels, as `x, y, w, h`. What survived of this section: "**Spines:** a tall, narrow …" — and nothing further.

---

## What to take from this one (my reading, not the prompt's words)

The parts that survive are still the most instructive thing in the whole reference set, and they are instructive for a reason that has nothing to do with 3D:

**It uses one image, cropped, instead of 24 files.** Four generation sheets become 24 assets through CSS `background-position` maths. That is a real production technique — it makes a 24-image page cost four requests, and it means the art direction is consistent because it all came out of one generation pass.

**The whole page is a shelf.** Not a carousel component on a page. The organising object *is* the navigation: spines are the menu, the pulled-out tape is the selected state, the cover turning is the transition. There is no separate "project list" UI.

**The reveal is paper.** Opening a film grows a sheet out of the cover's actual rectangle, rotating from the cover's tilt to straight. Same technique as the SIGNAL sheet, and the same technique as Noa's frame.

**"There is no opacity fade anywhere; every reveal is a mask slide, a clip or a scale."** That single sentence is the highest-leverage rule in all four references, and the SIGNAL build uses it (masks) while breaking it elsewhere (the sheet's `rise` lines, the meter fill).

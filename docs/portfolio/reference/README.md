# Reference prompts

Fauzi supplied four build prompts and asked that their practices be studied deeply and followed. `../08-craft-rules.md` holds the practices extracted from them. This folder holds the prompts themselves, because a summary loses the thing that makes them work: their level of specificity.

## What is here, and how complete it is

| File | Source | Completeness |
|---|---|---|
| `prompt-folio-room.md` | "Folio Room: interactive 3D book-orbit hero" | **Complete**, all 7 sections |
| `prompt-leon-vasari.md` | "Leon Vasari, VHS filmography shelf hero" | **Partial.** Intro, the four asset sheets and their URLs are exact. The 24 crop boxes and everything from the shelf physics onward were cut off in transit. |
| `prompt-noa-ellsworth.md` | "Noa Ellsworth" — sea, ring of site cards, sentence-as-navigation, Build view | **Partial but substantial.** Sections 6b–12 survive verbatim (ring geometry, card placement, per-frame camera, rotation, hover tilt, videos, sentence hover, Build view, opening sequence, routing, mobile, reduced motion, acceptance checklist). Sections 1–6a (palette tokens, type, the scene layers, nav, the sentence bar) are missing. |
| *(missing entirely)* | **Zestwell** — a curved gallery corridor walked in three.js; click a print, the camera glides to it | **Not saved.** Known only through the extraction in `../08-craft-rules.md`: per-component camera easing, the flyer-div technique, the step-on-load camera move, unlit materials with canvas gradient shading, and the 11px font floor. |

**Action for whoever picks this up:** ask Fauzi to re-paste the Zestwell, Leon Vasari and Noa Ellsworth prompts in full and replace the partial files. Do not guess at the missing parts and do not present reconstruction as if it were the original — the whole value of these documents is that they are exact.

## Why these four matter

They are not mood boards. Each one specifies a single idea, then executes it with no gaps: exact hex values, exact spring stiffness per property, exact clip-path insets measured from a real `getBoundingClientRect()`, exact crop boxes in source-image pixels, an acceptance checklist at the end that a reviewer can hold the build against.

The tell of all four: **one idea, executed completely.** Folio Room is "books orbit a headline." Leon Vasari is "a VHS tape is pulled out of a shelf and turned." Noa Ellsworth is "a sentence is the navigation." None of them is a layout with effects added.

`../08-craft-rules.md` is the distilled version. Read it first when planning; read these files when building, because the specifics are where the craft lives.

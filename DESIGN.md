# Fieldwork design notes

The opening takes the headline literally as the ink on a paper surface. A single navy print occupies the viewport, with a glimpse of cobalt at its corner. Native scrolling bends it along its crease and reveals the Common Ground campaign photograph. The photograph settles into the selected case’s actual cover position. The compact navigation stays available during the fold and on long case pages.

Four categories describe the kind of work someone came to see. The full archive remains searchable across fields so work can still be discovered by terms such as Blender, extensions, campaigns, or user research. Selected Work gives first-time visitors three substantial cases. The Lab provides a separate place to examine smaller prototypes and experiments. Experience and recognition point back to concrete cases.

The artwork moves between printed photographs, browser interfaces, material studies, field notes, and event ephemera. Dark navy introduces the print and digital build cases. Paper supports reading and close inspection. Cobalt marks the fold, selected copy, and the archive index. Newsreader supplies the large display type, Inter Tight supplies copy, and Geist Mono carries labels and dates.

| Interaction | Implementation |
| --- | --- |
| Full-screen print | Two physical CSS planes, native scroll geometry, reversible cover handoff |
| Compact navigation | Responsive links at the top, a smaller fixed rail on scroll, mobile menu |
| Archive | Search, shareable query/category, artifact-led cards, native quick-view panel |
| Case studies | Linked document sections, image detail controls, next-case navigation, shared cover transitions where supported |
| Lab desk | Drag and keyboard placement, stable list view, focus-managed image inspection |
| Lab fold study | Adjustable physical angle and crease in CSS, with a Blender-rendered detail in Paper Current |
| Reduced motion | One readable title and normal document flow. Native links and general content remain available without JavaScript |

The archive, dossier pages, and Lab adapt the ideas behind tilt, inspection, draggable cards, compact navigation, and scroll composition into a consistent set of original components. Animation is concentrated on changes to the object or navigation state, while long reads retain a stable text column.

Energy, rhythm, and motion are each 3 of 3 for the opening. The typesetting, blue edge, and gradually changing paper planes carry that intensity. Inside a case, spacing and movement quiet down so readers can compare the text and evidence at their own pace.

The Paper Current detail was rendered in Blender 4.3.2 with Cycles on the CPU. To reproduce the separate Blender environment check from the source directory, run `blender -b --factory-startup --python-exit-code 1 --python tools/blender-verify.py`. The check creates and renders a cube, saves a project, and exports a GLB in a temporary directory. The live site serves the detail as WebP.

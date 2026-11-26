# What to check before release

This file records the recurring portfolio review. Run it after substantial layout, interaction, or content changes.

| Pass | Reader focus | Evidence to capture |
| --- | --- | --- |
| 1. Reproduce | First visit as a recruiter trying to place the candidate quickly | Full name on About, the right Selected Work card, and the MavenPRO case at wide desktop, alongside screenshots of the starting state. |
| 2. Scan | Prospective client navigating from a project into its details | Screenshots of long case titles, actual role and project information, clear category links, and the Contact-to-footer handoff. Work search and filters reach the expected case. |
| 3. Interact | Reader scrolling at their own pace | Navy, intermediate, and paper navigation states, the reverse fold, pointer movement and idle, a native link from the hero, and no visible animation over reading or selected text. |
| 4. Access and reflow | Reader using keyboard, text enlargement, touch, reduced motion, or a browser without JavaScript | Review the fixtures in [the typography guide](maintenance.md#typography-and-reflow), including a 320 px and 200% stress check. Record automated accessibility findings plus manual focus, modal return, nav contrast, and touch dragging in the Lab. |
| 5. Release | Owner replacing the old files and previewing the delivered build | Type check, content tests, and production build. Validate the two extracted ZIPs, the Vercel source overlay, the robots policy, and the static root entry point. |

If release settings change, also build a separate copy with the intended public domain and approved project list. Verify canonical URLs, listing filters, and sitemap output before enabling indexing.

## Version 4 review record

Scores are editorial judgments from simulated recruiter, prospective client, and keyboard/mobile reading passes. Keep them separate from the results of automated checks.

| Round | Review score | Observation |
| --- | --- | --- |
| 1. Baseline, exact V3 export | 6.9/10 | About split the surname at 1920 and 2048 px. MavenPRO used three unbalanced lines and rose to five in the 320 px, 200% text stress check. Contact left 406 px of blank space below the footer in a 1100 px viewport. The Home navigation jumped from navy at 25 px of scroll to paper at 60 px, ahead of the fold. The automated baseline passed 465 of 495 checks. |
| 2. Layout and project scan | 8.2/10 | The recruiter gave 8.1, the client 8.6, and the keyboard/mobile reader 7.9. About kept the surname together at 1920 px. The résumé also passed at 1920 px, 390 px, and 320 px with text enlarged. Both Selected Work columns fit. At 1280 × 1100 px, the Contact footer ended at the viewport edge. MavenPRO put role, work type, and year before a cover that started at y=653 px, up from y=764 px. The rail stayed navy at 8% fold progress and showed intermediate tones. MavenPRO and TEDx title wrapping at 320 px with enlarged text went to Round 3. |
| 3. Motion and integration | 8.8/10 | The recruiter gave 8.6, the client 9.0, and the keyboard/mobile reader 8.8. The integrated rail reached paper around 78% progress. Its lowest sampled contrast was 5.88:1. The About pointer mark appeared during movement and faded on idle. Native pointer behavior, touch, reduced motion, and keyboard access held in the tested interactions. The artwork settled once and remained visible. At 320 px with enlarged text, MavenPRO fit as a complete word. The suite passed 505 of 506 checks. The old desktop Lab controls without JavaScript and extra-long synthetic titles went to Round 4. |
| 4. Accessibility and text reflow | 9.2/10 | The recruiter gave 9.1, the client 9.2, and the keyboard/mobile reader 9.3. A 549-of-551 mid-round pass found the Work heading cramped by the search column at 768 and 1024 px with enlarged text. The updated layout passed 84 synthetic and 102 case/archive checks. All 27 focused checks passed, including Lab mouse and touch actions, keyboard controls, restored dialog focus, and a static Lab with usable case links. The broader run returned zero findings across 44 routes and 124 route/viewport combinations. |
| 5. Archives and production replay | 9.4/10 | Both packages passed archive-integrity and extraction checks. The source overlay built through the Vercel adapter and passed all four content checks. The extracted preview contained 46 HTML files and 31 case pages. The source carried the task map and templates. The static archive contained web output only. At 280 px with 200% text and JavaScript disabled, all four primary links remained visible with no overflow. The static Lab offered five case links and the fold illustration. |

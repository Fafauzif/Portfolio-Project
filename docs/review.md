# Design and release review

Scores account for visual composition and identity, navigation and interaction, accessibility, and editorial completeness. They are design-review judgments. Browser and build findings are reported separately.

| Pass | Score | Observed and revised |
| --- | --- | --- |
| 1. First production build | 7.4/10 | The fold read on desktop. The mobile cover appeared twice, build-case navigation lacked contrast, and the full-sized poster slowed initial loading. |
| 2. Mobile composition | 8.5/10 | Enlarged and reflowed the title, cleaned up the cover’s arrival, and fixed dark case navigation. Found three remaining contrast issues on profile and contact pages. |
| 3. Integrated art and case flows | 9.0/10 | Added detailed process figures and the Lab’s Blender view. Tested archive search and navigation, then isolated a rapid-navigation view transition interruption and early hero contrast detection. |
| 4. Release candidate | 9.2/10 | Verified the transition interruption handling and explicit hero contrast, with no findings from the focused automated browser audit. Confirmed the Next.js adapter builds and serves the export in its default output mode. |
| 5. Packaged files | See the delivery review | Replayed the source ZIP over both earlier archives and checked the extracted static ZIP independently. |

The editorial pass removed redundant labels, kept page titles and wayfinding stable, and made the cases concrete through decisions, constraints, and source imagery. The main motion has a clear job at each point in the flow. Keyboard access, a no-JavaScript reading path, and reduced motion were part of the browser review. The supplied names, quotes, and portfolio records are replaceable sample content.

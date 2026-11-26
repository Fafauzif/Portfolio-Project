# Templates for the next edit

Choose the closest template. Its example values show the expected format. Replace each of them before copying the record into the site.

| Work you are adding | Copy | Destination |
| --- | --- | --- |
| Campaign or recruitment | [campaign.md](campaign.md) | `content/projects/<slug>.md` |
| Automation, tool, app, or browser extension | [digital-tool.md](digital-tool.md) | `content/projects/<slug>.md` |
| Client research or consulting | [consulting.md](consulting.md) | `content/projects/<slug>.md` |
| Competition, research proposal, or policy case | [competition.md](competition.md) | `content/projects/<slug>.md` |
| Article, speech, or facilitation | [editorial.md](editorial.md) | `content/projects/<slug>.md` |
| Visual prototype or interactive experiment | [lab.md](lab.md) | `content/projects/<slug>.md` |
| Organization, award, or accredited quote | [profile-records.json](profile-records.json) | Copy one object into its corresponding array in `content/site.json`. |
| Track what is ready to publish | [project-inventory-record.json](project-inventory-record.json) | Copy one object into `projects` in `docs/content-inventory.json`. |

For a new case, match `slug` to the destination filename, replace all copy, add actual media to `public/portfolio-media/`, and update the inventory. The template files under `docs/` are only editing aids. The general-purpose case template is also available at `content/projects/_template.md`.

Run `npm test` after changing slugs, linked cases, or images. Follow [the editing guide](../editing.md) and [the release guide](../release.md) for a full preview.

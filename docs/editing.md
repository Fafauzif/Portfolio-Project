# Edit the portfolio content

`content/site.json` supplies shared identity and profile data. `content/projects/*.md` supplies cards and cases. `docs/content-inventory.json` records which material still needs review and where to replace it.

## Replace visible personal details

1. Edit `name`, `initials`, `role`, `intro`, `about`, `skills`, and `location` in `content/site.json`. `tagline` is the exact hero question. Check [UI maintenance](maintenance.md) if changing its length or line breaks.
2. Put a cleared photo in `public/portfolio-media/`. Set `portrait.src` to its URL path, for example `/portfolio-media/fauzi-portrait.webp`, and set `portrait.alt` to a short, accurate description. Check the crop on About.
3. Set `contact.email` to a public inbox and add `contact.linkedin` as a full HTTPS URL if approved. Check the copy control and mail link on Contact.
4. Edit `experience` and `recognition` in the same file. `experience[].projects` is an array of case slugs. `recognition[].project` is an optional single case slug. The web résumé uses these data. Refresh the download by printing `/resume/` to PDF in the browser, putting the file in `public/portfolio-media/`, and updating `resume` if its filename changed.
5. Add `testimonials` only for exact approved quotes with publishable attributions. Omitting the field hides the section.

## Add or replace a case

1. Choose a [template](templates/README.md). Save a copy in `content/projects/`, for example `campus-week.md`, and set the YAML `slug` to the same basename. Use lowercase words separated by hyphens. A filename beginning with `_` is ignored by the app.
2. Choose `strategy`, `builds`, `competitions`, or `editorial` for `category`. Give `kind` a more specific label such as `Campaign`, `App`, `Client consulting`, or `Policy proposal`. Fill `year`, `role`, `client`, and `tags`. For an independent project, `client` can describe its setting.
3. Place a 4:3 cover in `public/portfolio-media/`. Use `/portfolio-media/<filename>` in `cover` and describe the image in `imageAlt`. `previewCover` can point to a lighter crop with the same proportions. Prefer WebP or AVIF with enough quality to read important text.
4. Write the body under the second `---`. Level-two headings become section links. Keep the summary useful on its own. Support results with a permitted source and credit your role accurately. Add a supporting image with `![What it shows](/portfolio-media/campus-week-process.webp)`.
5. Keep `featured: false` unless the work belongs on Home. Set `lab: true` if it should appear on the Lab desk and list. A Lab case can specify `inspectCover` and `inspectAlt` for a separate detail image.
6. Add or update its inventory record and check all references. If replacing a case at an existing public URL, keep its slug where the new content describes the same work. For a new case at a new slug, add it separately and check for old inbound links.

### Content wiring

`heroProject` selects the first featured case and its cover is the sheet's reverse side. The two other featured projects appear in the order returned by the content loader. `labProject` selects the Home Lab image and must point to a case with `lab: true`. The Work archive lists all cases available in the current build mode. In public mode, `publishedProjects` selects those cases.

### Review status

Track `titleStatus`, `bodyStatus`, and `mediaStatus` separately in the inventory. A real title can have a draft body and an illustrative cover. Confirm each before indexing. Keep editorial notes in the inventory. Case Markdown is rendered to the website.

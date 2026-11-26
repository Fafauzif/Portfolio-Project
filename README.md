# Fauzi Fadhlurrohman · Portfolio

A buildless portfolio site with an original folded print, Selected Work, direct project URLs and an About page.

## Apply the revision

Extract **Portfolio_Project_Revision.zip** into the existing repo directory, where `index.html` and `tools/` already live. Allow the archive to replace files with matching names. The archive entries start at the repo root.

From that directory, run:

```sh
node tools/serve.mjs
```

Open [http://127.0.0.1:4321/](http://127.0.0.1:4321/). Run `node --test` from the same directory for structural and legacy regression tests. No installation or build step is required. Relative paths support static hosting at the domain root or at a repository subpath.

## Edit the site

| File | Role |
| --- | --- |
| `index.html` | Homepage, work previews and contact |
| `work/` | Work index and three project pages |
| `about/index.html` | About and contact |
| `assets/css/portfolio.css` | Shared design and homepage layout |
| `assets/css/pages.css` | Interior layouts and project illustrations |
| `assets/css/portfolio-motion.css` | Paper geometry, material and motion layers |
| `assets/js/portfolio-motion.js` | Native-scroll pose and handoff |
| `assets/img/poster-fieldwork.blend` | Editable, packed Blender source for the personal print |

Project pages contain short introductions and illustrations created for this site. Full case studies and original campaign submissions can be added to the same URLs later. The old SIGNAL prototype assets remain available for reference in the repository history and supporting files.

See [design and motion notes](docs/portfolio/campaign-posters.md) for review decisions and technical details.

# Fauzi Fadhlurrohman portfolio

A static Next.js portfolio for campaigns, consulting, digital tools, proposals, and experiments. The home print folds into the cover of G-Consulting Mentee Recruitment. Case studies use Markdown and profile data uses JSON.

## Use this package

Extract `Portfolio_Vercel_Source_v4.zip` into the existing project directory and accept **Replace All**. `package.json`, `app/`, and `vercel.json` should be at the root. Earlier static `index.html` files may still be present in an existing checkout. The current site builds from `app/` and serves the export in `out/`.

Use Node.js 22 or 24.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a production preview, run `npm run build` and `npm run preview -- 4173`, then open [localhost:4173](http://localhost:4173).

## Edit or extend the portfolio

| Need | Open |
| --- | --- |
| Give a coding agent instructions | [AGENTS.md](AGENTS.md) |
| Replace text, projects, assets, or credentials | [Content guide](docs/editing.md) |
| Identify review status and files still to replace | [Content inventory](docs/content-inventory.json) |
| Start with a ready-to-copy structure | [Templates](docs/templates/README.md) |
| Adjust typography, responsive layouts, the fold, pointer effects, or buttons | [UI maintenance](docs/maintenance.md) |
| Check behavior before releasing a change | [Release review](docs/review.md) |
| Deploy, switch domains, enable indexing, or prepare a ZIP | [Release guide](docs/release.md) |

The site ships in preview mode pending the final domain and content approval. The editable stack is Next.js App Router, TypeScript, Tailwind CSS v4, and shadcn-compatible primitives. Interaction uses CSS transforms, browser APIs, and Motion for the Lab.

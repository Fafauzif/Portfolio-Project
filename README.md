# Fieldwork portfolio

An editorial portfolio for strategy, campaigns, digital tools, proposals, and experiments. The opening headline folds into the first case study cover. The work archive contains 25 editable case studies, and the Lab adds a movable desk, close-up inspection, and a paper-folding study.

## Run locally

Use Node.js 22 or 24. Run these commands from the directory containing `package.json`.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To test the same static output used for deployment:

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run preview -- 4173` uses a different port. The preview serves `out/` and uses the generated 404 page.

## Update the existing repository

Extract `Portfolio_Vercel_Source.zip` into the existing project directory. Accept **Replace All** when prompted. After extraction, `package.json`, `vercel.json`, and `app/` belong at the same level as the older `index.html`. The app routes and production build live under `app/` and `out/` respectively. Older static files can stay in the working directory during migration.

## Deploy to Vercel

Import the extracted source directory as a Git project or run the Vercel CLI from that directory. Keep the **Next.js** framework preset and the directory containing `package.json` as the project root. Leave **Output Directory** on its default setting. The included `vercel.json` runs `npm run build`, and the Next.js adapter discovers the static export in `out/`. Select Node.js 22 or 24 in the project settings. No secrets or external services are required for the included site.

For a static host, extract `Portfolio_Static_Export.zip` so its `index.html` sits at the hosting root beside `_next/`. Configure directory indexes and use `404.html` for missing pages. Both archives are set up for hosting at the root of a domain or subdomain.

## Replace the sample portfolio

Start with [the content guide](docs/editing.md). It maps each visible section to the source file an editor or coding agent should change. The bundled identity, projects, client names, testimonials, recognitions, portrait, contact address, and résumé are sample material. `preview` in `content/site.json` defaults to `true`, which applies noindex metadata and blocks crawling in `robots.txt` until the real portfolio is ready.

The source uses Next.js App Router, TypeScript, Tailwind CSS v4, shadcn-compatible primitives, Motion, CSS 3D transforms, and local Markdown and JSON. The exported site is static. The main motion, interaction, and layout decisions are recorded in [DESIGN.md](DESIGN.md).

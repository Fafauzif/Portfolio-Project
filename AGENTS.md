<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Start here

1. Run commands from the directory containing `package.json`. Use Node.js 22 or 24 and `npm ci` on a fresh checkout.
2. Find the requested task in the table below. Start with its source file and keep the edit scoped to that task.
3. Check `docs/content-inventory.json` before promoting, indexing, or making a factual claim about a project. Update its entry when a title, slug, source status, or asset changes.
4. Run the checks below and review the changed route in the browser.

| Task | Start here | Check after editing |
| --- | --- | --- |
| Change name, initials, role, introduction, contact, photo, or links | `content/site.json` | Header, Home, About, Contact, résumé, and metadata. Store site media in `public/portfolio-media/`. |
| Change the hero words | `content/site.json` → `tagline` | `components/fold-hero.tsx` controls displayed breaks. Verify a full, readable question at 320 px, in landscape, and on desktop. |
| Change the poster that unfolds | `content/site.json` → `heroProject`, then the matching project's `cover` and `previewCover` | Set that project's `featured` to `true`. Check the poster in the fold, landing cover, Work card, and full case. |
| Add or revise a case | `docs/templates/README.md` and `content/projects/<slug>.md` | YAML `slug` matches the filename. Images and links resolve. The inventory entry matches the case. |
| Change a project URL | Project filename and `slug` | Update `heroProject`, `labProject`, `publishedProjects`, experience and recognition slugs, Markdown links, and the inventory. See `docs/release.md` for redirects. |
| Change category names or summaries | `lib/content.ts` → `CATEGORIES` | Change `label` and `description` to preserve URLs. An `id` change also requires editing each affected case and public link. |
| Add Lab work or a detail view | Project Markdown → `lab`, `inspectCover`, `inspectAlt`; `content/site.json` → `labProject` | Check Desk, List, inspection, keyboard controls, and the Home Lab feature. |
| Change Experience or Recognition | `content/site.json`; templates in `docs/templates/` | Check project slugs, organizations, dates, and individual vs. team attribution. The web résumé also reads this data. |
| Replace the PDF résumé | `content/site.json` → `resume`; PDF in `public/portfolio-media/` | Keep the HTML résumé, downloadable PDF, and profile in sync. |
| Change buttons, motion, pointer behavior, or styling | `docs/maintenance.md` | Verify touch, keyboard focus, reduced motion, and the no-JavaScript path for essential links. |
| Set the domain, edit search metadata, or prepare an export | `docs/release.md` | Verify deployment mode, approved cases, canonical URLs, robots directives, and sitemap. |

## Content and deployment boundaries

- Treat `content/` as the editable copy and `app/` and `components/` as the presentation. Rebuild `out/` from source after every edit.
- Treat `docs/content-inventory.json` as internal editorial data. Keep it, private evidence, contact details without permission, and draft attribution notes outside `public/`. Describe team outcomes and personal contributions separately.
- Keep `output: 'export'` and the project root fixed for Vercel. Every content route must build statically. Keep text and links usable without JavaScript.
- Preserve one accessible hero `h1`, one native link to `#selected`, one `[data-fold-landing]` target, and normal document scrolling. Keep the system cursor and ensure pointer effects never intercept a link, keyboard focus, or drag.

## Verify changes

```sh
npm run typecheck
npm test
npm run build
npm run preview -- 4173
```

Use `http://localhost:4173` to check the exported pages. For hero edits, test a fresh visit, scrolling in both directions, opening `/#selected` directly, and using the CTA from the keyboard. Check at 320, 390, 768, and 1440 px, plus a short landscape viewport. Read any test failure before editing the corresponding source file.

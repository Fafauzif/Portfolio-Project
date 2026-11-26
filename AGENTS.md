<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Portfolio content

- Profile and site settings are in `content/site.json`. Cases use local Markdown in `content/projects/`.
- Use `content/projects/_template.md` for new cases and `docs/editing.md` for replacement guidance.
- The site is a static export. Keep all user-facing routes compatible with `output: 'export'`.
- Maintain the single home heading, native scroll and reduced-motion route through the hero, and keyboard controls for dialogs and the Lab.
- Check changes with `npm run typecheck`, `npm test`, and `npm run build`.

# Build, deploy, and publish

## Test a source change

Use Node.js 22 or 24 and run the commands from the directory containing `package.json`.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run preview -- 4173
```

Check Home, Work, every edited case, Lab, About, the résumé download, Contact, and `/robots.txt` at [localhost:4173](http://localhost:4173). A representative browser check covers keyboard operation, touch or touch emulation, reduced motion, 320 px portrait, short landscape, and desktop.

## Vercel source ZIP

Extract `Portfolio_Vercel_Source_v5.zip` over the existing repo. In Vercel, import that repo, select the **Next.js** preset, and use the directory containing `package.json` as the root. Leave **Output Directory** at its preset default. The existing `vercel.json` runs `npm run build`, and Next.js emits the static site to `out/`. Keep both `package.json` and `package-lock.json` with the source.

## Static ZIP

Extract `Portfolio_Static_Export_v5.zip` to a static host's document root. `index.html` and `_next/` should sit directly there. Use directory index handling and `404.html` as the error page. To regenerate it, build, then archive the contents of `out/` at the ZIP root. Source docs and the inventory belong with the source package.

## Move from preview to a public domain

1. Review every project and profile field against [the inventory](content-inventory.json). Clear the contact details, portrait, PDF, and use of any organization artwork. Make sure `heroProject` and featured cases are ready for public use.
2. Set `url` in `content/site.json` to the confirmed HTTPS origin, such as `https://portfolio.example.com`. Replace the example with the real domain.
3. Set `publishedProjects` to a nonempty array of approved slugs. The public build uses this list for case routes, categories, and the sitemap. Every link from an approved case to another case must resolve within that list.
4. Set `preview` to `false` for the intended public build. Align `heroProject`, `labProject`, experience project links, and recognition items with the approved project set. Include an approved `lab: true` case if the public Lab should show project items.
5. Review `/robots.txt`, `/sitemap.xml`, the canonical URL on a case, About's `ProfilePage` metadata, and links from Work. Check that excluded draft cases are absent from the export. Keep important role, project, and outcome information in HTML so visitors can read it without JavaScript.
6. If a published URL changes, add a permanent redirect on the host from the old path to its new destination. Test both paths before sharing the new URL.

Preview mode uses `noindex` and restrictive robots directives. Use the host's access controls when a preview must be private. Google and OpenAI search visibility depend on crawler access and indexing. The public policy allows `OAI-SearchBot`. Set `allowTrainingBots` only if you also want to permit `GPTBot` crawling for training. See `app/robots.ts`.

Public folder files have direct URLs even when no page links to them. The build's `postbuild` task uses `tools/prune-legacy-preview.mjs` to remove two retired profile assets from the generated export when the ZIP overlays an earlier version. Review other items under `public/portfolio-media/` for material that should stay private. Keep private assets outside the served project or use the host's access controls. Verify the contents of `out/` after rebuilding.

## Change titles and search metadata

`app/layout.tsx` supplies the site title template, general description, and robots settings. `lib/site-metadata.ts` supplies canonical URLs when a site origin is set and public mode is enabled. Case titles, descriptions, and share images come from the respective Markdown fields. `app/about/page.tsx` defines the profile structured data from the public profile. Keep those values aligned with what the page shows.

## What to archive

Include `app/`, `components/`, `content/`, `docs/`, `lib/`, `public/`, `checks/`, `tools/`, the root configs, README, and AGENTS in the source ZIP. Keep generated output, dependency installs, private attachments, and Git data outside it. If updating a legacy repo with Replace All, old files can remain on disk. Always inspect the generated export to see what the host will actually serve.

# Replace the portfolio content

| Content | Location |
| --- | --- |
| Name, initials, hero line, introduction, biography, portrait, skills, email, and LinkedIn | `content/site.json` |
| Experience, recognition, testimonials, and connections to projects | `content/site.json` |
| Case studies and project thumbnails | `content/projects/*.md` and `public/portfolio-media/` |
| Hero project and home Lab teaser | `heroProject` and `labProject` in `content/site.json` |
| Lab prints | Project case files with `lab: true` |
| Web résumé | Generated from the profile and experience in `content/site.json` |
| Downloadable PDF résumé | `resume` in `content/site.json` and its PDF in `public/portfolio-media/` |
| Work category labels and summaries | `CATEGORIES` in `lib/content.ts` |

## Edit profile and contact details

Update the site JSON first. Set `contact.email` to a real inbox, and add `contact.linkedin` as a full HTTPS URL if desired. Update `portrait.src` and `portrait.alt`, then replace the PDF. The optional `testimonials` property can be removed or set to an empty array. Use approved quotes and publishable names there. Experience and recognition records can link to cases by `slug`. Keep a replacement hero headline close to the original length and check the fold at 320 px and desktop widths.

## Add or update a project

1. Copy `content/projects/_template.md` to a new file such as `field-study.md`. Make its `slug` match the filename and use lowercase words separated by hyphens.
2. Pick `strategy`, `builds`, `competitions`, or `editorial` as its `category`. Use `kind` for a more specific label, such as `3d`, `webapp`, `extension`, `campaign`, or `case competition`. Add searchable `tags`, a clear `role`, and a one-sentence `summary`.
3. Put a 4:3 cover image in `public/portfolio-media/` and use its `/portfolio-media/...` URL in `cover`. Describe what the image shows in `imageAlt`. `previewCover` can point to a lighter 4:3 version of the same art. Lab items can also specify `inspectCover` and the matching `inspectAlt` for a closer or alternate view.
4. Write the case below the second `---` separator. Level-two headings create the case navigation. Show the context, your responsibility, a concrete choice, what you shipped or tested, and what you learned. Add inline images with `![Description](/portfolio-media/asset.webp)` where the reader needs to see evidence.
5. Set `featured: true` for headline projects. The homepage shows the case named by `heroProject` plus up to two other featured cases. `lab: true` makes a project available in the Lab. Each case remains accessible in the complete Work archive and its category.

When changing a public slug, update `site.json` references and any Markdown links to the case. After the site goes live, add a redirect at the host if you need to preserve inbound links to an old path.

## Release with real content

Set `url` to the final origin, such as `https://portfolio.example.com`, and change `preview` to `false` when the replacement content is ready to index. The site generates robots and sitemap from these settings and uses the domain in social image URLs. Review contact links, testimonial attributions, résumé, portrait, and every featured case before publishing. Run `npm test` and `npm run build` after changes, then check the exported site with `npm run preview`.

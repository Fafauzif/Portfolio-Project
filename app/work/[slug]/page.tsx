import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import CaseInspection from "@/components/case-inspection";
import CaseSections from "@/components/case-sections";
import WorkArrow from "@/components/work-arrow";
import { CATEGORIES, getProjects } from "@/lib/content";
import { withCanonical } from "@/lib/site-metadata";
import styles from "@/components/case-study.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function estimateTitleWordWidth(word: string) {
  return Array.from(word).reduce((width, character) => {
    if (/[MWmw@]/u.test(character)) return width + .96;
    if (/[fiIjlt1]/u.test(character)) return width + .34;
    if (/[r’'.:\-]/u.test(character)) return width + .42;
    if (/[a-z0-9]/u.test(character)) return width + .6;
    return width + .8;
  }, 0);
}

function CaseTitle({ title }: { title: string }) {
  const [first, ...partners] = title.split(" × ");
  const words = title.split(/\s+/).filter(word => word !== "×");
  const longestWidth = Math.max(
    1,
    ...words.map(estimateTitleWordWidth),
    ...partners.map(partner => estimateTitleWordWidth(partner.split(/\s+/, 1)[0]) + .8),
  );
  const longWord = words.some(word => Array.from(word).length > 17);
  const fit = { "--title-fit": `${100 / longestWidth}cqi` } as CSSProperties;

  return (
    <h1 className={styles.title} data-long-title={title.length > 22} data-long-word={longWord} style={fit}>
      {first}{partners.map((partner, index) => (
        <span className={styles.titlePartner} key={index}>{" "}<span className={styles.join}>×</span>{" "}{partner}</span>
      ))}
    </h1>
  );
}

function prepareCaseBody(html: string) {
  const headings: { id: string; title: string }[] = [];
  const seen = new Set<string>();
  const body = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, content: string) => {
    const title = content.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
    const base = "section-" + (title.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "notes");
    let id = base;
    for (let index = 2; seen.has(id); index++) id = `${base}-${index}`;
    seen.add(id);
    headings.push({ id, title });
    return `<h2 id="${id}">${content}</h2>`;
  });
  const illustratedSection = body.match(/<h2 id="([^"]+)">(?:(?!<h2 ).)*?<img /s)?.[1];
  const annotatedSection = illustratedSection ?? headings.find(heading => /\b(decision|turning point|choice)\b/i.test(heading.title))?.id ?? headings[1]?.id;
  const annotatedBody = annotatedSection ? body.replace(`<h2 id="${annotatedSection}">`, `<h2 id="${annotatedSection}" data-case-decision>`) : body;
  const illustratedBody = annotatedBody.replace(/<p>\s*(<img [^>]+>)\s*<\/p>/g, (_, img: string) => {
    const alt = img.match(/\balt="([^"]*)"/)?.[1];
    const caption = alt ? `<figcaption aria-hidden="true">${alt}</figcaption>` : "";
    return `<figure>${img.replace("<img ", '<img loading="lazy" decoding="async" ')}${caption}</figure>`;
  });
  return { body: illustratedBody, headings };
}

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjects().find(item => item.slug === slug);
  if (!project) return {};
  return withCanonical(`/work/${project.slug}/`, {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: [{ url: project.cover, alt: project.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: project.title, description: project.summary, images: [{ url: project.cover, alt: project.imageAlt }] },
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = getProjects();
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const category = CATEGORIES.find(item => item.id === project.category);
  const { headings, body } = prepareCaseBody(project.html);
  const related = projects
    .filter(other => other.slug !== slug)
    .sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category))
    .slice(0, 3);
  const build = project.category === "builds";
  const transitionName = `case-${project.slug}`;
  const accent = project.accent ? { "--case-accent": project.accent } as CSSProperties : undefined;

  return (
    <main className={styles.case} data-category={project.category} id="main-content" tabIndex={-1} style={accent}>
      <header className={styles.head} data-pointer-tone={build ? 'navy' : undefined}>
        <div className={styles.wrap}>
          <nav className={styles.trail} aria-label="Browse work">
            <a href="/work/" data-pointer-control>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
                <path d="M13 8H3m0 0 4-4M3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
              All work
            </a>
            {category && <a href={`/work/category/${category.id}/`} data-pointer-control>{category.label}</a>}
          </nav>
          <div className={styles.intro}>
            <div className={styles.titleArea}><CaseTitle title={project.title} /></div>
            <div className={styles.lead}>
              <p className={styles.summary}>{project.summary}</p>
              <dl className={styles.projectFacts}>
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Project type</dt><dd>{project.kind}</dd></div>
                <div><dt>Year</dt><dd><time dateTime={String(project.year)}>{project.year}</time></dd></div>
              </dl>
            </div>
          </div>
          {build ? <div className={styles.heroImage}><CaseInspection cover={project.cover} imageAlt={project.imageAlt} transitionName={transitionName} /></div> :
            <figure className={styles.heroImage}>
              <div data-case-cover data-reveal-print style={{ viewTransitionName: transitionName }}><img src={project.cover} alt={project.imageAlt} width={1200} height={900}
                fetchPriority="high" decoding="async" /></div>
            </figure>}
        </div>
      </header>

      <div className={`${styles.wrap} ${styles.caseBody}`}>
        <aside className={styles.margins} aria-label="Case study details">
          <div className={styles.marginContent}>
            <dl className={styles.facts}>
              <div><dt>Context</dt><dd>{project.client}</dd></div>
              {!!project.tags.length && <div><dt>Scope</dt><dd>{project.tags.join(", ")}</dd></div>}
            </dl>
            {headings.length > 0 && <CaseSections headings={headings} />}
          </div>
        </aside>
        <article className={styles.article} aria-label={`${project.title} case study`}>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </article>
      </div>

      {related.length > 0 && <section className={styles.more} aria-labelledby="related-title">
        <div className={styles.wrap}>
          <div className={styles.moreHeading}>
            <h2 id="related-title">Related work</h2>
            <a href="/work/">See all work <WorkArrow /></a>
          </div>
          <div className={styles.related}>
            {related.map(other => (
              <a href={`/work/${other.slug}/`} key={other.slug} className={styles.relatedLink}>
                <img src={other.cover} alt="" width={1200} height={900} loading="lazy" decoding="async" />
                <h3>{other.title}</h3>
                <p>{other.kind} <time dateTime={String(other.year)}>{other.year}</time></p>
              </a>
            ))}
          </div>
        </div>
      </section>}
    </main>
  );
}

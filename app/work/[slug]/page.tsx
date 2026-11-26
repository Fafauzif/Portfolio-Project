import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import CaseInspection from "@/components/case-inspection";
import CaseSections from "@/components/case-sections";
import WorkArrow from "@/components/work-arrow";
import { CATEGORIES, getProjects } from "@/lib/content";
import styles from "@/components/case-study.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: [{ url: project.cover, alt: project.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: project.title, description: project.summary, images: [{ url: project.cover, alt: project.imageAlt }] },
  };
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
      <header className={styles.head}>
        <div className={styles.wrap}>
          <nav className={styles.trail} aria-label="Case study breadcrumbs">
            <a href="/work/">Work</a>
            <span aria-hidden="true">/</span>
            <a href={`/work/category/${project.category}/`}>{category?.label}</a>
          </nav>
          <div className={styles.intro}>
            <div>
              <p className={styles.kind}>{project.kind} <span aria-hidden="true">/</span> {project.year}</p>
              <h1>{project.title}</h1>
            </div>
            <p className={styles.summary}>{project.summary}</p>
          </div>
          {build ? <div className={styles.heroImage}><CaseInspection cover={project.cover} imageAlt={project.imageAlt} transitionName={transitionName} /></div> :
            <figure className={styles.heroImage}>
              <div data-case-cover style={{ viewTransitionName: transitionName }}><img src={project.cover} alt={project.imageAlt} width={1200} height={900}
                fetchPriority="high" decoding="async" /></div>
              <figcaption>{project.title} <span aria-hidden="true">/</span> {project.client}</figcaption>
            </figure>}
        </div>
      </header>

      <div className={`${styles.wrap} ${styles.caseBody}`}>
        <aside className={styles.margins} aria-label="Case study details">
          <div className={styles.marginContent}>
            <dl className={styles.facts}>
              <div><dt>Role</dt><dd>{project.role}</dd></div>
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
                <p>{other.kind} <span aria-hidden="true">/</span> {other.year}</p>
                <h3>{other.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>}
    </main>
  );
}

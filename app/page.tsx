import FoldHero from '@/components/fold-hero';
import { Button } from '@/components/ui/button';
import { ProfileHeading } from '@/components/profile-heading';
import { CATEGORIES, categoryLabel, getProjects, getSite, type Project } from '@/lib/content';
import { withCanonical } from '@/lib/site-metadata';
import type { CSSProperties } from 'react';
import Image from 'next/image';

function ProjectMedia({ project, landing, reveal }: { project: Project; landing?: boolean; reveal?: boolean }) {
  const style = { '--cover-transition': 'case-' + project.slug } as CSSProperties;
  return (
    <div className="home-cover" style={style} data-fold-landing={landing ? '' : undefined} data-reveal-print={reveal ? '' : undefined}
      data-pointer-zone={landing ? 'cover' : undefined}>
      <Image src={project.previewCover ?? project.cover} alt={project.imageAlt} width={1200} height={900}
        loading={landing ? 'eager' : 'lazy'} fetchPriority={landing ? 'high' : undefined} />
    </div>
  );
}

export function generateMetadata() {
  return withCanonical('/');
}

export default function Home() {
  const site = getSite();
  const all = getProjects();
  const featured = all.filter(project => project.featured);
  const featuredLeading = featured.find(project => project.slug === site.heroProject) ?? featured[0] ?? all[0];
  const companion = featured.filter(project => project !== featuredLeading).slice(0, 2);
  const lab = all.find(project => project.slug === site.labProject) ?? all.find(project => project.lab);

  return (
    <main id="main-content" tabIndex={-1}>
      <FoldHero cover={featuredLeading.previewCover ?? featuredLeading.cover} headline={site.tagline} workHref="#selected" />

      <section className="selected wrap" id="selected" aria-labelledby="selected-title">
        <div className="selected-head">
          <h2 id="selected-title">Selected <em>work.</em></h2>
          <Button variant="outline" asChild><a href="/work/" data-motion-link>Browse all projects <span className="diagonal" aria-hidden="true" /></a></Button>
        </div>
        <article className="home-feature">
          <a href={'/work/' + featuredLeading.slug + '/'} className="home-project-link" aria-labelledby={'selected-' + featuredLeading.slug} data-motion-link>
            <ProjectMedia project={featuredLeading} landing />
            <div className="home-feature-info">
              <p className="project-meta"><span>{featuredLeading.role}</span><time dateTime={String(featuredLeading.year)}>{featuredLeading.year}</time></p>
              <h3 id={'selected-' + featuredLeading.slug}>{featuredLeading.title}</h3>
              <p>{featuredLeading.summary}</p>
              <span className="link-label">Read the case <span className="diagonal" aria-hidden="true" /></span>
            </div>
          </a>
        </article>

        <div className="home-companions">
          {companion.map(project => (
            <article key={project.slug}>
              <a href={'/work/' + project.slug + '/'} className="home-project-link" aria-labelledby={'selected-' + project.slug} data-motion-link>
                <ProjectMedia project={project} reveal />
                <p className="project-meta"><span>{categoryLabel(project.category)}</span><time dateTime={String(project.year)}>{project.year}</time></p>
                <h3 id={'selected-' + project.slug}><span>{project.title.replace(/ × /g, ' ×\u00a0')}</span><span className="diagonal" aria-hidden="true" /></h3>
                <p>{project.summary}</p>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="directory" aria-labelledby="directory-title">
        <div className="wrap directory-layout">
          <h2 id="directory-title">Find the work<br />you came <em>for.</em></h2>
          <div className="directory-links">
            {CATEGORIES.filter(category => all.some(project => project.category === category.id)).map(category => (
              <a href={'/work/category/' + category.id + '/'} key={category.id} data-motion-link>
                <div><h3>{category.label}</h3><p>{category.description}</p></div>
                <span className="diagonal" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {lab && <section className="lab-feature" aria-labelledby="home-lab-title">
        <div className="wrap lab-feature-grid">
          <div>
            <h2 id="home-lab-title">Things I made<br />to <em>find out.</em></h2>
            <p>Small tools, moving studies, and prototypes that started with a question worth testing.</p>
            <a href="/lab/" className="link-label" data-motion-link>Open the Lab <span className="diagonal" aria-hidden="true" /></a>
          </div>
          <a href={'/work/' + lab.slug + '/'} aria-label={'View ' + lab.title}><ProjectMedia project={lab} reveal /></a>
        </div>
      </section>}

      <section className="home-about wrap" aria-labelledby="home-about-title">
        <div>
          <ProfileHeading name={site.name} as="h2" id="home-about-title" />
          <p>{site.intro}</p>
          <a className="link-label" href="/about/" data-motion-link>Read more about my work <span className="diagonal" aria-hidden="true" /></a>
        </div>
      </section>
    </main>
  );
}

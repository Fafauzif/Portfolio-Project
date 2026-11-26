import type { Metadata } from 'next';
import { InteriorHeader } from '@/components/interior-header';
import { getProjects, getSite } from '@/lib/content';

export const metadata: Metadata = { title: 'Recognition' };

export default function RecognitionPage() {
  const { recognition } = getSite();
  const projects = new Map(getProjects().map(project => [project.slug, project]));
  return (
    <main className="interior recognition-page wrap" id="main-content" tabIndex={-1}>
      <InteriorHeader eyebrow="Recognition" lead="A record of projects selected by juries, panels, and readers.">Awards &amp;<br /><em>distinctions.</em></InteriorHeader>
      <div className="recognition-ledger">
        {recognition.map(entry => {
          const project = entry.project ? projects.get(entry.project) : undefined;
          return (
            <article key={entry.organization}>
              <p className="eyebrow">{entry.year}<br />{entry.distinction}</p>
              <div><h2>{entry.title}</h2><p>{entry.organization}</p></div>
              {project && <a className="link-label" href={'/work/' + project.slug + '/'}>{project.title} <span className="diagonal" aria-hidden="true" /></a>}
            </article>
          );
        })}
      </div>
    </main>
  );
}

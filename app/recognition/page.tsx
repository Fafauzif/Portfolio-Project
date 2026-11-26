import { InteriorHeader } from '@/components/interior-header';
import { getProjects, getSite } from '@/lib/content';
import { withCanonical } from '@/lib/site-metadata';

export const generateMetadata = () => withCanonical('/recognition/', { title: 'Recognition', description: 'Selected awards and distinctions for portfolio work.' });

export default function RecognitionPage() {
  const { recognition } = getSite();
  const projects = new Map(getProjects().map(project => [project.slug, project]));
  return (
    <main className="interior recognition-page wrap" id="main-content" tabIndex={-1}>
      <InteriorHeader>Awards &amp;<br /><em>distinctions.</em></InteriorHeader>
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

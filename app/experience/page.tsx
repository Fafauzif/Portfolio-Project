import { InteriorHeader } from '@/components/interior-header';
import { getProjects, getSite } from '@/lib/content';
import { withCanonical } from '@/lib/site-metadata';

export const generateMetadata = () => withCanonical('/experience/', { title: 'Experience', description: 'Roles, responsibilities, and the work behind them.' });

export default function ExperiencePage() {
  const { experience } = getSite();
  const projects = new Map(getProjects().map(project => [project.slug, project]));
  return (
    <main className="interior wrap" id="main-content" tabIndex={-1}>
      <InteriorHeader>Where I’ve <em>worked.</em></InteriorHeader>
      <ol className="experience-ledger">
        {experience.map(entry => (
          <li key={entry.organization + entry.title}>
            <p className="eyebrow">{entry.period}</p>
            <div>
              <p className="org-name">{entry.organization}</p>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
              <ul className="related-pills" aria-label={'Work at ' + entry.organization}>
                {entry.projects.map(slug => {
                  const project = projects.get(slug);
                  return project && <li key={slug}><a href={'/work/' + slug + '/'}>{project.title} <span className="diagonal" aria-hidden="true" /></a></li>;
                })}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}

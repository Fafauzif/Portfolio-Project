import { Button } from '@/components/ui/button';
import { getSite } from '@/lib/content';
import { withCanonical } from '@/lib/site-metadata';

export const generateMetadata = () => withCanonical('/resume/', { title: 'Résumé', description: `${getSite().name}’s experience, areas of practice, and selected recognition.` });

export default function ResumePage() {
  const site = getSite();
  return (
    <main className="interior resume-page wrap" id="main-content" tabIndex={-1}>
      <div className="resume-top"><p className="eyebrow">Résumé</p>
        {site.resume && <Button asChild><a href={site.resume} download>Download PDF <span className="diagonal" aria-hidden="true" /></a></Button>}
      </div>
      <article className="resume-document">
        <header><h1>{site.name}</h1><p>{site.role}</p><span>{site.location}</span></header>
        <p className="resume-profile">{site.intro}</p>
        <section aria-labelledby="res-exp">
          <h2 id="res-exp">Experience</h2>
          {site.experience.map(entry => <div className="resume-entry" key={entry.title + entry.organization}>
            <div><h3>{entry.title}</h3><strong>{entry.organization}</strong><p>{entry.summary}</p></div><small>{entry.period}</small>
          </div>)}
        </section>
        <section aria-labelledby="res-skills">
          <h2 id="res-skills">Areas of practice</h2>
          <ul className="related-pills">{site.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </section>
        <section aria-labelledby="res-prizes">
          <h2 id="res-prizes">Selected recognition</h2>
          <ul>{site.recognition.slice(0,3).map(entry => <li key={entry.organization}>{entry.title}, {entry.organization} ({entry.year})</li>)}</ul>
        </section>
      </article>
    </main>
  );
}

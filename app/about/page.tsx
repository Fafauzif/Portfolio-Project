import type { Metadata } from 'next';
import Image from 'next/image';
import { getSite } from '@/lib/content';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  const site = getSite();
  return (
    <main className="interior about-page" id="main-content" tabIndex={-1}>
      <div className="about-layout wrap">
        <header className="interior-heading">
          <p className="eyebrow">About</p>
          <h1>{site.name}<em>.</em></h1>
          <p className="interior-lead">{site.role}</p>
          <a className="link-label" href="/resume/">View résumé <span className="diagonal" aria-hidden="true" /></a>
        </header>
        <figure className="portrait-area">
          {site.portrait && <Image src={site.portrait.src} alt={site.portrait.alt} width={1200} height={900} priority />}
          <figcaption>{site.location}</figcaption>
        </figure>
        <div className="about-body">
          {site.about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <aside className="about-skills" aria-labelledby="skills-title">
          <h2 id="skills-title">Areas of practice</h2>
          <ul>{site.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
          <a className="link-label" href="/experience/">See experience <span className="diagonal" aria-hidden="true" /></a>
        </aside>
      </div>
      {!!site.testimonials?.length && <section className="about-voices" aria-labelledby="voices-title">
        <div className="wrap">
          <h2 className="eyebrow" id="voices-title">From collaborators</h2>
          <div className="voice-grid">
            {site.testimonials.map(item => (
              <figure key={item.author}>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption><span>{item.author}</span><span>{item.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>}
    </main>
  );
}

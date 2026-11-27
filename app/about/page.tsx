import Image from 'next/image';
import { RegisterMark } from '@/components/print-marks';
import { ProfileHeading } from '@/components/profile-heading';
import { getSite } from '@/lib/content';
import { withCanonical } from '@/lib/site-metadata';

export function generateMetadata() {
  const site = getSite();
  return withCanonical('/about/', { title: 'About', description: site.intro });
}

export default function AboutPage() {
  const site = getSite();
  const profileUrl = site.preview === false && site.url ? new URL('/about/', site.url).href : undefined;
  const schema = profileUrl ? {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: profileUrl,
    mainEntity: {
      '@type': 'Person',
      '@id': `${profileUrl}#person`,
      name: site.name,
      description: site.about[0],
      url: profileUrl,
    },
  } : undefined;
  return (
    <main className="interior about-page" id="main-content" tabIndex={-1}>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />}
      <div className="about-layout wrap" data-portrait={Boolean(site.portrait)}>
        <header className="interior-heading">
          <RegisterMark className="page-register" />
          <ProfileHeading name={site.name} id="person" />
          <p className="interior-lead">{site.role}</p>
          <div className="profile-actions">
            <a className="link-label" href="/work/" data-motion-link>Explore work <span className="diagonal" aria-hidden="true" /></a>
            <a className="link-label" href="/resume/" data-motion-link>View résumé <span className="diagonal" aria-hidden="true" /></a>
          </div>
        </header>
        {site.portrait && <figure className="portrait-area">
          <div className="portrait-frame" data-treatment={site.portrait.treatment} data-mirror={site.portrait.mirror || undefined} data-reveal-print>
            {site.portrait.treatment === 'cutout' && <span className="portrait-stock" aria-hidden="true" />}
            <Image src={site.portrait.src} alt={site.portrait.alt} width={site.portrait.width ?? 1200} height={site.portrait.height ?? 900} priority />
          </div>
          <figcaption>{site.location}</figcaption>
        </figure>}
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

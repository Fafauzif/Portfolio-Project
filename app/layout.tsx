import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getProjects, getSite } from '@/lib/content';
import SiteFooter from '@/components/site-footer';
import SiteNav from '@/components/site-nav';
import { PointerEffects } from '@/components/pointer-effects';
import './globals.css';

// A navigation can interrupt a native view transition before it is ready.
const routeTransitionGuard = `for(const name of ['pageswap','pagereveal'])addEventListener(name,event=>event.viewTransition?.ready.catch(()=>{}));`;

export function generateMetadata(): Metadata {
  const site = getSite();
  const projects = getProjects();
  const featured = projects.find(project => project.slug === site.heroProject) ?? projects.find(project => project.featured) ?? projects[0];
  return {
    metadataBase: new URL(site.url ?? 'https://fieldwork.example'),
    title: { default: site.name + ' | Strategy & Digital Work', template: '%s | ' + site.name },
    description: site.intro,
    robots: site.preview === false ? undefined : { index: false, follow: false },
    openGraph: { title: site.name + ' | Portfolio', description: site.intro, type: 'website',
      images: featured ? [{ url: featured.cover, alt: featured.imageAlt }] : undefined },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const site = getSite();
  return (
    <html lang="en">
      <head><script dangerouslySetInnerHTML={{ __html: routeTransitionGuard }} /></head>
      <body id="top">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <noscript><style>{`
          .site-header { position: static; background: var(--navy); color: var(--paper); }
          .contact-copy,.copy-status { display: none; }
          @container siteNavigation (max-width: 27.5rem) {
            .nav-rail { display: grid; justify-content: stretch; gap: 0; padding-block: 5px; }
            .nav-toggle { display: none !important; }
            .nav-rail .primary-nav { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0 10px; }
          }
        `}</style></noscript>
        <SiteNav name={site.name} initials={site.initials} />
        <PointerEffects />
        {children}
        <SiteFooter site={site} />
      </body>
    </html>
  );
}

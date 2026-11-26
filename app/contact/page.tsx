import { ContactEmail } from '@/components/contact-email';
import { getSite } from '@/lib/content';
import { withCanonical } from '@/lib/site-metadata';

export const generateMetadata = () => withCanonical('/contact/', { title: 'Contact', description: `Contact ${getSite().name} about a project or collaboration.` });

export default function ContactPage() {
  const site = getSite();
  return (
    <main className="interior contact-page" id="main-content" tabIndex={-1}>
      <div className="wrap contact-layout">
        <header className="interior-heading">
          <h1>What are you<br />working <em>on?</em></h1>
          <p className="interior-lead">Tell me what you’re trying to make and where the work is getting stuck.</p>
        </header>
        <div className="contact-panel">
          <h2>Email {site.name.split(' ')[0]}</h2>
          <ContactEmail email={site.contact.email} />
          {site.contact.linkedin && <a className="link-label" href={site.contact.linkedin}>LinkedIn <span className="diagonal" aria-hidden="true" /></a>}
          <p className="eyebrow">{site.location}</p>
        </div>
      </div>
    </main>
  );
}

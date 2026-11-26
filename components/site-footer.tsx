import type { SiteContent } from '@/lib/content';

export default function SiteFooter({ site }: { site: SiteContent }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <p className="eyebrow">Contact</p>
            <p className="footer-title">Let’s make<br />something <em>work.</em></p>
          </div>
          <a className="footer-contact" href="/contact/">Get in touch <span className="diagonal" aria-hidden="true" /></a>
        </div>
        <div className="footer-base">
          <a href="/">{site.name}</a>
          <nav aria-label="More pages">
            <a href="/experience/">Experience</a><a href="/recognition/">Recognition</a><a href="/resume/">Résumé</a>
          </nav>
          <a className="footer-top" href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

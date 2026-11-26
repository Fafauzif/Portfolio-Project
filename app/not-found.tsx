import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="interior wrap not-found" id="main-content" tabIndex={-1}>
      <div>
        <p className="eyebrow">Page not found · 404</p>
        <h1>Out of <em>frame.</em></h1>
        <p>The page may have moved. The work archive is a good place to pick up the thread.</p>
        <Button asChild><a href="/work/">Browse the work <span className="diagonal" aria-hidden="true" /></a></Button>
      </div>
      <div className="not-found-sheet" aria-hidden="true">404</div>
    </main>
  );
}

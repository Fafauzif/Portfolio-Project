import type { ReactNode } from 'react';

export function InteriorHeader({ eyebrow, children, lead }: { eyebrow: string; children: ReactNode; lead?: string }) {
  return (
    <header className="interior-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{children}</h1>
      {lead && <p className="interior-lead">{lead}</p>}
    </header>
  );
}

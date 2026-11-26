import type { ReactNode } from 'react';

export function InteriorHeader({ children }: { children: ReactNode }) {
  return (
    <header className="interior-heading">
      <h1>{children}</h1>
    </header>
  );
}

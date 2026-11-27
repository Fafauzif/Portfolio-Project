import { RegisterMark } from '@/components/print-marks';
import type { ReactNode } from 'react';

export function InteriorHeader({ children }: { children: ReactNode }) {
  return (
    <header className="interior-heading">
      <RegisterMark className="page-register" variant="crop" />
      <h1>{children}</h1>
    </header>
  );
}

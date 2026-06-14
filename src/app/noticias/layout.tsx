import type { ReactNode } from 'react';
import PortalHeader from '@/components/layout/PortalHeader';

export default function NoticiasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PortalHeader />
      {children}
    </>
  );
}

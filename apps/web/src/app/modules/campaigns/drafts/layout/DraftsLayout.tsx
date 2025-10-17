/**
 * Layout wrapper for Drafts module
 * Handles breadcrumb, permissions, and page structure
 */

'use client';

import { ReactNode } from 'react';
import { DraftsHeader } from './DraftsHeader';

interface DraftsLayoutProps {
  children: ReactNode;
}

export function DraftsLayout({ children }: DraftsLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <DraftsHeader />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

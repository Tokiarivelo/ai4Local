// 'use client';

import { DraftsExample, DraftsLayout, DraftsPage } from '@/app/modules/campaigns/drafts';
import React from 'react';

export default function Drafts() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DraftsExample />
    </div>

    //   <div className="space-y-4 sm:space-y-6">
    //   <DraftsLayout>
    //     <DraftsPage />
    //   </DraftsLayout>
    // </div>
  );
}

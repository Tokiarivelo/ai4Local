'use client';

import React from 'react';
import { Badge } from '@/app/modules/ui/badge';

export type CampaignStatus = 'active' | 'completed' | 'draft' | 'scheduled';

interface StatusBadgeProps {
  status: CampaignStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
    completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
    draft: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
    scheduled:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  };

  const labels = {
    active: 'Active',
    completed: 'Terminée',
    draft: 'Brouillon',
    scheduled: 'Planifiée',
  };

  return <Badge className={variants[status]}>{labels[status]}</Badge>;
};

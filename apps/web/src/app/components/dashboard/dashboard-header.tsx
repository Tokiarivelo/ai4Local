'use client';

import React from 'react';
import { Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  onAnalyticsClick?: () => void;
  onDateFilterClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Tableau de bord',
  description = "Vue d'ensemble de vos campagnes et performances",
  onAnalyticsClick,
  onDateFilterClick,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onDateFilterClick}>
          <Calendar className="w-4 h-4 mr-2" />
          Aujourd'hui
        </Button>
        <Button onClick={onAnalyticsClick}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Voir les analytics
        </Button>
      </div>
    </div>
  );
};

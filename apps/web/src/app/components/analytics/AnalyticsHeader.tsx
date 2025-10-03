'use client';

import React from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsHeaderProps {
  onSelectPeriod?: () => void;
  onAdvancedFilters?: () => void;
  onExport?: () => void;
}

export function AnalyticsHeader({
  onSelectPeriod,
  onAdvancedFilters,
  onExport,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Analysez les performances de vos campagnes marketing
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onSelectPeriod}>
          <Calendar className="w-4 h-4 mr-2" />
          Sélectionner une période
        </Button>
        <Button variant="outline" onClick={onAdvancedFilters}>
          <Filter className="w-4 h-4 mr-2" />
          Filtres avancés
        </Button>
        <Button onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>
    </div>
  );
}

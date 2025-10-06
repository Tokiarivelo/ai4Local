'use client';

import React from 'react';
import { Calendar, Download, Filter, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AnalyticsHeaderProps {
  onSelectPeriod?: () => void;
  onAdvancedFilters?: () => void;
  onExport?: () => void;
  className?: string;
}

export function AnalyticsHeader({
  onSelectPeriod,
  onAdvancedFilters,
  onExport,
  className,
}: AnalyticsHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* Titre */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Analysez les performances de vos campagnes marketing
        </p>
      </div>

      {/* Actions - Responsive */}
      <div className="flex items-center gap-2">
        {/* Desktop - Boutons visibles */}
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSelectPeriod}>
            <Calendar className="w-4 h-4 mr-2" />
            Sélectionner une période
          </Button>
          <Button variant="outline" size="sm" onClick={onAdvancedFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Filtres avancés
          </Button>
          <Button size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Mobile - Menu déroulant */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={onSelectPeriod}>
                <Calendar className="w-4 h-4 mr-2" />
                Sélectionner une période
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAdvancedFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Filtres avancés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

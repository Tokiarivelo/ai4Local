'use client';

import React from 'react';
import { ArrowUpDown, Grid3x3, List } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/modules/ui/dropdown-menu';
import {
  useSorting,
  useViewMode,
  useTemplateFiltersStore,
} from '../../stores/templateFiltersStore';
import type { SortField } from '../../types/filter.types';

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'name', label: 'Nom' },
  { value: 'updatedAt', label: 'Dernière modification' },
  { value: 'createdAt', label: 'Date de création' },
  { value: 'usageCount', label: "Nombre d'utilisations" },
];

export function TemplateSort() {
  const sorting = useSorting();
  const viewMode = useViewMode();
  const { setSorting, setViewMode } = useTemplateFiltersStore();

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sorting.field)?.label || 'Trier';

  return (
    <div className="flex items-center gap-2">
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {currentSortLabel}
            <span className="ml-2 text-muted-foreground">
              ({sorting.direction === 'asc' ? '↑' : '↓'})
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Trier par</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sorting.field}
            onValueChange={(value) => setSorting(value as SortField)}
          >
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sorting.direction}
            onValueChange={(value) => setSorting(sorting.field, value as 'asc' | 'desc')}
          >
            <DropdownMenuRadioItem value="asc">Croissant</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">Décroissant</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode Toggle */}
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="rounded-r-none"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="rounded-l-none"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

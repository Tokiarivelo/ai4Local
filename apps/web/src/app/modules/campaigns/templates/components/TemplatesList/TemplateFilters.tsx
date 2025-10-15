'use client';

import React, { useMemo } from 'react';
import { Search, X, Filter, Star } from 'lucide-react';
import { Input } from '@/app/modules/ui/input';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/modules/ui/dropdown-menu';
import { useFilters } from '../../stores/templateFiltersStore';
import { useTemplateFilters } from '../../hooks/useTemplateFilters';
import { useTemplatesFromStore } from '../../stores/templateStore';
import { getAllChannels, getAllTags, getCategoryLabel } from '../../utils/templateHelpers';
import type { TemplateCategory, TemplateStatus } from '../../types/template.types';

const CATEGORIES: TemplateCategory[] = [
  'promotion',
  'newsletter',
  'lead_generation',
  'retention',
  'event',
  'product_launch',
  'seasonal',
  'custom',
];

const STATUSES: { value: TemplateStatus; label: string }[] = [
  { value: 'active', label: 'Actif' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'archived', label: 'Archivé' },
];

export function TemplateFilters() {
  const filters = useFilters();
  const templates = useTemplatesFromStore();
  const {
    setSearch,
    toggleCategory,
    toggleChannel,
    toggleStatus,
    toggleTag,
    toggleFavoritesOnly,
    clearFilters,
  } = useTemplateFilters();

  const availableChannels = useMemo(() => getAllChannels(templates), [templates]);
  const availableTags = useMemo(() => getAllTags(templates), [templates]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.channels.length > 0) count += filters.channels.length;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.tags.length > 0) count += filters.tags.length;
    if (filters.showFavoritesOnly) count += 1;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un template..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {filters.search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Favorites Toggle */}
        <Button
          variant={filters.showFavoritesOnly ? 'default' : 'outline'}
          size="icon"
          onClick={toggleFavoritesOnly}
          title="Afficher uniquement les favoris"
        >
          <Star className={`w-4 h-4 ${filters.showFavoritesOnly ? 'fill-current' : ''}`} />
        </Button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Effacer ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Catégorie
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Catégories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORIES.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              >
                {getCategoryLabel(category)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Channel Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Canal
              {filters.channels.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.channels.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Canaux</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableChannels.map((channel) => (
              <DropdownMenuCheckboxItem
                key={channel}
                checked={filters.channels.includes(channel)}
                onCheckedChange={() => toggleChannel(channel)}
              >
                {channel}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Statut
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Statut</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={filters.status.includes(status.value)}
                onCheckedChange={() => toggleStatus(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Tags
                {filters.tags.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.tags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  #{tag}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {getCategoryLabel(category)}
              <button onClick={() => toggleCategory(category)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.channels.map((channel) => (
            <Badge key={channel} variant="secondary" className="gap-1">
              {channel}
              <button onClick={() => toggleChannel(channel)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {STATUSES.find((s) => s.value === status)?.label}
              <button onClick={() => toggleStatus(status)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              #{tag}
              <button onClick={() => toggleTag(tag)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

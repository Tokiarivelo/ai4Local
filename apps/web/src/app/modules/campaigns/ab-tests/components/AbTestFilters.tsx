/**
 * A/B Test Filters Component
 * Search and filter A/B tests
 */

'use client';

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/app/modules/ui/input';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/modules/ui/popover';
import { Label } from '@/app/modules/ui/label';
import { Checkbox } from '@/app/modules/ui/checkbox';
import type { AbTestFilters as Filters, AbTestStatus, Channel } from '../types';

interface AbTestFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: Array<{ value: AbTestStatus; label: string }> = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'running', label: 'En cours' },
  { value: 'paused', label: 'En pause' },
  { value: 'completed', label: 'Terminé' },
  { value: 'archived', label: 'Archivé' },
];

const CHANNEL_OPTIONS: Array<{ value: Channel; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
  { value: 'web', label: 'Web' },
  { value: 'social', label: 'Social' },
];

export function AbTestFilters({ filters, onChange, onClear }: AbTestFiltersProps) {
  const activeFilterCount =
    filters.status.length +
    filters.channels.length +
    filters.campaigns.length +
    filters.owners.length +
    filters.tags.length +
    (filters.search ? 1 : 0);

  const handleStatusToggle = (status: AbTestStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onChange({ status: newStatus });
  };

  const handleChannelToggle = (channel: Channel) => {
    const newChannels = filters.channels.includes(channel)
      ? filters.channels.filter((c) => c !== channel)
      : [...filters.channels, channel];
    onChange({ channels: newChannels });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un test..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Statut
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 min-w-[20px] justify-center">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Statut</Label>
              </div>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.status.includes(option.value)}
                      onCheckedChange={() => handleStatusToggle(option.value)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Channel Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Canal
              {filters.channels.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 min-w-[20px] justify-center">
                  {filters.channels.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Canal</Label>
              </div>
              <div className="space-y-2">
                {CHANNEL_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.channels.includes(option.value)}
                      onCheckedChange={() => handleChannelToggle(option.value)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-2">
            <X className="w-4 h-4" />
            Réinitialiser ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
}

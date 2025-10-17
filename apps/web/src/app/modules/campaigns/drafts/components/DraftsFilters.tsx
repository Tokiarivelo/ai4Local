/**
 * Filters sidebar component for drafts
 * Provides channel, status, owner, tags, and date filtering
 */

'use client';

import { useState } from 'react';
import { useDraftsStore } from '../stores/useDraftsStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Filter, X } from 'lucide-react';
import type { CampaignChannel, DraftStatus } from '../types/draft.types';

const CHANNELS: { value: CampaignChannel; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'email', label: 'Email' },
];

const STATUSES: { value: DraftStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'auto-saved', label: 'Auto-saved' },
  { value: 'scheduled', label: 'Scheduled' },
];

export function DraftsFilters() {
  const { filters, setFilters, clearFilters } = useDraftsStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount =
    filters.channels.length + filters.status.length + filters.owners.length + filters.tags.length;

  const handleChannelToggle = (channel: CampaignChannel) => {
    const current = filters.channels;
    const updated = current.includes(channel)
      ? current.filter((c) => c !== channel)
      : [...current, channel];
    setFilters({ channels: updated });
  };

  const handleStatusToggle = (status: DraftStatus) => {
    const current = filters.status;
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilters({ status: updated });
  };

  const handleClearAll = () => {
    clearFilters();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine your draft search</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Clear All */}
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear All ({activeFiltersCount})
            </Button>
          )}

          <Separator />

          {/* Channels */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Channels</Label>
            <div className="space-y-2">
              {CHANNELS.map((channel) => (
                <div key={channel.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`channel-${channel.value}`}
                    checked={filters.channels.includes(channel.value)}
                    onCheckedChange={() => handleChannelToggle(channel.value)}
                  />
                  <label
                    htmlFor={`channel-${channel.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {channel.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Status</Label>
            <div className="space-y-2">
              {STATUSES.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={() => handleStatusToggle(status.value)}
                  />
                  <label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Active Filters</Label>
              <div className="flex flex-wrap gap-1.5">
                {filters.channels.map((channel) => (
                  <Badge
                    key={channel}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleChannelToggle(channel)}
                  >
                    {CHANNELS.find((c) => c.value === channel)?.label}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.status.map((status) => (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle(status)}
                  >
                    {STATUSES.find((s) => s.value === status)?.label}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

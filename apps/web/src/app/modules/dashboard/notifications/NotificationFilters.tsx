'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { XIcon, FilterIcon } from './ui/Icons';
import type {
  NotificationFiltersProps,
  FilterOptions,
  NotificationChannel,
  NotificationType,
} from './types';

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableTags,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [searchTags, setSearchTags] = useState('');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced filter application
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFiltersChange]);

  const handleChannelToggle = (channel: NotificationChannel) => {
    setLocalFilters((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleTypeToggle = (type: NotificationType) => {
    setLocalFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleStatusToggle = (status: 'read' | 'unread') => {
    setLocalFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const handlePriorityToggle = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    setLocalFilters((prev) => ({
      ...prev,
      priority: prev.priority?.includes(priority)
        ? prev.priority.filter((p) => p !== priority)
        : [...(prev.priority || []), priority],
    }));
  };

  const handleTagToggle = (tag: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  const resetFilters = () => {
    const emptyFilters: FilterOptions = {
      channels: [],
      types: [],
      status: [],
      dateRange: {},
      tags: [],
      priority: [],
      searchQuery: '',
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters =
    localFilters.channels.length > 0 ||
    localFilters.types.length > 0 ||
    localFilters.status.length > 0 ||
    localFilters.tags.length > 0 ||
    (localFilters.priority && localFilters.priority.length > 0) ||
    localFilters.dateRange.start ||
    localFilters.dateRange.end;

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchTags.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--bg)] dark:bg-gray-900 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <FilterIcon size={20} className="text-[var(--brand-mid)]" />
              <h2 className="text-lg font-semibold text-[var(--text)] dark:text-white">Filtres</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <XIcon size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Channels */}
            <div>
              <h3 className="text-sm font-medium text-[var(--text)] dark:text-white mb-3">
                Canaux
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(['facebook', 'whatsapp', 'instagram', 'email'] as NotificationChannel[]).map(
                  (channel) => (
                    <Button
                      key={channel}
                      variant={localFilters.channels.includes(channel) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChannelToggle(channel)}
                      className="justify-start"
                    >
                      {channel === 'facebook'
                        ? 'Facebook'
                        : channel === 'whatsapp'
                          ? 'WhatsApp'
                          : channel === 'instagram'
                            ? 'Instagram'
                            : 'Email'}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Types */}
            <div>
              <h3 className="text-sm font-medium text-[var(--text)] dark:text-white mb-3">Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['info', 'success', 'warning', 'error'] as NotificationType[]).map((type) => (
                  <Button
                    key={type}
                    variant={localFilters.types.includes(type) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeToggle(type)}
                    className="justify-start"
                  >
                    {type === 'info'
                      ? 'Info'
                      : type === 'success'
                        ? 'Succès'
                        : type === 'warning'
                          ? 'Avertissement'
                          : 'Erreur'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-[var(--text)] dark:text-white mb-3">
                Statut
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant={localFilters.status.includes('unread') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusToggle('unread')}
                  className="flex-1"
                >
                  Non lues
                </Button>
                <Button
                  variant={localFilters.status.includes('read') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusToggle('read')}
                  className="flex-1"
                >
                  Lues
                </Button>
              </div>
            </div>

            {/* Priority */}
            <div>
              <h3 className="text-sm font-medium text-[var(--text)] dark:text-white mb-3">
                Priorité
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                  <Button
                    key={priority}
                    variant={localFilters.priority?.includes(priority) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePriorityToggle(priority)}
                    className="justify-start"
                  >
                    {priority === 'low'
                      ? 'Faible'
                      : priority === 'medium'
                        ? 'Moyenne'
                        : priority === 'high'
                          ? 'Élevée'
                          : 'Urgente'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-sm font-medium text-[var(--text)] dark:text-white mb-3">
                Période
              </h3>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={localFilters.dateRange.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  placeholder="Date de début"
                />
                <Input
                  type="date"
                  value={localFilters.dateRange.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  placeholder="Date de fin"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium text-[var(--text)] dark:text-white mb-3">Tags</h3>
              <Input
                type="text"
                placeholder="Rechercher tags..."
                value={searchTags}
                onChange={(e) => setSearchTags(e.target.value)}
                className="mb-3"
              />
              <div className="max-h-40 overflow-y-auto space-y-1">
                {filteredTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      localFilters.tags.includes(tag)
                        ? 'bg-[var(--brand-light)] text-[var(--text)]'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs text-gray-600 dark:text-gray-400">Filtres actifs:</span>
                <Badge variant="info" size="sm">
                  {localFilters.channels.length +
                    localFilters.types.length +
                    localFilters.status.length +
                    localFilters.tags.length +
                    (localFilters.priority?.length || 0)}{' '}
                  filtre
                  {localFilters.channels.length +
                    localFilters.types.length +
                    localFilters.status.length +
                    localFilters.tags.length +
                    (localFilters.priority?.length || 0) >
                  1
                    ? 's'
                    : ''}
                </Badge>
              </div>
            )}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="flex-1"
              >
                Réinitialiser
              </Button>
              <Button variant="default" size="sm" onClick={onClose} className="flex-1">
                Appliquer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

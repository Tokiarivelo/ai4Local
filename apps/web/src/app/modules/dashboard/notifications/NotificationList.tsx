'use client';

import React, { useMemo, useCallback } from 'react';
import { NotificationItem } from './NotificationItem';
import { NotificationListSkeleton } from './ui/Skeleton';
import { Button } from './ui/Button';
import type { NotificationListProps } from './types';

export const NotificationList: React.FC<
  NotificationListProps & {
    onToggleRead: (id: string) => void;
    onDelete: (id: string) => void;
    searchQuery?: string;
    maxHeight?: string;
  }
> = ({
  items,
  onSelect,
  onBulkAction,
  selectedIds,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onToggleRead,
  onDelete,
  searchQuery,
  maxHeight = 'calc(100vh - 200px)',
}) => {
  const handleSelectAll = useCallback(() => {
    const allIds = items.map((item) => item.id);
    onBulkAction('selectAll', allIds);
  }, [items, onBulkAction]);

  const handleDeselectAll = useCallback(() => {
    onBulkAction('deselectAll', []);
  }, [onBulkAction]);

  const handleMarkSelectedAsRead = useCallback(() => {
    onBulkAction('markAsRead', selectedIds);
  }, [selectedIds, onBulkAction]);

  const handleDeleteSelected = useCallback(() => {
    onBulkAction('delete', selectedIds);
  }, [selectedIds, onBulkAction]);

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <div className="bg-[var(--bg)] dark:bg-gray-900">
        <NotificationListSkeleton count={10} />
      </div>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5-5-5h5V3h5v14z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-[var(--text)] dark:text-white mb-2">
          Aucune notification
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">
          {searchQuery
            ? `Aucune notification trouvée pour "${searchQuery}". Essayez d'ajuster vos filtres.`
            : "Vous n'avez aucune notification pour le moment. Nous vous notifierons dès qu'il y aura du nouveau."}
        </p>
      </div>
    );
  }

  const allSelected = selectedIds.length === items.length && items.length > 0;
  const someSelected = selectedIds.length > 0 && selectedIds.length < items.length;

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] dark:bg-gray-900">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-10 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedIds.length} notification{selectedIds.length > 1 ? 's' : ''} sélectionnée
                {selectedIds.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkSelectedAsRead}
                  className="text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  Marquer comme lues
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Supprimer
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeselectAll}
              className="text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
            >
              Désélectionner
            </Button>
          </div>
        </div>
      )}

      {/* Header avec sélection globale */}
      <div className="sticky top-0 z-9 bg-[var(--bg)] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={allSelected ? handleDeselectAll : handleSelectAll}
              className="rounded border-gray-300 text-[var(--brand-mid)] focus:ring-[var(--brand-mid)] focus:ring-offset-0"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Sélectionner tout</span>
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-500">
            {items.length} notification{items.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Liste des notifications avec scroll */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight }}>
        <div role="list" aria-label="Liste des notifications">
          {items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.includes(notification.id)}
              onSelect={onSelect}
              onToggleRead={onToggleRead}
              onDelete={onDelete}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Chargement...' : 'Charger plus de notifications'}
          </Button>
        </div>
      )}

      {/* Loading indicator at bottom */}
      {isLoading && items.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-[var(--brand-mid)] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Chargement de nouvelles notifications...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

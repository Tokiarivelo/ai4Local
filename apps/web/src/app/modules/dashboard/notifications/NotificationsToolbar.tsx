'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CheckIcon, FilterIcon, RefreshIcon } from './ui/Icons';
import type { ToolbarActions } from './types';

interface NotificationsToolbarProps {
  actions: ToolbarActions;
  selectedCount: number;
  totalCount: number;
  isRefreshing?: boolean;
  liveUpdatesEnabled: boolean;
}

export const NotificationsToolbar: React.FC<NotificationsToolbarProps> = ({
  actions,
  selectedCount,
  totalCount,
  isRefreshing = false,
  liveUpdatesEnabled,
}) => {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Keyboard shortcuts handler
  React.useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Only handle shortcuts when no input is focused
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            actions.markAllRead();
          }
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            actions.toggleFilters();
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            actions.refresh();
          }
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardShortcuts(!showKeyboardShortcuts);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [actions, showKeyboardShortcuts]);

  const handleExportCsv = () => {
    actions.exportToCsv();
  };

  return (
    <>
      <div className="sticky top-[73px] z-9 bg-[var(--bg)] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          {/* Left: Main actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={actions.markAllRead}
              className="flex items-center space-x-2"
              title="Marquer tout comme lu (Ctrl+M)"
            >
              <CheckIcon size={16} />
              <span className="hidden sm:inline">Marquer tout lu</span>
              <span className="sm:hidden">Tout lu</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={actions.toggleFilters}
              className="flex items-center space-x-2"
              title="Filtrer les notifications (Ctrl+F)"
            >
              <FilterIcon size={16} />
              <span className="hidden sm:inline">Filtres</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={actions.refresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
              title="Actualiser (Ctrl+R)"
            >
              <RefreshIcon size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCsv}
              className="hidden sm:flex items-center space-x-2"
            >
              <span>Exporter CSV</span>
            </Button>
          </div>

          {/* Right: Stats and live updates */}
          <div className="flex items-center justify-between sm:justify-end space-x-4">
            {/* Selection info */}
            {selectedCount > 0 && (
              <Badge variant="info" size="sm">
                {selectedCount} sélectionnée{selectedCount > 1 ? 's' : ''}
              </Badge>
            )}

            {/* Total count */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount} notification{totalCount > 1 ? 's' : ''}
            </span>

            {/* Live updates toggle */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={liveUpdatesEnabled}
                onChange={(e) => actions.toggleLiveUpdates(e.target.checked)}
                className="rounded border-gray-300 text-[var(--brand-mid)] focus:ring-[var(--brand-mid)] focus:ring-offset-0"
              />
              <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">
                Mises à jour en temps réel
              </span>
              <span className="text-gray-600 dark:text-gray-400 sm:hidden">Live</span>
            </label>
          </div>
        </div>

        {/* Mobile: Second row for additional actions */}
        <div className="flex sm:hidden mt-3 space-x-2">
          <Button variant="ghost" size="sm" onClick={handleExportCsv} className="flex-1">
            Exporter CSV
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="text-xs"
          >
            Raccourcis ?
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      {showKeyboardShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowKeyboardShortcuts(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 m-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)] dark:text-white">
              Raccourcis clavier
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Marquer tout lu</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  Ctrl+M
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Filtres</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  Ctrl+F
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Actualiser</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  Ctrl+R
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cette aide</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  ?
                </kbd>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKeyboardShortcuts(false)}
              className="mt-4 w-full"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

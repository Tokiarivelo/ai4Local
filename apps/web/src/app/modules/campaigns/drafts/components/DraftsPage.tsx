/**
 * Main entry page for Drafts module
 * Displays toolbar, stats, filters, list, and preview panel
 */

'use client';

import { useEffect, useState } from 'react';
import { useDraftsStore } from '../stores/useDraftsStore';
import { DraftsList } from './DraftsList';
import { DraftsFilters } from './DraftsFilters';
import { DraftEditorDrawer } from './DraftEditorDrawer';
import { DraftActions } from './DraftActions';
import { DraftPreview } from './DraftPreview';
import { DraftEmptyState } from './DraftEmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Search } from 'lucide-react';
import type { Draft } from '../types/draft.types';
import { DraftCreateModal } from './DraftCreateModal';

export function DraftsPage() {
  const {
    drafts,
    stats,
    isLoading,
    selectedIds,
    filters,
    fetchDrafts,
    fetchStats,
    setFilters,
    createDraft,
  } = useDraftsStore();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [isCreating, setIsCreating] = useState(false);
  const [previewDraft, setPreviewDraft] = useState<Draft | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchDrafts();
    fetchStats();
  }, [fetchDrafts, fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  const handleCreateDraft = () => {
    setIsCreateModalOpen(true);
  };

  const handleRefresh = () => {
    fetchDrafts();
    fetchStats();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search drafts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <DraftsFilters />
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && <DraftActions />}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" onClick={handleCreateDraft}>
              <Plus className="h-4 w-4 mr-1" />
              Create Draft
            </Button>
          </div>
        </div>

        {/* Stats Strip */}
        {stats && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total:</span>{' '}
              <span className="font-medium">{stats.total}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last 7 days:</span>{' '}
              <span className="font-medium">{stats.last7Days}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Auto-saved:</span>{' '}
              <span className="font-medium">{stats.autoSaved}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {drafts.length === 0 && !isLoading ? (
            <DraftEmptyState onCreateDraft={handleCreateDraft} />
          ) : (
            <DraftsList onPreview={setPreviewDraft} />
          )}
        </div>

        {/* Preview Panel (Desktop) */}
        {previewDraft && (
          <div className="hidden lg:block w-96 border-l overflow-auto">
            <DraftPreview draft={previewDraft} onClose={() => setPreviewDraft(null)} />
          </div>
        )}
      </div>

      <DraftEditorDrawer />
      <DraftCreateModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}

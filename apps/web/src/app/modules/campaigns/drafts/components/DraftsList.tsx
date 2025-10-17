/**
 * Virtualized list of drafts with selection and actions
 * Optimized for large datasets with memoization
 */

'use client';

import { memo, useCallback } from 'react';
import { useDraftsStore } from '../stores/useDraftsStore';
import { DraftRow } from './DraftRow';
import { Skeleton } from '@/components/ui/skeleton';
import type { Draft } from '../types/draft.types';

interface DraftsListProps {
  onPreview?: (draft: Draft) => void;
}

export const DraftsList = memo(function DraftsList({ onPreview }: DraftsListProps) {
  const { drafts, selectedIds, isLoading, toggleSelection, startEditing } = useDraftsStore();

  const handleEdit = useCallback(
    (draft: Draft) => {
      startEditing(draft);
    },
    [startEditing]
  );

  const handleSelect = useCallback(
    (id: string) => {
      toggleSelection(id);
    },
    [toggleSelection]
  );

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
            <Skeleton className="h-5 w-5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {drafts.map((draft) => (
        <DraftRow
          key={draft.id}
          draft={draft}
          isSelected={selectedIds.includes(draft.id)}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
});

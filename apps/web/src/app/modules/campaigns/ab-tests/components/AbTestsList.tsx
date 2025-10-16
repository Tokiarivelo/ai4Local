/**
 * A/B Tests List Component
 * Virtualized list for performance with large datasets
 */

'use client';

import React, { useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { AbTestRow } from './AbTestRow';
import type { AbTest } from '../types';
import { Skeleton } from '@/app/modules/ui/skeleton';

interface AbTestsListProps {
  tests: AbTest[];
  selectedIds: string[];
  isLoading?: boolean;
  onSelect: (id: string) => void;
  onEdit: (test: AbTest) => void;
  onStart: (test: AbTest) => void;
  onPause: (test: AbTest) => void;
  onStop: (test: AbTest) => void;
  onArchive: (test: AbTest) => void;
  onViewResults: (test: AbTest) => void;
}

const ROW_HEIGHT = 96;
const LOADING_ROWS = 10;

function LoadingSkeleton() {
  return (
    <div className="p-4 border-b space-y-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function AbTestsList({
  tests,
  selectedIds,
  isLoading,
  onSelect,
  onEdit,
  onStart,
  onPause,
  onStop,
  onArchive,
  onViewResults,
}: AbTestsListProps) {
  // Create a map for quick lookup
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  if (isLoading) {
    return (
      <div className="space-y-0">
        {Array.from({ length: LOADING_ROWS }).map((_, idx) => (
          <LoadingSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-2">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">Aucun test A/B trouvé</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Créez votre premier test A/B pour optimiser vos campagnes marketing
        </p>
      </div>
    );
  }

  // Row renderer for react-window
  const Row = ({ index, style, tests }: RowComponentProps<{ tests: AbTest[] }>) => {
    const test = tests[index];

    if (!test) return null;

    return (
      <div style={style}>
        <AbTestRow
          test={test}
          selected={selectedSet.has(test.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onStart={onStart}
          onPause={onPause}
          onStop={onStop}
          onArchive={onArchive}
          onViewResults={onViewResults}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 border rounded-lg overflow-hidden bg-card" style={{ minHeight: 0 }}>
      <div style={{ height: 'calc(100vh - 270px)', width: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <div style={{ height, width }}>
              <List
                rowCount={tests.length}
                rowHeight={ROW_HEIGHT}
                overscanCount={5}
                rowComponent={Row}
                rowProps={{
                  tests,
                }}
              />
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

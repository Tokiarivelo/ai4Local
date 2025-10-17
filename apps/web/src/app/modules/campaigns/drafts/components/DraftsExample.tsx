/**
 * Example implementation of Drafts module
 * Demonstrates usage with mock data and autosave simulation
 */

'use client';

import { useEffect } from 'react';
import { DraftsLayout } from '../layout/DraftsLayout';
import { DraftsPage } from '../components/DraftsPage';
import { useDraftsStore } from '../stores/useDraftsStore';
import { mockDrafts } from '../mocks/draft.mock';

export function DraftsExample() {
  const { drafts, fetchDrafts, processAutosaveQueue } = useDraftsStore();

  // Initialize with mock data
  useEffect(() => {
    if (drafts.length === 0) {
      useDraftsStore.setState({ drafts: mockDrafts });
      fetchDrafts();
    }
  }, [drafts.length, fetchDrafts]);

  // Simulate autosave queue processing
  useEffect(() => {
    const interval = setInterval(() => {
      processAutosaveQueue();
    }, 5000);

    return () => clearInterval(interval);
  }, [processAutosaveQueue]);

  return (
    <DraftsLayout>
      <DraftsPage />
    </DraftsLayout>
  );
}

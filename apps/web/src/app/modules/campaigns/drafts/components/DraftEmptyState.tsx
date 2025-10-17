/**
 * Empty state component when no drafts exist
 * Provides quick action to create first draft
 */

'use client';

import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface DraftEmptyStateProps {
  onCreateDraft: () => void;
}

export function DraftEmptyState({ onCreateDraft }: DraftEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No drafts yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Get started by creating your first draft. You can save, edit, and publish content for
        multiple channels.
      </p>
      <Button onClick={onCreateDraft}>
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Draft
      </Button>
    </div>
  );
}

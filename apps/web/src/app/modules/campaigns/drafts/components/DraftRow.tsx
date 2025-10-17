/**
 * Individual draft row component
 * Displays draft summary with actions and selection
 */

'use client';

import { memo, useState } from 'react';
import { useDraftsStore } from '../stores/useDraftsStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/ui/use-toast';
import { MoreVertical, Edit, Copy, Send, Trash2, Eye, Calendar, User, Tag } from 'lucide-react';
import { getRelativeTime, sanitizeDraftContent, canPublishDraft } from '../utils/draftHelpers';
import type { Draft } from '../types/draft.types';

interface DraftRowProps {
  draft: Draft;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (draft: Draft) => void;
  onPreview?: (draft: Draft) => void;
}

const channelColors = {
  facebook: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  instagram: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  linkedin: 'bg-blue-600/10 text-blue-800 dark:text-blue-300',
  twitter: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  google_ads: 'bg-green-500/10 text-green-700 dark:text-green-400',
  email: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
};

const statusColors = {
  draft: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  'auto-saved': 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  scheduled: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  'in-review': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
};

export const DraftRow = memo(function DraftRow({
  draft,
  isSelected,
  onSelect,
  onEdit,
  onPreview,
}: DraftRowProps) {
  const { duplicateDraft, publishDraft, deleteDraft } = useDraftsStore();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDuplicate = async () => {
    setIsProcessing(true);
    try {
      await duplicateDraft(draft.id);
      toast({
        title: 'Draft duplicated',
        description: 'A copy of this draft has been created.',
      });
    } catch (error) {
      toast({
        title: 'Failed to duplicate',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    setIsProcessing(true);
    try {
      await publishDraft(draft.id);
      toast({
        title: 'Draft published',
        description: 'Your content has been published successfully.',
      });
      setShowPublishDialog(false);
    } catch (error) {
      toast({
        title: 'Failed to publish',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteDraft(draft.id);
      toast({
        title: 'Draft deleted',
        description: 'The draft has been removed.',
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const canPublish = canPublishDraft(draft);

  return (
    <>
      <div
        className={`group flex items-start gap-3 p-4 transition-colors hover:bg-accent/50 ${
          isSelected ? 'bg-accent/30' : ''
        }`}
      >
        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(draft.id)}
          aria-label={`Select ${draft.title}`}
          className="mt-1"
        />

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and Status */}
          <div className="flex items-start gap-2 flex-wrap">
            <button
              onClick={() => onEdit(draft)}
              className="font-medium text-sm hover:underline text-left flex-1 min-w-0"
            >
              {draft.title}
            </button>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge
                variant="outline"
                className={
                  channelColors[draft.channel as keyof typeof channelColors] ??
                  'bg-gray-200 text-gray-700 dark:text-gray-400'
                }
              >
                {draft.channel}
              </Badge>
              <Badge
                variant="outline"
                className={
                  statusColors[draft.status as keyof typeof statusColors] ??
                  'bg-gray-200 text-gray-700 dark:text-gray-400'
                }
              >
                {draft.status}
              </Badge>
            </div>
          </div>

          {/* Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {sanitizeDraftContent(draft.body)}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{draft.owner.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{getRelativeTime(draft.lastEditedAt)}</span>
            </div>
            {draft.campaign && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{draft.campaign.name}</span>
              </div>
            )}
            {draft.media.length > 0 && (
              <span className="text-xs">📎 {draft.media.length} media</span>
            )}
            {draft.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{draft.tags.length} tags</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(draft)}
              aria-label="Preview draft"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(draft)} aria-label="Edit draft">
            <Edit className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="More actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(draft)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {onPreview && (
                <DropdownMenuItem onClick={() => onPreview(draft)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDuplicate} disabled={isProcessing}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowPublishDialog(true)}
                disabled={!canPublish || isProcessing}
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                disabled={isProcessing}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Publish Confirmation */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish "{draft.title}" to {draft.channel}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isProcessing}>
              {isProcessing ? 'Publishing...' : 'Publish'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{draft.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

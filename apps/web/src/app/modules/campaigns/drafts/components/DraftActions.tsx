/**
 * Bulk actions component for selected drafts
 * Handles duplicate, publish, delete operations on multiple drafts
 */

'use client';

import { useState } from 'react';
import { useDraftsStore } from '../stores/useDraftsStore';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown, Copy, Send, Trash2 } from 'lucide-react';

export function DraftActions() {
  const { selectedIds, bulkAction, clearSelection } = useDraftsStore();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkDuplicate = async () => {
    setIsProcessing(true);
    try {
      await bulkAction({ draftIds: selectedIds, action: 'duplicate' });
      toast({
        title: 'Drafts duplicated',
        description: `${selectedIds.length} draft(s) have been duplicated.`,
      });
      clearSelection();
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

  const handleBulkPublish = async () => {
    setIsProcessing(true);
    try {
      await bulkAction({ draftIds: selectedIds, action: 'publish' });
      toast({
        title: 'Drafts published',
        description: `${selectedIds.length} draft(s) have been published.`,
      });
      clearSelection();
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

  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      await bulkAction({ draftIds: selectedIds, action: 'delete' });
      toast({
        title: 'Drafts deleted',
        description: `${selectedIds.length} draft(s) have been deleted.`,
      });
      clearSelection();
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isProcessing}>
            Bulk Actions ({selectedIds.length})
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleBulkDuplicate} disabled={isProcessing}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPublishDialog(true)} disabled={isProcessing}>
            <Send className="h-4 w-4 mr-2" />
            Publish All
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            disabled={isProcessing}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Publish Confirmation */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish {selectedIds.length} Drafts?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish all selected drafts. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkPublish} disabled={isProcessing}>
              {isProcessing ? 'Publishing...' : 'Publish All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} Drafts?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all selected drafts? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? 'Deleting...' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

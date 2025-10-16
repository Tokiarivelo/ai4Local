/**
 * A/B Test Actions Component
 * Bulk actions toolbar
 */

'use client';

import React, { useState } from 'react';
import { Play, Pause, Archive, Download, Trash2 } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/modules/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface AbTestActionsProps {
  selectedCount: number;
  onStart: () => void;
  onPause: () => void;
  onArchive: () => void;
  onExport: () => void;
  onClearSelection: () => void;
  className?: string;
}

export function AbTestActions({
  selectedCount,
  onStart,
  onPause,
  onArchive,
  onExport,
  onClearSelection,
  className,
}: AbTestActionsProps) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const handleArchive = () => {
    setShowArchiveConfirm(true);
  };

  const confirmArchive = () => {
    onArchive();
    setShowArchiveConfirm(false);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between p-4 bg-muted border rounded-lg',
          className
        )}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedCount} test{selectedCount > 1 ? 's' : ''} sélectionné
            {selectedCount > 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            Désélectionner
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onStart} className="gap-2">
            <Play className="w-4 h-4" />
            Démarrer
          </Button>

          <Button variant="outline" size="sm" onClick={onPause} className="gap-2">
            <Pause className="w-4 h-4" />
            Mettre en pause
          </Button>

          <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
            className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Archive className="w-4 h-4" />
            Archiver
          </Button>
        </div>
      </div>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver les tests sélectionnés ?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCount} test{selectedCount > 1 ? 's' : ''} ser
              {selectedCount > 1 ? 'ont' : 'a'} archivé{selectedCount > 1 ? 's' : ''}. Les tests
              archivés peuvent être restaurés ultérieurement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive}>Archiver</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

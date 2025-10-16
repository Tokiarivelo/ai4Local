/**
 * A/B Tests Page Component
 * Main entry point for A/B testing module
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import { useToast } from '@/app/modules/ui/use-toast';
import {
  useAbTestsStore,
  useTests,
  useSelectedTestIds,
  useIsLoading,
  useFilters,
} from '../store/useAbTestsStore';
import { AbTestsList } from './AbTestsList';
import { AbTestFilters } from './AbTestFilters';
import { AbTestActions } from './AbTestActions';
import { AbTestEditorModal } from './AbTestEditorModal';
import { ResultsDashboard } from './ResultsDashboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/modules/ui/dialog';
import type { AbTest, CreateAbTestInput } from '../types';

export function AbTestsPage() {
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [editingTest, setEditingTest] = useState<AbTest | undefined>();
  const [viewingResults, setViewingResults] = useState<AbTest | undefined>();

  const tests = useTests();
  const selectedIds = useSelectedTestIds();
  const isLoading = useIsLoading();
  const filters = useFilters();

  console.log('tests :>> ', tests);

  const {
    fetchTests,
    createDraft,
    updateDraft,
    start,
    pause,
    stop,
    archive,
    bulkStart,
    bulkPause,
    bulkArchive,
    toggleTestSelection,
    clearSelection,
    setFilters,
    clearFilters,
  } = useAbTestsStore();

  // Load tests on mount
  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleCreate = async (input: CreateAbTestInput) => {
    try {
      await createDraft(input);
      toast({
        title: 'Test créé',
        description: 'Le test A/B a été créé avec succès',
      });
      setShowEditor(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la création du test',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = (test: AbTest) => {
    setEditingTest(test);
    setShowEditor(true);
  };

  const handleStart = async (test: AbTest) => {
    try {
      await start(test.id);
      toast({
        title: 'Test démarré',
        description: `${test.name} est maintenant en cours d'exécution`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec du démarrage du test',
        variant: 'destructive',
      });
    }
  };

  const handlePause = async (test: AbTest) => {
    try {
      await pause(test.id);
      toast({
        title: 'Test en pause',
        description: `${test.name} a été mis en pause`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la mise en pause',
        variant: 'destructive',
      });
    }
  };

  const handleStop = async (test: AbTest) => {
    try {
      await stop(test.id);
      toast({
        title: 'Test arrêté',
        description: `${test.name} a été arrêté`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de l'arrêt du test",
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async (test: AbTest) => {
    try {
      await archive(test.id);
      toast({
        title: 'Test archivé',
        description: `${test.name} a été archivé`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de l'archivage",
        variant: 'destructive',
      });
    }
  };

  const handleViewResults = (test: AbTest) => {
    setViewingResults(test);
  };

  const handleDeclareWinner = async (variantId: string) => {
    if (!viewingResults) return;

    try {
      await stop(viewingResults.id, variantId);
      toast({
        title: 'Gagnant déclaré',
        description: 'La variante gagnante a été déclarée avec succès',
      });
      setViewingResults(undefined);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la déclaration du gagnant',
        variant: 'destructive',
      });
    }
  };

  const handleBulkStart = async () => {
    try {
      await bulkStart(selectedIds);
      toast({
        title: 'Tests démarrés',
        description: `${selectedIds.length} test(s) démarré(s)`,
      });
      clearSelection();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec du démarrage des tests',
        variant: 'destructive',
      });
    }
  };

  const handleBulkPause = async () => {
    try {
      await bulkPause(selectedIds);
      toast({
        title: 'Tests en pause',
        description: `${selectedIds.length} test(s) mis en pause`,
      });
      clearSelection();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la mise en pause',
        variant: 'destructive',
      });
    }
  };

  const handleBulkArchive = async () => {
    try {
      await bulkArchive(selectedIds);
      toast({
        title: 'Tests archivés',
        description: `${selectedIds.length} test(s) archivé(s)`,
      });
      clearSelection();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de l'archivage",
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(
      tests.filter((t) => selectedIds.includes(t.id)),
      null,
      2
    );
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ab-tests-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export réussi',
      description: 'Les données ont été exportées',
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tests A/B</h1>
          <p className="text-muted-foreground">Optimisez vos campagnes avec des tests A/B</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchTests()} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button
            onClick={() => {
              setEditingTest(undefined);
              setShowEditor(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau test
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AbTestFilters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          fetchTests(newFilters);
        }}
        onClear={() => {
          clearFilters();
          fetchTests();
        }}
      />

      {/* Bulk Actions */}
      <AbTestActions
        selectedCount={selectedIds.length}
        onStart={handleBulkStart}
        onPause={handleBulkPause}
        onArchive={handleBulkArchive}
        onExport={handleExport}
        onClearSelection={clearSelection}
      />

      {/* Tests List */}
      <div className="flex-1 min-h-0">
        <AbTestsList
          tests={tests}
          selectedIds={selectedIds}
          isLoading={isLoading}
          onSelect={toggleTestSelection}
          onEdit={handleEdit}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          onArchive={handleArchive}
          onViewResults={handleViewResults}
        />
      </div>

      {/* Editor Modal */}
      <AbTestEditorModal
        open={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingTest(undefined);
        }}
        onSave={handleCreate}
        editingTest={editingTest}
      />

      {/* Results Dialog */}
      <Dialog
        open={!!viewingResults}
        onOpenChange={(open) => !open && setViewingResults(undefined)}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Résultats du test</DialogTitle>
          </DialogHeader>
          {viewingResults && (
            <ResultsDashboard
              test={viewingResults}
              onDeclareWinner={handleDeclareWinner}
              onExport={handleExport}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

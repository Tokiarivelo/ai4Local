'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTemplates } from '../../hooks/useTemplates';
import { useViewMode } from '../../stores/templateFiltersStore';
import { useTemplateLoading } from '../../stores/templateStore';
import { TemplateGrid } from './TemplateGrid';
import { TemplateFilters } from './TemplateFilters';
import { TemplateSort } from './TemplateSort';
import { TemplateDetails } from '../TemplateDetails/TemplateDetails';
import { CreateTemplateDialog } from '../TemplateCreate/CreateTemplateDialog';
import type { Template } from '../../types/template.types';

export function TemplatesList() {
  const templates = useTemplates();
  const viewMode = useViewMode();
  const isLoading = useTemplateLoading();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handlePreview = (template: Template) => {
    setDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates de campagnes</h1>
          <p className="text-muted-foreground mt-1">
            {templates.length} template{templates.length > 1 ? 's' : ''} disponible
            {templates.length > 1 ? 's' : ''}
          </p>
        </div>
        <CreateTemplateDialog />
      </div>

      {/* Filters and Sort */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <TemplateFilters />
        </div>
        <TemplateSort />
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <TemplateGrid templates={templates} onPreview={handlePreview} />
      ) : (
        <TemplateGrid templates={templates} onPreview={handlePreview} />
      )}

      {/* Template Details Dialog */}
      <TemplateDetails open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  );
}

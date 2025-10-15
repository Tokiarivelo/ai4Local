'use client';

import React from 'react';
import type { Template } from '../../types/template.types';
import { TemplateCard } from './TemplateCard';

interface TemplateGridProps {
  templates: Template[];
  onPreview?: (template: Template) => void;
}

export function TemplateGrid({ templates, onPreview }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun template trouvé</h3>
        <p className="text-muted-foreground max-w-md">
          Essayez de modifier vos filtres ou créez un nouveau template pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} onPreview={onPreview} />
      ))}
    </div>
  );
}

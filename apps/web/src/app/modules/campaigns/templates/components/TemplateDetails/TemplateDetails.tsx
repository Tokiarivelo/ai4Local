'use client';

import React from 'react';
import { X, PlayCircle, Copy, Edit, Archive, Trash2, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/modules/ui/dialog';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { useSelectedTemplate, useTemplateStore } from '../../stores/templateStore';
import { useTemplateActions } from '../../hooks/useTemplateActions';
import { TemplatePreview } from './TemplatePreview';
import { TemplateStats } from './TemplateStats';
import { getCategoryLabel, getStatusConfig } from '../../utils/templateHelpers';

interface TemplateDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateDetails({ open, onOpenChange }: TemplateDetailsProps) {
  const template = useSelectedTemplate();
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const { useTemplate, toggleFavorite, cloneTemplate, archiveTemplate, deleteTemplate } =
    useTemplateActions();

  if (!template) return null;

  const statusConfig = getStatusConfig(template.status);

  const handleClose = () => {
    setSelectedTemplate(null);
    onOpenChange(false);
  };

  const handleUseTemplate = () => {
    useTemplate(template.id);
    handleClose();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(template.id);
  };

  const handleClone = async () => {
    try {
      await cloneTemplate(template.id);
      handleClose();
    } catch (error) {
      console.error('Failed to clone template:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveTemplate(template.id);
      handleClose();
    } catch (error) {
      console.error('Failed to archive template:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      try {
        await deleteTemplate(template.id);
        handleClose();
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DialogTitle className="text-2xl">{template.name}</DialogTitle>
                <button
                  onClick={handleToggleFavorite}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      template.isFavorite
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                  {statusConfig.label}
                </Badge>
                <Badge variant="outline">{getCategoryLabel(template.category)}</Badge>
                {template.channels.map((channel) => (
                  <Badge key={channel} variant="secondary">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
            {/* <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>
        </DialogHeader>

        {/* Description */}
        {template.description && (
          <p className="text-muted-foreground mt-4">{template.description}</p>
        )}

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-4">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-6">
          <Button onClick={handleUseTemplate} className="flex-1">
            <PlayCircle className="w-4 h-4 mr-2" />
            Utiliser ce template
          </Button>
          <Button variant="outline" onClick={handleClone}>
            <Copy className="w-4 h-4 mr-2" />
            Dupliquer
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          {template.status !== 'archived' ? (
            <Button variant="outline" onClick={handleArchive}>
              <Archive className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline">
              <Archive className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" onClick={handleDelete} className="text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="preview" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-6">
            <TemplatePreview template={template} />
          </TabsContent>
          <TabsContent value="stats" className="mt-6">
            <TemplateStats template={template} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Star,
  MoreVertical,
  Eye,
  Copy,
  Edit,
  Archive,
  Trash2,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Button } from '@/app/modules/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/modules/ui/dropdown-menu';
import type { Template } from '../../types/template.types';
import {
  getCategoryLabel,
  getStatusConfig,
  formatTemplateDate,
  calculatePerformanceScore,
} from '../../utils/templateHelpers';
import { useTemplateActions } from '../../hooks/useTemplateActions';
import { useTemplateStore } from '../../stores/templateStore';

interface TemplateCardProps {
  template: Template;
  onPreview?: (template: Template) => void;
}

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const [imageError, setImageError] = useState(false);
  const { useTemplate, toggleFavorite, cloneTemplate, archiveTemplate, deleteTemplate } =
    useTemplateActions();
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);

  const statusConfig = getStatusConfig(template.status);
  const performanceScore = calculatePerformanceScore(template);

  const handleUseTemplate = () => {
    useTemplate(template.id);
  };

  const handlePreview = () => {
    setSelectedTemplate(template);
    onPreview?.(template);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(template.id);
  };

  const handleClone = async () => {
    try {
      await cloneTemplate(template.id);
    } catch (error) {
      console.error('Failed to clone template:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveTemplate(template.id);
    } catch (error) {
      console.error('Failed to archive template:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      try {
        await deleteTemplate(template.id);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {template.thumbnail && !imageError ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <PlayCircle className="w-16 h-16 text-primary/20" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          <Button size="sm" onClick={handleUseTemplate}>
            <PlayCircle className="w-4 h-4 mr-2" />
            Utiliser
          </Button>
        </div>

        {/* Favorite Star */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <Star
            className={`w-5 h-5 ${
              template.isFavorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Performance Score */}
        {performanceScore > 70 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-green-500 text-white border-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {performanceScore}%
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{template.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {template.description || 'Aucune description'}
            </p>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUseTemplate}>
                <PlayCircle className="w-4 h-4 mr-2" />
                Utiliser
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClone}>
                <Copy className="w-4 h-4 mr-2" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {template.status !== 'archived' ? (
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archiver
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Restaurer
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category & Channels */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{getCategoryLabel(template.category)}</Badge>
          {template.channels.slice(0, 2).map((channel) => (
            <Badge key={channel} variant="secondary" className="text-xs">
              {channel}
            </Badge>
          ))}
          {template.channels.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{template.channels.length - 2}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{template.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span title="Nombre d'utilisations">{template.stats.usageCount} utilisations</span>
            {template.stats.averageCTR && (
              <span title="CTR moyen">{template.stats.averageCTR}% CTR</span>
            )}
          </div>
          <span title="Dernière modification">{formatTemplateDate(template.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}

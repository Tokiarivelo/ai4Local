/**
 * Liste des campagnes avec vue liste et grille
 * Supporte la sélection multiple et les actions
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Edit,
  Archive,
  Trash2,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Checkbox } from '@/app/modules/ui/checkbox';
import { Badge } from '@/app/modules/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/app/modules/ui/dropdown-menu';
import type { Campaign } from '../types';

// If not already defined, import or define CampaignStatus:
export type CampaignStatus =
  | 'active'
  | 'paused'
  | 'scheduled'
  | 'completed'
  | 'failed'
  | 'draft'
  | 'archived';

// Configuration des statuts
const statusConfig: Record<CampaignStatus, { color: string; label: string }> = {
  active: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    label: 'Active',
  },
  paused: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    label: 'En pause',
  },
  scheduled: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    label: 'Programmée',
  },
  completed: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    label: 'Terminée',
  },
  failed: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    label: 'Échouée',
  },
  draft: {
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    label: 'Brouillon',
  },
  archived: {
    color: 'bg-gray-200 text-gray-500 dark:bg-gray-800/20 dark:text-gray-400',
    label: 'Archivée',
  },
};
// Configuration des canaux
const channelConfig = {
  facebook: { icon: '📘', color: 'text-blue-600' },
  instagram: { icon: '📷', color: 'text-pink-600' },
  whatsapp: { icon: '💬', color: 'text-green-600' },
  email: { icon: '📧', color: 'text-orange-600' },
  sms: { icon: '💬', color: 'text-purple-600' },
};

// Composants de skeleton
function CampaignListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-4 h-4 bg-muted rounded" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="h-8 w-16 bg-muted rounded" />
                <div className="h-8 w-20 bg-muted rounded" />
                <div className="h-8 w-24 bg-muted rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CampaignGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-5 bg-muted rounded w-1/2" />
              <div className="h-6 w-16 bg-muted rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-muted rounded" />
                <div className="h-8 bg-muted rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Composant de ligne de campagne (vue liste)
function CampaignListItem({
  campaign,
  isSelected,
  onSelect,
  onToggleSelect,
  onAction,
}: {
  campaign: Campaign;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSelect: () => void;
  onAction: (action: string) => void;
}) {
  const statusInfo = statusConfig[campaign.status];
  const channelInfo = channelConfig[campaign.channel];

  // Calcul de la progression du budget
  const budgetProgress = (campaign.budget.spent / campaign.budget.total) * 100;

  // Format des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Gauche : Sélection + Info principale */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="flex-1 min-w-0" onClick={onSelect}>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-foreground truncate">{campaign.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{channelInfo.icon}</span>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Par {campaign.owner}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(campaign.schedule.startAt)}</span>
                </span>
                {campaign.schedule.endAt && (
                  <>
                    <span>→</span>
                    <span>{formatDate(campaign.schedule.endAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Droite : Métriques + Actions */}
          <div className="flex items-center space-x-6">
            {/* Métriques */}
            <div className="hidden lg:flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-medium text-foreground">
                  {campaign.metrics.impressions.toLocaleString('fr-FR')}
                </div>
                <div className="text-xs text-muted-foreground">Impressions</div>
              </div>

              <div className="text-center">
                <div className="font-medium text-foreground">
                  {campaign.metrics.clicks.toLocaleString('fr-FR')}
                </div>
                <div className="text-xs text-muted-foreground">Clics</div>
              </div>

              <div className="text-center">
                <div className="font-medium text-foreground">
                  {campaign.metrics.ctr.toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">CTR</div>
              </div>

              <div className="text-center">
                <div className="font-medium text-foreground">
                  {campaign.budget.spent.toLocaleString('fr-FR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{' '}
                  €
                </div>
                <div className="text-xs text-muted-foreground">
                  /{' '}
                  {campaign.budget.total.toLocaleString('fr-FR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{' '}
                  €
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Actions rapides */}
              {campaign.status === 'active' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('pause');
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pause className="w-4 h-4" />
                </Button>
              ) : campaign.status === 'paused' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction('resume');
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-4 h-4" />
                </Button>
              ) : null}

              {/* Menu d'actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onAction('edit')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction('duplicate')}>
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Voir détails
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onAction('archive')}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archiver
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onAction('delete')}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Barre de progression du budget */}
        <div className="mt-4 lg:hidden">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Budget utilisé</span>
            <span>{budgetProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-brand-mid rounded-full h-2 transition-all duration-300"
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant de carte de campagne (vue grille)
function CampaignGridItem({
  campaign,
  isSelected,
  onSelect,
  onToggleSelect,
  onAction,
}: {
  campaign: Campaign;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSelect: () => void;
  onAction: (action: string) => void;
}) {
  const statusInfo = statusConfig[campaign.status];
  const channelInfo = channelConfig[campaign.channel];
  const budgetProgress = (campaign.budget.spent / campaign.budget.total) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />
            <div className="flex-1 min-w-0" onClick={onSelect}>
              <h3 className="font-semibold text-foreground truncate mb-1">{campaign.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{channelInfo.icon}</span>
                <Badge className={statusInfo.color} size="sm">
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAction('edit')}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('duplicate')}>
                <Copy className="w-4 h-4 mr-2" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('archive')}>
                <Archive className="w-4 h-4 mr-2" />
                Archiver
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction('delete')}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0" onClick={onSelect}>
        <div className="space-y-4">
          {/* Description */}
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
          )}

          {/* Métriques principales */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">
                  {campaign.metrics.impressions >= 1000
                    ? `${(campaign.metrics.impressions / 1000).toFixed(1)}K`
                    : campaign.metrics.impressions.toLocaleString('fr-FR')}
                </div>
                <div className="text-xs text-muted-foreground">Impressions</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MousePointer className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{campaign.metrics.clicks.toLocaleString('fr-FR')}</div>
                <div className="text-xs text-muted-foreground">Clics</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{campaign.metrics.ctr.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">CTR</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">
                  {campaign.budget.spent.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </div>
                <div className="text-xs text-muted-foreground">Dépensé</div>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Budget</span>
              <span>{budgetProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-brand-mid rounded-full h-1.5 transition-all duration-300"
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          {campaign.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {campaign.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{campaign.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type CampaignsListProps = {
  campaigns: Campaign[];
  selectedCampaigns: string[];
  viewMode: 'list' | 'grid';
  loading?: boolean;
  onCampaignSelect: (campaignId: string) => void;
  onMultiSelect: (selectedIds: string[]) => void;
  onCampaignAction: (action: string, campaign: Campaign) => void;
};

export default function CampaignsList({
  campaigns,
  selectedCampaigns,
  viewMode,
  loading = false,
  onCampaignSelect,
  onMultiSelect,
  onCampaignAction,
}: CampaignsListProps) {
  // Gestion de la sélection
  const handleToggleSelect = useCallback(
    (campaignId: string) => {
      const newSelection = selectedCampaigns.includes(campaignId)
        ? selectedCampaigns.filter((id) => id !== campaignId)
        : [...selectedCampaigns, campaignId];

      onMultiSelect(newSelection);
    },
    [selectedCampaigns, onMultiSelect]
  );

  const handleSelectAll = useCallback(() => {
    const allSelected = campaigns.every((c) => selectedCampaigns.includes(c.id));
    onMultiSelect(allSelected ? [] : campaigns.map((c) => c.id));
  }, [campaigns, selectedCampaigns, onMultiSelect]);

  // États de sélection
  const isAllSelected =
    campaigns.length > 0 && campaigns.every((c) => selectedCampaigns.includes(c.id));
  const isSomeSelected = selectedCampaigns.length > 0 && !isAllSelected;

  if (loading) {
    return viewMode === 'list' ? <CampaignListSkeleton /> : <CampaignGridSkeleton />;
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Aucune campagne trouvée</h3>
            <p className="mb-4">
              Il n'y a pas de campagnes correspondant à vos critères de recherche.
            </p>
            <Button onClick={() => onCampaignAction('create', {} as Campaign)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer votre première campagne
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec sélection globale */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            // indeterminate={isSomeSelected}
            onCheckedChange={handleSelectAll}
          />
          <span>
            {selectedCampaigns.length > 0
              ? `${selectedCampaigns.length} campagne${selectedCampaigns.length > 1 ? 's' : ''} sélectionnée${selectedCampaigns.length > 1 ? 's' : ''}`
              : `${campaigns.length} campagne${campaigns.length > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Liste des campagnes */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <CampaignListItem
              key={campaign.id}
              campaign={campaign}
              isSelected={selectedCampaigns.includes(campaign.id)}
              onSelect={() => onCampaignSelect(campaign.id)}
              onToggleSelect={() => handleToggleSelect(campaign.id)}
              onAction={(action) => onCampaignAction(action, campaign)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignGridItem
              key={campaign.id}
              campaign={campaign}
              isSelected={selectedCampaigns.includes(campaign.id)}
              onSelect={() => onCampaignSelect(campaign.id)}
              onToggleSelect={() => handleToggleSelect(campaign.id)}
              onAction={(action) => onCampaignAction(action, campaign)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

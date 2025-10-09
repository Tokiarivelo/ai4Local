/**
 * Toolbar principale pour les campagnes
 * Actions: créer, filtrer, changer vue, actions bulk
 */

'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Filter,
  List,
  Grid3X3,
  Search,
  Download,
  Upload,
  Play,
  Pause,
  Archive,
  Trash2,
  MoreHorizontal,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/app/modules/ui/dropdown-menu';
import type { FilterOptions } from '../types';

interface CampaignsToolbarProps {
  selectedCount: number;
  totalCount: number;
  viewMode: 'list' | 'grid';
  showFilters: boolean;
  filters: FilterOptions;
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onToggleFilters: () => void;
  onCreateCampaign: () => void;
  onBulkAction: (action: string) => void;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
}

// Options de tri
const sortOptions = [
  { value: 'updatedAt', label: 'Dernière modification', icon: SortDesc },
  { value: 'createdAt', label: 'Date de création', icon: SortDesc },
  { value: 'name', label: 'Nom', icon: SortAsc },
  { value: 'status', label: 'Statut', icon: SortAsc },
  { value: 'startAt', label: 'Date de début', icon: SortDesc },
  { value: 'spend', label: 'Budget dépensé', icon: SortDesc },
  { value: 'impressions', label: 'Impressions', icon: SortDesc },
  { value: 'conversions', label: 'Conversions', icon: SortDesc },
];

export default function CampaignsToolbar({
  selectedCount,
  totalCount,
  viewMode,
  showFilters,
  filters,
  onViewModeChange,
  onToggleFilters,
  onCreateCampaign,
  onBulkAction,
  onFiltersChange,
}: CampaignsToolbarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Gestion de la recherche avec debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      // Debounce de 300ms
      const timeoutId = setTimeout(() => {
        onFiltersChange({ search: value });
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [onFiltersChange]
  );

  // Gestion du tri
  const handleSortChange = useCallback(
    (sortBy: string) => {
      const newSortOrder =
        filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
      onFiltersChange({ sortBy, sortOrder: newSortOrder });
    },
    [filters.sortBy, filters.sortOrder, onFiltersChange]
  );

  // Compte des filtres actifs
  const activeFiltersCount = [
    filters.status.length,
    filters.channels.length,
    filters.types.length,
    filters.objectives.length,
    filters.owners.length,
    filters.tags.length,
    filters.dateRange.start || filters.dateRange.end ? 1 : 0,
    filters.budgetRange.min || filters.budgetRange.max ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Ligne principale */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Gauche : Compteurs et recherche */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Compteurs */}
          <div className="text-sm text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium text-foreground">
                {selectedCount} sélectionnée{selectedCount > 1 ? 's' : ''}
              </span>
            ) : (
              <span>
                {totalCount} campagne{totalCount > 1 ? 's' : ''}
                {activeFiltersCount > 0 && (
                  <span className="ml-1">(filtré{activeFiltersCount > 1 ? 's' : ''})</span>
                )}
              </span>
            )}
          </div>

          {/* Barre de recherche */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher des campagnes..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Droite : Actions */}
        <div className="flex items-center space-x-2">
          {/* Actions bulk (visibles si sélection) */}
          {selectedCount > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('resume')}
                className="h-9"
              >
                <Play className="w-4 h-4 mr-2" />
                Reprendre
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('pause')}
                className="h-9"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('archive')}
                className="h-9"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archiver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('delete')}
                className="h-9 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
              <div className="w-px h-6 bg-border" />
            </>
          )}

          {/* Mode d'affichage */}
          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-9 rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-9 rounded-l-none border-l"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Filtres */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleFilters}
            className="h-9 relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs px-1 min-w-[1.25rem] h-5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Tri */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                {filters.sortOrder === 'desc' ? (
                  <SortDesc className="w-4 h-4 mr-2" />
                ) : (
                  <SortAsc className="w-4 h-4 mr-2" />
                )}
                Trier
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Trier par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {filters.sortBy === option.value &&
                    (filters.sortOrder === 'desc' ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    ))}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Actions additionnelles */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Exporter Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Importer campagnes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bouton principal de création */}
          <Button onClick={onCreateCampaign} size="sm" className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle campagne
          </Button>
        </div>
      </div>

      {/* Ligne secondaire : Filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Filtres actifs :</span>

          {/* Filtres de statut */}
          {filters.status.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              Statut : {filters.status.join(', ')}
            </Badge>
          )}

          {/* Filtres de canaux */}
          {filters.channels.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              Canaux : {filters.channels.join(', ')}
            </Badge>
          )}

          {/* Filtres de types */}
          {filters.types.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              Types : {filters.types.join(', ')}
            </Badge>
          )}

          {/* Filtres d'objectifs */}
          {filters.objectives.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              Objectifs : {filters.objectives.join(', ')}
            </Badge>
          )}

          {/* Filtres de propriétaires */}
          {filters.owners.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              Propriétaires : {filters.owners.join(', ')}
            </Badge>
          )}

          {/* Filtres de tags */}
          {filters.tags.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              Tags : {filters.tags.slice(0, 3).join(', ')}
              {filters.tags.length > 3 && ` +${filters.tags.length - 3}`}
            </Badge>
          )}

          {/* Filtre de date */}
          {(filters.dateRange.start || filters.dateRange.end) && (
            <Badge variant="secondary" className="text-xs">
              Période :{' '}
              {filters.dateRange.start &&
                new Date(filters.dateRange.start).toLocaleDateString('fr-FR')}
              {filters.dateRange.start && filters.dateRange.end && ' - '}
              {filters.dateRange.end && new Date(filters.dateRange.end).toLocaleDateString('fr-FR')}
            </Badge>
          )}

          {/* Filtre de budget */}
          {(filters.budgetRange.min || filters.budgetRange.max) && (
            <Badge variant="secondary" className="text-xs">
              Budget : {filters.budgetRange.min || 0}€ - {filters.budgetRange.max || '∞'}€
            </Badge>
          )}

          {/* Bouton pour tout effacer */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFiltersChange({
                status: [],
                channels: [],
                types: [],
                objectives: [],
                owners: [],
                tags: [],
                dateRange: {},
                budgetRange: {},
              })
            }
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
}

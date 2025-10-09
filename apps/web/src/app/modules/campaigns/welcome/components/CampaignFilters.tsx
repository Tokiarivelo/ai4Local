/**
 * Panneau de filtres pour les campagnes
 * Filtres avancés : statut, canaux, types, propriétaires, etc.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, X, DollarSign, Tag, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Checkbox } from '@/app/modules/ui/checkbox';
import { Badge } from '@/app/modules/ui/badge';
import { Separator } from '@/app/modules/ui/separator';
import type { Campaign, FilterOptions } from '../types';

interface CampaignFiltersProps {
  filters: FilterOptions;
  campaigns: Campaign[];
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  className?: string;
}

// Configuration des filtres disponibles
const statusOptions = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'paused', label: 'En pause', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'scheduled', label: 'Programmée', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Terminée', color: 'bg-gray-100 text-gray-800' },
  { value: 'failed', label: 'Échouée', color: 'bg-red-100 text-red-800' },
  { value: 'draft', label: 'Brouillon', color: 'bg-purple-100 text-purple-800' },
];

const channelOptions = [
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'sms', label: 'SMS', icon: '💬' },
];

const typeOptions = [
  { value: 'promotion', label: 'Promotion', icon: '🎯' },
  { value: 'awareness', label: 'Notoriété', icon: '👁️' },
  { value: 'traffic', label: 'Trafic', icon: '🚀' },
  { value: 'engagement', label: 'Engagement', icon: '❤️' },
  { value: 'lead_generation', label: 'Génération de leads', icon: '🧲' },
];

const objectiveOptions = [
  { value: 'traffic', label: 'Trafic', icon: '🚀' },
  { value: 'conversions', label: 'Conversions', icon: '🎯' },
  { value: 'leads', label: 'Leads', icon: '🧲' },
  { value: 'brand_awareness', label: 'Notoriété', icon: '👁️' },
  { value: 'engagement', label: 'Engagement', icon: '❤️' },
  { value: 'reach', label: 'Portée', icon: '📢' },
];

export default function CampaignFilters({
  filters,
  campaigns,
  onFiltersChange,
  className = '',
}: CampaignFiltersProps) {
  // États locaux pour les plages
  const [budgetMin, setBudgetMin] = useState(filters.budgetRange.min?.toString() || '');
  const [budgetMax, setBudgetMax] = useState(filters.budgetRange.max?.toString() || '');
  const [dateStart, setDateStart] = useState(filters.dateRange.start || '');
  const [dateEnd, setDateEnd] = useState(filters.dateRange.end || '');

  // Extraction des propriétaires uniques
  const availableOwners = useMemo(() => {
    const owners = Array.from(new Set(campaigns.map((c) => c.owner))).sort();
    return owners.map((owner) => ({
      value: owner,
      label: owner,
      count: campaigns.filter((c) => c.owner === owner).length,
    }));
  }, [campaigns]);

  // Extraction des tags uniques
  const availableTags = useMemo(() => {
    const allTags = campaigns.flatMap((c) => c.tags);
    const tagCounts = allTags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]) // Tri par popularité
      .map(([tag, count]) => ({ value: tag, label: tag, count }));
  }, [campaigns]);

  // Gestion des filtres à choix multiples
  const toggleArrayFilter = useCallback(
    (filterKey: keyof FilterOptions, value: string) => {
      const currentArray = filters[filterKey] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      onFiltersChange({ [filterKey]: newArray });
    },
    [filters, onFiltersChange]
  );

  // Gestion des plages de budget
  const handleBudgetChange = useCallback(() => {
    const min = budgetMin ? parseInt(budgetMin, 10) : undefined;
    const max = budgetMax ? parseInt(budgetMax, 10) : undefined;

    onFiltersChange({
      budgetRange: { min, max },
    });
  }, [budgetMin, budgetMax, onFiltersChange]);

  // Gestion des plages de dates
  const handleDateChange = useCallback(() => {
    onFiltersChange({
      dateRange: {
        start: dateStart || undefined,
        end: dateEnd || undefined,
      },
    });
  }, [dateStart, dateEnd, onFiltersChange]);

  // Reset des filtres
  const resetFilters = useCallback(() => {
    setBudgetMin('');
    setBudgetMax('');
    setDateStart('');
    setDateEnd('');
    onFiltersChange({
      status: [],
      channels: [],
      types: [],
      objectives: [],
      owners: [],
      tags: [],
      dateRange: {},
      budgetRange: {},
    });
  }, [onFiltersChange]);

  // Composant de section de filtre
  const FilterSection = ({
    title,
    icon,
    children,
    collapsible = true,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    collapsible?: boolean;
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <Card>
        <CardHeader
          className={`pb-3 ${collapsible ? 'cursor-pointer' : ''}`}
          onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {icon}
              <span>{title}</span>
            </div>
            {collapsible && (
              <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            )}
          </CardTitle>
        </CardHeader>
        {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
      </Card>
    );
  };

  // Composant de groupe de checkboxes
  const CheckboxGroup = ({
    options,
    selectedValues,
    onToggle,
    showCounts = false,
  }: {
    options: Array<{ value: string; label: string; count?: number; color?: string; icon?: string }>;
    selectedValues: string[];
    onToggle: (value: string) => void;
    showCounts?: boolean;
  }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={() => onToggle(option.value)}
          />
          <label
            htmlFor={option.value}
            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </div>
            {showCounts && option.count && (
              <Badge variant="secondary" className="text-xs">
                {option.count}
              </Badge>
            )}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header avec reset */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Statuts */}
      <FilterSection title="Statut" icon={<Zap className="w-4 h-4" />}>
        <CheckboxGroup
          options={statusOptions}
          selectedValues={filters.status}
          onToggle={(value) => toggleArrayFilter('status', value)}
          showCounts
        />
      </FilterSection>

      {/* Canaux */}
      <FilterSection title="Canaux" icon={<Tag className="w-4 h-4" />}>
        <CheckboxGroup
          options={channelOptions}
          selectedValues={filters.channels}
          onToggle={(value) => toggleArrayFilter('channels', value)}
          showCounts
        />
      </FilterSection>

      {/* Types */}
      <FilterSection title="Types de campagne" icon={<Tag className="w-4 h-4" />}>
        <CheckboxGroup
          options={typeOptions}
          selectedValues={filters.types}
          onToggle={(value) => toggleArrayFilter('types', value)}
          showCounts
        />
      </FilterSection>

      {/* Objectifs */}
      <FilterSection title="Objectifs" icon={<Tag className="w-4 h-4" />}>
        <CheckboxGroup
          options={objectiveOptions}
          selectedValues={filters.objectives}
          onToggle={(value) => toggleArrayFilter('objectives', value)}
          showCounts
        />
      </FilterSection>

      {/* Propriétaires */}
      <FilterSection title="Propriétaires" icon={<Users className="w-4 h-4" />}>
        <CheckboxGroup
          options={availableOwners}
          selectedValues={filters.owners}
          onToggle={(value) => toggleArrayFilter('owners', value)}
          showCounts
        />
      </FilterSection>

      {/* Budget */}
      <FilterSection title="Budget" icon={<DollarSign className="w-4 h-4" />}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Min (€)</label>
              <Input
                type="number"
                placeholder="0"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                onBlur={handleBudgetChange}
                className="h-8"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Max (€)</label>
              <Input
                type="number"
                placeholder="∞"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                onBlur={handleBudgetChange}
                className="h-8"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Dates */}
      <FilterSection title="Période" icon={<Calendar className="w-4 h-4" />}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Date de début</label>
            <Input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              onBlur={handleDateChange}
              className="h-8"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Date de fin</label>
            <Input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              onBlur={handleDateChange}
              className="h-8"
            />
          </div>
        </div>
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Tags" icon={<Tag className="w-4 h-4" />}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableTags.slice(0, 20).map((tag) => (
            <div key={tag.value} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.value}`}
                checked={filters.tags.includes(tag.value)}
                onCheckedChange={() => toggleArrayFilter('tags', tag.value)}
              />
              <label
                htmlFor={`tag-${tag.value}`}
                className="text-sm cursor-pointer flex-1 flex items-center justify-between"
              >
                <span className="truncate">{tag.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {tag.count}
                </Badge>
              </label>
            </div>
          ))}
          {availableTags.length > 20 && (
            <div className="text-xs text-muted-foreground text-center pt-2">
              +{availableTags.length - 20} autres tags...
            </div>
          )}
        </div>
      </FilterSection>
    </div>
  );
}

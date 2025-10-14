'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Plus, X } from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/modules/ui/dialog';

import type { AudienceFilter } from '../validators';

interface CustomFiltersProps {
  filters: AudienceFilter[];
  onFiltersChange: (filters: AudienceFilter[]) => void;
}

export function CustomFilters({ filters, onFiltersChange }: CustomFiltersProps) {
  const addCustomFilter = React.useCallback(
    (filter: AudienceFilter) => {
      onFiltersChange([...filters, filter]);
    },
    [filters, onFiltersChange]
  );

  const removeCustomFilter = React.useCallback(
    (filterId: string) => {
      onFiltersChange(filters.filter((f) => f.id !== filterId));
    },
    [filters, onFiltersChange]
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Filtres personnalisés</h4>
        <CustomFilterDialog onAdd={addCustomFilter} />
      </div>

      {filters.length > 0 ? (
        <div className="space-y-2">
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              filter={filter}
              onRemove={() => removeCustomFilter(filter.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Filter className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Aucun filtre personnalisé défini</p>
          <p className="text-xs">Utilisez le bouton ci-dessus pour en ajouter</p>
        </div>
      )}
    </Card>
  );
}

function CustomFilterDialog({ onAdd }: { onAdd: (filter: AudienceFilter) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<AudienceFilter['type']>('age');
  const [field, setField] = useState('');
  const [operator, setOperator] = useState<AudienceFilter['operator']>('equals');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!field || !value) return;

    const filter: AudienceFilter = {
      id: `filter-${Date.now()}`,
      type: filterType,
      field,
      operator,
      value: operator === 'between' ? value.split('-').map((v) => parseInt(v.trim())) : value,
    };

    onAdd(filter);
    setIsOpen(false);
    setField('');
    setValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un filtre
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un filtre personnalisé</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Type de filtre</label>
            <Select
              value={filterType}
              onValueChange={(value: AudienceFilter['type']) => setFilterType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="age">Âge</SelectItem>
                <SelectItem value="location">Localisation</SelectItem>
                <SelectItem value="interests">Centres d'intérêt</SelectItem>
                <SelectItem value="behavior">Comportement</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Champ</label>
            <Input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Ex: age, city, interests..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Opérateur</label>
            <Select
              value={operator}
              onValueChange={(value: AudienceFilter['operator']) => setOperator(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Égal à</SelectItem>
                <SelectItem value="contains">Contient</SelectItem>
                <SelectItem value="in">Dans la liste</SelectItem>
                <SelectItem value="between">Entre</SelectItem>
                <SelectItem value="greater_than">Supérieur à</SelectItem>
                <SelectItem value="less_than">Inférieur à</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Valeur</label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                operator === 'between'
                  ? 'Ex: 25-35'
                  : operator === 'in'
                    ? 'Ex: Paris,Lyon,Marseille'
                    : 'Ex: technologie'
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAdd} disabled={!field || !value}>
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const FilterChip = React.memo(function FilterChip({
  filter,
  onRemove,
}: {
  filter: AudienceFilter;
  onRemove: () => void;
}) {
  const getFilterText = () => {
    const { field, operator, value } = filter;
    const operatorText: Record<AudienceFilter['operator'], string> = {
      equals: '=',
      contains: 'contient',
      in: 'dans',
      between: 'entre',
      greater_than: '>',
      less_than: '<',
    };

    const valueText = Array.isArray(value) ? value.join(' - ') : value.toString();
    return `${field} ${operatorText[operator]} ${valueText}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
    >
      <span>{getFilterText()}</span>
      <button
        onClick={onRemove}
        className="hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
});

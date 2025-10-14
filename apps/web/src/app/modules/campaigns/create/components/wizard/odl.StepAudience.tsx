/**
 * Étape Audience - Ciblage et segmentation
 * Gère la sélection de segments, filtres personnalisés et import CSV
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Target,
  Upload,
  Download,
  Filter,
  Plus,
  Minus,
  MapPin,
  Calendar,
  Heart,
  Briefcase,
  Check,
  X,
  FileText,
  Eye,
} from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';
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

import { AudienceStepSchema, type AudienceStepData, type AudienceFilter } from './validators';
import { useCampaignCreateContext } from '../../context/WizardContext';
import { mockAudienceSegments, mockCSVData } from '../../mock-data';

interface StepAudienceProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepAudience({ onComplete, onValidationChange }: StepAudienceProps) {
  const { data, updateStepData, completeStep } = useCampaignCreateContext();

  const [activeSegments, setActiveSegments] = useState<string[]>(
    data.audience?.selectedSegments || []
  );
  const [customFilters, setCustomFilters] = useState<AudienceFilter[]>(
    data.audience?.customFilters || []
  );
  const [csvData, setCsvData] = useState(data.audience?.csvImport || null);
  const [estimatedReach, setEstimatedReach] = useState<number>(data.audience?.estimatedReach || 0);

  const form = useForm<AudienceStepData>({
    resolver: zodResolver(AudienceStepSchema),
    defaultValues: {
      selectedSegments: activeSegments,
      customFilters: customFilters,
      csvImport: csvData || undefined,
      estimatedReach: estimatedReach,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  // Calcul du reach estimé
  React.useEffect(() => {
    const totalReach = activeSegments.reduce((total, segmentId) => {
      const segment = mockAudienceSegments.find((s) => s.id === segmentId);
      return total + (segment?.size || 0);
    }, 0);

    // Facteur de réduction pour éviter le double comptage
    const adjustedReach = Math.round(totalReach * 0.85);
    setEstimatedReach(adjustedReach);
  }, [activeSegments]);

  // Mise à jour du contexte avec stabilisation
  React.useEffect(() => {
    updateStepData({
      audience: {
        selectedSegments: activeSegments,
        customFilters: customFilters,
        csvImport: csvData || undefined,
        estimatedReach: estimatedReach,
      },
    });
  }, [activeSegments, customFilters, csvData, estimatedReach, updateStepData]);

  // Notification de validation avec stabilisation
  const isFormValidMemo = React.useMemo(() => {
    return isValid && activeSegments.length > 0;
  }, [isValid, activeSegments.length]);

  React.useEffect(() => {
    onValidationChange?.(isFormValidMemo);
  }, [isFormValidMemo, onValidationChange]);

  // Fonction de toggle ultra-simple et directe
  const toggleSegment = useCallback((segmentId: string) => {
    setActiveSegments((prev) => {
      const isCurrentlyActive = prev.includes(segmentId);
      return isCurrentlyActive ? prev.filter((id) => id !== segmentId) : [...prev, segmentId];
    });
  }, []);

  // Pas de handlers mémorisés - utiliser des arrows functions directement
  // Cela élimine complètement les problèmes de référence

  const addCustomFilter = useCallback((filter: AudienceFilter) => {
    setCustomFilters((prev) => [...prev, filter]);
  }, []);

  // Fonction de suppression de filtre ultra-simple
  const removeCustomFilter = useCallback((filterId: string) => {
    setCustomFilters((prev) => prev.filter((f) => f.id !== filterId));
  }, []);

  const handleCSVUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulation de parsing CSV
    setTimeout(() => {
      setCsvData({
        fileName: file.name,
        headers: mockCSVData.headers,
        rowCount: mockCSVData.stats.totalRows,
        validRows: mockCSVData.stats.validRows,
      });
    }, 1000);

    event.target.value = '';
  }, []);

  const onSubmit = useCallback(
    (data: AudienceStepData) => {
      completeStep('audience');
      onComplete?.();
    },
    [completeStep, onComplete]
  );

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold">Définir l'audience</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez vos segments cibles pour maximiser l'impact de votre campagne
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Segments prédéfinis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Segments disponibles</h4>
            <Badge variant="outline">
              {activeSegments.length} sélectionné{activeSegments.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAudienceSegments.map((segment) => (
              <SegmentCard
                key={segment.id}
                segment={segment}
                isActive={activeSegments.includes(segment.id)}
                onToggle={() => toggleSegment(segment.id)}
              />
            ))}
          </div>
        </Card>

        {/* Filtres personnalisés */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Filtres personnalisés</h4>
            <CustomFilterDialog onAdd={addCustomFilter} />
          </div>

          {customFilters.length > 0 ? (
            <div className="space-y-2">
              {customFilters.map((filter) => (
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

        {/* Import CSV */}
        <Card className="p-6">
          <h4 className="font-medium mb-4">Import d'audience</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Importer un fichier CSV</span>
                  <span className="text-xs text-muted-foreground">
                    Emails, noms, localisations...
                  </span>
                </label>
              </div>
            </div>

            {csvData && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{csvData.fileName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total :</span>
                    <span className="ml-2 font-medium">{csvData.rowCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valides :</span>
                    <span className="ml-2 font-medium text-green-600">{csvData.validRows}</span>
                  </div>
                </div>

                <CSVPreviewDialog csvData={csvData} />
              </div>
            )}
          </div>
        </Card>

        {/* Résumé et estimation */}
        <AudienceSummary
          segments={activeSegments}
          filters={customFilters}
          csvData={csvData}
          estimatedReach={estimatedReach}
        />

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid || activeSegments.length === 0}>
            Continuer vers le planning
          </Button>
        </div>
      </form>
    </div>
  );
}

// Carte de segment ultra-stable avec checkbox personnalisée
const SegmentCard = React.memo(function SegmentCard({
  segment,
  isActive,
  onToggle,
}: {
  segment: (typeof mockAudienceSegments)[0];
  isActive: boolean;
  onToggle: () => void;
}) {
  // Handler de clic unifié - un seul événement pour toute la carte
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  return (
    <motion.div
      className={`
        relative p-4 border rounded-lg cursor-pointer transition-all
        ${
          isActive
            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
            : 'border-border hover:border-primary/50'
        }
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h5 className="font-medium text-sm">{segment.name}</h5>
        </div>
        {/* Checkbox personnalisée sans Radix UI */}
        <div
          className={`
            w-4 h-4 border-2 rounded flex items-center justify-center transition-all
            ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground'
            }
          `}
        >
          {isActive && <Check className="h-3 w-3" />}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{segment.description}</p>

      <div className="flex items-center justify-between">
        <Badge variant="secondary" size="sm">
          {segment.size.toLocaleString()} personnes
        </Badge>

        <div className="flex flex-wrap gap-1">
          {segment.demographics.interests.slice(0, 2).map((interest) => (
            <Badge key={interest} variant="outline" size="sm" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Indicateur de sélection */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-2 right-2"
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Dialogue pour ajouter un filtre personnalisé
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

  const getIcon = (type: AudienceFilter['type']) => {
    switch (type) {
      case 'age':
        return Calendar;
      case 'location':
        return MapPin;
      case 'interests':
        return Heart;
      case 'behavior':
        return Target;
      default:
        return Filter;
    }
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

// Puce de filtre mémorisée
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

// Dialogue de prévisualisation CSV
function CSVPreviewDialog({ csvData }: { csvData: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Prévisualiser
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Prévisualisation des données</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted rounded">
              <div className="font-medium text-lg">{csvData.rowCount}</div>
              <div className="text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded">
              <div className="font-medium text-lg text-green-600">{csvData.validRows}</div>
              <div className="text-muted-foreground">Valides</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded">
              <div className="font-medium text-lg text-red-600">
                {csvData.rowCount - csvData.validRows}
              </div>
              <div className="text-muted-foreground">Erreurs</div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-2 border-b">
              <h5 className="font-medium text-sm">Échantillon des données</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {mockCSVData.headers.map((header) => (
                      <th key={header} className="px-3 py-2 text-left font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockCSVData.preview.map((row, index) => (
                    <tr key={index} className="border-t">
                      {mockCSVData.headers.map((header) => (
                        <td key={header} className="px-3 py-2">
                          {row[header as keyof typeof row]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Résumé de l'audience
function AudienceSummary({
  segments,
  filters,
  csvData,
  estimatedReach,
}: {
  segments: string[];
  filters: AudienceFilter[];
  csvData: any;
  estimatedReach: number;
}) {
  return (
    <Card className="p-6">
      <h4 className="font-medium mb-4">Résumé de l'audience</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reach estimé */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {estimatedReach.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Personnes touchées</div>
        </div>

        {/* Segments */}
        <div>
          <div className="text-sm font-medium mb-2">Segments sélectionnés</div>
          <div className="space-y-1">
            {segments.length > 0 ? (
              segments.map((segmentId) => {
                const segment = mockAudienceSegments.find((s) => s.id === segmentId);
                return segment ? (
                  <div key={segmentId} className="text-sm text-muted-foreground">
                    • {segment.name} ({segment.size.toLocaleString()})
                  </div>
                ) : null;
              })
            ) : (
              <div className="text-sm text-muted-foreground">Aucun segment sélectionné</div>
            )}
          </div>
        </div>

        {/* Filtres et CSV */}
        <div>
          <div className="text-sm font-medium mb-2">Critères additionnels</div>
          <div className="space-y-1">
            {filters.length > 0 && (
              <div className="text-sm text-muted-foreground">
                • {filters.length} filtre{filters.length > 1 ? 's' : ''} personnalisé
                {filters.length > 1 ? 's' : ''}
              </div>
            )}
            {csvData && (
              <div className="text-sm text-muted-foreground">
                • Import CSV ({csvData.validRows} contacts)
              </div>
            )}
            {filters.length === 0 && !csvData && (
              <div className="text-sm text-muted-foreground">Aucun critère additionnel</div>
            )}
          </div>
        </div>
      </div>

      {estimatedReach > 0 && (
        <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              Votre audience cible représente <strong>{estimatedReach.toLocaleString()}</strong>{' '}
              personnes. Cette estimation peut varier selon les recoupements entre segments.
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
}

export default StepAudience;

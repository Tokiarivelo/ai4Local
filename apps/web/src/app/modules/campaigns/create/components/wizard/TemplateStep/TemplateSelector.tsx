'use client';

import React, { useState } from 'react';
import { Search, Filter, Sparkles, Clock, Target, Mail } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';
import { TemplateCard } from './TemplateCard';
import { TemplateFilters } from './TemplateFilters';
import { CAMPAIGN_TEMPLATES } from './constants';

interface TemplateSelectorProps {
  selectedTemplate: any;
  onTemplateSelect: (template: any) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrage des templates
  const filteredTemplates = React.useMemo(() => {
    return CAMPAIGN_TEMPLATES.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.some(
          (filter) => template.category === filter || template.channels.includes(filter as any)
        );

      return matchesSearch && matchesFilters;
    });
  }, [searchQuery, selectedFilters]);

  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
          {selectedFilters.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedFilters.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <TemplateFilters selectedFilters={selectedFilters} onFiltersChange={setSelectedFilters} />
      )}

      {/* Résultats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} template(s) trouvé(s)
          </p>

          {selectedFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedFilters([])}>
              Effacer les filtres
            </Button>
          )}
        </div>

        {/* Grille de templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={() => onTemplateSelect(template)}
            />
          ))}
        </div>

        {/* Option pour commencer sans template */}
        <Card className="p-6 mt-6 border-dashed">
          <div className="text-center">
            <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">Commencer sans template</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Créez votre campagne from scratch avec une liberté totale
            </p>
            <Button variant="outline" onClick={() => onTemplateSelect(null)}>
              Commencer vide
            </Button>
          </div>
        </Card>
      </div>

      {filteredTemplates.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun template trouvé pour "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

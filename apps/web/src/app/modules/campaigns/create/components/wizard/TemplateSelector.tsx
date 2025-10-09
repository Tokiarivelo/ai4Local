'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, Users, Eye, Heart } from 'lucide-react';

import { Button } from '@/app/modules/ui/button';
import { Card } from '@/app/modules/ui/card';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';

import { mockCampaignTemplates } from '../../mocks/campaign-create.mock';
import type { CampaignTemplate } from '../../types';

interface TemplateSelectorProps {
  /**
   * Callback appelé lors de la sélection d'un template
   */
  onSelectTemplate: (template: CampaignTemplate) => void;

  /**
   * Callback appelé pour ignorer la sélection
   */
  onSkipTemplate: () => void;

  /**
   * ID du template sélectionné par défaut
   */
  selectedTemplateId?: string;
}

/**
 * Sélecteur de templates de campagne
 * Affiche les templates disponibles avec recherche et filtres
 */
export function TemplateSelector({
  onSelectTemplate,
  onSkipTemplate,
  selectedTemplateId,
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    selectedTemplateId || null
  );

  // Filtrage des templates
  const filteredTemplates = useMemo(() => {
    return mockCampaignTemplates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Catégories disponibles
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockCampaignTemplates.map((t) => t.category)));
    return ['all', ...cats];
  }, []);

  // Templates populaires
  const popularTemplates = mockCampaignTemplates
    .filter((t) => t.isPopular)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 3);

  const handleTemplateClick = (template: CampaignTemplate) => {
    setSelectedTemplate(template.id);
  };

  const handleConfirmSelection = () => {
    const template = mockCampaignTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Démarrage rapide
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Choisissez un template</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Démarrez avec un modèle optimisé ou créez votre campagne depuis zéro. Tous les templates
          sont personnalisables.
        </p>
      </div>

      {/* Options de démarrage */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Démarrage rapide */}
        <Card className="p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/50">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Utiliser un template</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gagnez du temps avec nos modèles optimisés
            </p>
            <Badge variant="secondary" size="sm">
              Recommandé
            </Badge>
          </div>
        </Card>

        {/* Création libre */}
        <Card
          className="p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onSkipTemplate}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="font-semibold mb-2">Créer depuis zéro</h3>
            <p className="text-sm text-muted-foreground mb-4">Contrôle total sur votre campagne</p>
            <Button variant="outline" size="sm">
              Commencer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Templates populaires */}
      {popularTemplates.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Les plus utilisés
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => handleTemplateClick(template)}
              >
                <div className="relative">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 text-gray-700"
                  >
                    🔥 {template.usageCount}
                  </Badge>
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" size="sm">
                      {template.category}
                    </Badge>
                    <div className="flex -space-x-1">
                      {template.channels.slice(0, 3).map((channel, index) => (
                        <div
                          key={channel}
                          className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs border-2 border-white dark:border-gray-800"
                          title={channel}
                        >
                          {getChannelIcon(channel)}
                        </div>
                      ))}
                      {template.channels.length > 3 && (
                        <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                          +{template.channels.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recherche et filtres */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Tous' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des templates */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => handleTemplateClick(template)}
          >
            <div className="relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              {template.isPopular && (
                <Badge
                  variant="default"
                  size="sm"
                  className="absolute top-2 left-2 bg-orange-500 text-white"
                >
                  Populaire
                </Badge>
              )}
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" size="sm" className="bg-white/90">
                  <Users className="w-3 h-3 mr-1" />
                  {template.usageCount}
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium line-clamp-1">{template.name}</h4>
                <Badge variant="outline" size="sm">
                  {template.category}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {template.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-1">
                  {template.channels.slice(0, 4).map((channel, index) => (
                    <div
                      key={channel}
                      className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs border border-white dark:border-gray-800"
                      title={channel}
                    >
                      {getChannelIcon(channel)}
                    </div>
                  ))}
                  {template.channels.length > 4 && (
                    <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs border border-white dark:border-gray-800">
                      +{template.channels.length - 4}
                    </div>
                  )}
                </div>

                <Badge variant="secondary" size="sm">
                  {getObjectiveLabel(template.objective)}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Aucun résultat */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Aucun template trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche ou créez depuis zéro.
          </p>
          <Button variant="outline" onClick={onSkipTemplate}>
            Créer depuis zéro
          </Button>
        </div>
      )}

      {/* Actions */}
      {selectedTemplate && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="p-4 shadow-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium">Template sélectionné</p>
                <p className="text-muted-foreground">
                  {mockCampaignTemplates.find((t) => t.id === selectedTemplate)?.name}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(null)}>
                  Annuler
                </Button>
                <Button size="sm" onClick={handleConfirmSelection}>
                  Utiliser ce template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/**
 * Retourne l'icône du canal
 */
function getChannelIcon(channel: string): string {
  const icons: Record<string, string> = {
    email: '📧',
    sms: '💬',
    whatsapp: '💬',
    facebook: '📘',
    instagram: '📷',
    google_ads: '🔍',
    linkedin: '💼',
    twitter: '🐦',
    youtube: '🎥',
    tiktok: '🎵',
  };

  return icons[channel] || '📱';
}

/**
 * Retourne le libellé de l'objectif
 */
function getObjectiveLabel(objective: string): string {
  const labels: Record<string, string> = {
    awareness: 'Notoriété',
    traffic: 'Trafic',
    engagement: 'Engagement',
    leads: 'Leads',
    conversions: 'Conversions',
    retention: 'Fidélisation',
  };

  return labels[objective] || objective;
}

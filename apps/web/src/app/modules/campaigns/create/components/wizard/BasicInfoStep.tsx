'use client';

import React, { useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Lightbulb, Target, Globe, MessageSquare, Mail, Smartphone } from 'lucide-react';

import { Input } from '@/app/modules/ui/input';
import { Label } from '@/app/modules/ui/label';
import { Textarea } from '@/app/modules/ui/textarea';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Button } from '@/app/modules/ui/button';
import { Checkbox } from '@/app/modules/ui/checkbox';

import { mockChannelConfig } from '../../mocks/campaign-create.mock';

interface BasicInfoStepProps {
  isValidating?: boolean;
  onAsyncValidation?: (data: unknown) => Promise<void>;
  isEditing?: boolean;
}

const CAMPAIGN_OBJECTIVES: ReadonlyArray<{
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  recommended: string[];
}> = [
  {
    id: 'awareness',
    title: 'Notoriété',
    description: 'Faire connaître votre marque à de nouveaux prospects',
    icon: Globe,
    color: 'bg-blue-500',
    recommended: ['facebook', 'instagram', 'youtube'],
  },
  {
    id: 'traffic',
    title: 'Trafic',
    description: 'Diriger les visiteurs vers votre site web',
    icon: Target,
    color: 'bg-green-500',
    recommended: ['google_ads', 'facebook', 'linkedin'],
  },
  {
    id: 'engagement',
    title: 'Engagement',
    description: 'Augmenter les interactions avec votre contenu',
    icon: MessageSquare,
    color: 'bg-purple-500',
    recommended: ['instagram', 'facebook', 'twitter'],
  },
  {
    id: 'leads',
    title: 'Génération de leads',
    description: 'Collecter des contacts qualifiés',
    icon: Mail,
    color: 'bg-orange-500',
    recommended: ['linkedin', 'email', 'google_ads'],
  },
  {
    id: 'conversions',
    title: 'Conversions',
    description: 'Transformer les prospects en clients',
    icon: Target,
    color: 'bg-red-500',
    recommended: ['google_ads', 'facebook', 'email'],
  },
  {
    id: 'retention',
    title: 'Fidélisation',
    description: "Maintenir l'engagement des clients existants",
    icon: Smartphone,
    color: 'bg-teal-500',
    recommended: ['email', 'whatsapp', 'sms'],
  },
] as const;

/**
 * Étape 1: Informations de base de la campagne
 * Nom, description, objectif et sélection des canaux
 */
export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  isValidating = false,
  onAsyncValidation,
  isEditing = false,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext();

  const watchedValues = watch();
  const selectedObjective = watch('objective');
  const selectedChannels = (watch('channels') as string[] | undefined) || [];

  // Suggestions automatiques basées sur l'objectif
  useEffect(() => {
    if (selectedObjective && selectedChannels.length === 0) {
      const objective = CAMPAIGN_OBJECTIVES.find((obj) => obj.id === selectedObjective);
      if (objective) {
        setValue('channels', objective.recommended);
        trigger('channels');
      }
    }
  }, [selectedObjective, selectedChannels.length, setValue, trigger]);

  // Validation asynchrone quand les données changent
  useEffect(() => {
    if (onAsyncValidation && watchedValues.name && watchedValues.objective) {
      const timer = setTimeout(() => {
        onAsyncValidation(watchedValues);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [watchedValues, onAsyncValidation]);

  const handleChannelToggle = useCallback(
    (channelId: string) => {
      const currentChannels = (watch('channels') as string[]) || [];
      const updatedChannels = currentChannels.includes(channelId)
        ? currentChannels.filter((c: string) => c !== channelId)
        : [...currentChannels, channelId];

      setValue('channels', updatedChannels);
      trigger('channels');
    },
    [setValue, trigger, watch]
  );

  const handleObjectiveSelect = useCallback(
    (objectiveId: string) => {
      setValue('objective', objectiveId);
      trigger('objective');

      // Suggérer les canaux recommandés
      const objective = CAMPAIGN_OBJECTIVES.find((obj) => obj.id === objectiveId);
      const currentChannels = (watch('channels') as string[]) || [];
      if (objective && currentChannels.length === 0) {
        setValue('channels', objective.recommended);
        trigger('channels');
      }
    },
    [setValue, trigger, watch]
  );

  const handleSelectAllChannels = useCallback(() => {
    const allChannels = Object.keys(mockChannelConfig);
    setValue('channels', allChannels);
    trigger('channels');
  }, [setValue, trigger]);

  const handleDeselectAllChannels = useCallback(() => {
    setValue('channels', []);
    trigger('channels');
  }, [setValue, trigger]);

  return (
    <div className="space-y-8">
      {/* Informations générales */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Informations générales</h3>
          <p className="text-muted-foreground">
            Définissez l'identité et l'objectif de votre campagne.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Nom de la campagne */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la campagne *</Label>
              <Input
                id="name"
                placeholder="Ex: Promotion Black Friday 2024"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message as string}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Un nom descriptif aide à organiser vos campagnes
              </p>
            </div>

            {/* Statut/Badge */}
            <div className="space-y-2">
              <Label>Statut</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  🚧 Brouillon
                </Badge>
                {isEditing && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    ✏️ Modification
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le but de cette campagne, votre cible et vos attentes..."
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message as string}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Une description claire améliore la collaboration en équipe
            </p>
          </div>
        </div>
      </Card>

      {/* Objectif de la campagne */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Objectif de la campagne *</h3>
          <p className="text-muted-foreground">
            Choisissez l'objectif principal qui guidera l'optimisation de votre campagne.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGN_OBJECTIVES.map((objective) => {
            const Icon = objective.icon;
            const isSelected = selectedObjective === objective.id;

            return (
              <Card
                key={objective.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50 dark:bg-blue-950'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleObjectiveSelect(objective.id)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${objective.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1">{objective.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {objective.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {objective.recommended.slice(0, 2).map((channel) => (
                          <Badge key={channel} variant="secondary" size="sm">
                            {mockChannelConfig[channel as keyof typeof mockChannelConfig]?.name ||
                              channel}
                          </Badge>
                        ))}
                        {objective.recommended.length > 2 && (
                          <Badge variant="secondary" size="sm">
                            +{objective.recommended.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {errors.objective && (
          <p className="text-sm text-red-600 mt-2">{errors.objective.message as string}</p>
        )}
      </Card>

      {/* Sélection des canaux */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Canaux de diffusion *</h3>
          <p className="text-muted-foreground">
            Sélectionnez les plateformes où votre campagne sera diffusée.
          </p>
          {selectedObjective && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Canaux recommandés pour "
                    {CAMPAIGN_OBJECTIVES.find((o) => o.id === selectedObjective)?.title}"
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Ces canaux sont optimisés pour votre objectif sélectionné
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(mockChannelConfig).map(([channelId, config]) => {
            const isSelected = selectedChannels.includes(channelId);
            const isRecommended =
              selectedObjective &&
              Array.from(
                CAMPAIGN_OBJECTIVES.find((o) => o.id === selectedObjective)?.recommended ?? []
              ).includes(channelId);

            return (
              <div
                key={channelId}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {isRecommended && (
                  <Badge
                    variant="default"
                    size="sm"
                    className="absolute -top-2 -right-2 bg-green-500"
                  >
                    Recommandé
                  </Badge>
                )}

                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleChannelToggle(channelId)}
                  />
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleChannelToggle(channelId)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{config.icon}</span>
                      <span className="font-medium">{config.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {errors.channels && (
          <p className="text-sm text-red-600 mt-2">{errors.channels.message as string}</p>
        )}

        {selectedChannels.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ {selectedChannels.length} canal{selectedChannels.length > 1 ? 'aux' : ''}{' '}
              sélectionné{selectedChannels.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </Card>

      {/* Actions rapides */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm mb-1">Actions rapides</h4>
            <p className="text-xs text-muted-foreground">Optimisez votre configuration</p>
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={handleSelectAllChannels}>
              Tout sélectionner
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleDeselectAllChannels}>
              Tout désélectionner
            </Button>
          </div>
        </div>
      </Card>

      {/* Indicateur de validation */}
      {isValidating && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Validation des informations...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

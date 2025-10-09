'use client';

import React from 'react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { CheckCircle, AlertCircle, Info, ArrowRight } from 'lucide-react';
import type { CampaignDraft } from '../../types';

interface ReviewStepProps {
  isValidating?: boolean;
  onAsyncValidation?: (data: any) => Promise<void>;
  isEditing?: boolean;
  campaignData: Partial<CampaignDraft>;
}

/**
 * Étape 6: Révision et validation finale
 * Résumé de la campagne avant création
 */
export function ReviewStep({
  isValidating = false,
  onAsyncValidation,
  isEditing = false,
  campaignData,
}: ReviewStepProps) {
  const hasBasicInfo = Boolean(campaignData.name);
  const hasChannels = Boolean(campaignData.channels?.length);
  const hasCreatives = Boolean(campaignData.creatives?.length);

  const completionItems = [
    {
      label: 'Informations de base',
      completed: hasBasicInfo,
      description: campaignData.name || 'Nom non défini',
    },
    {
      label: 'Canaux sélectionnés',
      completed: hasChannels,
      description: hasChannels ? `${campaignData.channels!.length} canal(aux)` : 'Aucun canal',
    },
    {
      label: 'Créatifs',
      completed: hasCreatives,
      description: hasCreatives ? `${campaignData.creatives!.length} créatif(s)` : 'Aucun créatif',
    },
  ];

  const completedCount = completionItems.filter((item) => item.completed).length;
  const totalCount = completionItems.length;
  const isReadyToCreate = completedCount >= 2; // Au minimum nom + canaux

  return (
    <div className="space-y-8">
      {/* Résumé de progression */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Résumé de la campagne</h3>
          <p className="text-muted-foreground">
            Vérifiez les informations avant de créer votre campagne.
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} étapes complétées
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Liste des éléments */}
        <div className="space-y-3">
          {completionItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                item.completed
                  ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              {item.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Badge variant={item.completed ? 'default' : 'secondary'} size="sm">
                {item.completed ? 'Complété' : 'Incomplet'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Détails de la campagne */}
      {hasBasicInfo && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Détails de la campagne</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Informations générales</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="font-medium">{campaignData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objectif:</span>
                  <Badge variant="outline" size="sm">
                    {campaignData.objective}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Canaux:</span>
                  <span>{campaignData.channels?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créatifs:</span>
                  <span>{campaignData.creatives?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {campaignData.description && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{campaignData.description}</p>
            </div>
          )}
        </Card>
      )}

      {/* Actions de création */}
      <Card className="p-6">
        <div className="text-center">
          {isReadyToCreate ? (
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                Prêt à créer !
              </h3>
              <p className="text-muted-foreground mb-6">
                Votre campagne a été configurée avec succès. Vous pouvez maintenant la créer.
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700" disabled={isValidating}>
                {isValidating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Création en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{isEditing ? 'Mettre à jour' : 'Créer la campagne'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          ) : (
            <div>
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                Configuration incomplète
              </h3>
              <p className="text-muted-foreground mb-6">
                Veuillez compléter au minimum le nom de la campagne et sélectionner des canaux.
              </p>
              <Button variant="outline" disabled>
                Compléter la configuration
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Note informative */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Note importante</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Après création, vous pourrez modifier votre campagne, ajouter du contenu, ajuster le
              budget et suivre les performances en temps réel dans le tableau de bord.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

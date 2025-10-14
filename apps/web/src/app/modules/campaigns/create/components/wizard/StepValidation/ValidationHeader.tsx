'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, Calendar, Euro, Users, Target } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';

interface ValidationHeaderProps {
  campaignData: any;
}

export function ValidationHeader({ campaignData }: ValidationHeaderProps) {
  const { basicInfo, planning, audience, tracking } = campaignData;

  // Validation globale
  const validationChecks = {
    hasBasicInfo: Boolean(basicInfo?.name && basicInfo?.objective),
    hasCreatives: Boolean(campaignData.creatives?.mediaFiles?.length > 0),
    hasAudience: Boolean(audience?.selectedSegments?.length > 0),
    hasPlanning: Boolean(planning?.budget && planning?.startDate),
    hasTracking: Boolean(tracking?.utmParameters?.source),
  };

  const validationCount = Object.values(validationChecks).filter(Boolean).length;
  const totalChecks = Object.keys(validationChecks).length;
  const isComplete = validationCount === totalChecks;
  const hasIssues = validationCount < totalChecks;

  // Métriques de campagne
  const campaignMetrics = {
    totalBudget: planning?.isDailyBudget
      ? (planning?.budget || 0) * calculateDuration(planning?.startDate, planning?.endDate)
      : planning?.budget || 0,
    duration: calculateDuration(planning?.startDate, planning?.endDate),
    estimatedReach: audience?.estimatedReach || planning?.estimatedReach || 0,
    channels: basicInfo?.channels?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* En-tête principal */}
      <div>
        <h3 className="text-2xl font-bold">Validation finale</h3>
        <p className="text-muted-foreground">
          Vérifiez tous les paramètres avant de lancer votre campagne "
          {basicInfo?.name || 'Sans nom'}"
        </p>
      </div>

      {/* Statut global */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            {isComplete ? (
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-xl font-semibold">
                {isComplete ? 'Campagne prête' : 'Configuration incomplète'}
              </h4>
              <Badge variant={isComplete ? 'default' : 'secondary'}>
                {validationCount}/{totalChecks} étapes validées
              </Badge>
            </div>

            <p className="text-muted-foreground mb-4">
              {isComplete
                ? 'Tous les éléments sont configurés. Votre campagne est prête à être lancée.'
                : `Il reste ${totalChecks - validationCount} élément(s) à configurer pour finaliser votre campagne.`}
            </p>

            {/* Métriques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Budget</span>
                </div>
                <div className="font-semibold">{campaignMetrics.totalBudget}€</div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Durée</span>
                </div>
                <div className="font-semibold">{campaignMetrics.duration} jours</div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Reach</span>
                </div>
                <div className="font-semibold">
                  {campaignMetrics.estimatedReach.toLocaleString()}
                </div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Canaux</span>
                </div>
                <div className="font-semibold">{campaignMetrics.channels}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertes de validation */}
        {hasIssues && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Éléments manquants :</p>
                <ul className="text-sm space-y-1">
                  {!validationChecks.hasBasicInfo && (
                    <li>• Informations de base (nom, objectif)</li>
                  )}
                  {!validationChecks.hasCreatives && <li>• Éléments créatifs (images, vidéos)</li>}
                  {!validationChecks.hasAudience && <li>• Ciblage d'audience</li>}
                  {!validationChecks.hasPlanning && <li>• Budget et planification</li>}
                  {!validationChecks.hasTracking && <li>• Paramètres de tracking</li>}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
}

// Fonction utilitaire pour calculer la durée
function calculateDuration(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

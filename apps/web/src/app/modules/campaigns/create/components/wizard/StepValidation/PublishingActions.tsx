'use client';

import React, { useState } from 'react';
import {
  Rocket,
  Download,
  Share,
  Clock,
  Save,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import { Card } from '@/app/modules/ui/card';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import { Progress } from '@/app/modules/ui/progress';
import { useCampaignStore } from '../../../stores/campaignStore';

interface PublishingActionsProps {
  campaignData: any;
  onComplete?: () => void;
  onEdit?: (step: string) => void;
}

export function PublishingActions({ campaignData, onComplete, onEdit }: PublishingActionsProps) {
  const {
    isPublishing,
    publishingProgress,
    setPublishing,
    setPublishingProgress,
    getCampaignSummary,
    saveProgress,
  } = useCampaignStore();

  const [publishMode, setPublishMode] = useState<'immediate' | 'scheduled'>('immediate');

  // Validation des prérequis pour la publication
  const validationChecks = {
    hasBasicInfo: Boolean(campaignData.basicInfo?.name && campaignData.basicInfo?.objective),
    hasCreatives: Boolean(campaignData.creatives?.mediaFiles?.length > 0),
    hasAudience: Boolean(campaignData.audience?.selectedSegments?.length > 0),
    hasPlanning: Boolean(campaignData.planning?.budget && campaignData.planning?.startDate),
    hasTracking: Boolean(campaignData.tracking?.utmParameters?.source),
  };

  const canPublish = Object.values(validationChecks).every(Boolean);
  const missingRequirements = Object.entries(validationChecks)
    .filter(([_, isValid]) => !isValid)
    .map(([key]) => key);

  const handlePublish = async () => {
    if (!canPublish) return;

    setPublishing(true);
    setPublishingProgress(0);

    try {
      // Simulation du processus de publication
      const steps = [
        { name: 'Validation des données', duration: 500 },
        { name: 'Téléchargement des créatifs', duration: 1000 },
        { name: 'Configuration du ciblage', duration: 800 },
        { name: 'Paramétrage du tracking', duration: 600 },
        { name: 'Lancement de la campagne', duration: 700 },
      ];

      let currentProgress = 0;
      const progressIncrement = 100 / steps.length;

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, step.duration));
        currentProgress += progressIncrement;
        setPublishingProgress(Math.min(currentProgress, 100));
      }

      // Sauvegarde finale
      await saveProgress();

      // Completion
      onComplete?.();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    } finally {
      setPublishing(false);
      setPublishingProgress(0);
    }
  };

  const handleExport = () => {
    const summary = getCampaignSummary();
    const dataStr = JSON.stringify(summary, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `campagne-${campaignData.basicInfo?.name || 'sans-nom'}-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = async () => {
    const summary = getCampaignSummary();
    const shareData = {
      title: `Campagne: ${campaignData.basicInfo?.name || 'Sans nom'}`,
      text: `Aperçu de la campagne ${campaignData.basicInfo?.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
      // Ici vous pourriez afficher une notification
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions secondaires */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-1">
          <Button variant="outline" className="flex-1" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>

          <Button variant="outline" className="flex-1" onClick={() => saveProgress()}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Statut de publication */}
      <Card className="p-6">
        <h5 className="font-semibold mb-4">Lancement de la campagne</h5>

        {/* Validation des prérequis */}
        {!canPublish && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Prérequis manquants pour la publication :</p>
              <ul className="text-sm space-y-1">
                {missingRequirements.map((req) => (
                  <li key={req}>
                    • {getRequirementLabel(req)}
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 ml-2"
                      onClick={() => onEdit?.(getStepForRequirement(req))}
                    >
                      Corriger →
                    </Button>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {canPublish && !isPublishing && (
          <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Prêt pour le lancement !</strong> Tous les prérequis sont remplis.
            </AlertDescription>
          </Alert>
        )}

        {/* Barre de progression durant publication */}
        {isPublishing && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 animate-spin text-primary" />
              <span className="font-medium">Publication en cours...</span>
            </div>
            <Progress value={publishingProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round(publishingProgress)}% complété
            </p>
          </div>
        )}

        {/* Options de publication */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant={publishMode === 'immediate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPublishMode('immediate')}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Lancement immédiat
            </Button>
            <Button
              variant={publishMode === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPublishMode('scheduled')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Programmer
            </Button>
          </div>

          {publishMode === 'scheduled' && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                La campagne sera lancée automatiquement à la date de début configurée :
                <strong className="ml-1">
                  {campaignData.planning?.startDate
                    ? new Date(campaignData.planning.startDate).toLocaleDateString()
                    : 'Date non définie'}
                </strong>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Bouton principal de lancement */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handlePublish}
            disabled={!canPublish || isPublishing}
            size="lg"
            className="min-w-[200px]"
          >
            {isPublishing ? (
              <>
                <Clock className="h-5 w-5 mr-2 animate-spin" />
                Publication...
              </>
            ) : publishMode === 'scheduled' ? (
              <>
                <Calendar className="h-5 w-5 mr-2" />
                Programmer la campagne
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 mr-2" />
                Lancer maintenant
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Fonctions utilitaires
function getRequirementLabel(requirement: string): string {
  const labels: { [key: string]: string } = {
    hasBasicInfo: 'Informations de base (nom, objectif)',
    hasCreatives: 'Éléments créatifs',
    hasAudience: "Ciblage d'audience",
    hasPlanning: 'Budget et planification',
    hasTracking: 'Paramètres de tracking',
  };
  return labels[requirement] || requirement;
}

function getStepForRequirement(requirement: string): string {
  const stepMapping: { [key: string]: string } = {
    hasBasicInfo: 'basic_info',
    hasCreatives: 'creative',
    hasAudience: 'audience',
    hasPlanning: 'schedule_budget',
    hasTracking: 'tracking',
  };
  return stepMapping[requirement] || 'basic_info';
}

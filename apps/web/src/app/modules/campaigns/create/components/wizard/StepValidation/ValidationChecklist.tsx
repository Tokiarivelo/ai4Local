'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Checkbox } from '@/app/modules/ui/checkbox';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import { useCampaignStore } from '../../../stores/campaignStore';

export function ValidationChecklist() {
  // Get each field separately for stable references
  const basicInfo = useCampaignStore((state) => state.basicInfo);
  const creatives = useCampaignStore((state) => state.creatives);
  const audience = useCampaignStore((state) => state.audience);
  const planning = useCampaignStore((state) => state.planning);
  const tracking = useCampaignStore((state) => state.tracking);

  const [checklist, setChecklist] = useState({
    creativesReviewed: false,
    audienceConfirmed: false,
    budgetApproved: false,
    trackingSetup: false,
    legalCompliance: false,
    finalApproval: false,
  });

  const handleChecklistChange = (key: keyof typeof checklist, checked: boolean) => {
    setChecklist((prev) => ({ ...prev, [key]: checked }));
  };

  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const totalChecks = Object.keys(checklist).length;
  const allChecksPassed = completedChecks === totalChecks;

  const checklistItems = [
    {
      id: 'creativesReviewed',
      label: "J'ai vérifié et approuvé tous les éléments créatifs",
      description: 'Images, vidéos, textes et call-to-action sont corrects',
      critical: true,
      autoCheck: Boolean(creatives?.mediaFiles?.length && creatives?.headline),
    },
    {
      id: 'audienceConfirmed',
      label: "Le ciblage d'audience a été confirmé",
      description: 'Segments sélectionnés et reach estimé vérifié',
      critical: true,
      autoCheck: Boolean(audience?.selectedSegments?.length),
    },
    {
      id: 'budgetApproved',
      label: 'Le budget et la planification sont approuvés',
      description: 'Montant, dates et répartition validés',
      critical: true,
      autoCheck: Boolean(planning?.budget && planning?.startDate),
    },
    {
      id: 'trackingSetup',
      label: 'Les paramètres de tracking sont configurés',
      description: 'UTM, pixels et A/B testing configurés si nécessaire',
      critical: true,
      autoCheck: Boolean(tracking?.utmParameters?.source),
    },
    {
      id: 'legalCompliance',
      label: 'La conformité légale a été vérifiée',
      description: 'RGPD, mentions obligatoires et autorisations en règle',
      critical: true,
      autoCheck: false,
    },
    {
      id: 'finalApproval',
      label: 'Approbation finale pour le lancement',
      description: 'Validation définitive par le responsable de campagne',
      critical: true,
      autoCheck: false,
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h4 className="font-semibold">Checklist de validation</h4>
          <p className="text-sm text-muted-foreground">
            Vérifiez tous les points avant la publication ({completedChecks}/{totalChecks} complété)
          </p>
        </div>
      </div>

      {/* Indicateur de progression */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progression de validation</span>
          <span className="font-medium">{Math.round((completedChecks / totalChecks) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedChecks / totalChecks) * 100}%` }}
          />
        </div>
      </div>

      {/* Items de checklist */}
      <div className="space-y-4">
        {checklistItems.map((item) => {
          const isChecked = checklist[item.id as keyof typeof checklist];
          const canAutoCheck = item.autoCheck && !isChecked;

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleChecklistChange(item.id as keyof typeof checklist, Boolean(checked))
                    }
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="font-medium text-sm cursor-pointer">{item.label}</label>
                      {item.critical && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {item.autoCheck && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>

                {canAutoCheck && (
                  <button
                    onClick={() => handleChecklistChange(item.id as keyof typeof checklist, true)}
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Auto-valider
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertes et conseils */}
      <div className="mt-6 space-y-3">
        {!allChecksPassed && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Conseil :</strong> Utilisez "Auto-valider" pour les points déjà configurés
              automatiquement. Les éléments critiques nécessitent une validation manuelle.
            </AlertDescription>
          </Alert>
        )}

        {allChecksPassed && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Parfait !</strong> Tous les points de validation sont cochés. Votre campagne
              est prête à être lancée.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}

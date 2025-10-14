'use client';

import React from 'react';
import { Edit, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';

interface ValidationOverviewProps {
  campaignData: any;
  onEdit?: (step: string) => void;
}

export function ValidationOverview({ campaignData, onEdit }: ValidationOverviewProps) {
  const { basicInfo, creatives, audience, planning, tracking } = campaignData;

  const stepStatuses = [
    {
      id: 'basic_info',
      title: 'Informations de base',
      valid: Boolean(basicInfo?.name && basicInfo?.objective),
      details: [
        {
          label: 'Nom de campagne',
          value: basicInfo?.name || 'Non défini',
          valid: Boolean(basicInfo?.name),
        },
        {
          label: 'Objectif',
          value: basicInfo?.objective || 'Non défini',
          valid: Boolean(basicInfo?.objective),
        },
        { label: 'Type', value: basicInfo?.type || 'Non défini', valid: Boolean(basicInfo?.type) },
        {
          label: 'Canaux',
          value: `${basicInfo?.channels?.length || 0} sélectionné(s)`,
          valid: Boolean(basicInfo?.channels?.length),
        },
      ],
    },
    {
      id: 'creative',
      title: 'Créatifs',
      valid: Boolean(creatives?.mediaFiles?.length > 0),
      details: [
        {
          label: 'Éléments média',
          value: `${creatives?.mediaFiles?.length || 0} fichier(s)`,
          valid: Boolean(creatives?.mediaFiles?.length),
        },
        {
          label: 'Titre principal',
          value: creatives?.headline || 'Non défini',
          valid: Boolean(creatives?.headline),
        },
        {
          label: 'Description',
          value: creatives?.caption || 'Non définie',
          valid: Boolean(creatives?.caption),
        },
        {
          label: 'Call-to-Action',
          value: creatives?.callToAction || 'Non défini',
          valid: Boolean(creatives?.callToAction),
        },
      ],
    },
    {
      id: 'audience',
      title: 'Audience',
      valid: Boolean(audience?.selectedSegments?.length > 0),
      details: [
        {
          label: 'Segments',
          value: `${audience?.selectedSegments?.length || 0} sélectionné(s)`,
          valid: Boolean(audience?.selectedSegments?.length),
        },
        {
          label: 'Reach estimé',
          value: audience?.estimatedReach?.toLocaleString() || 'Non calculé',
          valid: Boolean(audience?.estimatedReach),
        },
        {
          label: 'Filtres personnalisés',
          value: `${audience?.customFilters?.length || 0} filtre(s)`,
          valid: true,
        },
        { label: 'Import CSV', value: audience?.csvData ? 'Importé' : 'Non utilisé', valid: true },
      ],
    },
    {
      id: 'schedule_budget',
      title: 'Planning & Budget',
      valid: Boolean(planning?.budget && planning?.startDate),
      details: [
        {
          label: 'Budget',
          value: planning?.budget ? `${planning.budget}€` : 'Non défini',
          valid: Boolean(planning?.budget),
        },
        {
          label: 'Type de budget',
          value: planning?.isDailyBudget ? 'Quotidien' : 'Total',
          valid: Boolean(planning?.budget),
        },
        {
          label: 'Date de début',
          value: planning?.startDate
            ? new Date(planning.startDate).toLocaleDateString()
            : 'Non définie',
          valid: Boolean(planning?.startDate),
        },
        {
          label: 'Date de fin',
          value: planning?.endDate
            ? new Date(planning.endDate).toLocaleDateString()
            : 'Non définie',
          valid: Boolean(planning?.endDate),
        },
      ],
    },
    {
      id: 'tracking',
      title: 'Tracking',
      valid: Boolean(tracking?.utmParameters?.source),
      details: [
        {
          label: 'UTM Source',
          value: tracking?.utmParameters?.source || 'Non défini',
          valid: Boolean(tracking?.utmParameters?.source),
        },
        {
          label: 'UTM Medium',
          value: tracking?.utmParameters?.medium || 'Non défini',
          valid: Boolean(tracking?.utmParameters?.medium),
        },
        {
          label: 'UTM Campaign',
          value: tracking?.utmParameters?.campaign || 'Non défini',
          valid: Boolean(tracking?.utmParameters?.campaign),
        },
        {
          label: 'A/B Testing',
          value: tracking?.abTestEnabled ? 'Activé' : 'Désactivé',
          valid: true,
        },
        {
          label: 'Pixel Tracking',
          value: tracking?.pixelTracking?.enabled ? 'Activé' : 'Désactivé',
          valid: true,
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Aperçu des étapes</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stepStatuses.map((step) => (
          <Card key={step.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {step.valid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <h5 className="font-medium">{step.title}</h5>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(step.id)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {step.details.map((detail, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span
                    className={`font-medium ${detail.valid ? 'text-foreground' : 'text-yellow-600'}`}
                  >
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

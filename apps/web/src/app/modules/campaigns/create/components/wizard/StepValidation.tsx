/**
 * Étape Validation - Révision finale
 * Affiche un résumé complet de la campagne avant publication
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  Euro,
  Target,
  Users,
  Image,
  Link,
  TestTube,
  Rocket,
  Edit,
  Download,
  Share,
  Clock,
} from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { Checkbox } from '@/app/modules/ui/checkbox';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import { Separator } from '@/app/modules/ui/separator';

import { useCampaignCreateContext } from '../../context/WizardContext';
import { generateUTMUrl } from '../../mock-data';

interface StepValidationProps {
  onComplete?: () => void;
  onEdit?: (step: string) => void;
}

export function StepValidation({ onComplete, onEdit }: StepValidationProps) {
  const { data, completeStep } = useCampaignCreateContext();

  const [checklist, setChecklist] = useState({
    creativesReviewed: false,
    audienceConfirmed: false,
    budgetApproved: false,
    trackingSetup: false,
    legalCompliance: false,
    finalApproval: false,
  });

  const [isPublishing, setIsPublishing] = useState(false);

  const handleChecklistChange = (key: keyof typeof checklist, checked: boolean) => {
    setChecklist((prev) => ({ ...prev, [key]: checked }));
  };

  const allChecksPassed = Object.values(checklist).every(Boolean);

  const handlePublish = async () => {
    if (!allChecksPassed) return;

    setIsPublishing(true);

    // Simulation de publication
    await new Promise((resolve) => setTimeout(resolve, 2000));

    completeStep('review');
    onComplete?.();
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';
      case 'MGA':
        return 'Ar';
      default:
        return '€';
    }
  };

  const calculateDuration = () => {
    if (!data.planning?.startDate || !data.planning?.endDate) return 0;

    const start = new Date(data.planning.startDate);
    const end = new Date(data.planning.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalBudget = () => {
    if (!data.planning?.budget) return 0;

    if (!data.planning.isDailyBudget) return data.planning.budget;

    const duration = calculateDuration();
    return duration > 0 ? data.planning.budget * duration : data.planning.budget;
  };

  // Validation des données
  const validationStatus = {
    creatives: data.creatives && data.creatives.mediaFiles.length > 0,
    audience: data.audience && data.audience.selectedSegments.length > 0,
    planning: data.planning && data.planning.budget > 0,
    tracking: data.tracking && data.tracking.utmParameters.source,
  };

  const hasWarnings = !Object.values(validationStatus).every(Boolean);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold">Validation finale</h3>
        <p className="text-sm text-muted-foreground">
          Vérifiez tous les paramètres avant de lancer votre campagne
        </p>
      </div>

      {/* Statut global */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {hasWarnings ? (
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
          <div>
            <h4 className="font-medium">
              {hasWarnings ? 'Attention requise' : 'Configuration complète'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {hasWarnings
                ? 'Certains éléments nécessitent votre attention'
                : 'Votre campagne est prête à être lancée'}
            </p>
          </div>
        </div>

        {hasWarnings && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="mt-2 space-y-1 text-sm">
                {!validationStatus.creatives && <li>• Ajoutez au moins un élément créatif</li>}
                {!validationStatus.audience && (
                  <li>• Sélectionnez au moins un segment d'audience</li>
                )}
                {!validationStatus.planning && <li>• Configurez le budget et les dates</li>}
                {!validationStatus.tracking && <li>• Configurez les paramètres de tracking</li>}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ValidationStatusCard
            title="Créatifs"
            valid={validationStatus.creatives || false}
            count={data.creatives?.mediaFiles.length || 0}
            onEdit={() => onEdit?.('creative')}
          />
          <ValidationStatusCard
            title="Audience"
            valid={validationStatus.audience || false}
            count={data.audience?.selectedSegments.length || 0}
            onEdit={() => onEdit?.('audience')}
          />
          <ValidationStatusCard
            title="Planning"
            valid={validationStatus.planning || false}
            count={data.planning?.budget ? 1 : 0}
            onEdit={() => onEdit?.('schedule_budget')}
          />
          <ValidationStatusCard
            title="Tracking"
            valid={Boolean(validationStatus.tracking)}
            count={data.tracking?.utmParameters.source ? 1 : 0}
            onEdit={() => onEdit?.('tracking')}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Résumé de la campagne */}
        <div className="space-y-6">
          {/* Créatifs */}
          {data.creatives && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Créatifs</h4>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.('creative')}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Éléments créatifs</span>
                  <span className="font-medium">{data.creatives.mediaFiles.length}</span>
                </div>

                {data.creatives.mediaFiles.slice(0, 3).map((asset: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <Image className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.type}</p>
                    </div>
                  </div>
                ))}

                {data.creatives.mediaFiles.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{data.creatives.mediaFiles.length - 3} autres éléments
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Audience */}
          {data.audience && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Audience</h4>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.('audience')}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Segments ciblés</span>
                  <span className="font-medium">{data.audience.selectedSegments.length}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Reach estimé</span>
                  <span className="font-medium">
                    {data.audience.estimatedReach?.toLocaleString() || 'N/A'}
                  </span>
                </div>

                <div className="space-y-2">
                  {data.audience.selectedSegments.slice(0, 3).map((segment: any, index: number) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {segment.name || segment}
                    </Badge>
                  ))}
                  {data.audience.selectedSegments.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{data.audience.selectedSegments.length - 3} autres
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Budget et planning */}
        <div className="space-y-6">
          {/* Budget */}
          {data.planning && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Budget et planning</h4>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.('schedule_budget')}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold text-primary">
                      {getTotalBudget()} {getCurrencySymbol(data.planning.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground">Budget total</div>
                  </div>

                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">{calculateDuration()}</div>
                    <div className="text-xs text-muted-foreground">Jours</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type de budget</span>
                    <span className="font-medium">
                      {data.planning.isDailyBudget ? 'Quotidien' : 'Total'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Date de début</span>
                    <span className="font-medium">
                      {data.planning.startDate
                        ? new Date(data.planning.startDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Date de fin</span>
                    <span className="font-medium">
                      {data.planning.endDate
                        ? new Date(data.planning.endDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Reach estimé</span>
                    <span className="font-medium">
                      {data.planning.estimatedReach?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tracking */}
          {data.tracking && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Tracking</h4>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.('tracking')}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>UTM Source</span>
                    <span className="font-medium">
                      {data.tracking.utmParameters.source || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>UTM Medium</span>
                    <span className="font-medium">
                      {data.tracking.utmParameters.medium || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>UTM Campaign</span>
                    <span className="font-medium">
                      {data.tracking.utmParameters.campaign || 'N/A'}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">A/B Testing</span>
                    <Badge variant={data.tracking.abTestEnabled ? 'default' : 'secondary'}>
                      {data.tracking.abTestEnabled ? 'Activé' : 'Désactivé'}
                    </Badge>
                  </div>

                  {data.tracking.abTestEnabled && data.tracking.abTestVariants && (
                    <p className="text-xs text-muted-foreground">
                      {data.tracking.abTestVariants.length || 0} variante(s) configurée(s)
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pixel tracking</span>
                    <Badge variant={data.tracking.generatedUrl ? 'default' : 'secondary'}>
                      {data.tracking.generatedUrl ? 'Activé' : 'Désactivé'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Checklist de validation */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">Checklist de validation</h4>

        <div className="space-y-4">
          <ChecklistItem
            label="J'ai vérifié et approuvé tous les éléments créatifs"
            checked={checklist.creativesReviewed}
            onChange={(checked) => handleChecklistChange('creativesReviewed', checked)}
          />

          <ChecklistItem
            label="Le ciblage d'audience a été confirmé"
            checked={checklist.audienceConfirmed}
            onChange={(checked) => handleChecklistChange('audienceConfirmed', checked)}
          />

          <ChecklistItem
            label="Le budget et la planification sont approuvés"
            checked={checklist.budgetApproved}
            onChange={(checked) => handleChecklistChange('budgetApproved', checked)}
          />

          <ChecklistItem
            label="Les paramètres de tracking sont configurés"
            checked={checklist.trackingSetup}
            onChange={(checked) => handleChecklistChange('trackingSetup', checked)}
          />

          <ChecklistItem
            label="La conformité légale a été vérifiée"
            checked={checklist.legalCompliance}
            onChange={(checked) => handleChecklistChange('legalCompliance', checked)}
          />

          <ChecklistItem
            label="Approbation finale pour le lancement"
            checked={checklist.finalApproval}
            onChange={(checked) => handleChecklistChange('finalApproval', checked)}
          />
        </div>
      </Card>

      {/* Actions finales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-1">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          <Button variant="outline" className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>

        <Button
          onClick={handlePublish}
          disabled={!allChecksPassed || isPublishing}
          className="sm:min-w-[200px]"
        >
          {isPublishing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Publication...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              Lancer la campagne
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Composant carte de statut de validation
function ValidationStatusCard({
  title,
  valid,
  count,
  onEdit,
}: {
  title: string;
  valid: boolean;
  count: number;
  onEdit?: () => void;
}) {
  return (
    <div className="text-center p-4 border rounded-lg">
      <div className="flex items-center justify-center mb-2">
        {valid ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        )}
      </div>

      <h5 className="font-medium text-sm">{title}</h5>
      <p className="text-xs text-muted-foreground">{count} élément(s)</p>

      <Button variant="ghost" size="sm" className="mt-2" onClick={onEdit}>
        <Edit className="h-3 w-3 mr-1" />
        Modifier
      </Button>
    </div>
  );
}

// Composant item de checklist
function ChecklistItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-3">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );
}

export default StepValidation;

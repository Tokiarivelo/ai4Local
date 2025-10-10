/**
 * Étape Tracking - UTM et A/B Testing
 * Gère la configuration des paramètres de tracking et des tests A/B
 */

'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Link,
  Copy,
  Plus,
  Trash2,
  BarChart3,
  Target,
  ExternalLink,
  Check,
  AlertCircle,
  TestTube,
} from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';
import { Switch } from '@/app/modules/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { Textarea } from '@/app/modules/ui/textarea';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import { Separator } from '@/app/modules/ui/separator';

import {
  TrackingStepSchema,
  type TrackingStepData,
  type ABTestOverrides,
  type ABTestVariant,
  getFinalCreativeForVariant,
} from './validators';
import { useCampaignCreateContext } from '../../context/WizardContext';
import { generateUTMUrl, mockPerformanceData } from '../../mock-data';

interface StepTrackingProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepTracking({ onComplete, onValidationChange }: StepTrackingProps) {
  const { data, updateStepData, completeStep } = useCampaignCreateContext();

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [enableAbTesting, setEnableAbTesting] = useState(data.tracking?.abTestEnabled || false);

  // Récupération des créatifs de base pour l'A/B testing
  const baselineCreatives = data.creatives;

  const form = useForm<TrackingStepData>({
    resolver: zodResolver(TrackingStepSchema),
    defaultValues: {
      utmParameters: {
        source: data.tracking?.utmParameters?.source || '',
        medium: data.tracking?.utmParameters?.medium || '',
        campaign: data.tracking?.utmParameters?.campaign || '',
        term: data.tracking?.utmParameters?.term || '',
        content: data.tracking?.utmParameters?.content || '',
      },
      generatedUrl: data.tracking?.generatedUrl || '',
      abTestEnabled: enableAbTesting,
      abTestVariants: data.tracking?.abTestVariants || [
        {
          id: '1',
          name: 'Contrôle - Version originale',
          percentage: 50,
          isControl: true,
          description: "Version de base créée dans l'étape Créatifs",
          overrides: {}, // Pas d'overrides = utilise la baseline
          expectedOutcome: 'Baseline pour comparaison avec les variantes',
        },
        {
          id: '2',
          name: 'Variante A - Titre avec urgence',
          percentage: 50,
          isControl: false,
          description: "Test d'un titre avec notion d'urgence",
          overrides: {
            headline: baselineCreatives?.headline
              ? `${baselineCreatives.headline} - Offre limitée !`
              : 'Offre limitée - Profitez maintenant !',
          },
          expectedOutcome: "Augmentation du taux de clic grâce à l'effet d'urgence",
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control,
    trigger,
  } = form;

  // Specific watch calls for stability (replacing watchedValues)
  const utmSource = watch('utmParameters.source');
  const utmMedium = watch('utmParameters.medium');
  const utmCampaign = watch('utmParameters.campaign');
  const utmTerm = watch('utmParameters.term');
  const utmContent = watch('utmParameters.content');
  const abTestEnabled = watch('abTestEnabled');
  const abTestVariants = watch('abTestVariants');

  // Field arrays for dynamic fields
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'abTestVariants',
  });

  // Génération URL avec UTM (stabilisée) - déplacer avant useEffect
  const generateTrackingUrl = React.useCallback(() => {
    const baseUrl = 'https://votre-site.com/landing';
    return generateUTMUrl(
      baseUrl,
      utmSource || '',
      utmMedium || '',
      utmCampaign || '',
      utmTerm,
      utmContent
    );
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  // Mise à jour du contexte avec stabilisation
  React.useEffect(() => {
    updateStepData({
      tracking: {
        utmParameters: {
          source: utmSource || '',
          medium: utmMedium || '',
          campaign: utmCampaign || '',
          term: utmTerm || '',
          content: utmContent || '',
        },
        generatedUrl: generateTrackingUrl(),
        abTestEnabled,
        abTestVariants,
      },
    });
  }, [
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    abTestEnabled,
    abTestVariants,
    updateStepData,
    generateTrackingUrl,
  ]);

  // Validation personnalisée pour les champs UTM uniquement
  const isUTMValid = React.useMemo(() => {
    return Boolean(utmSource && utmMedium && utmCampaign);
  }, [utmSource, utmMedium, utmCampaign]);

  // Validation pour A/B Testing si activé
  const isABTestValid = React.useMemo(() => {
    if (!abTestEnabled) return true;

    if (!abTestVariants || abTestVariants.length < 2) return false;

    const totalPercentage = abTestVariants.reduce(
      (sum, variant) => sum + (variant.percentage || 0),
      0
    );
    return totalPercentage === 100;
  }, [abTestEnabled, abTestVariants]);

  // Validation globale
  const isFormValid = React.useMemo(() => {
    return isUTMValid && isABTestValid;
  }, [isUTMValid, isABTestValid]);

  // Notification de validation avec mémorisation
  const isFormValidMemo = React.useMemo(() => {
    return isFormValid; // Utiliser notre validation personnalisée
  }, [isFormValid]);

  React.useEffect(() => {
    onValidationChange?.(isFormValidMemo);
  }, [isFormValidMemo, onValidationChange]);

  // Déclenchement de validation quand les champs requis changent
  React.useEffect(() => {
    if (utmSource || utmMedium || utmCampaign) {
      trigger(['utmParameters.source', 'utmParameters.medium', 'utmParameters.campaign']);
    }
  }, [utmSource, utmMedium, utmCampaign, trigger]);

  // Select handler avec stabilisation useRef
  const handleMediumChangeRef = React.useRef<(value: string) => void>();
  handleMediumChangeRef.current = (value: string) => {
    setValue('utmParameters.medium', value);
    // Déclencher validation après changement
    trigger('utmParameters.medium');
  };

  const handleMediumChange = React.useCallback((value: string) => {
    handleMediumChangeRef.current?.(value);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const onSubmit = (data: TrackingStepData) => {
    completeStep('tracking');
    onComplete?.();
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold">Tracking et mesure</h3>
        <p className="text-sm text-muted-foreground">
          Configurez le suivi de votre campagne et les tests A/B
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Paramètres UTM */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Paramètres UTM</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source *</label>
              <Input
                {...register('utmParameters.source')}
                placeholder="facebook, google, newsletter..."
                className={errors.utmParameters?.source ? 'border-destructive' : ''}
              />
              {errors.utmParameters?.source && (
                <p className="text-sm text-destructive">{errors.utmParameters.source.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Medium *</label>
              <Select value={utmMedium} onValueChange={handleMediumChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="cpc">CPC</SelectItem>
                  <SelectItem value="display">Display</SelectItem>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign *</label>
              <Input
                {...register('utmParameters.campaign')}
                placeholder="nom-campagne-2024"
                className={errors.utmParameters?.campaign ? 'border-destructive' : ''}
              />
              {errors.utmParameters?.campaign && (
                <p className="text-sm text-destructive">{errors.utmParameters.campaign.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Term (optionnel)</label>
              <Input {...register('utmParameters.term')} placeholder="mot-clé ciblé" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Content (optionnel)</label>
              <Input
                {...register('utmParameters.content')}
                placeholder="description du contenu ou variante"
              />
            </div>
          </div>

          {/* Aperçu URL */}
          {utmSource && utmMedium && utmCampaign && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Separator />
              <div>
                <label className="text-sm font-medium mb-2 block">URL générée avec UTM :</label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm break-all">{generateTrackingUrl()}</code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateTrackingUrl())}
                  >
                    {copiedUrl === generateTrackingUrl() ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* A/B Testing */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              <h4 className="font-medium">A/B Testing</h4>
            </div>
            <Switch
              checked={enableAbTesting}
              onCheckedChange={(checked: boolean) => {
                setEnableAbTesting(checked);
                setValue('abTestEnabled', checked);
                // Déclencher validation après changement
                trigger('abTestEnabled');
              }}
            />
          </div>

          {enableAbTesting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Variants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Variantes</h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendVariant({
                        id: `variant-${Date.now()}`,
                        name: `Variante ${String.fromCharCode(65 + variantFields.length)}`,
                        percentage: 0,
                        isControl: false,
                        description: '',
                        overrides: {}, // Pas d'overrides par défaut
                        expectedOutcome: '',
                      })
                    }
                    disabled={variantFields.length >= 4}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter variante
                  </Button>
                </div>

                <div className="space-y-4">
                  {variantFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-800"
                    >
                      {/* En-tête de la variante */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={abTestVariants?.[index]?.isControl ? 'default' : 'secondary'}
                          >
                            {abTestVariants?.[index]?.isControl ? 'Contrôle' : 'Test'}
                          </Badge>
                          <Input
                            {...register(`abTestVariants.${index}.name`)}
                            placeholder="Nom de la variante"
                            className="font-medium"
                          />
                        </div>
                        {variantFields.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVariant(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Description de la variante */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          {...register(`abTestVariants.${index}.description`)}
                          placeholder="Décrivez brièvement cette variante..."
                          className="min-h-[60px]"
                        />
                      </div>

                      {/* Aperçu des créatifs de base */}
                      {baselineCreatives && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            📋 Créatifs de base (Étape 3)
                          </label>
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm space-y-1">
                            <div>
                              <strong>Titre:</strong> {baselineCreatives.headline || 'Non défini'}
                            </div>
                            {baselineCreatives.caption && (
                              <div>
                                <strong>Description:</strong> {baselineCreatives.caption}
                              </div>
                            )}
                            {baselineCreatives.callToAction && (
                              <div>
                                <strong>CTA:</strong> {baselineCreatives.callToAction}
                              </div>
                            )}
                            <div>
                              <strong>Médias:</strong> {baselineCreatives.mediaFiles?.length || 0}{' '}
                              fichier(s)
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Overrides des éléments testés */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">
                          🧪 Personnalisations pour cette variante
                        </label>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Laissez vide pour utiliser la version de base. Modifiez seulement les
                          éléments que vous voulez tester.
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {/* Override Titre */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Titre personnalisé
                              {abTestVariants?.[index]?.overrides?.headline && (
                                <Badge variant="outline" className="ml-2">
                                  Modifié
                                </Badge>
                              )}
                            </label>
                            <Input
                              {...register(`abTestVariants.${index}.overrides.headline`)}
                              placeholder={baselineCreatives?.headline || 'Titre de base...'}
                              className="text-sm"
                            />
                          </div>

                          {/* Override Description */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Description personnalisée
                              {abTestVariants?.[index]?.overrides?.caption && (
                                <Badge variant="outline" className="ml-2">
                                  Modifié
                                </Badge>
                              )}
                            </label>
                            <Textarea
                              {...register(`abTestVariants.${index}.overrides.caption`)}
                              placeholder={baselineCreatives?.caption || 'Description de base...'}
                              className="min-h-[60px] text-sm"
                            />
                          </div>

                          {/* Override CTA */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Bouton d'action personnalisé
                              {abTestVariants?.[index]?.overrides?.callToAction && (
                                <Badge variant="outline" className="ml-2">
                                  Modifié
                                </Badge>
                              )}
                            </label>
                            <Input
                              {...register(`abTestVariants.${index}.overrides.callToAction`)}
                              placeholder={baselineCreatives?.callToAction || 'CTA de base...'}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Aperçu de la variante finale */}
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                            🎯 Aperçu de cette variante
                          </div>
                          <div className="text-xs space-y-1">
                            <div>
                              <strong>Titre final:</strong>{' '}
                              {abTestVariants?.[index]?.overrides?.headline ||
                                baselineCreatives?.headline ||
                                'Titre non défini'}
                            </div>
                            {(abTestVariants?.[index]?.overrides?.caption ||
                              baselineCreatives?.caption) && (
                              <div>
                                <strong>Description finale:</strong>{' '}
                                {abTestVariants?.[index]?.overrides?.caption ||
                                  baselineCreatives?.caption}
                              </div>
                            )}
                            {(abTestVariants?.[index]?.overrides?.callToAction ||
                              baselineCreatives?.callToAction) && (
                              <div>
                                <strong>CTA final:</strong>{' '}
                                {abTestVariants?.[index]?.overrides?.callToAction ||
                                  baselineCreatives?.callToAction}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Objectif attendu */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Résultat attendu</label>
                        <Input
                          {...register(`abTestVariants.${index}.expectedOutcome`)}
                          placeholder="Ex: Augmentation du CTR de 15%"
                        />
                      </div>

                      {/* Allocation de trafic */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Allocation de trafic: {abTestVariants?.[index]?.percentage || 0}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={abTestVariants?.[index]?.percentage || 0}
                          onChange={(e) =>
                            setValue(`abTestVariants.${index}.percentage`, Number(e.target.value))
                          }
                          className="w-full h-2"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Aperçu des variantes */}
                <VariantPreview
                  variants={abTestVariants || []}
                  baselineCreatives={baselineCreatives}
                />
              </div>
            </motion.div>
          )}
        </Card>

        {/* Recommandations */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Bonnes pratiques :</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Utilisez des noms UTM cohérents et descriptifs</li>
              <li>• Testez toujours vos URLs avant le lancement</li>
              <li>• Limitez-vous à 2-4 variantes pour des résultats significatifs</li>
              <li>• Assurez-vous que votre pixel est correctement installé</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!isFormValid}
            onClick={() => {
              console.log('StepTracking - Button clicked, isFormValid:', isFormValid);
              if (isFormValid) {
                const formData: TrackingStepData = {
                  utmParameters: {
                    source: utmSource || '',
                    medium: utmMedium || '',
                    campaign: utmCampaign || '',
                    term: utmTerm || '',
                    content: utmContent || '',
                  },
                  generatedUrl: generateTrackingUrl(),
                  abTestEnabled,
                  abTestVariants: abTestVariants || [],
                };
                onSubmit(formData);
              }
            }}
          >
            Continuer vers la validation
          </Button>
        </div>
      </form>
    </div>
  );
}

// Composant de prévisualisation des variantes
function VariantPreview({
  variants,
  baselineCreatives,
}: {
  variants: ABTestVariant[];
  baselineCreatives?: any;
}) {
  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h5 className="font-medium mb-3 flex items-center gap-2">
        <Target className="h-4 w-4" />
        Aperçu des variantes finales
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants?.map((variant, index) => {
          // Fusion des créatifs de base avec les overrides
          const finalCreative = baselineCreatives
            ? getFinalCreativeForVariant(baselineCreatives, variant)
            : null;

          return (
            <div key={variant.id} className="p-3 bg-white dark:bg-gray-800 border rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{variant.name}</span>
                <Badge variant={variant.isControl ? 'default' : 'secondary'}>
                  {variant.percentage}%
                </Badge>
              </div>

              {variant.description && (
                <p className="text-xs text-muted-foreground mb-2">{variant.description}</p>
              )}

              {/* Aperçu du contenu final fusionné */}
              <div className="space-y-1">
                {finalCreative?.headline && (
                  <div className="text-xs">
                    <span className="font-medium">Titre: </span>
                    <span className="text-muted-foreground">"{finalCreative.headline}"</span>
                    {variant.overrides?.headline && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}

                {finalCreative?.caption && (
                  <div className="text-xs">
                    <span className="font-medium">Description: </span>
                    <span className="text-muted-foreground">"{finalCreative.caption}"</span>
                    {variant.overrides?.caption && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}

                {finalCreative?.callToAction && (
                  <div className="text-xs">
                    <span className="font-medium">CTA: </span>
                    <span className="text-muted-foreground">"{finalCreative.callToAction}"</span>
                    {variant.overrides?.callToAction && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}

                {finalCreative?.mediaFiles && (
                  <div className="text-xs">
                    <span className="font-medium">Médias: </span>
                    <span className="text-muted-foreground">
                      {finalCreative.mediaFiles.length} fichier(s)
                    </span>
                    {variant.overrides?.mediaFiles && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {variant.expectedOutcome && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  🎯 {variant.expectedOutcome}
                </div>
              )}
            </div>
          );
        }) || []}
      </div>
    </div>
  );
}

export default StepTracking;

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Plus, Trash2 } from 'lucide-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card } from '@/app/modules/ui/card';
import { Switch } from '@/app/modules/ui/switch';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Textarea } from '@/app/modules/ui/textarea';
import { Badge } from '@/app/modules/ui/badge';
import type { TrackingStepData } from '../validators';
import { VariantPreview } from './VariantPreview';

interface ABTestSectionProps {
  form: UseFormReturn<TrackingStepData>;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  baselineCreatives?: any;
}

export function ABTestSection({ form, enabled, onToggle, baselineCreatives }: ABTestSectionProps) {
  const { register, setValue, watch, control, trigger } = form;

  const abTestVariants = watch('abTestVariants');

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'abTestVariants',
  });

  const handleToggle = React.useCallback(
    (checked: boolean) => {
      onToggle(checked);
      setValue('abTestEnabled', checked);
      trigger('abTestEnabled');
    },
    [onToggle, setValue, trigger]
  );

  const addVariant = () => {
    appendVariant({
      id: `variant-${Date.now()}`,
      name: `Variante ${String.fromCharCode(65 + variantFields.length)}`,
      percentage: 0,
      isControl: false,
      description: '',
      overrides: {},
      expectedOutcome: '',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-primary" />
          <h4 className="font-medium">A/B Testing</h4>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {enabled && (
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
                onClick={addVariant}
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
                      <Badge variant={abTestVariants?.[index]?.isControl ? 'default' : 'secondary'}>
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
                      Laissez vide pour utiliser la version de base. Modifiez seulement les éléments
                      que vous voulez tester.
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
            <VariantPreview variants={abTestVariants || []} baselineCreatives={baselineCreatives} />
          </div>
        </motion.div>
      )}
    </Card>
  );
}

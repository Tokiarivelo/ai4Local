'use client';

import React from 'react';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Textarea } from '@/app/modules/ui/textarea';
import { Badge } from '@/app/modules/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { useCampaignStore, useBasicInfo } from '../../../stores/campaignStore';
import type { CreativesStepData } from '../validators';

interface TextGenerationSectionProps {
  form: UseFormReturn<CreativesStepData>;
  isGenerating: boolean;
}

export function TextGenerationSection({ form, isGenerating }: TextGenerationSectionProps) {
  const { useAiCredits, setGenerating, setGenerationError } = useCampaignStore();
  const basicInfo = useBasicInfo();

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const generateText = async (field: 'headline' | 'caption' | 'callToAction') => {
    setGenerating(true);
    setGenerationError(null);

    try {
      useAiCredits(1); // Coût de génération de texte

      // Simulation de génération IA basée sur les infos de base
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const suggestions = {
        headline: [
          `${basicInfo?.name || 'Votre campagne'} - Découvrez maintenant !`,
          `Offre exclusive : ${basicInfo?.name || 'Ne manquez pas'}`,
          `Nouveau : ${basicInfo?.name || 'Innovation'} vous attend`,
        ],
        caption: [
          `Profitez de notre ${basicInfo?.type || 'offre'} exceptionnelle. Une opportunité unique de découvrir ${basicInfo?.name || 'nos services'} avec des avantages exclusifs.`,
          `Transformez votre expérience avec ${basicInfo?.name || 'notre solution'}. Des résultats garantis et une satisfaction client au rendez-vous.`,
          `Rejoignez des milliers de clients satisfaits qui ont choisi ${basicInfo?.name || 'notre service'}. Votre succès commence ici.`,
        ],
        callToAction: [
          'Découvrir maintenant',
          "Profiter de l'offre",
          'Commencer gratuitement',
          'En savoir plus',
          'Réserver ma place',
          'Télécharger',
        ],
      };

      const randomSuggestion =
        suggestions[field][Math.floor(Math.random() * suggestions[field].length)];
      setValue(field, randomSuggestion, { shouldValidate: true });
    } catch (error) {
      setGenerationError(`Erreur lors de la génération du ${field}`);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ici vous pourriez ajouter une notification
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h4 className="font-medium">Contenu textuel</h4>
        <p className="text-sm text-muted-foreground">
          Créez vos textes manuellement ou laissez l'IA vous aider
        </p>
      </div>

      <div className="space-y-6">
        {/* Titre principal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Titre principal *</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateText('headline')}
                disabled={isGenerating}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Générer
              </Button>
              {watch('headline') && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(watch('headline'))}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <Input
            {...register('headline')}
            placeholder="Ex: Découvrez notre nouvelle collection automne"
            className={errors.headline ? 'border-destructive' : ''}
          />
          {errors.headline && (
            <p className="text-sm text-destructive mt-1">{errors.headline.message}</p>
          )}

          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Optimal: 25-40 caractères</span>
            <span>{watch('headline')?.length || 0}/60</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Description</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateText('caption')}
                disabled={isGenerating}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Générer
              </Button>
              {watch('caption') && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(watch('caption'))}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <Textarea
            {...register('caption')}
            placeholder="Décrivez votre offre de manière engageante..."
            rows={3}
            className="resize-none"
          />

          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Optimal: 100-150 caractères</span>
            <span>{watch('caption')?.length || 0}/200</span>
          </div>
        </div>

        {/* Call-to-Action */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Call-to-Action</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateText('callToAction')}
                disabled={isGenerating}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Générer
              </Button>
              {watch('callToAction') && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(watch('callToAction'))}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <Input
            {...register('callToAction')}
            placeholder="Ex: Découvrir maintenant"
            className={errors.callToAction ? 'border-destructive' : ''}
          />
          {errors.callToAction && (
            <p className="text-sm text-destructive mt-1">{errors.callToAction.message}</p>
          )}

          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Optimal: 2-5 mots</span>
            <span>{watch('callToAction')?.length || 0}/25</span>
          </div>
        </div>

        {/* Suggestions rapides pour CTA */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Suggestions populaires :</p>
          <div className="flex flex-wrap gap-2">
            {['Découvrir', 'En savoir plus', 'Commencer', 'Télécharger', 'Réserver', 'Acheter'].map(
              (suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setValue('callToAction', suggestion, { shouldValidate: true })}
                >
                  {suggestion}
                </Badge>
              )
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

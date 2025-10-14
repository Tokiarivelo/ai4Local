'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Textarea } from '@/app/modules/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';

import { BasicInfoStepSchema, type BasicInfoStepData } from '../validators';
import type { CampaignChannel, CampaignObjective, CampaignType } from '../../../types';
import { ObjectiveSelector } from './ObjectiveSelector';
import { ChannelSelector } from './ChannelSelector';
import { RecommendationsCard } from './RecommendationsCard';
import { CAMPAIGN_TYPES } from './constants';

interface BasicInfoFormProps {
  initialData?: BasicInfoStepData;
  onSubmit: (data: BasicInfoStepData) => void;
  onValidationChange: (isValid: boolean) => void;
  isValidating?: boolean;
}

export function BasicInfoForm({
  initialData,
  onSubmit,
  onValidationChange,
  isValidating = false,
}: BasicInfoFormProps) {
  const [selectedObjective, setSelectedObjective] = useState<CampaignObjective | null>(
    initialData?.objective || null
  );
  const [selectedChannels, setSelectedChannels] = useState<CampaignChannel[]>(
    initialData?.channels || []
  );

  const form = useForm<BasicInfoStepData>({
    resolver: zodResolver(BasicInfoStepSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      objective: selectedObjective || 'awareness',
      type: initialData?.type || 'promotion',
      channels: selectedChannels,
    },
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = form;

  const formName = watch('name');
  const formDescription = watch('description');
  const formType = watch('type');

  // Validation complète
  const isFormValid = React.useMemo(() => {
    return isValid && selectedObjective && selectedChannels.length > 0;
  }, [isValid, selectedObjective, selectedChannels.length]);

  React.useEffect(() => {
    onValidationChange(Boolean(isFormValid));
  }, [isFormValid, onValidationChange]);

  const handleObjectiveSelect = React.useCallback(
    (objective: CampaignObjective) => {
      setSelectedObjective(objective);
      setValue('objective', objective as any, { shouldValidate: true });
    },
    [setValue]
  );

  const handleChannelToggle = React.useCallback(
    (channels: CampaignChannel[]) => {
      setSelectedChannels(channels);
      setValue('channels', channels, { shouldValidate: true });
    },
    [setValue]
  );

  const handleFormSubmit = React.useCallback(
    (data: BasicInfoStepData) => {
      const completeData = {
        ...data,
        objective: selectedObjective || 'awareness',
        channels: selectedChannels,
      };
      onSubmit(completeData);
    },
    [onSubmit, selectedObjective, selectedChannels]
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Informations générales */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">Détails de la campagne</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">Nom de la campagne *</label>
            <Input
              {...register('name')}
              placeholder="Ex: Lancement produit automne 2024"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">Description (optionnel)</label>
            <Textarea
              {...register('description')}
              placeholder="Décrivez l'objectif et le contexte de votre campagne..."
              rows={3}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Type de campagne</label>
            <Select
              value={formType || 'promotion'}
              onValueChange={(value: string) => {
                setValue('type', value as CampaignType, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div>
                      <div className="font-medium">{type.title}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Sélecteur d'objectif */}
      <ObjectiveSelector
        selectedObjective={selectedObjective}
        onObjectiveSelect={handleObjectiveSelect}
      />

      {/* Sélecteur de canaux */}
      <ChannelSelector selectedChannels={selectedChannels} onChannelsChange={handleChannelToggle} />

      {/* Recommandations */}
      <RecommendationsCard
        selectedObjective={selectedObjective}
        selectedChannels={selectedChannels}
      />

      {/* Actions */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid || isValidating}>
          {isValidating ? 'Validation...' : 'Continuer vers les créatifs'}
        </Button>
      </div>
    </form>
  );
}

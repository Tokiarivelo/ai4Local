/**
 * Étape Informations de base - Nom, objectif et canaux
 * Gère la configuration des informations fondamentales de la campagne
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Target,
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Search,
  Smartphone,
  Globe,
  Info,
  Sparkles,
} from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';
import { Textarea } from '@/app/modules/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';

import { BasicInfoStepSchema, type BasicInfoStepData } from './validators';
import { useCampaignCreateContext } from '../../context/WizardContext';
import type { CampaignChannel, CampaignObjective, CampaignType } from '../../types';

interface BasicInfoStepProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  isValidating?: boolean;
  onAsyncValidation?: (data: any) => Promise<void>;
  isEditing?: boolean;
}

// Configuration des objectifs avec descriptions
const CAMPAIGN_OBJECTIVES = [
  {
    id: 'awareness' as CampaignObjective,
    title: 'Notoriété',
    description: 'Faire connaître votre marque ou produit',
    icon: Globe,
    color: 'bg-blue-500',
  },
  {
    id: 'traffic' as CampaignObjective,
    title: 'Trafic',
    description: 'Diriger les visiteurs vers votre site web',
    icon: Search,
    color: 'bg-green-500',
  },
  {
    id: 'engagement' as CampaignObjective,
    title: 'Engagement',
    description: 'Encourager les interactions avec votre contenu',
    icon: Target,
    color: 'bg-purple-500',
  },
  {
    id: 'leads' as CampaignObjective,
    title: 'Génération de leads',
    description: 'Collecter des contacts qualifiés',
    icon: Mail,
    color: 'bg-orange-500',
  },
  {
    id: 'conversions' as CampaignObjective,
    title: 'Conversions',
    description: "Inciter à l'action (achat, inscription...)",
    icon: Target,
    color: 'bg-red-500',
  },
  {
    id: 'sales' as CampaignObjective,
    title: 'Ventes',
    description: 'Générer des ventes directes',
    icon: Sparkles,
    color: 'bg-indigo-500',
  },
] as const;

// Configuration des canaux avec icônes
const CAMPAIGN_CHANNELS = [
  {
    id: 'email' as CampaignChannel,
    title: 'Email',
    description: 'Newsletters et emails marketing',
    icon: Mail,
    color: 'bg-blue-500',
  },
  {
    id: 'sms' as CampaignChannel,
    title: 'SMS',
    description: 'Messages texte directs',
    icon: MessageSquare,
    color: 'bg-green-500',
  },
  {
    id: 'whatsapp' as CampaignChannel,
    title: 'WhatsApp',
    description: 'Messages via WhatsApp Business',
    icon: MessageSquare,
    color: 'bg-green-600',
  },
  {
    id: 'facebook' as CampaignChannel,
    title: 'Facebook',
    description: 'Publicités sur Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
  },
  {
    id: 'instagram' as CampaignChannel,
    title: 'Instagram',
    description: 'Stories et posts sponsorisés',
    icon: Instagram,
    color: 'bg-pink-500',
  },
  {
    id: 'google_ads' as CampaignChannel,
    title: 'Google Ads',
    description: 'Publicités sur Google Search & Display',
    icon: Search,
    color: 'bg-yellow-500',
  },
  {
    id: 'linkedin' as CampaignChannel,
    title: 'LinkedIn',
    description: 'Réseau professionnel B2B',
    icon: Linkedin,
    color: 'bg-blue-700',
  },
  {
    id: 'twitter' as CampaignChannel,
    title: 'Twitter/X',
    description: 'Tweets sponsorisés',
    icon: Twitter,
    color: 'bg-gray-900',
  },
  {
    id: 'youtube' as CampaignChannel,
    title: 'YouTube',
    description: 'Publicités vidéo',
    icon: Youtube,
    color: 'bg-red-600',
  },
  {
    id: 'tiktok' as CampaignChannel,
    title: 'TikTok',
    description: 'Contenu viral et tendance',
    icon: Smartphone,
    color: 'bg-black',
  },
] as const;

// Types de campagne
const CAMPAIGN_TYPES = [
  { id: 'promotion', title: 'Promotion', description: 'Offres spéciales et réductions' },
  { id: 'newsletter', title: 'Newsletter', description: 'Information régulière' },
  { id: 'lead_generation', title: 'Génération de leads', description: 'Collecte de contacts' },
  { id: 'retention', title: 'Fidélisation', description: 'Réengager les clients existants' },
  { id: 'event', title: 'Événement', description: "Promotion d'événements" },
  { id: 'product_launch', title: 'Lancement produit', description: 'Nouveau produit ou service' },
  { id: 'seasonal', title: 'Saisonnier', description: 'Campagnes liées aux saisons' },
] as const;

export function BasicInfoStep({
  onComplete,
  onValidationChange,
  isValidating = false,
  onAsyncValidation,
  isEditing = false,
}: BasicInfoStepProps) {
  const { data, updateStepData, completeStep } = useCampaignCreateContext();

  // Cast des données avec une interface étendue pour basicInfo
  const typedData = data as any;

  const [selectedObjective, setSelectedObjective] = useState<CampaignObjective | null>(
    typedData.basicInfo?.objective || null
  );
  const [selectedChannels, setSelectedChannels] = useState<CampaignChannel[]>(
    typedData.basicInfo?.channels || []
  );

  const form = useForm<BasicInfoStepData>({
    resolver: zodResolver(BasicInfoStepSchema),
    defaultValues: {
      name: typedData.basicInfo?.name || '',
      description: typedData.basicInfo?.description || '',
      objective: selectedObjective || 'awareness',
      type: typedData.basicInfo?.type || 'promotion',
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
    getValues,
  } = form;

  // Surveillez uniquement les champs nécessaires pour éviter les re-renders inutiles
  const formName = watch('name');
  const formDescription = watch('description');
  const formType = watch('type');

  // Mise à jour du contexte avec stabilisation des dépendances
  React.useEffect(() => {
    const basicInfoData = {
      name: formName || '',
      description: formDescription || '',
      type: formType || 'promotion',
      objective: selectedObjective || 'awareness',
      channels: selectedChannels,
    };

    updateStepData({
      basicInfo: basicInfoData,
    });
  }, [formName, formDescription, formType, selectedObjective, selectedChannels, updateStepData]);

  // Notification de validation avec stabilisation
  const isFormValid = React.useMemo(() => {
    return isValid && selectedObjective && selectedChannels.length > 0;
  }, [isValid, selectedObjective, selectedChannels.length]);

  React.useEffect(() => {
    onValidationChange?.(Boolean(isFormValid));
  }, [isFormValid, onValidationChange]);

  const handleObjectiveSelect = React.useCallback(
    (objective: CampaignObjective) => {
      if (selectedObjective !== objective) {
        setSelectedObjective(objective);
        setValue('objective', objective as any, { shouldValidate: true });
      }
    },
    [setValue, selectedObjective]
  );

  const handleChannelToggle = React.useCallback(
    (channel: CampaignChannel) => {
      setSelectedChannels((prev) => {
        const isCurrentlySelected = prev.includes(channel);
        const newChannels = isCurrentlySelected
          ? prev.filter((c) => c !== channel)
          : [...prev, channel];

        // Seulement si la sélection a vraiment changé
        if (newChannels.length !== prev.length || !newChannels.every((c) => prev.includes(c))) {
          setValue('channels', newChannels, { shouldValidate: true });
        }

        return newChannels;
      });
    },
    [setValue]
  );

  const onSubmit = React.useCallback(
    (data: BasicInfoStepData) => {
      completeStep('basic_info');
      onComplete?.();
    },
    [completeStep, onComplete]
  );

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold">Informations de base</h3>
        <p className="text-sm text-muted-foreground">
          Définissez les informations essentielles de votre campagne
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
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
                onValueChange={React.useCallback(
                  (value: string) => {
                    if (value !== formType) {
                      setValue('type', value as CampaignType, { shouldValidate: true });
                    }
                  },
                  [setValue, formType]
                )}
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

        {/* Objectif de la campagne */}
        <Card className="p-6">
          <div className="mb-4">
            <h4 className="font-medium">Objectif principal *</h4>
            <p className="text-sm text-muted-foreground">
              Choisissez l'objectif principal de votre campagne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAMPAIGN_OBJECTIVES.map((objective) => {
              const isSelected = selectedObjective === objective.id;
              const IconComponent = objective.icon;

              return (
                <motion.div
                  key={objective.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-4 border rounded-lg cursor-pointer transition-all
                    ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                  onClick={() => handleObjectiveSelect(objective.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg text-white ${objective.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm">{objective.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{objective.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Target className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {!selectedObjective && (
            <p className="text-sm text-destructive mt-2">
              Veuillez sélectionner un objectif pour votre campagne
            </p>
          )}
        </Card>

        {/* Canaux de distribution */}
        <Card className="p-6">
          <div className="mb-4">
            <h4 className="font-medium">Canaux de distribution *</h4>
            <p className="text-sm text-muted-foreground">
              Sélectionnez les canaux où vous souhaitez diffuser votre campagne
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CAMPAIGN_CHANNELS.map((channel) => {
              const isSelected = selectedChannels.includes(channel.id);
              const IconComponent = channel.icon;

              return (
                <motion.div
                  key={channel.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-3 border rounded-lg cursor-pointer transition-all
                    ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }
                  `}
                  onClick={() => handleChannelToggle(channel.id)}
                >
                  <div className="text-center">
                    <div
                      className={`
                      w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-white
                      ${isSelected ? channel.color : 'bg-muted'}
                    `}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium">{channel.title}</p>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Target className="h-2 w-2 text-primary-foreground" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {selectedChannels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Canaux sélectionnés:</span>
              {selectedChannels.map((channelId) => {
                const channel = CAMPAIGN_CHANNELS.find((c) => c.id === channelId);
                return channel ? (
                  <Badge key={channelId} variant="secondary" className="text-xs">
                    {channel.title}
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          {selectedChannels.length === 0 && (
            <p className="text-sm text-destructive mt-2">
              Veuillez sélectionner au moins un canal de distribution
            </p>
          )}
        </Card>

        {/* Recommandations */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900 mb-1">💡 Recommandations</div>
              <div className="text-sm text-blue-800 space-y-1">
                {selectedObjective === 'awareness' && (
                  <p>• Pour la notoriété, privilégiez Facebook, Instagram et Google Ads</p>
                )}
                {selectedObjective === 'leads' && (
                  <p>• Pour les leads, combinez LinkedIn, email et Google Ads</p>
                )}
                {selectedObjective === 'sales' && (
                  <p>• Pour les ventes, utilisez Google Ads, Facebook et email</p>
                )}
                {selectedChannels.length > 3 && (
                  <p>• Attention: trop de canaux peuvent diluer votre message</p>
                )}
                <p>• Un nom descriptif améliore le suivi de vos performances</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!selectedObjective || selectedChannels.length === 0 || !isValid}
          >
            Continuer vers les créatifs
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BasicInfoStep;

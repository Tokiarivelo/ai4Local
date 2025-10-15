'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, Check } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/app/modules/ui/card';
import { Input } from '@/app/modules/ui/input';
import { Button } from '@/app/modules/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { Separator } from '@/app/modules/ui/separator';
import type { TrackingStepData } from '../validators';
import { generateUTMUrl } from '../../../mock-data';

interface UTMSectionProps {
  form: UseFormReturn<TrackingStepData>;
}

export function UTMSection({ form }: UTMSectionProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = form;

  const utmSource = watch('utmParameters.source');
  const utmMedium = watch('utmParameters.medium');
  const utmCampaign = watch('utmParameters.campaign');
  const utmTerm = watch('utmParameters.term');
  const utmContent = watch('utmParameters.content');

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

  const handleMediumChange = React.useCallback(
    (value: string) => {
      setValue('utmParameters.medium', value);
      trigger('utmParameters.medium');
    },
    [setValue, trigger]
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
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
  );
}

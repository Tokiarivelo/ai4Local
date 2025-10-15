'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2, Check, X } from 'lucide-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card } from '@/app/modules/ui/card';
import { Input } from '@/app/modules/ui/input';
import { Button } from '@/app/modules/ui/button';
import { Switch } from '@/app/modules/ui/switch';
import { Badge } from '@/app/modules/ui/badge';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import type { TrackingStepData, CustomPixel } from '../validators';

interface PixelTrackingSectionProps {
  form: UseFormReturn<TrackingStepData>;
}

export function PixelTrackingSection({ form }: PixelTrackingSectionProps) {
  const [showPixelIds, setShowPixelIds] = useState(false);
  const [pixelStatus, setPixelStatus] = useState<{
    facebook: 'idle' | 'checking' | 'valid' | 'invalid';
    google: 'idle' | 'checking' | 'valid' | 'invalid';
  }>({ facebook: 'idle', google: 'idle' });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = form;

  const pixelTracking = watch('pixelTracking');
  const facebookPixel = watch('pixelTracking.facebookPixel');
  const googleAnalytics = watch('pixelTracking.googleAnalytics');

  const {
    fields: customPixelFields,
    append: appendCustomPixel,
    remove: removeCustomPixel,
  } = useFieldArray({
    control,
    name: 'pixelTracking.customPixels',
  });

  const handlePixelToggle = React.useCallback(
    (enabled: boolean) => {
      setValue('pixelTracking.enabled', enabled);
    },
    [setValue]
  );

  const validatePixel = async (type: 'facebook' | 'google', pixelId: string) => {
    if (!pixelId) return;

    setPixelStatus((prev) => ({ ...prev, [type]: 'checking' }));

    // Simulation de validation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validation basique
    let isValid = false;
    if (type === 'facebook') {
      isValid = /^\d{15,16}$/.test(pixelId);
    } else if (type === 'google') {
      isValid = /^G-[A-Z0-9]{10}$/.test(pixelId) || /^UA-\d{8}-\d{1,2}$/.test(pixelId);
    }

    setPixelStatus((prev) => ({ ...prev, [type]: isValid ? 'valid' : 'invalid' }));
  };

  const addCustomPixel = () => {
    appendCustomPixel({
      name: '',
      id: '',
      type: 'custom',
      description: '',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-medium">Tracking Pixel</h4>
          <p className="text-sm text-muted-foreground">
            Configurez vos pixels de tracking pour mesurer les conversions
          </p>
        </div>
        <Switch checked={pixelTracking?.enabled || false} onCheckedChange={handlePixelToggle} />
      </div>

      {pixelTracking?.enabled && (
        <div className="space-y-6">
          {/* Facebook Pixel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Facebook Pixel ID</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPixelIds(!showPixelIds)}
                >
                  {showPixelIds ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {facebookPixel && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => validatePixel('facebook', facebookPixel)}
                    disabled={pixelStatus.facebook === 'checking'}
                  >
                    {pixelStatus.facebook === 'checking' ? 'Vérification...' : 'Valider'}
                  </Button>
                )}
              </div>
            </div>

            <div className="relative">
              <Input
                {...register('pixelTracking.facebookPixel')}
                type={showPixelIds ? 'text' : 'password'}
                placeholder="123456789012345"
                className={`pr-10 ${
                  pixelStatus.facebook === 'valid'
                    ? 'border-green-500'
                    : pixelStatus.facebook === 'invalid'
                      ? 'border-red-500'
                      : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {pixelStatus.facebook === 'valid' && <Check className="h-4 w-4 text-green-500" />}
                {pixelStatus.facebook === 'invalid' && <X className="h-4 w-4 text-red-500" />}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Trouvez votre Pixel ID dans le Gestionnaire d'événements Facebook
            </p>
          </div>

          {/* Google Analytics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Google Analytics ID</label>
              {googleAnalytics && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => validatePixel('google', googleAnalytics)}
                  disabled={pixelStatus.google === 'checking'}
                >
                  {pixelStatus.google === 'checking' ? 'Vérification...' : 'Valider'}
                </Button>
              )}
            </div>

            <div className="relative">
              <Input
                {...register('pixelTracking.googleAnalytics')}
                type={showPixelIds ? 'text' : 'password'}
                placeholder="G-XXXXXXXXXX ou UA-XXXXXXXX-X"
                className={`pr-10 ${
                  pixelStatus.google === 'valid'
                    ? 'border-green-500'
                    : pixelStatus.google === 'invalid'
                      ? 'border-red-500'
                      : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {pixelStatus.google === 'valid' && <Check className="h-4 w-4 text-green-500" />}
                {pixelStatus.google === 'invalid' && <X className="h-4 w-4 text-red-500" />}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              ID de mesure Google Analytics 4 (G-) ou Universal Analytics (UA-)
            </p>
          </div>

          {/* Custom Pixels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Pixels personnalisés</label>
              <Button type="button" variant="outline" size="sm" onClick={addCustomPixel}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter pixel
              </Button>
            </div>

            {customPixelFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-muted/50">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Pixel {index + 1}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomPixel(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom du pixel</label>
                    <Input
                      {...register(`pixelTracking.customPixels.${index}.name`)}
                      placeholder="Ex: TikTok Pixel"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID/Code</label>
                    <Input
                      {...register(`pixelTracking.customPixels.${index}.id`)}
                      type={showPixelIds ? 'text' : 'password'}
                      placeholder="ID ou code du pixel"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      {...register(`pixelTracking.customPixels.${index}.description`)}
                      placeholder="Description de ce pixel"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Summary */}
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">État des pixels :</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        pixelStatus.facebook === 'valid'
                          ? 'bg-green-500'
                          : pixelStatus.facebook === 'invalid'
                            ? 'bg-red-500'
                            : 'bg-gray-300'
                      }`}
                    />
                    Facebook: {pixelStatus.facebook === 'valid' ? 'Validé' : 'Non validé'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        pixelStatus.google === 'valid'
                          ? 'bg-green-500'
                          : pixelStatus.google === 'invalid'
                            ? 'bg-red-500'
                            : 'bg-gray-300'
                      }`}
                    />
                    Google: {pixelStatus.google === 'valid' ? 'Validé' : 'Non validé'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Personnalisés: {customPixelFields.length} configuré(s)
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}

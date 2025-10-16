/**
 * Variant Editor Component
 * Form for creating/editing a test variant
 */

'use client';

import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Video, Type } from 'lucide-react';
import { Input } from '@/app/modules/ui/input';
import { Textarea } from '@/app/modules/ui/textarea';
import { Label } from '@/app/modules/ui/label';
import { Button } from '@/app/modules/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import type { Variant } from '../types';

interface VariantEditorProps {
  variant: Variant;
  index: number;
  canRemove: boolean;
  onChange: (variant: Variant) => void;
  onRemove: () => void;
}

export function VariantEditor({
  variant,
  index,
  canRemove,
  onChange,
  onRemove,
}: VariantEditorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(variant.creative.url || null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setImagePreview(url);
      onChange({
        ...variant,
        creative: {
          ...variant.creative,
          url,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium">
          Variante {index + 1}: {variant.name || 'Sans nom'}
        </CardTitle>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Variant Name */}
        <div className="space-y-2">
          <Label htmlFor={`variant-${index}-name`}>Nom de la variante *</Label>
          <Input
            id={`variant-${index}-name`}
            placeholder="Ex: Contrôle, Variante A, etc."
            value={variant.name}
            onChange={(e) => onChange({ ...variant, name: e.target.value })}
            required
          />
        </div>

        {/* Creative Type */}
        <div className="space-y-2">
          <Label htmlFor={`variant-${index}-type`}>Type de contenu</Label>
          <Select
            value={variant.creative.type}
            onValueChange={(value: 'image' | 'video' | 'text') =>
              onChange({
                ...variant,
                creative: { ...variant.creative, type: value },
              })
            }
          >
            <SelectTrigger id={`variant-${index}-type`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image
                </div>
              </SelectItem>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Vidéo
                </div>
              </SelectItem>
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Texte uniquement
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Creative Content */}
        {variant.creative.type === 'image' && (
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      onChange({
                        ...variant,
                        creative: { ...variant.creative, url: undefined },
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Cliquez pour uploader une image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {variant.creative.type === 'video' && (
          <div className="space-y-2">
            <Label htmlFor={`variant-${index}-video-url`}>URL de la vidéo</Label>
            <Input
              id={`variant-${index}-video-url`}
              placeholder="https://..."
              value={variant.creative.url || ''}
              onChange={(e) =>
                onChange({
                  ...variant,
                  creative: { ...variant.creative, url: e.target.value },
                })
              }
            />
          </div>
        )}

        {variant.creative.type === 'text' && (
          <div className="space-y-2">
            <Label htmlFor={`variant-${index}-text-content`}>Contenu texte</Label>
            <Textarea
              id={`variant-${index}-text-content`}
              placeholder="Entrez le contenu texte..."
              rows={4}
              value={variant.creative.content || ''}
              onChange={(e) =>
                onChange({
                  ...variant,
                  creative: { ...variant.creative, content: e.target.value },
                })
              }
            />
          </div>
        )}

        {/* Headline */}
        <div className="space-y-2">
          <Label htmlFor={`variant-${index}-headline`}>Titre *</Label>
          <Input
            id={`variant-${index}-headline`}
            placeholder="Titre accrocheur..."
            value={variant.headline}
            onChange={(e) => onChange({ ...variant, headline: e.target.value })}
            required
          />
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <Label htmlFor={`variant-${index}-cta`}>Call-to-Action *</Label>
          <Input
            id={`variant-${index}-cta`}
            placeholder="Ex: Acheter maintenant, En savoir plus..."
            value={variant.cta}
            onChange={(e) => onChange({ ...variant, cta: e.target.value })}
            required
          />
        </div>

        {/* Description (Optional) */}
        <div className="space-y-2">
          <Label htmlFor={`variant-${index}-description`}>Description (optionnel)</Label>
          <Textarea
            id={`variant-${index}-description`}
            placeholder="Description de la variante..."
            rows={2}
            value={variant.description || ''}
            onChange={(e) => onChange({ ...variant, description: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

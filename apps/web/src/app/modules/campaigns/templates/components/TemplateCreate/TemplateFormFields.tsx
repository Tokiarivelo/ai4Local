'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/modules/ui/form';
import { Input } from '@/app/modules/ui/input';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/modules/ui/accordion';
import { AITextField } from './AITextField';
import { FileUploadZone } from './FileUploadZone';
import { DEFAULT_IMAGE_CONFIG } from '../../types/file-upload.types';
import type { TemplateFormData } from '../../validators/templateSchema';
import type { TemplateCategory } from '../../types/template.types';
import { getCategoryLabel } from '../../utils/templateHelpers';

interface TemplateFormFieldsProps {
  form: UseFormReturn<TemplateFormData>;
}

const CAMPAIGN_TYPES: TemplateCategory[] = [
  'promotion',
  'newsletter',
  'lead_generation',
  'retention',
  'event',
  'product_launch',
  'seasonal',
  'custom',
];

export function TemplateFormFields({ form }: TemplateFormFieldsProps) {
  const [tagInput, setTagInput] = useState('');
  const tags = form.watch('tags') || [];
  const templateName = form.watch('name');
  const templateCategory = form.watch('category');

  const context = `${templateName} - ${getCategoryLabel(templateCategory)}`;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      form.setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      'tags',
      tags.filter((t) => t !== tag)
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Configuration du template</h3>

      {/* Tags */}
      <FormField
        control={form.control}
        name="tags"
        render={() => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Ajouter
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FormDescription>
              Ajoutez des tags pour faciliter la recherche et l'organisation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Template Structure - Advanced Fields */}
      <Accordion type="multiple" className="w-full">
        {/* Basic Info */}
        <AccordionItem value="basic-info">
          <AccordionTrigger>Informations de base de la campagne</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="structure.basicInfo.objective"
              render={({ field }) => (
                <FormItem>
                  <AITextField
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Objectif"
                    placeholder="Ex: Augmenter les conversions, générer des leads..."
                    fieldType="objective"
                    context={context}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="structure.basicInfo.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de campagne</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CAMPAIGN_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {getCategoryLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Creatives */}
        <AccordionItem value="creatives">
          <AccordionTrigger>Éléments créatifs</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="structure.creatives.headline"
              render={({ field }) => (
                <FormItem>
                  <AITextField
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Titre"
                    placeholder="Titre accrocheur de la campagne..."
                    fieldType="headline"
                    context={context}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="structure.creatives.caption"
              render={({ field }) => (
                <FormItem>
                  <AITextField
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Description"
                    placeholder="Description détaillée de la campagne..."
                    fieldType="caption"
                    context={context}
                    multiline
                    rows={4}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="structure.creatives.callToAction"
              render={({ field }) => (
                <FormItem>
                  <AITextField
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Call-to-Action"
                    placeholder="Ex: En savoir plus, Acheter maintenant..."
                    fieldType="callToAction"
                    context={context}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media Files Upload */}
            <FormField
              control={form.control}
              name="structure.creatives.mediaFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médias (Images/Vidéos)</FormLabel>
                  <FormControl>
                    <FileUploadZone
                      config={DEFAULT_IMAGE_CONFIG}
                      onFilesChange={(files) => {
                        field.onChange(
                          files.map((f) => ({
                            id: f.id,
                            type: f.type.startsWith('image/') ? 'image' : 'video',
                            url: f.url,
                            name: f.name,
                            size: f.size,
                          }))
                        );
                      }}
                      existingFiles={
                        field.value?.map((f: any) => ({
                          id: f.id || `file-${Date.now()}`,
                          name: f.name,
                          size: f.size || 0,
                          type: f.type === 'image' ? 'image/jpeg' : 'video/mp4',
                          url: f.url || '',
                          uploadedAt: new Date(),
                        })) || []
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Téléchargez des images ou vidéos pour votre template (max 10 fichiers)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Planning */}
        <AccordionItem value="planning">
          <AccordionTrigger>Planification</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="structure.planning.budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget suggéré (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 5000"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? Number(value) : undefined);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Budget recommandé pour ce type de campagne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="structure.planning.startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début suggérée</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value ? new Date(e.target.value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="structure.planning.endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin suggérée</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value ? new Date(e.target.value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tracking */}
        <AccordionItem value="tracking">
          <AccordionTrigger>Paramètres de tracking (optionnel)</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <FormLabel>Paramètres UTM</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="utm_source" disabled />
                <Input placeholder="utm_medium" disabled />
                <Input placeholder="utm_campaign" disabled />
                <Input placeholder="utm_content" disabled />
              </div>
              <FormDescription>
                Les paramètres UTM seront configurés lors de la création de la campagne
              </FormDescription>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
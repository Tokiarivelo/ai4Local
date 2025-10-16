'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
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

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  size: number;
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
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const tags = form.watch('tags') || [];
  const templateName = form.watch('name');
  const templateCategory = form.watch('category');
  const headline = form.watch('structure.creatives.headline');
  const caption = form.watch('structure.creatives.caption');

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

  /**
   * Génération IA de médias basée sur le contexte de la campagne
   */
  const handleGenerateWithAI = async () => {
    setIsGeneratingMedia(true);

    try {
      // Construction du prompt enrichi avec le contexte
      const enrichedPrompt =
        aiPrompt ||
        `Génère une image pour une campagne ${getCategoryLabel(templateCategory)}: ${
          headline || templateName
        }. ${caption || ''}`;

      // TODO: Appel API GraphQL/REST vers le service de génération d'images
      // Exemple avec mutation GraphQL
      // const { data } = await generateImageMutation({
      //   variables: {
      //     prompt: enrichedPrompt,
      //     style: 'professional',
      //     size: '1024x1024',
      //   }
      // });

      // Simulation pour démonstration (à remplacer par l'appel réel)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedMedia: MediaFile = {
        id: `ai-gen-${Date.now()}`,
        type: 'image',
        url: '/api/placeholder-image', // Remplacer par data.generateImage.url
        name: `ai-generated-${Date.now()}.png`,
        size: 1024000,
      };

      // Ajouter aux médias existants
      const currentMedia = form.getValues('structure.creatives.mediaFiles') || [];
      form.setValue('structure.creatives.mediaFiles', [...currentMedia, generatedMedia]);

      setAiPrompt('');
    } catch (error) {
      console.error('Erreur génération IA:', error);
      // TODO: Afficher toast d'erreur
    } finally {
      setIsGeneratingMedia(false);
    }
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

            {/* Media Files Upload avec génération IA */}
            <FormField
              control={form.control}
              name="structure.creatives.mediaFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médias (Images/Vidéos)</FormLabel>

                  {/* Zone de génération IA */}
                  <div className="mb-4 p-4 border border-dashed rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <div className="flex items-start gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">Générer avec l'IA</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Décrivez l'image souhaitée ou laissez l'IA suggérer basé sur votre
                          campagne
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Ex: Une image moderne et colorée représentant..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        disabled={isGeneratingMedia}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleGenerateWithAI}
                        disabled={isGeneratingMedia || !templateName}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isGeneratingMedia ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Générer
                          </>
                        )}
                      </Button>
                    </div>

                    {!templateName && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        💡 Remplissez d'abord le nom et le titre pour une meilleure génération
                      </p>
                    )}
                  </div>

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
                      // existingFiles={
                      //   field.value?.map((f) => ({
                      //     id: f.id ? f.id : `file-${Date.now()}`,
                      //     name: f.name,
                      //     size: typeof f.size === 'number' ? f.size : 0,
                      //     type: f.type === 'image' ? 'image/jpeg' : 'video/mp4',
                      //     url: f.url ? f.url : '',
                      //     uploadedAt: new Date(),
                      //   })) || []
                      // }
                    />
                  </FormControl>
                  <FormDescription>
                    Téléchargez des images/vidéos ou générez-les avec l'IA (max 10 fichiers)
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
                  <FormDescription>Budget recommandé pour ce type de campagne</FormDescription>
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
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
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
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
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

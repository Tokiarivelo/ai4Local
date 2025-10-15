'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/modules/ui/form';
import { Input } from '@/app/modules/ui/input';
import { Textarea } from '@/app/modules/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { useTemplateActions } from '../../hooks/useTemplateActions';
import { TemplateSchema, type TemplateFormData } from '../../validators/templateSchema';
import { TemplateFormFields } from './TemplateFormFields';
import { getCategoryLabel } from '../../utils/templateHelpers';
import type { TemplateCategory } from '../../types/template.types';

interface TemplateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES: TemplateCategory[] = [
  'promotion',
  'newsletter',
  'lead_generation',
  'retention',
  'event',
  'product_launch',
  'seasonal',
  'custom',
];

export function TemplateForm({ onSuccess, onCancel }: TemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTemplate } = useTemplateActions();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(TemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'promotion',
      tags: [],
      structure: {},
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true);
    try {
      await createTemplate(data);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create template:', error);
      form.setError('root', {
        message: 'Échec de la création du template. Veuillez réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold">Informations de base</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du template *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Promo Black Friday" {...field} />
                </FormControl>
                <FormDescription>
                  Un nom descriptif pour identifier facilement ce template
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez l'utilisation et les objectifs de ce template..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Template Structure */}
        <TemplateFormFields form={form} />

        {/* Error Message */}
        {form.formState.errors.root && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.root.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Créer le template
          </Button>
        </div>
      </form>
    </Form>
  );
}

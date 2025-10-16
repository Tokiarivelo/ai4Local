/**
 * A/B Test Editor Modal
 * Create and edit A/B tests
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/modules/ui/dialog';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Label } from '@/app/modules/ui/label';
import { Textarea } from '@/app/modules/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { ScrollArea } from '@/app/modules/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import type { AbTest, Channel, MetricType, Variant, CreateAbTestInput } from '../types';
import { VariantEditor } from './VariantEditor';
import { TrafficSplitter } from './TrafficSplitter';
import { MetricsSelector } from './MetricsSelector';
import { validateAbTest } from '../utils/sanity-checks';

interface AbTestEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (test: CreateAbTestInput) => Promise<void>;
  editingTest?: AbTest;
}

const CHANNELS: Channel[] = ['email', 'sms', 'push', 'web', 'social'];

const CHANNEL_LABELS: Record<Channel, string> = {
  email: 'Email',
  sms: 'SMS',
  push: 'Notification Push',
  web: 'Web',
  social: 'Réseaux Sociaux',
};

export function AbTestEditorModal({ open, onClose, onSave, editingTest }: AbTestEditorModalProps) {
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [channel, setChannel] = useState<Channel>('email');
  const [variants, setVariants] = useState<Omit<Variant, 'id'>[]>([
    {
      name: 'Contrôle',
      trafficPercentage: 50,
      creative: { type: 'text', content: '' },
      headline: '',
      cta: '',
    },
    {
      name: 'Variante A',
      trafficPercentage: 50,
      creative: { type: 'text', content: '' },
      headline: '',
      cta: '',
    },
  ]);
  const [targetMetric, setTargetMetric] = useState<MetricType>('ctr');
  const [duration, setDuration] = useState(14);
  const [sampleSize, setSampleSize] = useState(10000);

  // Initialize from editing test
  useEffect(() => {
    if (editingTest) {
      setName(editingTest.name);
      setDescription(editingTest.description || '');
      setCampaignId(editingTest.campaignId);
      setChannel(editingTest.channel);
      setVariants(editingTest.variants.map(({ id, ...rest }) => rest));
      setTargetMetric(editingTest.targetMetric);
      setDuration(editingTest.duration || 14);
      setSampleSize(editingTest.sampleSize || 10000);
    } else {
      // Reset form
      setName('');
      setDescription('');
      setCampaignId('');
      setChannel('email');
      setVariants([
        {
          name: 'Contrôle',
          trafficPercentage: 50,
          creative: { type: 'text', content: '' },
          headline: '',
          cta: '',
        },
        {
          name: 'Variante A',
          trafficPercentage: 50,
          creative: { type: 'text', content: '' },
          headline: '',
          cta: '',
        },
      ]);
      setTargetMetric('ctr');
      setDuration(14);
      setSampleSize(10000);
    }
    setCurrentTab('basic');
    setErrors([]);
  }, [editingTest, open]);

  const handleAddVariant = () => {
    const equalPercentage = 100 / (variants.length + 1);
    const newVariants = [
      ...variants.map((v) => ({ ...v, trafficPercentage: equalPercentage })),
      {
        name: `Variante ${String.fromCharCode(65 + variants.length - 1)}`,
        trafficPercentage: equalPercentage,
        creative: { type: 'text' as const, content: '' },
        headline: '',
        cta: '',
      },
    ];
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 2) return;
    const newVariants = variants.filter((_, i) => i !== index);
    const equalPercentage = 100 / newVariants.length;
    setVariants(newVariants.map((v) => ({ ...v, trafficPercentage: equalPercentage })));
  };

  const handleVariantChange = (index: number, variant: Omit<Variant, 'id'>) => {
    const newVariants = [...variants];
    newVariants[index] = variant;
    setVariants(newVariants);
  };

  const handleSave = async (asDraft: boolean = false) => {
    const input: CreateAbTestInput = {
      name,
      description: description || undefined,
      campaignId,
      channel,
      variants,
      targetMetric,
      duration,
      sampleSize,
    };

    const validationErrors = validateAbTest(input);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.message));
      return;
    }

    setIsSaving(true);
    setErrors([]);

    try {
      await onSave(input);
      onClose();
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Échec de la sauvegarde']);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{editingTest ? 'Modifier le test A/B' : 'Créer un test A/B'}</DialogTitle>
          <DialogDescription>
            Configurez votre test A/B pour optimiser vos campagnes marketing
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1">
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="variants">Variantes ({variants.length})</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="metrics">Métriques</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-6 py-4" style={{ maxHeight: 'calc(90vh - 240px)' }}>
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="test-name">Nom du test *</Label>
                <Input
                  id="test-name"
                  placeholder="Ex: Test email Black Friday"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-description">Description</Label>
                <Textarea
                  id="test-description"
                  placeholder="Décrivez l'objectif du test..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-id">Campagne *</Label>
                  <Input
                    id="campaign-id"
                    placeholder="ID de la campagne"
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel">Canal *</Label>
                  <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
                    <SelectTrigger id="channel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((ch) => (
                        <SelectItem key={ch} value={ch}>
                          {CHANNEL_LABELS[ch]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (jours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="90"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 14)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sample-size">Taille d'échantillon cible</Label>
                  <Input
                    id="sample-size"
                    type="number"
                    min="100"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(parseInt(e.target.value) || 10000)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value="variants" className="space-y-4 mt-0">
              {variants.map((variant, index) => (
                <VariantEditor
                  key={index}
                  variant={variant as Variant}
                  index={index}
                  canRemove={variants.length > 2}
                  onChange={(v) => handleVariantChange(index, v)}
                  onRemove={() => handleRemoveVariant(index)}
                />
              ))}

              {variants.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddVariant}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une variante
                </Button>
              )}
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="mt-0">
              <TrafficSplitter
                variants={variants as Variant[]}
                onChange={(newVariants) => setVariants(newVariants)}
              />
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="mt-0">
              <MetricsSelector value={targetMetric} onChange={setTargetMetric} />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter className="px-6 pb-6 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button variant="outline" onClick={() => handleSave(true)} disabled={isSaving}>
            Enregistrer comme brouillon
          </Button>
          <Button onClick={() => handleSave(false)} disabled={isSaving}>
            {isSaving ? 'Sauvegarde...' : editingTest ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Étape Créatifs - Upload d'images/vidéos et génération IA
 * Gère l'upload de fichiers, la génération de contenu par IA et la preview
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image,
  Video,
  Sparkles,
  Trash2,
  Eye,
  Download,
  Loader2,
  Plus,
  GripVertical,
} from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/modules/ui/dialog';

import { CreativesStepSchema, type CreativesStepData, type MediaFile } from './validators';
import { useCampaignCreateContext } from '../../context/WizardContext';
import { generateText, generateImage, useAICredits } from '../../utils/ai-generator';
import { mockMediaFiles } from '../../mock-data';

interface StepCreativesProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepCreatives({ onComplete, onValidationChange }: StepCreativesProps) {
  const { data, updateStepData, completeStep } = useCampaignCreateContext();
  const { credits, useCredits, canUseCredits } = useAICredits();

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(data.creatives?.mediaFiles || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedForPreview, setSelectedForPreview] = useState<MediaFile | null>(null);

  const form = useForm<CreativesStepData>({
    resolver: zodResolver(CreativesStepSchema),
    defaultValues: {
      headline: data.creatives?.headline || '',
      caption: data.creatives?.caption || '',
      callToAction: data.creatives?.callToAction || '',
      mediaFiles: mediaFiles,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = form;

  // Mise à jour du contexte quand les données changent
  React.useEffect(() => {
    const subscription = watch((formData: any) => {
      updateStepData({
        creatives: {
          ...formData,
          mediaFiles: mediaFiles,
        } as CreativesStepData,
      });
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [watch, updateStepData, mediaFiles]);

  // Notification de validation
  React.useEffect(() => {
    onValidationChange?.(isValid && mediaFiles.length > 0);
  }, [isValid, mediaFiles.length, onValidationChange]);

  // Simulation d'upload de fichier
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const mediaFile: MediaFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      };

      setMediaFiles((prev) => [...prev, mediaFile]);
    });

    // Reset input
    event.target.value = '';
  }, []);

  // Supprimer un fichier média
  const removeMediaFile = useCallback((id: string) => {
    setMediaFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  // Réorganiser les fichiers (drag & drop simulation)
  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setMediaFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  }, []);

  // Génération IA de texte
  const generateAIText = useCallback(
    async (type: 'headline' | 'caption', prompt: string) => {
      if (!canUseCredits(1)) {
        setGenerationError('Crédits IA insuffisants');
        return;
      }

      setIsGenerating(true);
      setGenerationError(null);

      try {
        const response = await generateText({
          prompt,
          type,
          tone: 'professional',
          length: type === 'headline' ? 'short' : 'medium',
        });

        if (response.success && response.data) {
          setValue(type, response.data);
          useCredits(response.credits_used || 1);
        } else {
          setGenerationError(response.error || 'Erreur de génération');
        }
      } catch (error) {
        setGenerationError('Erreur lors de la génération');
      } finally {
        setIsGenerating(false);
      }
    },
    [canUseCredits, setValue, useCredits]
  );

  // Génération IA d'image
  const generateAIImage = useCallback(
    async (prompt: string) => {
      if (!canUseCredits(3)) {
        setGenerationError('Crédits IA insuffisants (3 crédits requis)');
        return;
      }

      setIsGenerating(true);
      setGenerationError(null);

      try {
        const response = await generateImage({
          prompt,
          style: 'photo',
          size: '16:9',
        });

        if (response.success && response.data) {
          const aiImage: MediaFile = {
            id: `ai-${Date.now()}`,
            type: 'image',
            url: response.data,
            name: 'image-generee-ia.jpg',
            size: 500000, // Taille simulée
            preview: response.data,
          };

          setMediaFiles((prev) => [...prev, aiImage]);
          useCredits(response.credits_used || 3);
        } else {
          setGenerationError(response.error || "Erreur de génération d'image");
        }
      } catch (error) {
        setGenerationError("Erreur lors de la génération d'image");
      } finally {
        setIsGenerating(false);
      }
    },
    [canUseCredits, useCredits]
  );

  const onSubmit = (data: CreativesStepData) => {
    completeStep('creative');
    onComplete?.();
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec crédits IA */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Créatifs de campagne</h3>
          <p className="text-sm text-muted-foreground">
            Ajoutez des images, vidéos et textes pour votre campagne
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {credits} crédits IA
        </Badge>
      </div>

      {/* Alerte d'erreur */}
      <AnimatePresence>
        {generationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-sm text-red-800">{generationError}</div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section Upload et Génération */}
        <Card className="p-6">
          <h4 className="font-medium mb-4">Médias</h4>

          {/* Zone d'upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Uploader des fichiers</span>
                <span className="text-xs text-muted-foreground">Images et vidéos</span>
              </label>
            </div>

            <AIImageGenerator onGenerate={generateAIImage} isLoading={isGenerating} />
          </div>

          {/* Liste des fichiers média */}
          <AnimatePresence>
            {mediaFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {mediaFiles.map((file, index) => (
                  <MediaFileCard
                    key={file.id}
                    file={file}
                    index={index}
                    onRemove={() => removeMediaFile(file.id)}
                    onPreview={() => setSelectedForPreview(file)}
                    onReorder={reorderFiles}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {errors.mediaFiles && (
            <p className="text-sm text-destructive mt-2">{errors.mediaFiles.message}</p>
          )}
        </Card>

        {/* Section Textes */}
        <Card className="p-6">
          <h4 className="font-medium mb-4">Textes</h4>

          <div className="space-y-4">
            {/* Titre */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Titre principal *</label>
                <AITextGenerator
                  type="headline"
                  onGenerate={(prompt) => generateAIText('headline', prompt)}
                  isLoading={isGenerating}
                />
              </div>
              <Input
                {...register('headline')}
                placeholder="Ex: Découvrez notre nouvelle offre exclusive !"
                className={errors.headline ? 'border-destructive' : ''}
              />
              {errors.headline && (
                <p className="text-sm text-destructive">{errors.headline.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Description</label>
                <AITextGenerator
                  type="caption"
                  onGenerate={(prompt) => generateAIText('caption', prompt)}
                  isLoading={isGenerating}
                />
              </div>
              <textarea
                {...register('caption')}
                placeholder="Décrivez votre offre en détail..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors resize-none"
              />
              {errors.caption && (
                <p className="text-sm text-destructive">{errors.caption.message}</p>
              )}
            </div>

            {/* Call to Action */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Appel à l'action</label>
              <Input
                {...register('callToAction')}
                placeholder="Ex: En savoir plus, Acheter maintenant..."
              />
            </div>
          </div>
        </Card>

        {/* Preview de la campagne */}
        <PreviewCard
          headline={watch('headline')}
          caption={watch('caption')}
          callToAction={watch('callToAction')}
          mediaFiles={mediaFiles}
        />

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid || mediaFiles.length === 0}>
            Continuer vers l'audience
          </Button>
        </div>
      </form>

      {/* Modal de prévisualisation */}
      <MediaPreviewModal file={selectedForPreview} onClose={() => setSelectedForPreview(null)} />
    </div>
  );
}

// Composant pour la génération IA d'images
function AIImageGenerator({
  onGenerate,
  isLoading,
}: {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}) {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
      setIsOpen(false);
      setPrompt('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-primary/25 rounded-lg hover:border-primary/50 transition-colors cursor-pointer bg-primary/5">
          <Sparkles className="h-8 w-8 text-primary mb-2" />
          <span className="text-sm font-medium text-primary">Générer avec IA</span>
          <span className="text-xs text-muted-foreground">3 crédits</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Générer une image avec IA</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Décrivez l'image souhaitée</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Une photo professionnelle de bureau moderne avec des technologies innovantes..."
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleGenerate} disabled={!prompt.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour la génération IA de texte
function AITextGenerator({
  type,
  onGenerate,
  isLoading,
}: {
  type: string;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}) {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
      setIsOpen(false);
      setPrompt('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <Sparkles className="h-3 w-3 mr-1" />
          IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Générer du texte avec IA</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Décrivez le contenu souhaité</label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Ex: ${type === 'headline' ? 'Un titre accrocheur pour une promotion' : 'Une description engageante pour un produit tech'}`}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleGenerate} disabled={!prompt.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Carte pour afficher un fichier média
function MediaFileCard({
  file,
  index,
  onRemove,
  onPreview,
  onReorder,
}: {
  file: MediaFile;
  index: number;
  onRemove: () => void;
  onPreview: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group bg-card border rounded-lg overflow-hidden"
    >
      {/* Preview de l'image/vidéo */}
      <div className="aspect-video bg-muted relative">
        {file.type === 'image' ? (
          <img
            src={file.preview || file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={onPreview}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Handle de drag */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Informations du fichier */}
      <div className="p-3">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <div className="flex items-center justify-between mt-1">
          <Badge variant="outline" size="sm">
            {file.type === 'image' ? (
              <Image className="h-3 w-3 mr-1" />
            ) : (
              <Video className="h-3 w-3 mr-1" />
            )}
            {file.type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Modal de prévisualisation
function MediaPreviewModal({ file, onClose }: { file: MediaFile | null; onClose: () => void }) {
  if (!file) return null;

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {file.type === 'image' ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-full max-h-96 object-contain rounded-lg"
            />
          ) : (
            <video src={file.url} controls className="w-full max-h-96 rounded-lg" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Carte de prévisualisation
function PreviewCard({
  headline,
  caption,
  callToAction,
  mediaFiles,
}: {
  headline?: string;
  caption?: string;
  callToAction?: string;
  mediaFiles: MediaFile[];
}) {
  const firstMedia = mediaFiles[0];

  return (
    <Card className="p-6">
      <h4 className="font-medium mb-4">Aperçu de la campagne</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Version Mobile */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-muted-foreground">Mobile</h5>
          <div className="bg-background border rounded-lg p-4 max-w-sm mx-auto">
            {firstMedia && (
              <div className="aspect-video bg-muted rounded mb-3 overflow-hidden">
                {firstMedia.type === 'image' ? (
                  <img
                    src={firstMedia.preview || firstMedia.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}
            {headline && <h6 className="font-semibold text-sm mb-2">{headline}</h6>}
            {caption && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{caption}</p>
            )}
            {callToAction && (
              <Button size="sm" className="w-full">
                {callToAction}
              </Button>
            )}
          </div>
        </div>

        {/* Version Desktop */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-muted-foreground">Desktop</h5>
          <div className="bg-background border rounded-lg p-6">
            <div className="flex gap-4">
              {firstMedia && (
                <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                  {firstMedia.type === 'image' ? (
                    <img
                      src={firstMedia.preview || firstMedia.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1">
                {headline && <h6 className="font-semibold mb-2">{headline}</h6>}
                {caption && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{caption}</p>
                )}
                {callToAction && <Button size="sm">{callToAction}</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StepCreatives;

/**
 * Drawer for editing drafts with AI assistance
 * Features autosave, rich editing, AI generation, media upload, and validation
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDraftsStore } from '../stores/useDraftsStore';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/app/modules/ui/sheet';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Label } from '@/app/modules/ui/label';
import { Textarea } from '@/app/modules/ui/textarea';
import { Badge } from '@/app/modules/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { ScrollArea } from '@/app/modules/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/modules/ui/alert-dialog';
import { useToast } from '@/app/modules/ui/use-toast';
import {
  Save,
  X,
  Send,
  Copy,
  Clock,
  Sparkles,
  Wand2,
  Loader2,
  Plus,
  Image,
  Video,
  FileText,
  Calendar,
  Target,
} from 'lucide-react';
import { hasUnsavedChanges, getRelativeTime } from '../utils/draftHelpers';
import { validateDraftForPublish } from '../validators/draft.schema';
import type { Draft, CampaignChannel } from '../types/draft.types';
import type { CampaignObjective, CommunicationTone } from '../../create/types';

const CHANNELS: { value: CampaignChannel; label: string; icon: string }[] = [
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'google_ads', label: 'Google Ads', icon: '🔍' },
  { value: 'email', label: 'Email', icon: '📧' },
];

const TONES: { value: CommunicationTone; label: string }[] = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'friendly', label: 'Amical' },
  { value: 'casual', label: 'Décontracté' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'inspirational', label: 'Inspirant' },
];

const OBJECTIVES: { value: CampaignObjective; label: string; icon: string }[] = [
  { value: 'awareness', label: 'Notoriété', icon: '👁️' },
  { value: 'engagement', label: 'Engagement', icon: '💬' },
  { value: 'conversions', label: 'Conversion', icon: '🎯' },
  { value: 'traffic', label: 'Trafic', icon: '🚀' },
];

export function DraftEditorDrawer() {
  const {
    editingDrafts,
    updateEditingDraft,
    clearEditingDraft,
    updateDraft,
    publishDraft,
    duplicateDraft,
    lastAutosave,
  } = useDraftsStore();
  const { toast } = useToast();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [step, setStep] = useState<'basic' | 'content' | 'media'>('basic');
  const [newTag, setNewTag] = useState('');

  // Extended state for new fields - WITH CORRECT TYPES
  const [objective, setObjective] = useState<CampaignObjective>('awareness');
  const [tone, setTone] = useState<CommunicationTone>('professional');
  const [headline, setHeadline] = useState('');
  const [cta, setCta] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyMessage, setKeyMessage] = useState('');

  const draft = activeId ? editingDrafts[activeId] : null;
  const isOpen = !!draft;

  // Set active draft when editing starts
  useEffect(() => {
    const ids = Object.keys(editingDrafts);
    if (ids.length > 0 && !activeId) {
      setActiveId(ids[0]);
    } else if (ids.length === 0) {
      setActiveId(null);
    }
  }, [editingDrafts, activeId]);

  // Load extended fields when draft changes
  useEffect(() => {
    if (draft) {
      setObjective(draft.objective || 'awareness');
      setTone(draft.tone || 'professional');
      setHeadline(draft.headline || '');
      setCta(draft.cta || '');
      setTargetAudience(draft.targetAudience || '');
      setKeyMessage(draft.keyMessage || '');
    }
  }, [draft?.id]);

  // Autosave effect
  useEffect(() => {
    if (!draft || !activeId) return;

    const timer = setTimeout(() => {
      updateDraft(activeId, draft);
    }, 5000);

    return () => clearTimeout(timer);
  }, [draft, activeId, updateDraft]);

  const handleGenerateAI = async (field: 'title' | 'body' | 'headline' | 'cta') => {
    if (!draft) return;

    setIsGeneratingAI(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const prompts = {
        title: `Nouveau ${draft.channel} - ${objective}`,
        body: `Découvrez notre nouvelle offre exclusive ! 🎉\n\nNous sommes ravis de vous présenter une solution innovante qui va transformer votre expérience.\n\n✨ Avantages clés:\n• Innovation constante\n• Résultats mesurables\n• Support dédié\n\nRejoignez-nous dès aujourd'hui !`,
        headline: `Transformez votre ${objective} avec notre solution`,
        cta: objective === 'conversions' ? 'Acheter maintenant' : 'En savoir plus',
      };

      switch (field) {
        case 'title':
          updateField('title', prompts.title);
          break;
        case 'body':
          updateField('body', prompts.body);
          break;
        case 'headline':
          setHeadline(prompts.headline);
          updateField('headline', prompts.headline);
          break;
        case 'cta':
          setCta(prompts.cta);
          updateField('cta', prompts.cta);
          break;
      }

      toast({
        title: '✨ Contenu généré par IA',
        description: 'Le contenu a été généré avec succès !',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le contenu',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!draft || !activeId) return;

    // Check for unsaved changes
    const original = editingDrafts[activeId];
    if (original && hasUnsavedChanges(original, draft)) {
      setShowCloseConfirm(true);
    } else {
      clearEditingDraft(activeId);
      setActiveId(null);
      setStep('basic');
    }
  }, [draft, activeId, editingDrafts, clearEditingDraft]);

  const handleSave = async () => {
    if (!draft || !activeId) return;

    setIsSaving(true);
    try {
      await updateDraft(activeId, {
        ...draft,
        objective,
        tone,
        headline,
        cta,
        targetAudience,
        keyMessage,
      });
      toast({
        title: 'Brouillon sauvegardé',
        description: 'Vos modifications ont été enregistrées.',
      });
    } catch (error) {
      toast({
        title: 'Échec de la sauvegarde',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!draft || !activeId) return;

    const validation = validateDraftForPublish(draft);
    if (!validation.isValid) {
      toast({
        title: 'Impossible de publier',
        description: (validation.errors as { message: string }[]).map((e) => e.message).join(', '),
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);
    try {
      await publishDraft(activeId);
      toast({
        title: 'Brouillon publié',
        description: 'Votre contenu a été publié avec succès.',
      });
      clearEditingDraft(activeId);
      setActiveId(null);
      setShowPublishConfirm(false);
    } catch (error) {
      toast({
        title: 'Échec de la publication',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDuplicate = async () => {
    if (!draft || !activeId) return;

    try {
      const duplicated = await duplicateDraft(activeId);
      toast({
        title: 'Brouillon dupliqué',
        description: 'Une copie a été créée.',
      });
      setActiveId(duplicated.id);
    } catch (error) {
      toast({
        title: 'Échec de la duplication',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  const updateField = <K extends keyof Draft>(field: K, value: Draft[K]) => {
    if (!activeId) return;
    updateEditingDraft(activeId, { [field]: value });
  };

  const handleAddTag = () => {
    if (!draft || !activeId) return;
    if (newTag && !draft.tags.includes(newTag)) {
      updateField('tags', [...draft.tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (!draft || !activeId) return;
    updateField(
      'tags',
      draft.tags.filter((t) => t !== tag)
    );
  };

  if (!draft) return null;

  const lastSaved = activeId ? lastAutosave[activeId] : undefined;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent className="sm:max-w-3xl overflow-hidden flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Modifier le brouillon
            </SheetTitle>
            <SheetDescription>
              Modifiez votre brouillon. Utilisez l'IA pour optimiser votre contenu.
              {lastSaved && ` • Dernière sauvegarde ${getRelativeTime(lastSaved)}`}
            </SheetDescription>
          </SheetHeader>

          <Tabs value={step} onValueChange={(v) => setStep(v as typeof step)} className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">1. Informations</TabsTrigger>
              <TabsTrigger value="content">2. Contenu</TabsTrigger>
              <TabsTrigger value="media">3. Médias & Finalisation</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)] mt-4">
              <TabsContent value="basic" className="space-y-6 p-1">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    Titre du brouillon *
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateAI('title')}
                      disabled={isGeneratingAI}
                      className="h-6 px-2"
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      IA
                    </Button>
                  </Label>
                  <Input
                    id="title"
                    value={draft.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Ex: Lancement produit printemps 2024"
                  />
                </div>

                {/* Channel */}
                <div className="space-y-2">
                  <Label htmlFor="channel">Canal de diffusion *</Label>
                  <Select
                    value={draft.channel}
                    onValueChange={(v) => updateField('channel', v as CampaignChannel)}
                  >
                    <SelectTrigger id="channel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((ch) => (
                        <SelectItem key={ch.value} value={ch.value}>
                          <span className="flex items-center gap-2">
                            {ch.icon} {ch.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Objective */}
                <div className="space-y-2">
                  <Label>Objectif de la campagne</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {OBJECTIVES.map((obj) => (
                      <button
                        key={obj.value}
                        type="button"
                        onClick={() => {
                          setObjective(obj.value);
                          updateField('objective', obj.value);
                        }}
                        className={`p-4 border rounded-lg text-left transition-all hover:border-primary ${
                          objective === obj.value ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{obj.icon}</span>
                          <span className="font-medium">{obj.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="tone">Ton de communication</Label>
                  <Select
                    value={tone}
                    onValueChange={(v) => {
                      const newTone = v as CommunicationTone;
                      setTone(newTone);
                      updateField('tone', newTone);
                    }}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience">Audience cible</Label>
                  <Textarea
                    id="audience"
                    value={targetAudience}
                    onChange={(e) => {
                      setTargetAudience(e.target.value);
                      updateField('targetAudience', e.target.value);
                    }}
                    placeholder="Ex: Professionnels du marketing, 25-45 ans, intéressés par l'innovation"
                    rows={3}
                  />
                </div>

                {/* Key Message */}
                <div className="space-y-2">
                  <Label htmlFor="keyMessage">Message clé</Label>
                  <Textarea
                    id="keyMessage"
                    value={keyMessage}
                    onChange={(e) => {
                      setKeyMessage(e.target.value);
                      updateField('keyMessage', e.target.value);
                    }}
                    placeholder="Ex: Augmentez votre productivité de 40% avec notre solution"
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6 p-1">
                {/* Headline */}
                <div className="space-y-2">
                  <Label htmlFor="headline" className="flex items-center gap-2">
                    Titre accrocheur
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateAI('headline')}
                      disabled={isGeneratingAI}
                      className="h-6 px-2"
                    >
                      {isGeneratingAI ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Wand2 className="h-3 w-3 mr-1" />
                      )}
                      Générer avec IA
                    </Button>
                  </Label>
                  <Input
                    id="headline"
                    value={headline}
                    onChange={(e) => {
                      setHeadline(e.target.value);
                      updateField('headline', e.target.value);
                    }}
                    placeholder="Ex: Découvrez la solution qui révolutionne votre quotidien"
                  />
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body" className="flex items-center gap-2">
                    Contenu principal *
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateAI('body')}
                      disabled={isGeneratingAI}
                      className="h-6 px-2"
                    >
                      {isGeneratingAI ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Wand2 className="h-3 w-3 mr-1" />
                      )}
                      Générer avec IA
                    </Button>
                  </Label>
                  <Textarea
                    id="body"
                    value={draft.body}
                    onChange={(e) => updateField('body', e.target.value)}
                    placeholder="Écrivez votre contenu ici ou générez-le avec l'IA..."
                    rows={12}
                    className="resize-none font-mono text-sm"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{draft.body.length} caractères</span>
                    {draft.channel && (
                      <span>
                        {draft.channel === 'twitter' && 'Max: 280 caractères'}
                        {draft.channel === 'instagram' && 'Max: 2,200 caractères'}
                        {draft.channel === 'facebook' && 'Max: 63,206 caractères'}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <Label htmlFor="cta" className="flex items-center gap-2">
                    Appel à l'action (CTA)
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateAI('cta')}
                      disabled={isGeneratingAI}
                      className="h-6 px-2"
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      IA
                    </Button>
                  </Label>
                  <Input
                    id="cta"
                    value={cta}
                    onChange={(e) => {
                      setCta(e.target.value);
                      updateField('cta', e.target.value);
                    }}
                    placeholder="Ex: Découvrir maintenant, En savoir plus, S'inscrire"
                  />
                </div>

                {/* AI Suggestions Panel */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Suggestions IA</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Utilisez des émojis pour plus d'engagement 🎯</li>
                    <li>• Commencez par une question pour capter l'attention</li>
                    <li>• Incluez des chiffres ou statistiques percutants</li>
                    <li>• Terminez par un CTA clair et action-oriented</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 p-1">
                {/* Media Upload with AI Generation */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Médias
                    <Badge variant="secondary" className="ml-auto">
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA disponible
                    </Badge>
                  </Label>

                  {/* AI Image Generation */}
                  <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Générer une image avec l'IA</span>
                    </div>
                    <Textarea
                      placeholder="Décrivez l'image que vous souhaitez générer... Ex: Une photo professionnelle d'un bureau moderne avec des personnes travaillant sur des ordinateurs, lumière naturelle, style minimaliste"
                      rows={3}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Select defaultValue="realistic">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realistic">Réaliste</SelectItem>
                          <SelectItem value="artistic">Artistique</SelectItem>
                          <SelectItem value="minimal">Minimaliste</SelectItem>
                          <SelectItem value="abstract">Abstrait</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="1:1">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">Carré (1:1)</SelectItem>
                          <SelectItem value="16:9">Paysage (16:9)</SelectItem>
                          <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                          <SelectItem value="4:3">Standard (4:3)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        className="flex-1"
                        disabled={isGeneratingAI}
                        onClick={async () => {
                          setIsGeneratingAI(true);
                          try {
                            await new Promise((resolve) => setTimeout(resolve, 3000));
                            toast({
                              title: '✨ Image générée',
                              description: 'Votre image a été générée avec succès !',
                            });
                          } catch (error) {
                            toast({
                              title: 'Erreur',
                              description: "Impossible de générer l'image",
                              variant: 'destructive',
                            });
                          } finally {
                            setIsGeneratingAI(false);
                          }
                        }}
                      >
                        {isGeneratingAI ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Générer l'image
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      💡 Astuce: Soyez précis dans votre description pour de meilleurs résultats
                    </div>
                  </div>

                  {/* Upload Options */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <button
                      type="button"
                      className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors group"
                    >
                      <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                        <Image className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Importer une image
                      </span>
                    </button>
                    <button
                      type="button"
                      className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors group"
                    >
                      <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                        <Video className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Importer une vidéo
                      </span>
                    </button>
                    <button
                      type="button"
                      className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors group"
                    >
                      <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                        <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Importer un document
                      </span>
                    </button>
                  </div>
                </div>

                {/* Existing Media with AI Enhancement Options */}
                {draft.media && draft.media.length > 0 && (
                  <div className="space-y-2">
                    <Label>Médias existants ({draft.media.length})</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {draft.media.map((media: any) => (
                        <div
                          key={media.id}
                          className="group relative aspect-video rounded-lg overflow-hidden border hover:border-primary transition-all"
                        >
                          <img
                            src={media.thumbnail || media.url}
                            alt={media.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8"
                              onClick={() => {
                                toast({
                                  title: '✨ Optimisation IA',
                                  description: 'Amélioration de la qualité en cours...',
                                });
                              }}
                            >
                              <Wand2 className="h-3 w-3 mr-1" />
                              Optimiser
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8"
                              onClick={() => {
                                toast({
                                  title: '🎨 Génération de variantes',
                                  description: 'Création de variantes en cours...',
                                });
                              }}
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              Variantes
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          {media.type === 'image' && (
                            <Badge className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm">
                              <Image className="h-3 w-3 mr-1" />
                              Image
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Media Suggestions */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Suggestions IA pour les médias</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        toast({
                          title: '🎨 Génération en cours',
                          description: "Création d'une image de couverture...",
                        });
                      }}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Image de couverture
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        toast({
                          title: '📊 Génération en cours',
                          description: "Création d'une infographie...",
                        });
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Infographie
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        toast({
                          title: '🎬 Génération en cours',
                          description: "Création d'une vidéo courte...",
                        });
                      }}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Vidéo courte
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        toast({
                          title: '🎨 Génération en cours',
                          description: "Création d'une bannière...",
                        });
                      }}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Bannière publicitaire
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    💡 Les suggestions sont basées sur votre contenu, canal et objectif
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Ajouter un tag..."
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {draft.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Programmer la publication
                  </Label>
                  {draft.scheduledFor ? (
                    <div className="text-sm text-muted-foreground">
                      {new Date(draft.scheduledFor).toLocaleString()}
                    </div>
                  ) : (
                    <Input type="datetime-local" />
                  )}
                </div>

                {/* Campaign */}
                {draft.campaign && (
                  <div className="space-y-2">
                    <Label>Campagne associée</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">{draft.campaign.name}</div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Résumé
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Canal:</span>{' '}
                      <span className="font-medium">
                        {CHANNELS.find((c) => c.value === draft.channel)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Objectif:</span>{' '}
                      <span className="font-medium">
                        {OBJECTIVES.find((o) => o.value === objective)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ton:</span>{' '}
                      <span className="font-medium">
                        {TONES.find((t) => t.value === tone)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tags:</span>{' '}
                      <span className="font-medium">{draft.tags.length}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
            {step !== 'media' && (
              <Button
                onClick={() => setStep(step === 'basic' ? 'content' : 'media')}
                className="flex-1"
              >
                Suivant
              </Button>
            )}
            {step === 'media' && (
              <>
                <Button onClick={handleSave} disabled={isSaving} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button variant="outline" onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Dupliquer
                </Button>
                <Button
                  variant="default"
                  onClick={() => setShowPublishConfirm(true)}
                  disabled={isPublishing}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publier
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Close Confirmation */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifications non sauvegardées</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez des modifications non sauvegardées. Voulez-vous sauvegarder avant de fermer
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (activeId) clearEditingDraft(activeId);
                setActiveId(null);
                setShowCloseConfirm(false);
                setStep('basic');
              }}
            >
              Abandonner
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleSave();
                if (activeId) clearEditingDraft(activeId);
                setActiveId(null);
                setShowCloseConfirm(false);
                setStep('basic');
              }}
            >
              Sauvegarder & Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish Confirmation */}
      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publier le brouillon ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cela publiera votre contenu sur {draft.channel}. Cette action ne peut pas être
              annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? 'Publication...' : 'Publier'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

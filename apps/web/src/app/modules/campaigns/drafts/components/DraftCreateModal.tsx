/**
 * Modal for creating new drafts with AI assistance
 * Provides rich creation experience with AI suggestions
 */

'use client';

import { useState } from 'react';
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
import { Badge } from '@/app/modules/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { ScrollArea } from '@/app/modules/ui/scroll-area';
import {
  Sparkles,
  Wand2,
  Loader2,
  Plus,
  X,
  Image,
  Video,
  FileText,
  Calendar,
  Target,
} from 'lucide-react';
import { useDraftsStore } from '../stores/useDraftsStore';
import { useToast } from '@/app/modules/ui/use-toast';
import { CampaignChannel } from '../types/draft.types';

interface DraftCreateModalProps {
  open: boolean;
  onClose: () => void;
}

const CHANNELS: { value: CampaignChannel; label: string; icon: string }[] = [
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'google_ads', label: 'Google Ads', icon: '🔍' },
  { value: 'email', label: 'Email', icon: '📧' },
];

const TONES = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'friendly', label: 'Amical' },
  { value: 'casual', label: 'Décontracté' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'inspirational', label: 'Inspirant' },
];

const OBJECTIVES = [
  { value: 'awareness', label: 'Notoriété', icon: '👁️' },
  { value: 'engagement', label: 'Engagement', icon: '💬' },
  { value: 'conversion', label: 'Conversion', icon: '🎯' },
  { value: 'traffic', label: 'Trafic', icon: '🚀' },
];

export function DraftCreateModal({ open, onClose }: DraftCreateModalProps) {
  const { createDraft } = useDraftsStore();
  const { toast } = useToast();

  const [step, setStep] = useState<'basic' | 'content' | 'media'>('basic');
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<CampaignChannel>('facebook');
  const [objective, setObjective] = useState('awareness');
  const [tone, setTone] = useState('professional');
  const [body, setBody] = useState('');
  const [headline, setHeadline] = useState('');
  const [cta, setCta] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyMessage, setKeyMessage] = useState('');

  const handleGenerateAI = async (field: 'title' | 'body' | 'headline' | 'cta') => {
    setIsGeneratingAI(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const prompts = {
        title: `Nouveau ${channel} - ${objective}`,
        body: `Découvrez notre nouvelle offre exclusive ! 🎉\n\nNous sommes ravis de vous présenter une solution innovante qui va transformer votre expérience.\n\n✨ Avantages clés:\n• Innovation constante\n• Résultats mesurables\n• Support dédié\n\nRejoignez-nous dès aujourd'hui !`,
        headline: `Transformez votre ${objective} avec notre solution`,
        cta: objective === 'conversion' ? 'Acheter maintenant' : 'En savoir plus',
      };

      switch (field) {
        case 'title':
          setTitle(prompts.title);
          break;
        case 'body':
          setBody(prompts.body);
          break;
        case 'headline':
          setHeadline(prompts.headline);
          break;
        case 'cta':
          setCta(prompts.cta);
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

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleCreate = async () => {
    if (!title || !body) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir le titre et le contenu',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      await createDraft({
        title,
        body,
        channel,
        tags,
      });

      toast({
        title: 'Brouillon créé',
        description: 'Votre brouillon a été créé avec succès !',
      });

      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le brouillon',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setChannel('facebook');
    setObjective('awareness');
    setTone('professional');
    setBody('');
    setHeadline('');
    setCta('');
    setTags([]);
    setTargetAudience('');
    setKeyMessage('');
    setStep('basic');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Créer un nouveau brouillon
          </DialogTitle>
          <DialogDescription>
            Utilisez l'IA pour générer du contenu optimisé pour vos campagnes
          </DialogDescription>
        </DialogHeader>

        <Tabs value={step} onValueChange={(v) => setStep(v as typeof step)} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">1. Informations</TabsTrigger>
            <TabsTrigger value="content">2. Contenu</TabsTrigger>
            <TabsTrigger value="media">3. Médias & Finalisation</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Lancement produit printemps 2024"
                />
              </div>

              {/* Channel */}
              <div className="space-y-2">
                <Label htmlFor="channel">Canal de diffusion *</Label>
                <Select value={channel} onValueChange={(v) => setChannel(v as CampaignChannel)}>
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
                      onClick={() => setObjective(obj.value)}
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
                <Select value={tone} onValueChange={setTone}>
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
                  onChange={(e) => setTargetAudience(e.target.value)}
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
                  onChange={(e) => setKeyMessage(e.target.value)}
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
                  onChange={(e) => setHeadline(e.target.value)}
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
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Écrivez votre contenu ici ou générez-le avec l'IA..."
                  rows={12}
                  className="resize-none font-mono text-sm"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{body.length} caractères</span>
                  {channel && (
                    <span>
                      {channel === 'twitter' && 'Max: 280 caractères'}
                      {channel === 'instagram' && 'Max: 2,200 caractères'}
                      {channel === 'facebook' && 'Max: 63,206 caractères'}
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
                  onChange={(e) => setCta(e.target.value)}
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
                  {tags.map((tag) => (
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
                <Input type="datetime-local" />
              </div>

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
                      {CHANNELS.find((c) => c.value === channel)?.label}
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
                    <span className="font-medium">{tags.length}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Annuler
          </Button>
          {step !== 'media' && (
            <Button onClick={() => setStep(step === 'basic' ? 'content' : 'media')}>Suivant</Button>
          )}
          {step === 'media' && (
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer le brouillon'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Panneau de droite pour les détails et édition des campagnes
 * Onglets : Aperçu, Modification, Métriques, Tests A/B
 */

'use client';

import { useState, useCallback } from 'react';
import {
  X,
  Save,
  Copy,
  Trash2,
  Play,
  Pause,
  Calendar,
  Clock,
  DollarSign,
  Target,
  Eye,
  MousePointer,
  TrendingUp,
  Settings,
  BarChart3,
  Users,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Textarea } from '@/app/modules/ui/textarea';
import { Badge } from '@/app/modules/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { Separator } from '@/app/modules/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import type { Campaign } from '../types';

interface CampaignRightPaneProps {
  campaign: Campaign | null | undefined;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Campaign>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  className?: string;
}

// Configuration des statuts et canaux
const statusConfig: Record<Campaign['status'], { color: string; label: string }> = {
  active: { color: 'bg-green-100 text-green-800', label: 'Active' },
  paused: { color: 'bg-yellow-100 text-yellow-800', label: 'En pause' },
  scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Programmée' },
  completed: { color: 'bg-gray-100 text-gray-800', label: 'Terminée' },
  failed: { color: 'bg-red-100 text-red-800', label: 'Échouée' },
  draft: { color: 'bg-purple-100 text-purple-800', label: 'Brouillon' },
  archived: { color: 'bg-gray-200 text-gray-500', label: 'Archivée' },
};

const channelConfig = {
  facebook: { icon: '📘', label: 'Facebook' },
  instagram: { icon: '📷', label: 'Instagram' },
  whatsapp: { icon: '💬', label: 'WhatsApp' },
  email: { icon: '📧', label: 'Email' },
  sms: { icon: '💬', label: 'SMS' },
};

export default function CampaignRightPane({
  campaign,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
  className = '',
}: CampaignRightPaneProps) {
  // Valeurs par défaut pour une nouvelle campagne
  const getDefaultCampaign = (): Partial<Campaign> => ({
    id: '',
    name: '',
    description: '',
    status: 'draft',
    channel: 'email',
    type: 'promotion',
    objective: 'conversions',
    owner: '',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    budget: {
      total: 0,
      spent: 0,
      daily: 0,
      currency: 'EUR',
      bidStrategy: 'lowest_cost',
    },
    schedule: {
      startAt: '',
      endAt: '',
      timezone: 'Europe/Paris',
    },
    metrics: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      conversionRate: 0,
      reach: 0,
      frequency: 0,
      costPerClick: 0,
      costPerConversion: 0,
      returnOnAdSpend: 0,
    },
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(campaign?.status === 'draft' || !campaign);
  const [editedCampaign, setEditedCampaign] = useState<Campaign | Partial<Campaign>>(
    campaign || getDefaultCampaign()
  );
  const [isSaving, setIsSaving] = useState(false);

  // Gestion de la sauvegarde
  const handleSave = useCallback(async () => {
    if (!editedCampaign) return;
    try {
      setIsSaving(true);
      await onSave(campaign?.id || '', editedCampaign);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  }, [campaign?.id, editedCampaign, onSave]);

  // Gestion des modifications
  const handleFieldChange = useCallback((field: string, value: any) => {
    setEditedCampaign((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Gestion des modifications nested
  const handleNestedFieldChange = useCallback((parentField: string, field: string, value: any) => {
    setEditedCampaign((prev) => {
      if (!prev) return prev;
      const parentValue = prev[parentField as keyof Campaign];
      return {
        ...prev,
        [parentField]: {
          ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
          [field]: value,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Annuler les modifications
  const handleCancel = useCallback(() => {
    setEditedCampaign(campaign || getDefaultCampaign());
    setIsEditing(false);
  }, [campaign]);

  // Format des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculs pour les métriques
  const budgetProgress =
    campaign?.budget?.total && campaign.budget.total > 0
      ? ((campaign.budget?.spent ?? 0) / campaign.budget.total) * 100
      : 0;
  const remainingBudget = (campaign?.budget?.total ?? 0) - (campaign?.budget?.spent ?? 0);
  const estimatedDaysRemaining =
    (campaign?.budget?.daily ?? 0) > 0 && remainingBudget > 0
      ? Math.ceil(remainingBudget / (campaign?.budget?.daily ?? 1))
      : 0;

  return (
    <Card className={`h-fit ${className}`}>
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {campaign?.channel && (
                <span className="text-lg">{channelConfig[campaign.channel]?.icon || '📄'}</span>
              )}
              <Badge
                className={
                  statusConfig[campaign?.status || 'draft']?.color ?? 'bg-gray-100 text-gray-800'
                }
              >
                {statusConfig[campaign?.status || 'draft']?.label ??
                  campaign?.status ??
                  'Brouillon'}
              </Badge>
            </div>
            <CardTitle className="text-lg truncate">
              {campaign?.name || 'Nouvelle campagne'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {campaign?.owner && campaign?.updatedAt ? (
                <>
                  Par {campaign.owner} • Modifiée {formatDate(campaign.updatedAt)}
                </>
              ) : campaign?.createdAt ? (
                <>Créée {formatDate(campaign.createdAt)}</>
              ) : (
                'Campagne en cours de création'
              )}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center space-x-2 pt-3">
          {!isEditing ? (
            <>
              {campaign?.status === 'active' ? (
                <Button variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : campaign?.status === 'paused' || campaign?.status === 'draft' ? (
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Lancer
                </Button>
              ) : null}

              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Modifier
              </Button>

              {campaign?.id && (
                <Button variant="outline" size="sm" onClick={onDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Dupliquer
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>

              <Button variant="outline" size="sm" onClick={handleCancel}>
                Annuler
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="edit">Édition</TabsTrigger>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="tests">Tests A/B</TabsTrigger>
          </TabsList>

          {/* Onglet Aperçu */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Informations générales */}
            <div>
              <h4 className="font-semibold mb-3">Informations générales</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">
                    {campaign?.type ? campaign.type.replace('_', ' ') : 'Non défini'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objectif</span>
                  <span className="font-medium capitalize">
                    {campaign?.objective ? campaign.objective.replace('_', ' ') : 'Non défini'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Canal</span>
                  <span className="font-medium">
                    {campaign?.channel
                      ? channelConfig[campaign.channel]?.label || campaign.channel
                      : 'Non défini'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créée le</span>
                  <span className="font-medium">
                    {campaign?.createdAt ? formatDate(campaign.createdAt) : 'Non défini'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {campaign?.description && (
              <>
                <div>
                  <h4 className="font-semibold mb-3">Description</h4>
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                </div>
                <Separator />
              </>
            )}

            {/* Programmation */}
            <div>
              <h4 className="font-semibold mb-3">Programmation</h4>
              <div className="space-y-3 text-sm">
                {campaign?.schedule?.startAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Début :</span>
                    <span className="font-medium">{formatDate(campaign.schedule.startAt)}</span>
                  </div>
                )}
                {campaign?.schedule?.endAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fin :</span>
                    <span className="font-medium">{formatDate(campaign.schedule.endAt)}</span>
                  </div>
                )}
                {campaign?.schedule?.timezone && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fuseau :</span>
                    <span className="font-medium">{campaign.schedule.timezone}</span>
                  </div>
                )}
                {!campaign?.schedule?.startAt && (
                  <div className="text-sm text-muted-foreground">Aucune programmation définie</div>
                )}
              </div>
            </div>

            <Separator />

            {/* Budget */}
            <div>
              <h4 className="font-semibold mb-3">Budget</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total</span>
                    <div className="font-semibold text-lg">
                      {(campaign?.budget?.total ?? 0).toLocaleString('fr-FR')} €
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dépensé</span>
                    <div className="font-semibold text-lg">
                      {(campaign?.budget?.spent ?? 0).toLocaleString('fr-FR')} €
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{budgetProgress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-brand-mid rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget quotidien</span>
                    <span className="font-medium">{campaign?.budget?.daily ?? 0} €/jour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Restant</span>
                    <span className="font-medium">{remainingBudget.toFixed(2)} €</span>
                  </div>
                  {estimatedDaysRemaining > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jours restants estimés</span>
                      <span className="font-medium">{estimatedDaysRemaining} jours</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            {campaign?.tags && campaign.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Onglet Édition */}
          <TabsContent value="edit" className="space-y-6 mt-6">
            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className="text-sm font-medium">Nom de la campagne</label>
                <Input
                  value={editedCampaign?.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editedCampaign?.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Statut */}
              <div>
                <label className="text-sm font-medium">Statut</label>
                <Select
                  value={editedCampaign?.status || 'draft'}
                  onValueChange={(value) => handleFieldChange('status', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={editedCampaign?.type || 'promotion'}
                  onValueChange={(value) => handleFieldChange('type', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="awareness">Notoriété</SelectItem>
                    <SelectItem value="traffic">Trafic</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="lead_generation">Génération de leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget total */}
              <div>
                <label className="text-sm font-medium">Budget total (€)</label>
                <Input
                  type="number"
                  value={editedCampaign?.budget?.total ?? 0}
                  onChange={(e) =>
                    handleNestedFieldChange('budget', 'total', parseInt(e.target.value))
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              {/* Budget quotidien */}
              <div>
                <label className="text-sm font-medium">Budget quotidien (€)</label>
                <Input
                  type="number"
                  value={editedCampaign?.budget?.daily ?? 0}
                  onChange={(e) =>
                    handleNestedFieldChange('budget', 'daily', parseInt(e.target.value))
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              {/* Date de début */}
              <div>
                <label className="text-sm font-medium">Date de début</label>
                <Input
                  type="datetime-local"
                  value={
                    editedCampaign?.schedule?.startAt
                      ? new Date(editedCampaign.schedule.startAt).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    handleNestedFieldChange(
                      'schedule',
                      'startAt',
                      new Date(e.target.value).toISOString()
                    )
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              {/* Date de fin */}
              <div>
                <label className="text-sm font-medium">Date de fin (optionnelle)</label>
                <Input
                  type="datetime-local"
                  value={
                    editedCampaign?.schedule?.endAt
                      ? new Date(editedCampaign.schedule.endAt).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    handleNestedFieldChange(
                      'schedule',
                      'endAt',
                      e.target.value ? new Date(e.target.value).toISOString() : undefined
                    )
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          {/* Onglet Métriques */}
          <TabsContent value="metrics" className="space-y-6 mt-6">
            {campaign?.metrics ? (
              <>
                {/* Métriques principales */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">
                        {campaign.metrics.impressions?.toLocaleString('fr-FR') || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Impressions</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <MousePointer className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">
                        {campaign.metrics.clicks?.toLocaleString('fr-FR') || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Clics</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">
                        {campaign.metrics.ctr?.toFixed(2) || '0.00'}%
                      </div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold">
                        {campaign.metrics.conversions?.toLocaleString('fr-FR') || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Conversions</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Métriques détaillées */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Portée</span>
                    <span className="font-medium">
                      {campaign.metrics.reach?.toLocaleString('fr-FR') || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taux de conversion</span>
                    <span className="font-medium">
                      {campaign.metrics.conversionRate?.toFixed(2) || '0.00'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coût par clic</span>
                    <span className="font-medium">
                      {campaign.metrics.costPerClick?.toFixed(2) || '0.00'} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coût par conversion</span>
                    <span className="font-medium">
                      {campaign.metrics.costPerConversion?.toFixed(2) || '0.00'} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROAS</span>
                    <span className="font-medium">
                      {campaign.metrics.returnOnAdSpend?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fréquence</span>
                    <span className="font-medium">
                      {campaign.metrics.frequency?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-semibold mb-2">Aucune métrique disponible</h4>
                <p className="text-sm text-muted-foreground">
                  Les métriques seront disponibles une fois la campagne lancée.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Onglet Tests A/B */}
          <TabsContent value="tests" className="space-y-6 mt-6">
            {campaign?.abTest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{campaign.abTest.testName}</h4>
                  <Badge
                    className={
                      campaign.abTest.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }
                  >
                    {campaign.abTest.status === 'completed' ? 'Terminé' : 'En cours'}
                  </Badge>
                </div>

                {campaign.abTest.status === 'completed' && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Gagnant :{' '}
                        {campaign.abTest.variants?.find((v) => v.id === campaign.abTest?.winner)
                          ?.name || 'Non déterminé'}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Confiance : {campaign.abTest.confidence || 0}%
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {campaign.abTest.variants?.map((variant) => (
                    <Card
                      key={variant.id}
                      className={
                        variant.id === campaign.abTest?.winner ? 'ring-2 ring-green-500' : ''
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{variant.name}</h5>
                          <span className="text-sm text-muted-foreground">
                            {variant.percentage}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="font-medium">
                              {variant.impressions?.toLocaleString('fr-FR') || '0'}
                            </div>
                            <div className="text-muted-foreground">Impressions</div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {variant.clicks?.toLocaleString('fr-FR') || '0'}
                            </div>
                            <div className="text-muted-foreground">Clics</div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {variant.conversions?.toLocaleString('fr-FR') || '0'}
                            </div>
                            <div className="text-muted-foreground">Conversions</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-sm text-muted-foreground">Aucune variante configurée</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-semibold mb-2">Aucun test A/B configuré</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configurez un test A/B pour optimiser les performances de votre campagne.
                </p>
                <Button variant="outline" size="sm">
                  Configurer un test A/B
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions de suppression */}
        {campaign?.id && (
          <div className="pt-6 border-t">
            <Button variant="destructive" size="sm" onClick={onDelete} className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer la campagne
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

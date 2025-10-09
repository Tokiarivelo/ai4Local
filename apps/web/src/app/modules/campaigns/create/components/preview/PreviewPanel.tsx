'use client';

import React, { useState } from 'react';
import { X, Monitor, Smartphone, Tablet, Eye, Share2, Download } from 'lucide-react';

import { Button } from '@/app/modules/ui/button';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';

import type { CampaignDraft } from '../../types';
import { mockChannelConfig } from '../../mocks/campaign-create.mock';

interface PreviewPanelProps {
  /**
   * Données de la campagne à prévisualiser
   */
  campaignData: Partial<CampaignDraft>;

  /**
   * Callback appelé lors de la fermeture
   */
  onClose: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

/**
 * Panneau de prévisualisation de la campagne
 * Affiche un aperçu sur différents appareils et canaux
 */
export function PreviewPanel({ campaignData, onClose }: PreviewPanelProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [selectedChannel, setSelectedChannel] = useState<string>(
    campaignData.channels?.[0] || 'email'
  );

  const channels = campaignData.channels || [];
  const creatives = campaignData.creatives || [];
  const primaryCreative = creatives[0];

  // Dimensions selon l'appareil
  const getDeviceDimensions = (device: DeviceType) => {
    switch (device) {
      case 'desktop':
        return { width: 'w-full', height: 'h-96', maxWidth: 'max-w-4xl' };
      case 'tablet':
        return { width: 'w-2/3', height: 'h-80', maxWidth: 'max-w-2xl' };
      case 'mobile':
        return { width: 'w-80', height: 'h-96', maxWidth: 'max-w-sm' };
    }
  };

  const dimensions = getDeviceDimensions(selectedDevice);

  // Rendu du créatif selon le canal
  const renderCreativePreview = () => {
    if (!primaryCreative) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Aucun créatif à prévisualiser</p>
          </div>
        </div>
      );
    }

    switch (selectedChannel) {
      case 'email':
        return <EmailPreview creative={primaryCreative} campaign={campaignData} />;
      case 'facebook':
      case 'instagram':
        return (
          <SocialPreview
            creative={primaryCreative}
            campaign={campaignData}
            channel={selectedChannel}
          />
        );
      case 'sms':
      case 'whatsapp':
        return (
          <MessagePreview
            creative={primaryCreative}
            campaign={campaignData}
            channel={selectedChannel}
          />
        );
      default:
        return <DefaultPreview creative={primaryCreative} campaign={campaignData} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Aperçu de la campagne</h2>
            <p className="text-sm text-muted-foreground">
              {campaignData.name || 'Campagne sans nom'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar des options */}
          <div className="w-80 p-6 border-r bg-gray-50 dark:bg-gray-800/50">
            {/* Sélection d'appareil */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Appareil</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'desktop' as const, icon: Monitor, label: 'Desktop' },
                  { type: 'tablet' as const, icon: Tablet, label: 'Tablette' },
                  { type: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
                ].map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant={selectedDevice === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDevice(type)}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Sélection de canal */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Canal</h3>
              <div className="space-y-2">
                {channels.map((channel) => (
                  <Button
                    key={channel}
                    variant={selectedChannel === channel ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedChannel(channel)}
                    className="w-full justify-start"
                  >
                    <span className="mr-2">
                      {mockChannelConfig[channel as keyof typeof mockChannelConfig]?.icon || '📱'}
                    </span>
                    {mockChannelConfig[channel as keyof typeof mockChannelConfig]?.name || channel}
                  </Button>
                ))}
              </div>
            </div>

            {/* Informations de la campagne */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Informations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objectif:</span>
                    <Badge variant="outline" size="sm">
                      {campaignData.objective || 'Non défini'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Canaux:</span>
                    <span>{channels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créatifs:</span>
                    <span>{creatives.length}</span>
                  </div>
                </div>
              </div>

              {campaignData.budget && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Budget</h4>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{campaignData.budget.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Montant:</span>
                      <span>
                        {campaignData.budget.amount} {campaignData.budget.currency}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Zone de prévisualisation */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-center h-full">
              <div
                className={`${dimensions.width} ${dimensions.height} ${dimensions.maxWidth} mx-auto`}
              >
                <div className="h-full border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900">
                  {renderCreativePreview()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Prévisualisation email
 */
function EmailPreview({ creative, campaign }: { creative: any; campaign: Partial<CampaignDraft> }) {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm h-full overflow-auto">
        {/* Header email */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{campaign.name || 'Campagne'}</p>
              <p className="text-sm text-muted-foreground">contact@ai4local.com</p>
            </div>
            <div className="text-sm text-muted-foreground">Maintenant</div>
          </div>
        </div>

        {/* Contenu email */}
        <div className="p-6">
          {creative.type === 'image' && creative.url && (
            <img src={creative.url} alt={creative.alt} className="w-full rounded-lg mb-4" />
          )}

          <h1 className="text-2xl font-bold mb-4">{creative.title}</h1>
          <p className="text-muted-foreground mb-6">{creative.description}</p>

          <Button className="mb-4">{creative.callToAction || 'En savoir plus'}</Button>

          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>© 2024 AI4Local. Tous droits réservés.</p>
            <p>Se désabonner | Gérer les préférences</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Prévisualisation réseaux sociaux
 */
function SocialPreview({
  creative,
  campaign,
  channel,
}: {
  creative: any;
  campaign: Partial<CampaignDraft>;
  channel: string;
}) {
  const isInstagram = channel === 'instagram';

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg h-full overflow-auto">
        {/* Header du post */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <p className="font-medium">AI4Local</p>
              <p className="text-sm text-muted-foreground">Sponsorisé</p>
            </div>
          </div>
        </div>

        {/* Contenu du post */}
        <div>
          {creative.type === 'image' && creative.url && (
            <img
              src={creative.url}
              alt={creative.alt}
              className={`w-full ${isInstagram ? 'aspect-square' : 'max-h-80'} object-cover`}
            />
          )}

          <div className="p-4">
            <p className="mb-3">{creative.title}</p>
            {creative.description && (
              <p className="text-muted-foreground text-sm mb-3">{creative.description}</p>
            )}

            <Button size="sm" className="w-full">
              {creative.callToAction || 'En savoir plus'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Prévisualisation messages (SMS/WhatsApp)
 */
function MessagePreview({
  creative,
  campaign,
  channel,
}: {
  creative: any;
  campaign: Partial<CampaignDraft>;
  channel: string;
}) {
  const isWhatsApp = channel === 'whatsapp';

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg h-full overflow-auto">
        {/* Header de la conversation */}
        <div className="p-4 border-b bg-green-500 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              AI
            </div>
            <div>
              <p className="font-medium">AI4Local</p>
              <p className="text-sm opacity-90">en ligne</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4">
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
              <p className="text-sm">{creative.title}</p>
              {creative.description && (
                <p className="text-sm mt-1 opacity-90">{creative.description}</p>
              )}

              {creative.type === 'image' && creative.url && (
                <img src={creative.url} alt={creative.alt} className="w-full rounded mt-2" />
              )}

              <div className="text-xs opacity-75 mt-2">Maintenant ✓✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Prévisualisation par défaut
 */
function DefaultPreview({
  creative,
  campaign,
}: {
  creative: any;
  campaign: Partial<CampaignDraft>;
}) {
  return (
    <div className="h-full bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
      <div className="text-center max-w-md">
        {creative.type === 'image' && creative.url && (
          <img src={creative.url} alt={creative.alt} className="w-full rounded-lg mb-4" />
        )}

        <h2 className="text-xl font-bold mb-2">{creative.title}</h2>
        {creative.description && (
          <p className="text-muted-foreground mb-4">{creative.description}</p>
        )}

        <Button>{creative.callToAction || 'En savoir plus'}</Button>
      </div>
    </div>
  );
}

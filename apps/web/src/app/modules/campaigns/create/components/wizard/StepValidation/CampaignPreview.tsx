'use client';

import React from 'react';
import { Eye, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';

interface CampaignPreviewProps {
  campaignData: any;
}

export function CampaignPreview({ campaignData }: CampaignPreviewProps) {
  const { basicInfo, creatives, tracking } = campaignData;

  // Génération de l'URL de tracking
  const generatePreviewUrl = () => {
    if (!tracking?.utmParameters) return '#';

    const { source, medium, campaign, term, content } = tracking.utmParameters;
    const baseUrl = 'https://example.com';
    const params = new URLSearchParams();

    if (source) params.append('utm_source', source);
    if (medium) params.append('utm_medium', medium);
    if (campaign) params.append('utm_campaign', campaign);
    if (term) params.append('utm_term', term);
    if (content) params.append('utm_content', content);

    return `${baseUrl}?${params.toString()}`;
  };

  const previewUrl = generatePreviewUrl();

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold">Aperçu de la campagne</h4>

      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desktop" className="space-y-4">
          <CampaignPreviewCard
            campaignData={campaignData}
            device="desktop"
            previewUrl={previewUrl}
          />
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <CampaignPreviewCard
            campaignData={campaignData}
            device="mobile"
            previewUrl={previewUrl}
          />
        </TabsContent>
      </Tabs>

      {/* Variantes A/B si activées */}
      {tracking?.abTestEnabled && tracking?.abTestVariants?.length > 0 && (
        <Card className="p-6">
          <h5 className="font-medium mb-4">Variantes A/B Testing</h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tracking.abTestVariants.map((variant: any, index: number) => (
              <div key={variant.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={variant.isControl ? 'default' : 'secondary'}>
                      {variant.isControl ? 'Contrôle' : `Variante ${index}`}
                    </Badge>
                    <span className="text-sm font-medium">{variant.percentage}%</span>
                  </div>
                </div>

                <h6 className="font-medium mb-2">{variant.name}</h6>
                <p className="text-sm text-muted-foreground mb-3">{variant.description}</p>

                {variant.overrides && Object.keys(variant.overrides).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Modifications :</p>
                    {Object.entries(variant.overrides).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium capitalize">{key}:</span>{' '}
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Composant de carte de prévisualisation
function CampaignPreviewCard({
  campaignData,
  device,
  previewUrl,
}: {
  campaignData: any;
  device: 'desktop' | 'mobile';
  previewUrl: string;
}) {
  const { basicInfo, creatives } = campaignData;

  const containerClass =
    device === 'mobile'
      ? 'max-w-sm mx-auto bg-white border rounded-lg shadow-sm overflow-hidden'
      : 'bg-white border rounded-lg shadow-sm overflow-hidden';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-medium">Aperçu {device === 'mobile' ? 'Mobile' : 'Desktop'}</h5>
        <Button variant="outline" size="sm" asChild>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir
          </a>
        </Button>
      </div>

      <div className={containerClass}>
        {/* Image principale */}
        {creatives?.mediaFiles?.[0] && (
          <div className="aspect-video bg-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {creatives.mediaFiles[0].type}
            </div>
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Titre et description */}
          <div>
            <h6 className="font-semibold text-gray-900 line-clamp-2">
              {creatives?.headline || basicInfo?.name || 'Titre de la campagne'}
            </h6>
            {creatives?.caption && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{creatives.caption}</p>
            )}
          </div>

          {/* Call-to-Action */}
          {creatives?.callToAction && (
            <Button className="w-full" size={device === 'mobile' ? 'sm' : 'default'}>
              {creatives.callToAction}
            </Button>
          )}

          {/* Métadonnées */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>Objectif: {basicInfo?.objective || 'Non défini'}</span>
            <span>{basicInfo?.channels?.length || 0} canal(aux)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

'use client';

import React from 'react';
import { Eye, Smartphone, Monitor } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import type { MediaFile } from '../validators';

interface CampaignPreviewProps {
  headline: string;
  caption: string;
  callToAction: string;
  mediaFiles: MediaFile[];
}

export function CampaignPreview({
  headline,
  caption,
  callToAction,
  mediaFiles,
}: CampaignPreviewProps) {
  const primaryMedia = mediaFiles[0];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h4 className="font-medium">Aperçu de la campagne</h4>
        <p className="text-sm text-muted-foreground">
          Visualisez votre campagne sur différents appareils
        </p>
      </div>

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

        <TabsContent value="desktop" className="mt-4">
          <PreviewCard
            headline={headline}
            caption={caption}
            callToAction={callToAction}
            mediaFiles={mediaFiles}
            device="desktop"
          />
        </TabsContent>

        <TabsContent value="mobile" className="mt-4">
          <PreviewCard
            headline={headline}
            caption={caption}
            callToAction={callToAction}
            mediaFiles={mediaFiles}
            device="mobile"
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function PreviewCard({
  headline,
  caption,
  callToAction,
  mediaFiles,
  device,
}: CampaignPreviewProps & { device: 'desktop' | 'mobile' }) {
  const primaryMedia = mediaFiles[0];

  const containerClass =
    device === 'mobile'
      ? 'max-w-sm mx-auto bg-white border rounded-lg shadow-sm overflow-hidden'
      : 'bg-white border rounded-lg shadow-sm overflow-hidden';

  return (
    <div className={containerClass}>
      {/* Image/Vidéo */}
      {primaryMedia ? (
        <div className="aspect-video bg-gray-100 relative">
          {primaryMedia.type === 'image' ? (
            <img
              src={primaryMedia.url}
              alt="Campaign media"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Eye className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Vidéo</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {primaryMedia.type}
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Eye className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Aucun média ajouté</p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Titre */}
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {headline || 'Votre titre apparaîtra ici'}
        </h3>

        {/* Description */}
        {caption && <p className="text-sm text-gray-600 line-clamp-3">{caption}</p>}

        {/* Call-to-Action */}
        {callToAction && (
          <Button className="w-full" size={device === 'mobile' ? 'sm' : 'default'}>
            {callToAction}
          </Button>
        )}

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>Aperçu {device === 'mobile' ? 'mobile' : 'desktop'}</span>
          <span>{mediaFiles.length} média(s)</span>
        </div>
      </div>
    </div>
  );
}

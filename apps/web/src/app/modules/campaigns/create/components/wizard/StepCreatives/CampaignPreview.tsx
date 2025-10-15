'use client';

import React, { useState } from 'react';
import { Eye, Smartphone, Monitor, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/modules/ui/dialog';
import type { MediaFile } from '../validators';
import { MediaCarousel } from './MediaCarousel';
import { PreviewCard } from './PreviewCard';
import { PreviewPopup } from './PreviewPopup';

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>('desktop');

  const openPopup = (device: 'desktop' | 'mobile') => {
    setSelectedDevice(device);
    setIsPopupOpen(true);
  };

  return (
    <>
      <Card className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Aperçu de la campagne</h4>
              <p className="text-sm text-muted-foreground">
                Visualisez votre campagne sur différents appareils
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openPopup('desktop')}
              className="flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              Plein écran
            </Button>
          </div>
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
              onFullscreen={() => openPopup('desktop')}
            />
          </TabsContent>

          <TabsContent value="mobile" className="mt-4">
            <PreviewCard
              headline={headline}
              caption={caption}
              callToAction={callToAction}
              mediaFiles={mediaFiles}
              device="mobile"
              onFullscreen={() => openPopup('mobile')}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <PreviewPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        headline={headline}
        caption={caption}
        callToAction={callToAction}
        mediaFiles={mediaFiles}
        device={selectedDevice}
        onDeviceChange={setSelectedDevice}
      />
    </>
  );
}

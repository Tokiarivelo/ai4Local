'use client';

import React from 'react';
import { X, Monitor, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/modules/ui/dialog';
import { Button } from '@/app/modules/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import type { MediaFile } from '../validators';
import { PreviewCard } from './PreviewCard';

interface PreviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  caption: string;
  callToAction: string;
  mediaFiles: MediaFile[];
  device: 'desktop' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
}

export function PreviewPopup({
  isOpen,
  onClose,
  headline,
  caption,
  callToAction,
  mediaFiles,
  device,
  onDeviceChange,
}: PreviewPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">Aperçu de la campagne</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Visualisation complète sur {device === 'mobile' ? 'mobile' : 'desktop'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 pt-4">
          <Tabs value={device} onValueChange={onDeviceChange as any} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="desktop" className="mt-0">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <PreviewCard
                    headline={headline}
                    caption={caption}
                    callToAction={callToAction}
                    mediaFiles={mediaFiles}
                    device="desktop"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="mt-0">
              <div className="flex justify-center">
                <PreviewCard
                  headline={headline}
                  caption={caption}
                  callToAction={callToAction}
                  mediaFiles={mediaFiles}
                  device="mobile"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Informations de la campagne</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Médias:</span>
                <div className="font-medium">{mediaFiles.length} fichier(s)</div>
              </div>
              <div>
                <span className="text-muted-foreground">Titre:</span>
                <div className="font-medium">{headline.length} caractères</div>
              </div>
              <div>
                <span className="text-muted-foreground">Description:</span>
                <div className="font-medium">{caption?.length || 0} caractères</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

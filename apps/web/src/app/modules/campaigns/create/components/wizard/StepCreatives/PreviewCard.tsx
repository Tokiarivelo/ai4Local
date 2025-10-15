'use client';

import React from 'react';
import { Eye, Maximize2 } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import type { MediaFile } from '../validators';
import { MediaCarousel } from './MediaCarousel';

interface PreviewCardProps {
  headline: string;
  caption: string;
  callToAction: string;
  mediaFiles: MediaFile[];
  device: 'desktop' | 'mobile';
  onFullscreen?: () => void;
}

export function PreviewCard({
  headline,
  caption,
  callToAction,
  mediaFiles,
  device,
  onFullscreen,
}: PreviewCardProps) {
  const containerClass =
    device === 'mobile'
      ? 'max-w-sm mx-auto bg-white border rounded-lg shadow-sm overflow-hidden relative'
      : 'bg-white border rounded-lg shadow-sm overflow-hidden relative';

  return (
    <div className={containerClass}>
      {/* Fullscreen Button */}
      {onFullscreen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      )}

      {/* Media Section */}
      {mediaFiles.length > 0 ? (
        <MediaCarousel mediaFiles={mediaFiles} device={device} />
      ) : (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Eye className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Aucun média ajouté</p>
          </div>
        </div>
      )}

      {/* Content Section */}
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

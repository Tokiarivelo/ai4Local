'use client';

import React from 'react';
import { Eye, ExternalLink, Image, Video } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { BasicInfo, Creatives } from './CampaignPreview.types';

interface MiniCampaignPreviewCardProps {
  basicInfo: BasicInfo;
  creatives: Creatives;
  device: 'desktop' | 'mobile';
  previewUrl: string;
  compact?: boolean;
}

export function MiniCampaignPreviewCard({
  basicInfo,
  creatives,
  device,
  previewUrl,
  compact = false,
}: MiniCampaignPreviewCardProps) {
  const containerClass =
    device === 'mobile'
      ? 'max-w-xs mx-auto bg-white border rounded-lg shadow-sm overflow-hidden'
      : 'bg-white border rounded-lg shadow-sm overflow-hidden';

  return (
    <Card className={compact ? 'p-3' : 'p-6'}>
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-medium text-sm">
          {compact ? 'Mini aperçu' : `Aperçu ${device === 'mobile' ? 'Mobile' : 'Desktop'}`}
        </h5>
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
        {/* Media preview: show all media as thumbnails */}
        <div className="flex gap-2 overflow-x-auto py-2">
          {creatives?.mediaFiles?.length ? (
            creatives.mediaFiles.map((media, idx) => (
              <div
                key={idx}
                className="relative w-20 h-14 rounded bg-gray-100 flex items-center justify-center border"
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={media.name}
                    className="object-cover w-full h-full rounded"
                  />
                ) : media.type === 'video' ? (
                  <Video className="h-8 w-8 text-gray-400" />
                ) : (
                  <Image className="h-8 w-8 text-gray-400" />
                )}
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                  {media.type}
                </span>
              </div>
            ))
          ) : (
            <div className="w-20 h-14 flex items-center justify-center bg-gray-100 rounded">
              <Eye className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className={compact ? 'p-2 space-y-2' : 'p-4 space-y-3'}>
          <div>
            <h6 className="font-semibold text-gray-900 line-clamp-2 text-sm">
              {creatives?.headline || basicInfo?.name || 'Titre de la campagne'}
            </h6>
            {creatives?.caption && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{creatives.caption}</p>
            )}
          </div>
          {creatives?.callToAction && (
            <Button className="w-full" size={device === 'mobile' ? 'sm' : 'default'}>
              {creatives.callToAction}
            </Button>
          )}
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t">
            <span>Objectif: {basicInfo?.objective || 'Non défini'}</span>
            <span>{basicInfo?.channels?.length || 0} canal(aux)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

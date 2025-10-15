'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Eye } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import type { MediaFile } from '../validators';

interface MediaCarouselProps {
  mediaFiles: MediaFile[];
  device: 'desktop' | 'mobile';
}

export function MediaCarousel({ mediaFiles, device }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  };

  const currentMedia = mediaFiles[currentIndex];

  if (!currentMedia) return null;

  return (
    <div className="relative aspect-video bg-gray-100">
      {/* Media Display */}
      {currentMedia.type === 'image' ? (
        <img
          src={currentMedia.url}
          alt={currentMedia.name}
          className="w-full h-full object-cover"
        />
      ) : currentMedia.type === 'video' ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 relative">
          <Play className="h-12 w-12 text-white bg-black/50 rounded-full p-3" />
          <video
            className="w-full h-full object-cover"
            poster={currentMedia.preview}
            controls={false}
          >
            <source src={currentMedia.url} />
          </video>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <Eye className="h-8 w-8 text-gray-400" />
          <span className="ml-2 text-gray-500">{currentMedia.type}</span>
        </div>
      )}

      {/* Media Type Badge */}
      <Badge
        variant="secondary"
        className="absolute bottom-2 left-2 bg-black/70 text-white text-xs"
      >
        {currentMedia.type}
        {currentMedia.generated && ' • IA'}
      </Badge>

      {/* Navigation Controls */}
      {mediaFiles.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMedia}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            disabled={mediaFiles.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextMedia}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            disabled={mediaFiles.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Indicators */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            {mediaFiles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-black/70 text-white text-xs"
          >
            {currentIndex + 1} / {mediaFiles.length}
          </Badge>
        </>
      )}
    </div>
  );
}

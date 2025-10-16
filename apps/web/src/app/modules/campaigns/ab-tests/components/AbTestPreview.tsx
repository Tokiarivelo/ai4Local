/**
 * A/B Test Preview Component
 * Preview variant on different devices
 */

'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { cn } from '@/lib/utils';
import type { Variant } from '../types';

interface AbTestPreviewProps {
  variant: Variant;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export function AbTestPreview({ variant }: AbTestPreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');

  const deviceClasses = {
    desktop: 'max-w-full',
    tablet: 'max-w-2xl mx-auto',
    mobile: 'max-w-sm mx-auto',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Aperçu: {variant.name}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={device === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={device === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={device === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className={cn('transition-all', deviceClasses[device])}>
          <div className="border rounded-lg overflow-hidden bg-background">
            {/* Creative Preview */}
            {variant.creative.type === 'image' && variant.creative.url && (
              <div className="aspect-video bg-muted">
                <img
                  src={variant.creative.url}
                  alt={variant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {variant.creative.type === 'video' && variant.creative.url && (
              <div className="aspect-video bg-muted">
                <video src={variant.creative.url} controls className="w-full h-full" />
              </div>
            )}

            {variant.creative.type === 'text' && (
              <div className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">{variant.headline}</h2>
                  {variant.creative.content && (
                    <p className="text-muted-foreground">{variant.creative.content}</p>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-4">
              {variant.creative.type !== 'text' && (
                <h2 className="text-xl font-bold">{variant.headline}</h2>
              )}

              {variant.description && (
                <p className="text-muted-foreground">{variant.description}</p>
              )}

              <Button size="lg" className="w-full">
                {variant.cta}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

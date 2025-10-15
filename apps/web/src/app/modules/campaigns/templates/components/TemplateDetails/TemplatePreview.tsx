'use client';

import React from 'react';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import type { Template } from '../../types/template.types';

interface TemplatePreviewProps {
  template: Template;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const { structure } = template;

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      {structure.basicInfo && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Informations de base</h3>
          <div className="grid grid-cols-2 gap-4">
            {structure.basicInfo.objective && (
              <div>
                <p className="text-sm text-muted-foreground">Objectif</p>
                <p className="font-medium capitalize">{structure.basicInfo.objective}</p>
              </div>
            )}
            {structure.basicInfo.type && (
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{structure.basicInfo.type}</p>
              </div>
            )}
            {structure.basicInfo.channels && structure.basicInfo.channels.length > 0 && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-2">Canaux</p>
                <div className="flex gap-2 flex-wrap">
                  {structure.basicInfo.channels.map((channel) => (
                    <Badge key={channel} variant="secondary">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Creatives */}
      {structure.creatives && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Éléments créatifs</h3>
          <div className="space-y-4">
            {structure.creatives.headline && (
              <div>
                <p className="text-sm text-muted-foreground">Titre</p>
                <p className="font-medium text-lg">{structure.creatives.headline}</p>
              </div>
            )}
            {structure.creatives.caption && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{structure.creatives.caption}</p>
              </div>
            )}
            {structure.creatives.callToAction && (
              <div>
                <p className="text-sm text-muted-foreground">Call-to-Action</p>
                <Badge className="mt-1">{structure.creatives.callToAction}</Badge>
              </div>
            )}
            {structure.creatives.mediaFiles && structure.creatives.mediaFiles.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Médias</p>
                <div className="grid grid-cols-3 gap-2">
                  {structure.creatives.mediaFiles.slice(0, 6).map((media, idx) => (
                    <div
                      key={idx}
                      className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                    >
                      {media.type === 'image' && media.url ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">{media.type}</span>
                      )}
                    </div>
                  ))}
                </div>
                {structure.creatives.mediaFiles.length > 6 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{structure.creatives.mediaFiles.length - 6} autres médias
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Audience */}
      {structure.audience && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Audience</h3>
          <div className="space-y-4">
            {structure.audience.selectedSegments &&
              structure.audience.selectedSegments.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Segments sélectionnés</p>
                  <div className="flex gap-2 flex-wrap">
                    {structure.audience.selectedSegments.map((segment, idx) => (
                      <Badge key={idx} variant="outline">
                        {typeof segment === 'string'
                          ? segment
                          : typeof segment === 'object' && segment !== null && 'name' in segment
                            ? (segment as { name?: string }).name || 'Segment'
                            : 'Segment'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </Card>
      )}

      {/* Planning */}
      {structure.planning && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Planification</h3>
          <div className="grid grid-cols-2 gap-4">
            {structure.planning.budget && (
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">{structure.planning.budget.toLocaleString()} €</p>
              </div>
            )}
            {structure.planning.startDate && (
              <div>
                <p className="text-sm text-muted-foreground">Date de début</p>
                <p className="font-medium">
                  {new Date(structure.planning.startDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {structure.planning.endDate && (
              <div>
                <p className="text-sm text-muted-foreground">Date de fin</p>
                <p className="font-medium">
                  {new Date(structure.planning.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tracking */}
      {structure.tracking && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tracking</h3>
          <div className="space-y-4">
            {structure.tracking.utmParameters && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Paramètres UTM</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(structure.tracking.utmParameters).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}:</span>{' '}
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

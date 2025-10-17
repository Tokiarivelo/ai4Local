/**
 * Draft preview panel component
 * Displays formatted preview of draft content
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Calendar, User, Tag, Image as ImageIcon } from 'lucide-react';
import { getRelativeTime, getDraftSummary } from '../utils/draftHelpers';
import type { Draft } from '../types/draft.types';

interface DraftPreviewProps {
  draft: Draft;
  onClose: () => void;
}

export function DraftPreview({ draft, onClose }: DraftPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Preview</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <h4 className="text-lg font-semibold mb-2">{draft.title}</h4>
            <p className="text-sm text-muted-foreground">{getDraftSummary(draft)}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{draft.channel}</Badge>
            <Badge variant="outline">{draft.status}</Badge>
            {draft.scheduledFor && (
              <Badge variant="outline" className="bg-violet-500/10">
                Scheduled
              </Badge>
            )}
          </div>

          <Separator />

          {/* Body */}
          <div>
            <h5 className="text-sm font-medium mb-2">Content</h5>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{draft.body}</p>
            </div>
          </div>

          {/* Media */}
          {draft.media.length > 0 && (
            <>
              <Separator />
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Media ({draft.media.length})
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {draft.media.map((media) => (
                    <div
                      key={media.id}
                      className="aspect-video rounded-md overflow-hidden border bg-muted"
                    >
                      {media.type === 'image' || media.type === 'video' ? (
                        <img
                          src={media.thumbnail || media.url}
                          alt={media.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-xs text-muted-foreground">{media.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {draft.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {draft.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Meta Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created by {draft.owner.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last edited {getRelativeTime(draft.lastEditedAt)}</span>
            </div>
            {draft.scheduledFor && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Scheduled for {new Date(draft.scheduledFor).toLocaleString()}</span>
              </div>
            )}
            {draft.campaign && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Campaign: {draft.campaign.name}</span>
              </div>
            )}
          </div>

          {/* Version */}
          <div className="text-xs text-muted-foreground">
            Version {draft.version} • ID: {draft.id}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

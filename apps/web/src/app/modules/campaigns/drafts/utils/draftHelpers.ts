/**
 * Utility functions for draft operations
 * Includes merge, diff, summary generation, and validation helpers
 */

import type { Draft, UpdateDraftPayload, DraftMedia } from '../types/draft.types';

/**
 * Merges draft updates with existing draft
 */
export function mergeDraft(existingDraft: Draft, updates: UpdateDraftPayload): Draft {
  return {
    ...existingDraft,
    ...updates,
    updatedAt: new Date().toISOString(),
    lastEditedAt: new Date().toISOString(),
    version: existingDraft.version + 1,
  };
}

/**
 * Checks if draft has unsaved changes
 */
export function hasUnsavedChanges(original: Draft, modified: Partial<Draft>): boolean {
  const fieldsToCheck: (keyof Draft)[] = ['title', 'body', 'channel', 'tags', 'scheduledFor'];

  return fieldsToCheck.some((field) => {
    if (field === 'tags') {
      return JSON.stringify(original.tags) !== JSON.stringify(modified.tags);
    }
    return original[field] !== modified[field];
  });
}

/**
 * Generates a summary of draft changes
 */
export function getDraftSummary(draft: Draft): string {
  const parts: string[] = [];

  parts.push(`${draft.channel} post`);

  if (draft.campaign) {
    parts.push(`for ${draft.campaign.name}`);
  }

  if (draft.media.length > 0) {
    parts.push(`with ${draft.media.length} media`);
  }

  if (draft.scheduledFor) {
    parts.push(`scheduled for ${new Date(draft.scheduledFor).toLocaleDateString()}`);
  }

  return parts.join(' ');
}

/**
 * Calculates diff between two drafts
 */
export function diffDrafts(original: Draft, updated: Draft): Partial<Draft> {
  const diff: Partial<Draft> = {};

  (Object.keys(updated) as (keyof Draft)[]).forEach((key) => {
    if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
      diff[key] = updated[key] as never;
    }
  });

  return diff;
}

/**
 * Calculates total media size
 */
export function getTotalMediaSize(media: DraftMedia[]): number {
  return media.reduce((total, item) => total + item.size, 0);
}

/**
 * Formats media size for display
 */
export function formatMediaSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Generates unique draft title
 */
export function generateDraftTitle(channel: string, index: number): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `${channel} Draft ${index} - ${timestamp}`;
}

/**
 * Checks if draft can be published
 */
export function canPublishDraft(draft: Draft): boolean {
  return (
    draft.title.trim().length > 0 && draft.body.trim().length >= 10 && draft.status !== 'scheduled'
  );
}

/**
 * Sanitizes draft content for display
 */
export function sanitizeDraftContent(content: string, maxLength = 150): string {
  const sanitized = content.replace(/<[^>]*>/g, '').trim();
  return sanitized.length > maxLength ? `${sanitized.substring(0, maxLength)}...` : sanitized;
}

/**
 * Gets relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

'use client';

import { useCallback } from 'react';
import { useTemplateStore } from '../stores/templateStore';
import { useRouter } from 'next/navigation';
import type { CreateTemplateInput, UpdateTemplateInput } from '../types/template.types';

export function useTemplateActions() {
  const router = useRouter();
  const store = useTemplateStore();

  const createTemplate = useCallback(
    async (input: CreateTemplateInput) => {
      try {
        const template = await store.createTemplate(input);
        return template;
      } catch (error) {
        console.error('Failed to create template:', error);
        throw error;
      }
    },
    [store]
  );

  const updateTemplate = useCallback(
    async (input: UpdateTemplateInput) => {
      try {
        const template = await store.updateTemplate(input);
        return template;
      } catch (error) {
        console.error('Failed to update template:', error);
        throw error;
      }
    },
    [store]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      try {
        await store.deleteTemplate(id);
      } catch (error) {
        console.error('Failed to delete template:', error);
        throw error;
      }
    },
    [store]
  );

  const cloneTemplate = useCallback(
    async (id: string) => {
      try {
        const cloned = await store.cloneTemplate(id);
        return cloned;
      } catch (error) {
        console.error('Failed to clone template:', error);
        throw error;
      }
    },
    [store]
  );

  const useTemplate = useCallback(
    (id: string) => {
      store.incrementUsage(id);
      router.push(`/dashboard/campaigns/create?template=${id}`);
    },
    [store, router]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      store.toggleFavorite(id);
    },
    [store]
  );

  const archiveTemplate = useCallback(
    async (id: string) => {
      try {
        await store.archiveTemplate(id);
      } catch (error) {
        console.error('Failed to archive template:', error);
        throw error;
      }
    },
    [store]
  );

  const restoreTemplate = useCallback(
    async (id: string) => {
      try {
        await store.restoreTemplate(id);
      } catch (error) {
        console.error('Failed to restore template:', error);
        throw error;
      }
    },
    [store]
  );

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    cloneTemplate,
    useTemplate,
    toggleFavorite,
    archiveTemplate,
    restoreTemplate,
  };
}

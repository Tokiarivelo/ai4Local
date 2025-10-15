import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Template, CreateTemplateInput, UpdateTemplateInput } from '../types/template.types';
import { mockTemplates } from '../mock-data/templates';

interface TemplateState {
  // State
  templates: Template[];
  selectedTemplate: Template | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTemplates: (templates: Template[]) => void;
  setSelectedTemplate: (template: Template | null) => void;
  createTemplate: (input: CreateTemplateInput) => Promise<Template>;
  updateTemplate: (input: UpdateTemplateInput) => Promise<Template>;
  deleteTemplate: (id: string) => Promise<void>;
  cloneTemplate: (id: string) => Promise<Template>;
  toggleFavorite: (id: string) => void;
  archiveTemplate: (id: string) => Promise<void>;
  restoreTemplate: (id: string) => Promise<void>;
  incrementUsage: (id: string) => void;
  fetchTemplates: () => Promise<void>;
  clearError: () => void;
}

export const useTemplateStore = create<TemplateState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        templates: mockTemplates,
        selectedTemplate: null,
        isLoading: false,
        error: null,

        // Actions
        setTemplates: (templates) => set({ templates }),

        setSelectedTemplate: (template) => set({ selectedTemplate: template }),

        createTemplate: async (input) => {
          set({ isLoading: true, error: null });
          try {
            const newTemplate: Template = {
              id: `template-${Date.now()}`,
              ...input,
              status: 'draft',
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: 'current-user',
              stats: {
                usageCount: 0,
              },
              tags: input.tags || [],
              isFavorite: false,
              isShared: false,
              channels: input.structure.basicInfo?.channels || [],
            };

            set((state) => ({
              templates: [newTemplate, ...state.templates],
              isLoading: false,
            }));

            return newTemplate;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create template';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        updateTemplate: async (input) => {
          set({ isLoading: true, error: null });
          try {
            const { id, ...updates } = input;
            
            set((state) => ({
              templates: state.templates.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      ...updates,
                      updatedAt: new Date(),
                      channels: updates.structure?.basicInfo?.channels || t.channels,
                    }
                  : t
              ),
              isLoading: false,
            }));

            const updated = get().templates.find((t) => t.id === id);
            if (!updated) throw new Error('Template not found');
            
            return updated;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update template';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        deleteTemplate: async (id) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              templates: state.templates.filter((t) => t.id !== id),
              selectedTemplate: state.selectedTemplate?.id === id ? null : state.selectedTemplate,
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete template';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        cloneTemplate: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const template = get().templates.find((t) => t.id === id);
            if (!template) throw new Error('Template not found');

            const cloned: Template = {
              ...template,
              id: `template-${Date.now()}`,
              name: `${template.name} (Copie)`,
              createdAt: new Date(),
              updatedAt: new Date(),
              stats: { usageCount: 0 },
              isFavorite: false,
            };

            set((state) => ({
              templates: [cloned, ...state.templates],
              isLoading: false,
            }));

            return cloned;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to clone template';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        toggleFavorite: (id) => {
          set((state) => ({
            templates: state.templates.map((t) =>
              t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
            ),
          }));
        },

        archiveTemplate: async (id) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              templates: state.templates.map((t) =>
                t.id === id ? { ...t, status: 'archived' as const, updatedAt: new Date() } : t
              ),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to archive template';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        restoreTemplate: async (id) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              templates: state.templates.map((t) =>
                t.id === id ? { ...t, status: 'active' as const, updatedAt: new Date() } : t
              ),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to restore template';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        incrementUsage: (id) => {
          set((state) => ({
            templates: state.templates.map((t) =>
              t.id === id
                ? {
                    ...t,
                    stats: {
                      ...t.stats,
                      usageCount: t.stats.usageCount + 1,
                      lastUsedAt: new Date(),
                    },
                  }
                : t
            ),
          }));
        },

        fetchTemplates: async () => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            set({ templates: mockTemplates, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch templates';
            set({ error: errorMessage, isLoading: false });
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'template-storage',
        partialize: (state) => ({
          templates: state.templates,
        }),
      }
    ),
    { name: 'TemplateStore' }
  )
);

// Stable selectors to avoid infinite loops - RENAMED to avoid conflicts
export const useTemplatesFromStore = () => useTemplateStore((state) => state.templates);
export const useSelectedTemplate = () => useTemplateStore((state) => state.selectedTemplate);
export const useTemplateLoading = () => useTemplateStore((state) => state.isLoading);
export const useTemplateError = () => useTemplateStore((state) => state.error);

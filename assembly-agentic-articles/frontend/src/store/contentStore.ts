import { create } from 'zustand';
import { contentApi, Draft, ResearchSource, PlatformContent } from '../services/api';

interface ContentStore {
  // State
  currentDraft: Draft | null;
  drafts: Draft[];
  sources: ResearchSource[];
  formattedContent: PlatformContent | null;
  status: 'idle' | 'researching' | 'generating' | 'revising' | 'formatting' | 'error';
  error: string | null;
  loading: boolean;
  selectedSourceIds: string[];
  researchRetryCount: number;
  canRetryResearch: boolean;

  // Actions
  createDraft: (idea: string) => Promise<void>;
  loadDrafts: () => Promise<void>;
  loadDraft: (id: string) => Promise<void>;
  conductResearch: () => Promise<void>;
  generateContent: () => Promise<void>;
  reviseContent: (feedback: string) => Promise<void>;
  approveDraft: () => Promise<void>;
  formatContent: () => Promise<void>;
  publishContent: (platforms: string[]) => Promise<void>;
  selectSources: (sourceIds: string[]) => void;
  saveSourceSelection: () => Promise<void>;
  retryResearch: () => Promise<void>;
  generateContentFromSelection: () => Promise<void>;
  skipSourceSelection: () => Promise<void>;
  setStatus: (status: ContentStore['status']) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useContentStore = create<ContentStore>((set, get) => ({
  // Initial state
  currentDraft: null,
  drafts: [],
  sources: [],
  formattedContent: null,
  status: 'idle',
  error: null,
  loading: false,
  selectedSourceIds: [],
  researchRetryCount: 0,
  canRetryResearch: true,

  // Actions
  createDraft: async (idea: string) => {
    set({ loading: true, error: null });
    try {
      const draft = await contentApi.createDraft(idea);
      set({
        currentDraft: draft,
        status: 'idle',
        loading: false
      });

      // Start research automatically
      await get().conductResearch();
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create draft',
        status: 'error',
        loading: false
      });
    }
  },

  loadDrafts: async () => {
    set({ loading: true, error: null });
    try {
      const drafts = await contentApi.getDrafts();
      set({ drafts, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load drafts',
        loading: false
      });
    }
  },

  loadDraft: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const draft = await contentApi.getDraft(id);
      const sources = await contentApi.getSources(id);

      // Load formatted content if draft is approved
      let formattedContent = null;
      if (draft.status === 'approved' || draft.status === 'published') {
        try {
          formattedContent = await contentApi.getFormattedContent(id);
        } catch {
          // Formatted content might not exist yet
        }
      }

      set({
        currentDraft: draft,
        sources,
        formattedContent,
        status: 'idle',
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load draft',
        loading: false
      });
    }
  },

  conductResearch: async () => {
    const { currentDraft } = get();
    if (!currentDraft) return;

    set({ status: 'researching', error: null });
    try {
      const result = await contentApi.conductResearch(currentDraft.id);
      set({
        sources: result.sources,
        canRetryResearch: result.canRetry,
        researchRetryCount: result.retryCount,
        status: 'idle',
        selectedSourceIds: [] // Reset selection
      });

      // REMOVED: Auto-generate content
      // Now user must select sources first
    } catch (error: any) {
      set({
        error: error.message || 'Failed to conduct research',
        status: 'error'
      });
    }
  },

  generateContent: async () => {
    const { currentDraft } = get();
    if (!currentDraft) return;

    set({ status: 'generating', error: null });
    try {
      const content = await contentApi.generateContent(currentDraft.id);

      // Update the draft with new content
      const updatedDraft = {
        ...currentDraft,
        draftContent: content,
        status: 'review'
      };

      set({
        currentDraft: updatedDraft,
        status: 'idle'
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to generate content',
        status: 'error'
      });
    }
  },

  reviseContent: async (feedback: string) => {
    const { currentDraft } = get();
    if (!currentDraft) return;

    set({ status: 'revising', error: null });
    try {
      const content = await contentApi.reviseContent(currentDraft.id, feedback);

      // Update the draft with revised content
      const updatedDraft = {
        ...currentDraft,
        draftContent: content,
        status: 'review',
        revisionCount: currentDraft.revisionCount + 1
      };

      set({
        currentDraft: updatedDraft,
        status: 'idle'
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to revise content',
        status: 'error'
      });
    }
  },

  approveDraft: async () => {
    const { currentDraft } = get();
    if (!currentDraft) return;

    set({ loading: true, error: null });
    try {
      await contentApi.approveDraft(currentDraft.id);

      // Update draft status
      const updatedDraft = {
        ...currentDraft,
        status: 'approved'
      };

      set({
        currentDraft: updatedDraft,
        loading: false
      });

      // Automatically format content after approval
      await get().formatContent();
    } catch (error: any) {
      set({
        error: error.message || 'Failed to approve draft',
        loading: false
      });
    }
  },

  formatContent: async () => {
    const { currentDraft } = get();
    if (!currentDraft) return;

    set({ status: 'formatting', error: null });
    try {
      const formatted = await contentApi.formatContent(currentDraft.id);
      set({
        formattedContent: formatted,
        status: 'idle'
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to format content',
        status: 'error'
      });
    }
  },

  publishContent: async (platforms: string[]) => {
    const { currentDraft } = get();
    if (!currentDraft) return;

    set({ loading: true, error: null });
    try {
      await contentApi.publishContent(currentDraft.id, platforms);

      // Update draft status
      const updatedDraft = {
        ...currentDraft,
        status: 'published'
      };

      set({
        currentDraft: updatedDraft,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to publish content',
        loading: false
      });
    }
  },

  // NEW: Update local selection state
  selectSources: (sourceIds: string[]) => {
    set({ selectedSourceIds: sourceIds });
  },

  // NEW: Save selection to backend
  saveSourceSelection: async () => {
    const { currentDraft, selectedSourceIds } = get();
    if (!currentDraft) return;

    if (selectedSourceIds.length < 3) {
      set({ error: 'Please select at least 3 sources' });
      throw new Error('Please select at least 3 sources');
    }

    try {
      await contentApi.selectSources(currentDraft.id, selectedSourceIds);
    } catch (error: any) {
      set({ error: error.message || 'Failed to save source selection' });
      throw error;
    }
  },

  // NEW: Generate content with selected sources
  generateContentFromSelection: async () => {
    const { currentDraft, selectedSourceIds } = get();
    if (!currentDraft) return;

    // Validation
    if (selectedSourceIds.length < 3) {
      set({ error: 'Please select at least 3 sources to generate content' });
      return;
    }

    set({ status: 'generating', error: null });

    try {
      // Save selection first
      await get().saveSourceSelection();

      // Then generate content
      await get().generateContent();
    } catch (error: any) {
      set({
        error: error.message || 'Failed to generate content',
        status: 'error'
      });
    }
  },

  // NEW: Skip selection and use all sources
  skipSourceSelection: async () => {
    const { sources } = get();

    // Select all sources
    const allSourceIds = sources.map(s => s.id);
    set({ selectedSourceIds: allSourceIds });

    // Generate immediately
    await get().generateContentFromSelection();
  },

  // NEW: Re-run research
  retryResearch: async () => {
    const { currentDraft, researchRetryCount } = get();
    if (!currentDraft) return;

    if (researchRetryCount >= 2) {
      set({ error: 'Maximum research attempts (2) reached' });
      return;
    }

    set({ status: 'researching', error: null });

    try {
      const result = await contentApi.retryResearch(currentDraft.id);

      // Append new sources to existing list
      set((state) => ({
        sources: [...state.sources, ...result.newSources],
        researchRetryCount: result.retryCount,
        canRetryResearch: result.canRetry,
        status: 'idle'
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to find more sources',
        status: 'error'
      });
    }
  },

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),

  reset: () => set({
    currentDraft: null,
    sources: [],
    formattedContent: null,
    status: 'idle',
    error: null,
    loading: false,
    selectedSourceIds: [],
    researchRetryCount: 0,
    canRetryResearch: true
  }),
}));

export default useContentStore;
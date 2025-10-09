import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header if needed in future
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Draft {
  id: string;
  userId: string;
  originalIdea: string;
  draftContent: string | null;
  status: string;
  revisionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSource {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  publicationDate?: string;
  domainAuthority: number;
  credibilityScore: number;
  sourceType: string;
  userSelected?: boolean;
}

export interface PlatformContent {
  linkedin: string;
  twitter: string[];
  tiktok: string;
}

// API Methods
export const contentApi = {
  // Draft management
  createDraft: async (idea: string): Promise<Draft> => {
    const response = await api.post('/content/drafts', { idea });
    return response.data.draft;
  },

  getDrafts: async (): Promise<Draft[]> => {
    const response = await api.get('/content/drafts');
    return response.data.drafts;
  },

  getDraft: async (id: string): Promise<Draft> => {
    const response = await api.get(`/content/drafts/${id}`);
    return response.data.draft;
  },

  // Research
  conductResearch: async (draftId: string): Promise<{ sources: ResearchSource[]; canRetry: boolean; retryCount: number }> => {
    const response = await api.post(`/content/drafts/${draftId}/research`);
    return {
      sources: response.data.sources,
      canRetry: response.data.canRetry,
      retryCount: response.data.retryCount
    };
  },

  getSources: async (draftId: string): Promise<ResearchSource[]> => {
    const response = await api.get(`/content/drafts/${draftId}/sources`);
    return response.data.sources;
  },

  selectSources: async (draftId: string, selectedSourceIds: string[]): Promise<{ success: boolean; selectedCount: number }> => {
    const response = await api.post(`/content/drafts/${draftId}/sources/select`, { selectedSourceIds });
    return response.data;
  },

  retryResearch: async (draftId: string): Promise<{ newSources: ResearchSource[]; retryCount: number; canRetry: boolean }> => {
    const response = await api.post(`/content/drafts/${draftId}/research/retry`);
    return {
      newSources: response.data.newSources,
      retryCount: response.data.retryCount,
      canRetry: response.data.canRetry
    };
  },

  // Content generation
  generateContent: async (draftId: string): Promise<string> => {
    const response = await api.post(`/content/drafts/${draftId}/generate`);
    return response.data.content;
  },

  reviseContent: async (draftId: string, feedback: string): Promise<string> => {
    const response = await api.post(`/content/drafts/${draftId}/revise`, { feedback });
    return response.data.content;
  },

  approveDraft: async (draftId: string): Promise<void> => {
    await api.post(`/content/drafts/${draftId}/approve`);
  },

  // Formatting
  formatContent: async (draftId: string): Promise<PlatformContent> => {
    const response = await api.post(`/content/drafts/${draftId}/format`);
    return response.data.formatted;
  },

  getFormattedContent: async (draftId: string): Promise<PlatformContent> => {
    const response = await api.get(`/content/drafts/${draftId}/formatted`);
    return response.data.formatted;
  },

  // Publishing
  publishContent: async (draftId: string, platforms: string[]): Promise<any> => {
    const response = await api.post(`/content/drafts/${draftId}/publish`, { platforms });
    return response.data;
  },
};

export default api;
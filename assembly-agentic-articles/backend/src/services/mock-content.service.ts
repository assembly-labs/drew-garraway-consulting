import { v4 as uuidv4 } from 'uuid';
import { ClaudeService } from './claude.service';
import { ResearchService, ResearchSource } from './research.service';
import { PlatformFormatter } from '../utils/formatting';
import { ContentDraft } from './content.service';

// In-memory storage for mock data
const mockDrafts = new Map<string, ContentDraft>();
const mockSources = new Map<string, ResearchSource[]>();
const mockFormattedContent = new Map<string, any>();

export class MockContentService {
  private claudeService: ClaudeService;
  private researchService: ResearchService;
  private formatter: PlatformFormatter;

  constructor() {
    this.claudeService = new ClaudeService();
    this.researchService = new ResearchService();
    this.formatter = new PlatformFormatter();
  }

  async createDraft(userId: string, idea: string): Promise<ContentDraft> {
    const draft: ContentDraft = {
      id: uuidv4(),
      userId,
      originalIdea: idea,
      draftContent: null,
      status: 'draft',
      revisionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDrafts.set(draft.id, draft);
    return draft;
  }

  async getDraft(draftId: string, userId: string): Promise<ContentDraft | null> {
    const draft = mockDrafts.get(draftId);
    if (!draft || draft.userId !== userId) {
      return null;
    }
    return draft;
  }

  async getUserDrafts(userId: string): Promise<ContentDraft[]> {
    const drafts = Array.from(mockDrafts.values())
      .filter(d => d.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return drafts;
  }

  async conductResearch(draftId: string): Promise<ResearchSource[]> {
    const draft = mockDrafts.get(draftId);
    if (!draft) {
      throw new Error('Draft not found');
    }

    const sources = await this.researchService.conductResearch(draft.originalIdea);
    mockSources.set(draftId, sources);

    // Update draft status
    draft.status = 'researching';
    draft.updatedAt = new Date();

    return sources;
  }

  async getSources(draftId: string): Promise<ResearchSource[]> {
    return mockSources.get(draftId) || [];
  }

  async generateDraftContent(draftId: string): Promise<string> {
    const draft = mockDrafts.get(draftId);
    if (!draft) {
      throw new Error('Draft not found');
    }

    const sources = mockSources.get(draftId) || [];
    const content = await this.claudeService.generateContent({
      idea: draft.originalIdea,
      sources
    });

    // Update draft
    draft.draftContent = content;
    draft.status = 'generated';
    draft.updatedAt = new Date();

    return content;
  }

  async requestRevision(draftId: string, userId: string, feedback: string): Promise<string> {
    const draft = mockDrafts.get(draftId);
    if (!draft || draft.userId !== userId) {
      throw new Error('Draft not found');
    }

    if (draft.revisionCount >= 2) {
      throw new Error('Maximum revisions (2) reached');
    }

    const sources = mockSources.get(draftId) || [];
    const revisedContent = await this.claudeService.generateContent({
      idea: draft.originalIdea,
      sources,
      feedback
    });

    // Update draft
    draft.draftContent = revisedContent;
    draft.revisionCount++;
    draft.status = 'revised';
    draft.updatedAt = new Date();

    return revisedContent;
  }

  async approveDraft(draftId: string, userId: string): Promise<void> {
    const draft = mockDrafts.get(draftId);
    if (!draft || draft.userId !== userId) {
      throw new Error('Draft not found');
    }

    if (!draft.draftContent) {
      throw new Error('No content to approve');
    }

    draft.status = 'approved';
    draft.updatedAt = new Date();
  }

  async formatContent(draftId: string): Promise<any> {
    const draft = mockDrafts.get(draftId);
    if (!draft) {
      throw new Error('Draft not found');
    }

    if (!draft.draftContent) {
      throw new Error('No content to format');
    }

    const sources = mockSources.get(draftId) || [];
    const formatted = {
      linkedin: this.formatter.formatForLinkedIn(draft.draftContent, sources),
      twitter: this.formatter.formatForTwitter(draft.draftContent, sources),
      tiktok: this.formatter.formatForTikTok(draft.draftContent, sources),
    };

    mockFormattedContent.set(draftId, formatted);
    draft.status = 'formatted';
    draft.updatedAt = new Date();

    return formatted;
  }

  async getFormattedContent(draftId: string): Promise<any> {
    const formatted = mockFormattedContent.get(draftId);
    if (!formatted) {
      throw new Error('No formatted content found');
    }
    return formatted;
  }

  async publishContent(draftId: string, userId: string, platforms: string[]): Promise<any> {
    const draft = mockDrafts.get(draftId);
    if (!draft || draft.userId !== userId) {
      throw new Error('Draft not found');
    }

    const formatted = mockFormattedContent.get(draftId);
    if (!formatted) {
      throw new Error('Content not formatted');
    }

    // Mock publish success
    const publishResults = platforms.reduce((acc, platform) => {
      acc[platform] = { success: true, message: 'Published successfully (mock)' };
      return acc;
    }, {} as any);

    draft.status = 'published';
    draft.updatedAt = new Date();

    return {
      success: true,
      platforms: publishResults,
      message: 'Content published successfully to all platforms',
    };
  }
}
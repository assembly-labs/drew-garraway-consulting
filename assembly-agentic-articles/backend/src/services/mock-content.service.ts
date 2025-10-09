import { v4 as uuidv4 } from 'uuid';
import { ClaudeService } from './claude.service';
import { ResearchService, ResearchSource } from './research.service';
import { PlatformFormatter } from '../utils/formatting';
import { ContentDraft } from './content.service';
import { Platform } from '../config/platforms';

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

  async conductResearch(draftId: string, options?: { append?: boolean }): Promise<ResearchSource[]> {
    const draft = mockDrafts.get(draftId);
    if (!draft) {
      throw new Error('Draft not found');
    }

    const newSources = await this.researchService.conductResearch(draft.originalIdea);

    // Add IDs to sources
    const sourcesWithIds = newSources.map(s => ({
      ...s,
      id: uuidv4(),
      userSelected: false
    }));

    if (options?.append) {
      // Append mode: get existing sources and deduplicate
      const existingSources = mockSources.get(draftId) || [];
      const existingUrls = new Set(existingSources.map(s => s.url));
      const uniqueNewSources = sourcesWithIds.filter(s => !existingUrls.has(s.url));

      mockSources.set(draftId, [...existingSources, ...uniqueNewSources]);
      return uniqueNewSources;
    } else {
      // Normal mode: replace all sources
      mockSources.set(draftId, sourcesWithIds);
      draft.status = 'draft';
      draft.updatedAt = new Date();
      return sourcesWithIds;
    }
  }

  async getSources(draftId: string): Promise<ResearchSource[]> {
    return mockSources.get(draftId) || [];
  }

  async selectSources(draftId: string, selectedSourceIds: string[]): Promise<void> {
    const sources = mockSources.get(draftId) || [];

    // Mark all as not selected
    sources.forEach(s => s.userSelected = false);

    // Mark selected ones as selected
    sources.forEach(s => {
      if (selectedSourceIds.includes(s.id || '')) {
        s.userSelected = true;
      }
    });

    mockSources.set(draftId, sources);
  }

  async incrementResearchRetry(draftId: string): Promise<void> {
    const draft = mockDrafts.get(draftId);
    if (draft) {
      // Add retry count tracking (store in draft object)
      (draft as any).research_retry_count = ((draft as any).research_retry_count || 0) + 1;
    }
  }

  async generateDraftContent(draftId: string, platforms: string[], contentLength: string, feedback?: string): Promise<Record<Platform, string>> {
    const draft = mockDrafts.get(draftId);
    if (!draft) {
      throw new Error('Draft not found');
    }

    // Validate platforms
    const validPlatforms = platforms.filter(p => p === 'linkedin' || p === 'twitter') as Platform[];
    if (validPlatforms.length === 0) {
      throw new Error('At least one valid platform must be selected (linkedin or twitter)');
    }

    // Validate content length
    const validLength = (contentLength === 'short' || contentLength === 'medium' || contentLength === 'long')
      ? contentLength
      : 'short'; // default to short

    // Get ONLY selected sources
    const allSources = mockSources.get(draftId) || [];
    const sources = allSources.filter(s => s.userSelected);

    if (sources.length === 0) {
      throw new Error('No sources selected. Please select at least 3 sources before generating content.');
    }

    if (sources.length < 3) {
      throw new Error(`Only ${sources.length} source(s) selected. Please select at least 3 sources.`);
    }

    // Generate content for each platform
    const generatedContent: Record<Platform, string> = {} as Record<Platform, string>;

    for (const platform of validPlatforms) {
      console.log(`📝 [MOCK] Generating ${platform} content (${validLength}) for draft ${draftId}`);
      const content = await this.claudeService.generateContent({
        idea: draft.originalIdea,
        sources,
        platform,
        contentLength: validLength,
        feedback
      });
      generatedContent[platform] = content;
    }

    // Store the primary content (use first platform's content as the draft_content)
    const primaryContent = generatedContent[validPlatforms[0]];
    draft.draftContent = primaryContent;
    draft.status = 'review';
    draft.updatedAt = new Date();

    return generatedContent;
  }

  async requestRevision(draftId: string, userId: string, platforms: string[], contentLength: string, feedback: string): Promise<Record<Platform, string>> {
    const draft = mockDrafts.get(draftId);
    if (!draft || draft.userId !== userId) {
      throw new Error('Draft not found');
    }

    if (draft.revisionCount >= 2) {
      throw new Error('Maximum revisions (2) reached');
    }

    // Validate platforms
    const validPlatforms = platforms.filter(p => p === 'linkedin' || p === 'twitter') as Platform[];
    if (validPlatforms.length === 0) {
      throw new Error('At least one valid platform must be selected (linkedin or twitter)');
    }

    // Validate content length
    const validLength = (contentLength === 'short' || contentLength === 'medium' || contentLength === 'long')
      ? contentLength
      : 'short'; // default to short

    const sources = mockSources.get(draftId) || [];

    // Generate revised content for each platform
    const generatedContent: Record<Platform, string> = {} as Record<Platform, string>;

    for (const platform of validPlatforms) {
      console.log(`📝 [MOCK] Revising ${platform} content (${validLength}) for draft ${draftId}`);
      const content = await this.claudeService.generateContent({
        idea: draft.originalIdea,
        sources,
        platform,
        contentLength: validLength,
        feedback
      });
      generatedContent[platform] = content;
    }

    // Update draft with primary content
    const primaryContent = generatedContent[validPlatforms[0]];
    draft.draftContent = primaryContent;
    draft.revisionCount++;
    draft.status = 'revised';
    draft.updatedAt = new Date();

    return generatedContent;
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
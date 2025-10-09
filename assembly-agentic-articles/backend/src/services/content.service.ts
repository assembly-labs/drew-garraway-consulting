import { Pool } from 'pg';
import { ClaudeService } from './claude.service';
import { ResearchService, ResearchSource } from './research.service';
import { PlatformFormatter } from '../utils/formatting';
import { Platform, validatePlatforms } from '../config/platforms';

export interface ContentDraft {
  id: string;
  userId: string;
  originalIdea: string;
  draftContent: string | null;
  status: string;
  revisionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ContentService {
  private claudeService: ClaudeService;
  private researchService: ResearchService;
  private formatter: PlatformFormatter;

  constructor(private dbPool: Pool) {
    this.claudeService = new ClaudeService();
    this.researchService = new ResearchService();
    this.formatter = new PlatformFormatter();
  }

  async createDraft(userId: string, idea: string): Promise<ContentDraft> {
    const result = await this.dbPool.query(
      `INSERT INTO content_drafts (user_id, original_idea, status)
       VALUES ($1, $2, 'draft')
       RETURNING id, user_id, original_idea, draft_content, status, revision_count, created_at, updated_at`,
      [userId, idea]
    );

    return this.mapRowToDraft(result.rows[0]);
  }

  async getDraft(draftId: string, userId: string): Promise<ContentDraft | null> {
    const result = await this.dbPool.query(
      `SELECT id, user_id, original_idea, draft_content, status, revision_count, created_at, updated_at
       FROM content_drafts
       WHERE id = $1 AND user_id = $2`,
      [draftId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToDraft(result.rows[0]);
  }

  async getUserDrafts(userId: string): Promise<ContentDraft[]> {
    const result = await this.dbPool.query(
      `SELECT id, user_id, original_idea, draft_content, status, revision_count, created_at, updated_at
       FROM content_drafts
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map(row => this.mapRowToDraft(row));
  }

  async conductResearch(draftId: string, options?: { append?: boolean }): Promise<ResearchSource[]> {
    // Get the draft
    const draftResult = await this.dbPool.query(
      'SELECT original_idea FROM content_drafts WHERE id = $1',
      [draftId]
    );

    if (draftResult.rows.length === 0) {
      throw new Error('Draft not found');
    }

    const idea = draftResult.rows[0].original_idea;

    // Update status to researching
    await this.dbPool.query(
      'UPDATE content_drafts SET status = $1 WHERE id = $2',
      ['researching', draftId]
    );

    // Conduct research
    const newSources = await this.researchService.conductResearch(idea, 10);

    if (options?.append) {
      // Append mode: Get existing source URLs to deduplicate
      const existingResult = await this.dbPool.query(
        'SELECT url FROM research_sources WHERE draft_id = $1',
        [draftId]
      );
      const existingUrls = new Set(existingResult.rows.map((r: any) => r.url));

      // Filter out duplicates
      const uniqueNewSources = newSources.filter(s => !existingUrls.has(s.url));

      // Insert only unique sources
      for (const source of uniqueNewSources) {
        await this.dbPool.query(
          `INSERT INTO research_sources
           (draft_id, url, title, excerpt, publication_date, domain_authority, credibility_score, source_type, user_selected)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)`,
          [
            draftId,
            source.url,
            source.title,
            source.excerpt,
            source.publicationDate || null,
            source.domainAuthority,
            source.credibilityScore,
            source.sourceType,
          ]
        );
      }

      // Update status back to idle (not drafting, user needs to select sources)
      await this.dbPool.query(
        'UPDATE content_drafts SET status = $1 WHERE id = $2',
        ['draft', draftId]
      );

      return uniqueNewSources;
    } else {
      // Normal mode: Delete old sources and insert new ones
      await this.dbPool.query('DELETE FROM research_sources WHERE draft_id = $1', [draftId]);

      // Save sources to database (user_selected defaults to false)
      for (const source of newSources) {
        await this.dbPool.query(
          `INSERT INTO research_sources
           (draft_id, url, title, excerpt, publication_date, domain_authority, credibility_score, source_type, user_selected)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)`,
          [
            draftId,
            source.url,
            source.title,
            source.excerpt,
            source.publicationDate || null,
            source.domainAuthority,
            source.credibilityScore,
            source.sourceType,
          ]
        );
      }

      // Update status to draft (not drafting, user needs to select sources)
      await this.dbPool.query(
        'UPDATE content_drafts SET status = $1 WHERE id = $2',
        ['draft', draftId]
      );

      return newSources;
    }
  }

  async getSources(draftId: string): Promise<ResearchSource[]> {
    const result = await this.dbPool.query(
      `SELECT id, url, title, excerpt, publication_date, domain_authority, credibility_score, source_type, user_selected
       FROM research_sources
       WHERE draft_id = $1
       ORDER BY credibility_score DESC`,
      [draftId]
    );

    return result.rows.map(row => ({
      id: row.id,
      url: row.url,
      title: row.title,
      excerpt: row.excerpt,
      publicationDate: row.publication_date,
      domainAuthority: row.domain_authority,
      credibilityScore: row.credibility_score,
      sourceType: row.source_type,
      userSelected: row.user_selected || false,
    }));
  }

  async generateDraftContent(draftId: string, platforms: string[], contentLength: string, feedback?: string): Promise<Record<Platform, string>> {
    // Validate platforms
    const validPlatforms = validatePlatforms(platforms);
    if (validPlatforms.length === 0) {
      throw new Error('At least one valid platform must be selected (linkedin or twitter)');
    }

    // Validate content length
    const validLength = (contentLength === 'short' || contentLength === 'medium' || contentLength === 'long')
      ? contentLength
      : 'short'; // default to short

    // Get ONLY selected sources
    const allSources = await this.getSources(draftId);
    const sources = allSources.filter(s => s.userSelected);

    if (sources.length === 0) {
      throw new Error('No sources selected. Please select at least 3 sources before generating content.');
    }

    if (sources.length < 3) {
      throw new Error(`Only ${sources.length} source(s) selected. Please select at least 3 sources.`);
    }

    // Get original idea
    const draftResult = await this.dbPool.query(
      'SELECT original_idea FROM content_drafts WHERE id = $1',
      [draftId]
    );

    const idea = draftResult.rows[0].original_idea;

    // Generate content for each platform
    const generatedContent: Record<Platform, string> = {} as Record<Platform, string>;

    for (const platform of validPlatforms) {
      console.log(`📝 Generating ${platform} content (${validLength}) for draft ${draftId}`);
      const content = await this.claudeService.generateContent({
        idea,
        sources,
        platform,
        contentLength: validLength,
        feedback,
      });
      generatedContent[platform] = content;
    }

    // Store the primary content (use first platform's content as the draft_content)
    const primaryContent = generatedContent[validPlatforms[0]];
    await this.dbPool.query(
      `UPDATE content_drafts
       SET draft_content = $1, status = 'review'
       WHERE id = $2`,
      [primaryContent, draftId]
    );

    // Store edit if this is a revision
    if (feedback) {
      const previousContent = await this.dbPool.query(
        'SELECT draft_content, user_id FROM content_drafts WHERE id = $1',
        [draftId]
      );

      if (previousContent.rows[0].draft_content) {
        await this.dbPool.query(
          `INSERT INTO user_edits (draft_id, user_id, original_text, edited_text, edit_type)
           VALUES ($1, $2, $3, $4, 'revision')`,
          [
            draftId,
            previousContent.rows[0].user_id,
            previousContent.rows[0].draft_content,
            primaryContent
          ]
        );
      }
    }

    return generatedContent;
  }

  async requestRevision(draftId: string, userId: string, platforms: string[], contentLength: string, feedback: string): Promise<Record<Platform, string>> {
    // Check revision count
    const result = await this.dbPool.query(
      `SELECT revision_count FROM content_drafts WHERE id = $1 AND user_id = $2`,
      [draftId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Draft not found');
    }

    const revisionCount = result.rows[0].revision_count;

    if (revisionCount >= 2) {
      throw new Error('Maximum revision limit reached (2 revisions)');
    }

    // Increment revision count and update status
    await this.dbPool.query(
      `UPDATE content_drafts
       SET revision_count = revision_count + 1, status = 'revising'
       WHERE id = $1 AND user_id = $2`,
      [draftId, userId]
    );

    // Generate revised content
    const revisedContent = await this.generateDraftContent(draftId, platforms, contentLength, feedback);

    return revisedContent;
  }

  async approveDraft(draftId: string, userId: string): Promise<void> {
    await this.dbPool.query(
      `UPDATE content_drafts
       SET status = 'approved'
       WHERE id = $1 AND user_id = $2`,
      [draftId, userId]
    );
  }

  async formatContent(draftId: string, platformContents: Record<Platform, string>): Promise<any> {
    // Get sources for formatting
    const sources = await this.getSources(draftId);

    // Format each platform's content
    const formatted: any = {};

    for (const [platform, content] of Object.entries(platformContents)) {
      if (platform === 'twitter') {
        formatted[platform] = this.formatter.formatForTwitter(content, sources);
      } else if (platform === 'linkedin') {
        formatted[platform] = this.formatter.formatForLinkedIn(content, sources);
      }

      // Save formatted version
      const contentStr = Array.isArray(formatted[platform])
        ? JSON.stringify(formatted[platform])
        : formatted[platform];

      await this.dbPool.query(
        `INSERT INTO platform_content (draft_id, platform, formatted_content)
         VALUES ($1, $2, $3)
         ON CONFLICT (draft_id, platform)
         DO UPDATE SET formatted_content = $3`,
        [draftId, platform, contentStr]
      );
    }

    return formatted;
  }

  async getFormattedContent(draftId: string): Promise<any> {
    const result = await this.dbPool.query(
      `SELECT platform, formatted_content
       FROM platform_content
       WHERE draft_id = $1`,
      [draftId]
    );

    const formatted: any = {};
    result.rows.forEach(row => {
      if (row.platform === 'twitter') {
        formatted[row.platform] = JSON.parse(row.formatted_content);
      } else {
        formatted[row.platform] = row.formatted_content;
      }
    });

    return formatted;
  }

  async publishContent(draftId: string, userId: string, platforms: string[]): Promise<any> {
    // For MVP, we just mark as published and return the formatted content
    // Actual social media APIs would be integrated here

    await this.dbPool.query(
      `UPDATE content_drafts
       SET status = 'published'
       WHERE id = $1 AND user_id = $2`,
      [draftId, userId]
    );

    // Update platform content with published timestamp
    for (const platform of platforms) {
      await this.dbPool.query(
        `UPDATE platform_content
         SET published_at = NOW()
         WHERE draft_id = $1 AND platform = $2`,
        [draftId, platform]
      );
    }

    return {
      success: true,
      message: 'Content ready for publishing. Copy and paste to your chosen platforms.',
      platforms,
    };
  }

  async selectSources(draftId: string, selectedSourceIds: string[]): Promise<void> {
    // First, mark ALL sources for this draft as NOT selected
    await this.dbPool.query(
      'UPDATE research_sources SET user_selected = false WHERE draft_id = $1',
      [draftId]
    );

    // Then, mark ONLY the selected IDs as selected
    if (selectedSourceIds.length > 0) {
      await this.dbPool.query(
        'UPDATE research_sources SET user_selected = true WHERE id = ANY($1) AND draft_id = $2',
        [selectedSourceIds, draftId]
      );
    }
  }

  async incrementResearchRetry(draftId: string): Promise<void> {
    await this.dbPool.query(
      'UPDATE content_drafts SET research_retry_count = research_retry_count + 1 WHERE id = $1',
      [draftId]
    );
  }

  private mapRowToDraft(row: any): ContentDraft {
    return {
      id: row.id,
      userId: row.user_id,
      originalIdea: row.original_idea,
      draftContent: row.draft_content,
      status: row.status,
      revisionCount: row.revision_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
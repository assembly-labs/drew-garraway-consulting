import { Pool } from 'pg';
import { ClaudeService } from './claude.service';
import { ResearchService, ResearchSource } from './research.service';
import { PlatformFormatter } from '../utils/formatting';

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

  async conductResearch(draftId: string): Promise<ResearchSource[]> {
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
    const sources = await this.researchService.conductResearch(idea, 10);

    // Save sources to database
    for (const source of sources) {
      await this.dbPool.query(
        `INSERT INTO research_sources
         (draft_id, url, title, excerpt, publication_date, domain_authority, credibility_score, source_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
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

    // Update status to drafting
    await this.dbPool.query(
      'UPDATE content_drafts SET status = $1 WHERE id = $2',
      ['drafting', draftId]
    );

    return sources;
  }

  async getSources(draftId: string): Promise<ResearchSource[]> {
    const result = await this.dbPool.query(
      `SELECT url, title, excerpt, publication_date, domain_authority, credibility_score, source_type
       FROM research_sources
       WHERE draft_id = $1
       ORDER BY credibility_score DESC`,
      [draftId]
    );

    return result.rows.map(row => ({
      url: row.url,
      title: row.title,
      excerpt: row.excerpt,
      publicationDate: row.publication_date,
      domainAuthority: row.domain_authority,
      credibilityScore: row.credibility_score,
      sourceType: row.source_type,
    }));
  }

  async generateDraftContent(draftId: string, feedback?: string): Promise<string> {
    // Get sources
    const sources = await this.getSources(draftId);

    if (sources.length === 0) {
      throw new Error('No research sources found. Please conduct research first.');
    }

    // Get original idea
    const draftResult = await this.dbPool.query(
      'SELECT original_idea FROM content_drafts WHERE id = $1',
      [draftId]
    );

    const idea = draftResult.rows[0].original_idea;

    // Generate content with Claude
    const content = await this.claudeService.generateContent({
      idea,
      sources,
      feedback,
    });

    // Update draft
    await this.dbPool.query(
      `UPDATE content_drafts
       SET draft_content = $1, status = 'review'
       WHERE id = $2`,
      [content, draftId]
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
            content
          ]
        );
      }
    }

    return content;
  }

  async requestRevision(draftId: string, userId: string, feedback: string): Promise<string> {
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
    const revisedContent = await this.generateDraftContent(draftId, feedback);

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

  async formatContent(draftId: string): Promise<any> {
    // Get draft content
    const draftResult = await this.dbPool.query(
      'SELECT draft_content FROM content_drafts WHERE id = $1',
      [draftId]
    );

    if (draftResult.rows.length === 0 || !draftResult.rows[0].draft_content) {
      throw new Error('Draft content not found');
    }

    const content = draftResult.rows[0].draft_content;

    // Get sources
    const sources = await this.getSources(draftId);

    // Format for all platforms
    const formatted = await this.formatter.formatForAllPlatforms(content, sources);

    // Save formatted versions
    for (const [platform, formattedContent] of Object.entries(formatted)) {
      const contentStr = Array.isArray(formattedContent)
        ? JSON.stringify(formattedContent)
        : formattedContent;

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
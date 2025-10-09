import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { ContentService } from '../services/content.service';
import { MockContentService } from '../services/mock-content.service';
import { z } from 'zod';

// Validation schemas
const createDraftSchema = z.object({
  idea: z.string().min(5).max(200),
});

const revisionSchema = z.object({
  feedback: z.string().min(10).max(500),
});

const publishSchema = z.object({
  platforms: z.array(z.enum(['linkedin', 'twitter', 'tiktok'])).min(1),
});

const selectSourcesSchema = z.object({
  selectedSourceIds: z.array(z.string().uuid()).min(3, 'At least 3 sources must be selected'),
});

export function createContentRoutes(dbPool: Pool | null): Router {
  const router = Router();
  // Use mock service if database is not available
  const contentService: any = dbPool
    ? new ContentService(dbPool)
    : new MockContentService();

  // For MVP, we'll use a hardcoded user ID
  const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

  // Create a new draft
  router.post('/drafts', async (req: Request, res: Response): Promise<void> => {
    try {
      const { idea } = createDraftSchema.parse(req.body);
      const userId = req.headers['user-id'] as string || DEFAULT_USER_ID;

      const draft = await contentService.createDraft(userId, idea);
      res.status(201).json({
        success: true,
        draft,
      });
    } catch (error: any) {
      console.error('Create draft error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create draft',
      });
    }
  });

  // Get all drafts for user
  router.get('/drafts', async (req: Request, res: Response) => {
    try {
      const userId = req.headers['user-id'] as string || DEFAULT_USER_ID;
      const drafts = await contentService.getUserDrafts(userId);

      res.json({
        success: true,
        drafts,
      });
    } catch (error: any) {
      console.error('Get drafts error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch drafts',
      });
    }
  });

  // Get a specific draft
  router.get('/drafts/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.headers['user-id'] as string || DEFAULT_USER_ID;

      const draft = await contentService.getDraft(id, userId);

      if (!draft) {
        res.status(404).json({
          success: false,
          error: 'Draft not found',
        });
        return;
      }

      res.json({
        success: true,
        draft,
      });
    } catch (error: any) {
      console.error('Get draft error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch draft',
      });
    }
  });

  // Conduct research for a draft
  router.post('/drafts/:id/research', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const sources = await contentService.conductResearch(id);

      // Get retry info
      const draft = await contentService.getDraft(id);
      const retryCount = (draft as any)?.research_retry_count || 0;
      const canRetry = retryCount < 2;

      res.json({
        success: true,
        sources,
        retryCount,
        canRetry,
        message: 'Research completed successfully',
      });
    } catch (error: any) {
      console.error('Research error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to conduct research',
      });
    }
  });

  // Get research sources for a draft
  router.get('/drafts/:id/sources', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const sources = await contentService.getSources(id);

      res.json({
        success: true,
        sources,
      });
    } catch (error: any) {
      console.error('Get sources error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch sources',
      });
    }
  });

  // Select sources for content generation
  router.post('/drafts/:id/sources/select', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { selectedSourceIds } = selectSourcesSchema.parse(req.body);

      await contentService.selectSources(id, selectedSourceIds);

      res.json({
        success: true,
        selectedCount: selectedSourceIds.length,
        message: 'Source selection saved successfully',
      });
    } catch (error: any) {
      console.error('Source selection error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: error.errors[0]?.message || 'At least 3 sources must be selected',
          details: error.errors,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to save source selection',
      });
    }
  });

  // Retry research (Find More Sources)
  router.post('/drafts/:id/research/retry', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check retry limit
      const draft = await contentService.getDraft(id);
      const retryCount = (draft as any)?.research_retry_count || 0;

      if (retryCount >= 2) {
        res.status(400).json({
          success: false,
          error: 'Maximum research retries (2) reached for this draft',
        });
        return;
      }

      // Increment retry count
      await contentService.incrementResearchRetry(id);

      // Run research again (append mode)
      const newSources = await contentService.conductResearch(id, { append: true });

      res.json({
        success: true,
        newSources,
        retryCount: retryCount + 1,
        canRetry: retryCount + 1 < 2,
        message: `Found ${newSources.length} additional sources`,
      });
    } catch (error: any) {
      console.error('Research retry error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to retry research',
      });
    }
  });

  // Generate content for a draft
  router.post('/drafts/:id/generate', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const content = await contentService.generateDraftContent(id);

      res.json({
        success: true,
        content,
        message: 'Content generated successfully',
      });
    } catch (error: any) {
      console.error('Generate content error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate content',
      });
    }
  });

  // Request revision for a draft
  router.post('/drafts/:id/revise', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { feedback } = revisionSchema.parse(req.body);
      const userId = req.headers['user-id'] as string || DEFAULT_USER_ID;

      const revisedContent = await contentService.requestRevision(id, userId, feedback);

      res.json({
        success: true,
        content: revisedContent,
        message: 'Content revised successfully',
      });
    } catch (error: any) {
      console.error('Revision error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to revise content',
      });
    }
  });

  // Approve a draft
  router.post('/drafts/:id/approve', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.headers['user-id'] as string || DEFAULT_USER_ID;

      await contentService.approveDraft(id, userId);

      res.json({
        success: true,
        message: 'Draft approved successfully',
      });
    } catch (error: any) {
      console.error('Approve draft error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to approve draft',
      });
    }
  });

  // Format content for platforms
  router.post('/drafts/:id/format', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const formatted = await contentService.formatContent(id);

      res.json({
        success: true,
        formatted,
        message: 'Content formatted for all platforms',
      });
    } catch (error: any) {
      console.error('Format content error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to format content',
      });
    }
  });

  // Get formatted content
  router.get('/drafts/:id/formatted', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const formatted = await contentService.getFormattedContent(id);

      res.json({
        success: true,
        formatted,
      });
    } catch (error: any) {
      console.error('Get formatted content error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch formatted content',
      });
    }
  });

  // Publish content
  router.post('/drafts/:id/publish', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { platforms } = publishSchema.parse(req.body);
      const userId = req.headers['user-id'] as string || DEFAULT_USER_ID;

      const result = await contentService.publishContent(id, userId, platforms);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Publish content error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to publish content',
      });
    }
  });

  return router;
}
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, validateEnv } from './config/env';
import { dbPool, testConnection, closeDatabase } from './config/database';
import { createContentRoutes } from './routes/content.routes';

// Validate environment variables
validateEnv();

// Start server
async function startServer() {
  try {
    // TEST DATABASE FIRST (before creating routes)
    console.log('🔍 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected && config.env === 'production') {
      throw new Error('Failed to connect to database in production mode');
    }

    // Determine which pool to use (null = mock service)
    const servicePool = dbConnected ? dbPool : null;
    const mode = dbConnected ? 'DATABASE' : 'MOCK DATA';

    console.log(`✅ Running in ${mode} mode\n`);

    // NOW create Express app with correct pool
    const app: Express = express();

    // Middleware
    app.use(helmet());
    app.use(cors({
      origin: config.frontend.url,
      credentials: true,
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });
    app.use('/api', limiter);

    // Health check
    app.get('/health', (_req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.env,
        mode: mode,
        database: dbConnected ? 'connected' : 'not connected',
      });
    });

    // API routes - Pass tested pool (null if no DB = uses MockContentService)
    app.use('/api/content', createContentRoutes(servicePool));

    // 404 handler
    app.use((_req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    });

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: any) => {
      console.error('Server error:', err);
      res.status(err.status || 500).json({
        success: false,
        error: config.env === 'development' ? err.message : 'Internal server error',
      });
    });

    // Start listening
    const server = app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║   AI Content Platform Backend                     ║
║   Environment: ${config.env.padEnd(34)}║
║   Port: ${String(config.port).padEnd(41)}║
║   Frontend: ${config.frontend.url.padEnd(37)}║
║   Mode: ${mode.padEnd(41)}║
╚══════════════════════════════════════════════════╝

📝 API Endpoints:
   POST   /api/content/drafts                 - Create draft
   GET    /api/content/drafts                 - List drafts
   GET    /api/content/drafts/:id            - Get draft
   POST   /api/content/drafts/:id/research   - Conduct research
   GET    /api/content/drafts/:id/sources    - Get sources
   POST   /api/content/drafts/:id/generate   - Generate content
   POST   /api/content/drafts/:id/revise     - Request revision
   POST   /api/content/drafts/:id/approve    - Approve draft
   POST   /api/content/drafts/:id/format     - Format content
   GET    /api/content/drafts/:id/formatted  - Get formatted
   POST   /api/content/drafts/:id/publish    - Publish content

🚀 Server is running on http://localhost:${config.port}
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n📛 SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await closeDatabase();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\n📛 SIGINT signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await closeDatabase();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

import { Pool } from 'pg';
import { config } from './env';

// Initialize as null, will be set if database is available
export let dbPool: Pool | null = null;

// Try to create database pool
try {
  dbPool = new Pool({
    connectionString: config.database.url,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} catch (error) {
  console.warn('⚠️ Database pool creation failed, using mock data');
  dbPool = null;
}

// Test database connection
export async function testConnection() {
  if (!dbPool) {
    console.warn('⚠️ No database pool available, using mock data');
    return false;
  }

  try {
    const client = await dbPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // Set pool to null on connection failure
    dbPool = null;
    return false;
  }
}

// Graceful shutdown
export async function closeDatabase() {
  if (dbPool) {
    await dbPool.end();
    console.log('Database pool closed');
  }
}
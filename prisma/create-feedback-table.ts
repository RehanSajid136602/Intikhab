import { config } from 'dotenv';
config({ path: '.env.local' });
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL,
        rating INTEGER,
        message TEXT NOT NULL,
        email TEXT,
        contact_permission BOOLEAN DEFAULT FALSE,
        page_url TEXT DEFAULT '',
        status TEXT DEFAULT 'new',
        notified_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
    `);
    console.log('Feedback table created!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();

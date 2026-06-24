import { config } from 'dotenv';
config({ path: '.env.local' });
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  try {
    await pool.query(`
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS subject TEXT;
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS experience_category TEXT;
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS name TEXT;
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS order_id TEXT;
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS would_recommend TEXT;
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS heard_from TEXT;
    `);
    console.log('Columns added successfully');
  } catch (e) {
    console.error(e);
  }
  await pool.end();
}

main();

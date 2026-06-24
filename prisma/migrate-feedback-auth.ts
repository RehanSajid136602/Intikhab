import { config } from 'dotenv';
config({ path: '.env.local' });
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  try {
    await pool.query(`
      ALTER TABLE feedback ADD COLUMN IF NOT EXISTS customer_email TEXT;
      CREATE INDEX IF NOT EXISTS idx_feedback_customer_email ON feedback(customer_email);
    `);
    console.log('customer_email column added');
  } catch (e) {
    console.error(e);
  }
  await pool.end();
}

main();

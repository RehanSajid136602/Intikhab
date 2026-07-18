import { config } from 'dotenv';
config({ path: '.env.local' });
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('No connection string found in environment!');
    process.exit(1);
  }
  
  const pool = new Pool({ connectionString });
  try {
    console.log('Dropping unused profiles table...');
    await pool.query('DROP TABLE IF EXISTS public.profiles CASCADE;');
    console.log('Profiles table dropped successfully!');
  } catch (err) {
    console.error('Error dropping profiles table:', err);
  } finally {
    await pool.end();
  }
}

main();

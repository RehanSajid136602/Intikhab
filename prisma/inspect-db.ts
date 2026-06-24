import { config } from 'dotenv';
config({ path: '.env.local' });
import { Pool } from 'pg';
import * as fs from 'fs';

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('No connection string found in environment!');
    process.exit(1);
  }
  
  const pool = new Pool({ connectionString });
  let out = '';

  function log(msg: string) {
    out += msg + '\n';
  }

  try {
    // 1. Get all tables
    log('\n=== TABLES ===');
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    out += JSON.stringify(tablesRes.rows, null, 2) + '\n';

    // 2. Get migration history
    log('\n=== PRISMA MIGRATIONS ===');
    const migrationsRes = await pool.query(`
      SELECT id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count
      FROM _prisma_migrations
      ORDER BY started_at;
    `);
    
    const migrationSummary = migrationsRes.rows.map(row => ({
      id: row.id,
      migration_name: row.migration_name,
      started_at: row.started_at,
      finished_at: row.finished_at,
      applied_steps_count: row.applied_steps_count,
      is_failed: row.finished_at === null && row.rolled_back_at === null,
      has_logs: !!row.logs,
      logs: row.logs
    }));
    out += JSON.stringify(migrationSummary, null, 2) + '\n';

    // 3. Get key columns from important tables
    const targetTables = ['products', 'customers', 'orders', 'order_items', 'carts', 'coupons', 'addresses', 'reviews', 'categories', 'wishlist_items', 'feedback'];
    for (const table of targetTables) {
      const exists = tablesRes.rows.some(t => t.table_name === table);
      if (exists) {
        log(`\n=== TABLE: ${table} ===`);
        const colsRes = await pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `, [table]);
        log('--- COLUMNS ---');
        out += JSON.stringify(colsRes.rows, null, 2) + '\n';

        log('--- INDEXES ---');
        const idxRes = await pool.query(`
          SELECT indexname, indexdef
          FROM pg_indexes
          WHERE schemaname = 'public' AND tablename = $1;
        `, [table]);
        out += JSON.stringify(idxRes.rows, null, 2) + '\n';

        log('--- CONSTRAINTS ---');
        const consRes = await pool.query(`
          SELECT 
            conname AS constraint_name, 
            pg_get_constraintdef(c.oid) AS constraint_definition
          FROM pg_constraint c
          JOIN pg_namespace n ON n.oid = c.connamespace
          JOIN pg_class cl ON cl.oid = c.conrelid
          WHERE n.nspname = 'public' AND cl.relname = $1;
        `, [table]);
        out += JSON.stringify(consRes.rows, null, 2) + '\n';
      } else {
        log(`\n=== TABLE: ${table} (Does not exist) ===`);
      }
    }

    fs.writeFileSync('DATABASE_INSPECT_RAW.txt', out);
    console.log('Saved inspection output to DATABASE_INSPECT_RAW.txt');
  } catch (err) {
    console.error('Error during query:', err);
  } finally {
    await pool.end();
  }
}

main();

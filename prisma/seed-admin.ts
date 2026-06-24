/**
 * Seed script for Admin Users: creates the admin_users table and inserts/updates admin emails.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  console.log('🌱 Seeding database with admin users...');
  
  const adminEmailsString = process.env.ADMIN_EMAILS || '';
  const adminEmails = adminEmailsString
    .split(',')
    .map((val) => val.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    console.log('⚠️ No ADMIN_EMAILS found in environment variables. Skipping.');
    return;
  }

  console.log(`Allowed admin emails to seed: ${adminEmails.join(', ')}`);

  const pool = new pg.Pool({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Create table directly using pg Pool to bypass Prisma schema introspection issues
  const client = await pool.connect();
  try {
    console.log('🛠 Creating admin_users table if not exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users (email);
      CREATE INDEX IF NOT EXISTS admin_users_active_idx ON admin_users (active);
    `);
    console.log('✅ admin_users table is ready.');
  } finally {
    client.release();
  }

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  let inserted = 0;
  for (const email of adminEmails) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO admin_users (id, email, role, active, created_at, updated_at) 
       VALUES (gen_random_uuid(), $1, 'admin', true, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET active = true, updated_at = NOW()`,
      email
    );
    inserted++;
  }

  console.log(`✅ Successfully seeded ${inserted} admin users.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Admin seeding failed:', e);
  process.exit(1);
});

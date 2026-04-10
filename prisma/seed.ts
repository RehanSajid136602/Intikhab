/**
 * Seed script: imports products from src/data/products.ts and upserts them
 * into the Supabase database via Prisma.
 *
 * Run with: npx prisma db seed
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '../src/generated/prisma/index.js';
import { products } from '../src/data/products';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  console.log('🌱 Seeding database with products from static data...');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('DIRECT_URL exists:', !!process.env.DIRECT_URL);

  const pool = new pg.Pool({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);

  // Test pool directly
  const client = await pool.connect();
  const testResult = await client.query('SELECT NOW()');
  console.log('Direct pool test OK:', testResult.rows[0]);
  client.release();

  const prisma = new PrismaClient({ adapter });

  let created = 0;
  let updated = 0;

  for (const product of products) {
    const result = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        images: product.images,
        badge: product.badge ?? null,
        inStock: product.inStock,
        stock: product.stock,
        installment: product.installment,
        description: product.description,
        status: product.status,
        sizes: product.sizes ?? [],
      },
      create: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        images: product.images,
        badge: product.badge ?? null,
        inStock: product.inStock,
        stock: product.stock,
        installment: product.installment,
        description: product.description,
        sku: product.sku,
        status: product.status,
        sizes: product.sizes ?? [],
      },
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
  }

  console.log(`✅ Seeded: ${created} created, ${updated} updated`);

  const count = await prisma.product.count();
  console.log(`📦 Total products in database: ${count}`);

  await prisma.$disconnect();
  await pool.end();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });

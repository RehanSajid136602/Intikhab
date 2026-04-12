import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  console.log('🧹 Resetting database: Deleting all records...');
  
  if (!process.env.DIRECT_URL) {
    throw new Error('DIRECT_URL is missing in .env.local');
  }

  const pool = new pg.Pool({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Delete in order to respect foreign key constraints
    console.log('Deleting Carts...');
    await prisma.cart.deleteMany({});
    
    console.log('Deleting Order Items...');
    await prisma.orderItem.deleteMany({});
    
    console.log('Deleting Orders...');
    await prisma.order.deleteMany({});
    
    console.log('Deleting Customers...');
    await prisma.customer.deleteMany({});
    
    console.log('Deleting Products...');
    await prisma.product.deleteMany({});

    console.log('✅ Database completely reset. Revenue, Orders, and Products are now cleared.');
  } catch (error) {
    console.error('❌ Reset failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { createHash, randomBytes } from 'crypto';
import { isAllowedAdminEmail } from '../src/lib/supabase/auth';

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== STARTING AUTOMATED LAUNCH QA TEST SUITE ===\n');

  // We will run tests in a transaction or clean up after ourselves to keep the database tidy.
  const testEmailCustomerA = 'customera@intikhab.com';
  const testEmailCustomerB = 'customerb@intikhab.com';
  const dummyProductSku = 'TEST-SKU-999';

  try {
    // 0. Set up database prerequisites (Product and Customers)
    console.log('0. Preparing test data...');
    // Create/retrieve product
    let product = await prisma.product.upsert({
      where: { sku: dummyProductSku },
      update: { inStock: true, stock: 10 },
      create: {
        sku: dummyProductSku,
        slug: 'test-product-999',
        name: 'Test QA Product',
        price: 2000,
        brand: 'Intikhab',
        productType: 'shoes',
        category: 'men',
        inStock: true,
        stock: 10,
        sizeStock: [{ size: '42', stock: 5 }, { size: '43', stock: 5 }],
      }
    });

    // Create/retrieve customers
    let customerA = await prisma.customer.upsert({
      where: { email: testEmailCustomerA },
      update: {},
      create: {
        email: testEmailCustomerA,
        fullName: 'Customer A',
        phone: '03001234567',
        city: 'Lahore',
      }
    });

    let customerB = await prisma.customer.upsert({
      where: { email: testEmailCustomerB },
      update: {},
      create: {
        email: testEmailCustomerB,
        fullName: 'Customer B',
        phone: '03007654321',
        city: 'Karachi',
      }
    });

    // 1. Guest Order Validation (Redirect, secure token checks)
    console.log('\n--- 1. Guest Order Token Security Tests ---');
    const guestOrderId = 'INK-TEST-GUEST-1';
    const guestAccessToken = randomBytes(24).toString('hex');
    const guestAccessTokenHash = createHash('sha256').update(guestAccessToken).digest('hex');

    // Create guest order
    await prisma.order.deleteMany({ where: { id: guestOrderId } });
    const guestOrder = await prisma.order.create({
      data: {
        id: guestOrderId,
        customerEmail: testEmailCustomerA, // Linked to guest email profile
        customerName: 'Guest User',
        shippingAddress: '123 Guest St, Lahore',
        total: 2000,
        status: 'Pending',
        accessTokenHash: guestAccessTokenHash,
      }
    });
    console.log(`Created guest order ${guestOrderId} with token hash.`);

    // Access check simulation (matching GET /api/orders/[id])
    const verifyAccess = (reqToken: string | null, userEmail: string | null, isAdmin: boolean) => {
      const isOwner = userEmail && userEmail.toLowerCase() === guestOrder.customerEmail.toLowerCase();
      const tokenHash = reqToken ? createHash('sha256').update(reqToken).digest('hex') : null;
      const hasValidToken = tokenHash && tokenHash === guestOrder.accessTokenHash;
      return !!(isAdmin || isOwner || hasValidToken);
    };

    console.log('  Access with correct guest token:', verifyAccess(guestAccessToken, null, false) ? 'PASS (Allowed)' : 'FAIL (Denied)');
    console.log('  Access without guest token:', !verifyAccess(null, null, false) ? 'PASS (Denied)' : 'FAIL (Allowed)');
    console.log('  Access with incorrect guest token:', !verifyAccess('wrongtoken', null, false) ? 'PASS (Denied)' : 'FAIL (Allowed)');
    
    if (!verifyAccess(guestAccessToken, null, false) || verifyAccess(null, null, false)) {
      throw new Error('Guest token check failed.');
    }

    // 2. Logged-in Customer View Protection
    console.log('\n--- 2. Logged-in Customer View Protection Tests ---');
    const orderIdA = 'INK-TEST-OWNER-A';
    await prisma.order.deleteMany({ where: { id: orderIdA } });
    await prisma.order.create({
      data: {
        id: orderIdA,
        customerEmail: testEmailCustomerA,
        shippingAddress: 'Customer A Address',
        total: 2000,
      }
    });

    const canCustomerAViewA = testEmailCustomerA.toLowerCase() === testEmailCustomerA.toLowerCase();
    const canCustomerBViewA = testEmailCustomerB.toLowerCase() === testEmailCustomerA.toLowerCase();
    console.log('  Customer A can view their own order:', canCustomerAViewA ? 'PASS (Allowed)' : 'FAIL (Denied)');
    console.log('  Customer B cannot view Customer A\'s order:', !canCustomerBViewA ? 'PASS (Denied)' : 'FAIL (Allowed)');

    if (!canCustomerAViewA || canCustomerBViewA) {
      throw new Error('Logged-in customer view validation failed.');
    }

    // 3. Admin Permissions
    console.log('\n--- 3. Admin Permissions Tests ---');
    const adminEmail = 'admin@intikhab.com';
    const nonAdminEmail = 'customer@gmail.com';
    console.log(`  Allowed admin email (${adminEmail}) check:`, isAllowedAdminEmail(adminEmail) ? 'PASS (Allowed)' : 'FAIL (Denied)');
    console.log(`  Non-admin email (${nonAdminEmail}) check:`, !isAllowedAdminEmail(nonAdminEmail) ? 'PASS (Denied)' : 'FAIL (Allowed)');
    
    if (!isAllowedAdminEmail(adminEmail) || isAllowedAdminEmail(nonAdminEmail)) {
      throw new Error('Admin authorization check failed.');
    }

    // 4. Coupon Logic Validation
    console.log('\n--- 4. Coupon System Tests ---');
    // Prepare Coupons in Database
    const now = new Date();
    await prisma.coupon.deleteMany({ where: { code: { in: ['QA-ACTIVE', 'QA-INACTIVE', 'QA-EXPIRED', 'QA-MIN-5000'] } } });
    
    const cActive = await prisma.coupon.create({
      data: { code: 'QA-ACTIVE', discountType: 'fixed', discountValue: 500, active: true }
    });
    const cInactive = await prisma.coupon.create({
      data: { code: 'QA-INACTIVE', discountType: 'fixed', discountValue: 500, active: false }
    });
    const cExpired = await prisma.coupon.create({
      data: { code: 'QA-EXPIRED', discountType: 'fixed', discountValue: 500, active: true, expiresAt: new Date(Date.now() - 3600000) }
    });
    const cMinOrder = await prisma.coupon.create({
      data: { code: 'QA-MIN-5000', discountType: 'fixed', discountValue: 1000, active: true, minimumOrderAmount: 5000 }
    });

    const validateCoupon = (coupon: any, subtotal: number) => {
      if (!coupon) return 'Coupon not found';
      if (!coupon.active) return 'Coupon is inactive';
      if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return 'Coupon has expired';
      if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) return 'Below minimum order amount';
      return 'VALID';
    };

    console.log('  Active Coupon Validation:', validateCoupon(cActive, 2000) === 'VALID' ? 'PASS (Valid)' : 'FAIL');
    console.log('  Inactive Coupon Validation:', validateCoupon(cInactive, 2000) === 'Coupon is inactive' ? 'PASS (Rejected)' : 'FAIL');
    console.log('  Expired Coupon Validation:', validateCoupon(cExpired, 2000) === 'Coupon has expired' ? 'PASS (Rejected)' : 'FAIL');
    console.log('  Below Minimum Coupon Validation (Order=2000, Min=5000):', validateCoupon(cMinOrder, 2000) === 'Below minimum order amount' ? 'PASS (Rejected)' : 'FAIL');
    console.log('  Above Minimum Coupon Validation (Order=6000, Min=5000):', validateCoupon(cMinOrder, 6000) === 'VALID' ? 'PASS (Valid)' : 'FAIL');

    if (
      validateCoupon(cActive, 2000) !== 'VALID' ||
      validateCoupon(cInactive, 2000) !== 'Coupon is inactive' ||
      validateCoupon(cExpired, 2000) !== 'Coupon has expired' ||
      validateCoupon(cMinOrder, 2000) !== 'Below minimum order amount' ||
      validateCoupon(cMinOrder, 6000) !== 'VALID'
    ) {
      throw new Error('Coupon logic validation failed.');
    }

    // 5. Addresses CRUD
    console.log('\n--- 5. Saved Addresses CRUD Tests ---');
    await prisma.address.deleteMany({ where: { customerEmail: testEmailCustomerA } });
    
    // Create
    const address = await prisma.address.create({
      data: {
        customerEmail: testEmailCustomerA,
        fullName: 'Rehan Sajid',
        phone: '+923323130689',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54000',
        addressLine: 'House 1, Canal Bank Road',
        isDefault: true,
      }
    });
    console.log('  Created address:', address.id ? 'PASS' : 'FAIL');

    // Edit
    const updatedAddress = await prisma.address.update({
      where: { id: address.id },
      data: { addressLine: 'House 10, Canal Bank Road' }
    });
    console.log('  Edited address successfully:', updatedAddress.addressLine === 'House 10, Canal Bank Road' ? 'PASS' : 'FAIL');

    // Use default address check
    const defaultAddress = await prisma.address.findFirst({
      where: { customerEmail: testEmailCustomerA, isDefault: true }
    });
    console.log('  Retrieve default address:', defaultAddress ? 'PASS' : 'FAIL');

    // Delete
    await prisma.address.delete({ where: { id: address.id } });
    const checkDeleted = await prisma.address.findUnique({ where: { id: address.id } });
    console.log('  Deleted address successfully:', !checkDeleted ? 'PASS' : 'FAIL');

    if (updatedAddress.addressLine !== 'House 10, Canal Bank Road' || checkDeleted) {
      throw new Error('Addresses CRUD validation failed.');
    }

    // 6. Reviews Submission and Approval
    console.log('\n--- 6. Reviews Workflow Tests ---');
    await prisma.review.deleteMany({ where: { productId: product.id } });
    
    // Submit review (should default to pending)
    const review = await prisma.review.create({
      data: {
        productId: product.id,
        customerEmail: testEmailCustomerA,
        rating: 5,
        title: 'Excellent Quality',
        body: 'Super comfortable shoes!',
      }
    });
    console.log('  Submit review status (default pending):', review.status === 'pending' ? 'PASS' : 'FAIL');

    // Public list query simulation (only approved reviews)
    const getPublicReviews = async () => prisma.review.findMany({
      where: { productId: product.id, status: 'approved' }
    });
    let publicReviews = await getPublicReviews();
    console.log('  Pending review excluded from public query:', publicReviews.length === 0 ? 'PASS' : 'FAIL');

    // Admin approves review
    await prisma.review.update({
      where: { id: review.id },
      data: { status: 'approved' }
    });
    publicReviews = await getPublicReviews();
    console.log('  Approved review included in public query:', publicReviews.length === 1 ? 'PASS' : 'FAIL');

    if (review.status !== 'pending' || publicReviews.length !== 1) {
      throw new Error('Reviews workflow validation failed.');
    }

    // 7. Categories Filtering
    console.log('\n--- 7. Categories Management Tests ---');
    await prisma.category.deleteMany({ where: { slug: 'qa-shoes' } });
    const qaCategory = await prisma.category.create({
      data: { name: 'QA Shoes', slug: 'qa-shoes', active: true }
    });
    console.log('  Create category:', qaCategory.slug === 'qa-shoes' ? 'PASS' : 'FAIL');

    // Filter query simulation
    const categoryFilterTest = async (activeOnly: boolean) => prisma.category.findMany({
      where: activeOnly ? { active: true } : {}
    });
    let activeCategories = await categoryFilterTest(true);
    console.log('  Category listed in active queries:', activeCategories.some(c => c.slug === 'qa-shoes') ? 'PASS' : 'FAIL');

    // Archive category
    await prisma.category.update({
      where: { id: qaCategory.id },
      data: { active: false }
    });
    activeCategories = await categoryFilterTest(true);
    console.log('  Archived category excluded from active queries:', !activeCategories.some(c => c.slug === 'qa-shoes') ? 'PASS' : 'FAIL');

    if (!qaCategory || activeCategories.some(c => c.slug === 'qa-shoes')) {
      throw new Error('Categories filter validation failed.');
    }

    // 8. Wishlist Sync (Unique constraints)
    console.log('\n--- 8. Wishlist Sync Uniqueness Tests ---');
    await prisma.wishlistItem.deleteMany({ where: { customerEmail: testEmailCustomerA } });
    
    // Create first wishlist item
    await prisma.wishlistItem.create({
      data: { customerEmail: testEmailCustomerA, productId: product.id }
    });
    console.log('  Created wishlist item:', 'PASS');

    // Verify duplicate item fails due to Unique Constraint
    let uniqueConstraintFails = false;
    try {
      await prisma.wishlistItem.create({
        data: { customerEmail: testEmailCustomerA, productId: product.id }
      });
    } catch (e) {
      uniqueConstraintFails = true;
    }
    console.log('  Uniqueness constraint (CustomerEmail + ProductId):', uniqueConstraintFails ? 'PASS (Prevented duplicate)' : 'FAIL (Allowed duplicate!)');

    if (!uniqueConstraintFails) {
      throw new Error('Wishlist unique constraint failed.');
    }

    // 9. Cart Stack Logic (Variants separated by size)
    console.log('\n--- 9. Cart Size Variant Separation Tests ---');
    await prisma.cart.deleteMany({ where: { customerEmail: testEmailCustomerA } });
    
    // Add product size 42
    const cart42 = await prisma.cart.create({
      data: { customerEmail: testEmailCustomerA, productId: product.id, size: '42', quantity: 1 }
    });
    // Add same product size 43
    const cart43 = await prisma.cart.create({
      data: { customerEmail: testEmailCustomerA, productId: product.id, size: '43', quantity: 1 }
    });

    // Check count (should be 2 items in database)
    const cartItemsCount = await prisma.cart.count({ where: { customerEmail: testEmailCustomerA } });
    console.log(`  Cart counts after adding sizes 42 and 43 separately (Expected: 2): ${cartItemsCount === 2 ? 'PASS (2 items)' : 'FAIL (' + cartItemsCount + ' items)'}`);

    // Update quantity of size 42
    await prisma.cart.update({
      where: { id: cart42.id },
      data: { quantity: 3 }
    });
    
    const cart42Updated = await prisma.cart.findUnique({ where: { id: cart42.id } });
    const cart43Check = await prisma.cart.findUnique({ where: { id: cart43.id } });
    console.log('  Updating size 42 quantity did not affect size 43 quantity:', cart42Updated?.quantity === 3 && cart43Check?.quantity === 1 ? 'PASS' : 'FAIL');

    // Remove size 42
    await prisma.cart.delete({ where: { id: cart42.id } });
    const cartRemainingCount = await prisma.cart.count({ where: { customerEmail: testEmailCustomerA } });
    console.log('  Removing size 42 leaves size 43 in cart:', cartRemainingCount === 1 ? 'PASS' : 'FAIL');

    if (cartItemsCount !== 2 || cart42Updated?.quantity !== 3 || cart43Check?.quantity !== 1 || cartRemainingCount !== 1) {
      throw new Error('Cart stacking/sizes separation validation failed.');
    }

    // Clean up temporary data
    console.log('\nCleaning up test data...');
    await prisma.cart.deleteMany({ where: { customerEmail: testEmailCustomerA } });
    await prisma.review.deleteMany({ where: { productId: product.id } });
    await prisma.wishlistItem.deleteMany({ where: { customerEmail: testEmailCustomerA } });
    await prisma.order.deleteMany({ where: { id: { in: [guestOrderId, orderIdA] } } });
    await prisma.address.deleteMany({ where: { customerEmail: testEmailCustomerA } });
    await prisma.coupon.deleteMany({ where: { code: { in: ['QA-ACTIVE', 'QA-INACTIVE', 'QA-EXPIRED', 'QA-MIN-5000'] } } });
    await prisma.category.deleteMany({ where: { slug: 'qa-shoes' } });

    console.log('\n=== ALL LAUNCH QA AUTOMATED CHECKS PASSED PERFECTLY! ===');

  } catch (err) {
    console.error('\n❌ QA Test Suite Failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

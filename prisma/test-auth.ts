import { config } from 'dotenv';
config({ path: '.env.local' });
import { isAllowedAdminEmail } from '../src/lib/supabase/auth';

async function main() {
  console.log('--- TESTING ADMIN EMAIL AUTHORIZATION RULES ---');

  // Test 1: Allowed admin email
  const allowedEmail = 'admin@intikhab.com';
  const isAllowed1 = isAllowedAdminEmail(allowedEmail);
  console.log(`Test 1 (Allowed email: ${allowedEmail}):`, isAllowed1 ? 'PASS (Allowed)' : 'FAIL (Denied)');
  if (!isAllowed1) {
    throw new Error('Test 1 failed: admin@intikhab.com should be allowed');
  }

  // Test 2: Case insensitivity
  const allowedEmailCaps = 'AdMiN@InTiKhAb.CoM';
  const isAllowed2 = isAllowedAdminEmail(allowedEmailCaps);
  console.log(`Test 2 (Case insensitivity: ${allowedEmailCaps}):`, isAllowed2 ? 'PASS (Allowed)' : 'FAIL (Denied)');
  if (!isAllowed2) {
    throw new Error('Test 2 failed: AdMiN@InTiKhAb.CoM should be allowed (case-insensitive)');
  }

  // Test 3: Non-admin email
  const nonAdminEmail = 'customer@gmail.com';
  const isAllowed3 = isAllowedAdminEmail(nonAdminEmail);
  console.log(`Test 3 (Non-admin email: ${nonAdminEmail}):`, !isAllowed3 ? 'PASS (Denied)' : 'FAIL (Allowed)');
  if (isAllowed3) {
    throw new Error('Test 3 failed: customer@gmail.com should be denied');
  }

  // Test 4: Missing email
  const isAllowed4 = isAllowedAdminEmail(undefined);
  console.log('Test 4 (Undefined email):', !isAllowed4 ? 'PASS (Denied)' : 'FAIL (Allowed)');
  if (isAllowed4) {
    throw new Error('Test 4 failed: undefined should be denied');
  }

  // Test 5: Fail-closed when ADMIN_EMAILS env var is empty
  const originalEnv = process.env.ADMIN_EMAILS;
  try {
    process.env.ADMIN_EMAILS = '';
    const isAllowed5 = isAllowedAdminEmail('admin@intikhab.com');
    console.log('Test 5 (Fail-closed with empty ADMIN_EMAILS):', !isAllowed5 ? 'PASS (Denied)' : 'FAIL (Allowed)');
    if (isAllowed5) {
      throw new Error('Test 5 failed: empty ADMIN_EMAILS environment variable should fail closed (deny all)');
    }
  } finally {
    process.env.ADMIN_EMAILS = originalEnv;
  }

  console.log('--- ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY! ---');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

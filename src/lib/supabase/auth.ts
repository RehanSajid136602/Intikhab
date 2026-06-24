/**
 * Utility: verify admin authentication in API routes.
 * Uses the anon key with request cookies to validate session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Emergency synchronous fallback check.
 */
export function isAllowedAdminEmail(email?: string | null) {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!email || adminEmails.length === 0) {
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}

/**
 * Database-backed admin access check with environment fallback.
 */
export async function checkAdminAccess(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('active')
      .eq('email', normalizedEmail)
      .single();

    if (!error && data) {
      return data.active;
    }
  } catch (err) {
    console.error('Error verifying admin access via database:', err);
  }

  // Emergency fallback
  return isAllowedAdminEmail(normalizedEmail);
}

export async function verifyAdmin(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {
        // Can't set cookies in API routes, but middleware handles it
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await checkAdminAccess(user.email))) {
    return { authenticated: false, user: null };
  }

  return { authenticated: true, user };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

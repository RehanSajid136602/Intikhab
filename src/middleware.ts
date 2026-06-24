import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { isAllowedAdminEmail } from '@/lib/auth/admin-emails';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.(svg|png|jpg|jpeg|gif|webp|avif|ico)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Admin routes: protect with Better Auth + Admin verification
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
      return NextResponse.next();
    }

    // Read the session cookie name used by Better Auth (standard is better-auth.session_token)
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Call Better Auth session API endpoint internally
    const getSessionUrl = new URL('/api/auth/get-session', request.url);
    const sessionRes = await fetch(getSessionUrl, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    }).catch(() => null);

    if (!sessionRes || !sessionRes.ok) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const session = await sessionRes.json().catch(() => null);
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const email = session.user.email.trim().toLowerCase();
    let isAllowed = isAllowedAdminEmail(email);

    if (!isAllowed) {
      // Check database via Supabase client (Edge-safe HTTP call)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll() {},
          },
        });

        const { data: adminData } = await supabase
          .from('admin_users')
          .select('active')
          .eq('email', email)
          .single();

        if (adminData && adminData.active) {
          isAllowed = true;
        }
      }
    }

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};

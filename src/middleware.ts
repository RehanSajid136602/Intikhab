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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Admin routes: protect with Better Auth + Admin verification
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
      return NextResponse.next();
    }

    // Read the session cookie — check both standard and __Secure- prefix (HTTPS)
    const sessionToken =
      request.cookies.get('better-auth.session_token')?.value ||
      request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Validate session via direct database lookup (edge-compatible Supabase REST API).
    // This replaces the former self-referential fetch to /api/auth/get-session,
    // which was unreliable on Vercel (Edge-to-Serverless internal routing can
    // strip/delay cookie propagation or silently time out).
    let userEmail: string | null = null;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll() {},
          },
        });

        // Look up the session by its token
        const { data: sessionRecord } = await supabase
          .from('session')
          .select('expires_at, user_id')
          .eq('token', sessionToken)
          .maybeSingle();

        if (sessionRecord) {
          const expiresAt = new Date(sessionRecord.expires_at);
          if (expiresAt > new Date()) {
            // Session is valid — fetch the associated user's email
            const { data: userRecord } = await supabase
              .from('user')
              .select('email')
              .eq('id', sessionRecord.user_id)
              .single();

            if (userRecord) {
              userEmail = userRecord.email;
            }
          }
        }
      } catch (err) {
        console.error('Middleware: direct session DB lookup failed', err);
      }
    }

    // Fallback: try self-referential fetch if direct DB query didn't resolve
    if (!userEmail) {
      try {
        const baseUrl = process.env.BETTER_AUTH_URL || request.url;
        const getSessionUrl = new URL('/api/auth/get-session', baseUrl);
        const sessionRes = await fetch(getSessionUrl, {
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
        });

        if (sessionRes && sessionRes.ok) {
          const session = await sessionRes.json();
          if (session?.user?.email) {
            userEmail = session.user.email;
          }
        }
      } catch (err) {
        console.error('Middleware: fallback fetch get-session failed', err);
      }
    }

    if (!userEmail) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const email = userEmail.trim().toLowerCase();
    let isAllowed = isAllowedAdminEmail(email);

    if (!isAllowed) {
      // Check database via Supabase client (Edge-safe HTTP call)
      if (supabaseUrl && supabaseAnonKey) {
        try {
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
        } catch (err) {
          console.error('Middleware: Supabase admin_users lookup failed', err);
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

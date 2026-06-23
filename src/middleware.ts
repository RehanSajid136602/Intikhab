import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Fast static assets exclusion check inside middleware logic
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

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // Refresh session without blocking the request
    await supabase.auth.getSession();

    // Admin route protection
    if (pathname.startsWith('/admin')) {
      const isLoginPage = pathname === '/admin/login';

      if (isLoginPage) {
        return supabaseResponse;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/admin/login', request.url);
        // Create redirect response
        const redirectResponse = NextResponse.redirect(loginUrl);
        // Copy cookies to ensure auth state sync if needed
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value, {
            path: cookie.path,
            domain: cookie.domain,
            secure: cookie.secure,
            sameSite: cookie.sameSite,
            expires: cookie.expires,
            maxAge: cookie.maxAge,
            httpOnly: cookie.httpOnly,
          });
        });
        return redirectResponse;
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};


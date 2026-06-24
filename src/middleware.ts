import { auth0 } from "@/lib/auth0";
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { isAllowedAdminEmail } from '@/lib/supabase/auth';

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

  // Admin routes: use Supabase Auth (email/password login)
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
      return NextResponse.next();
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    let isAllowed = false;
    if (user && user.email) {
      const normalizedEmail = user.email.trim().toLowerCase();
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('active')
        .eq('email', normalizedEmail)
        .single();

      if (adminData && adminData.active) {
        isAllowed = true;
      } else {
        isAllowed = isAllowedAdminEmail(normalizedEmail);
      }
    }

    if (!isAllowed) {
      const loginUrl = new URL('/admin/login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, {
          path: cookie.path, domain: cookie.domain, secure: cookie.secure,
          sameSite: cookie.sameSite, expires: cookie.expires,
          maxAge: cookie.maxAge, httpOnly: cookie.httpOnly,
        });
      });
      return redirectResponse;
    }

    return supabaseResponse;
  }

  // All other routes (storefront): use Auth0
  const auth0Response = await auth0.middleware(request);

  // Auth0 middleware returns null for non-auth routes — pass through
  if (auth0Response) {
    return auth0Response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};

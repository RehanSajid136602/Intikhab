import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';

/**
 * Admin dashboard layout with sidebar and topbar.
 * Only applies to pages inside the (dashboard) route group.
 * /admin/login is NOT wrapped by this layout.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Can't set cookies in server components, handled by middleware
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-brand-light-gray">
      <Sidebar userEmail={session.user.email} />
      <div className="ml-[260px]">
        <TopBar pageTitle="Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

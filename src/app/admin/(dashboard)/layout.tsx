import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';
import { checkAdminAccess } from '@/lib/supabase/auth';

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
        // Cookies set via middleware; no-op in server components
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await checkAdminAccess(user.email))) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-brand-light-gray">
      <Sidebar userEmail={user.email} />
      <div className="ml-[260px]">
        <TopBar pageTitle="Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

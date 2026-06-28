import { requireAdmin } from '@/lib/auth/requireAdmin';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const user = session.user;

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

import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';

/**
 * Admin layout with separate sidebar, topbar, and content area.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-light-gray">
      <Sidebar />
      <div className="ml-[260px]">
        <TopBar pageTitle="Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

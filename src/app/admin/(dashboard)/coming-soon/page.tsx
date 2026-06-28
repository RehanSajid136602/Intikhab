import { requireAdmin } from '@/lib/auth/requireAdmin';
import AdminComingSoonClient from './AdminComingSoonClient';

export default async function AdminComingSoonPage() {
  await requireAdmin();
  return <AdminComingSoonClient />;
}

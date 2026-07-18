'use client';

import { useSession } from '@/lib/auth-client';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  const { data: session } = useSession();

  return (
    <Navbar
      isAuthenticated={!!session}
      userEmail={session?.user.email}
    />
  );
}

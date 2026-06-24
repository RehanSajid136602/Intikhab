import { auth0 } from "@/lib/auth0";
import { Navbar } from "./Navbar";

export async function NavbarWrapper() {
  let isAuthenticated = false;
  let userEmail: string | undefined;

  try {
    const session = await auth0.getSession();
    if (session) {
      isAuthenticated = true;
      userEmail = session.user.email ?? undefined;
    }
  } catch {
    // Auth0 not configured or error — show logged-out state
  }

  return <Navbar isAuthenticated={isAuthenticated} userEmail={userEmail} />;
}

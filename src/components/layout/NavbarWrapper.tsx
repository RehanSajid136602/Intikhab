import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "./Navbar";

export async function NavbarWrapper() {
  let isAuthenticated = false;
  let userEmail: string | undefined;

  try {
    const session = await auth.api.getSession({
      headers: headers(),
    }).catch(() => null);

    if (session) {
      isAuthenticated = true;
      userEmail = session.user.email;
    }
  } catch (e) {
    console.error("Error reading session in NavbarWrapper:", e);
  }

  return <Navbar isAuthenticated={isAuthenticated} userEmail={userEmail} />;
}


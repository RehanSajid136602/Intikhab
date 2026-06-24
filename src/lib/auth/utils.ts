import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Helper to retrieve the current logged-in customer email.
 * Returns null if the user is not authenticated.
 */
export async function getCurrentCustomerEmail(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    }).catch(() => null);
    
    return session?.user?.email || null;
  } catch (err) {
    console.error("Error retrieving current customer email:", err);
    return null;
  }
}

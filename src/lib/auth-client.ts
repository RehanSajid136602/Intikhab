import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Fallbacks to standard local app base URL if NEXT_PUBLIC_APP_URL is not set
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signUp, signOut } = authClient;

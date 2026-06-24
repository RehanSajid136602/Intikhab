import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = getMetadata({
  title: "Login — Intikhab",
  description: "Log in to your Intikhab account to view your orders, addresses, and wishlist.",
  path: "/login",
});

interface PageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);

  if (session) {
    redirect(searchParams.callbackUrl || "/");
  }

  return <LoginForm callbackUrl={searchParams.callbackUrl} />;
}

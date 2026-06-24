import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = getMetadata({
  title: "Sign Up — Intikhab",
  description: "Create an Intikhab account to save your addresses and manage your orders.",
  path: "/signup",
});

export default async function SignupPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);

  if (session) {
    redirect("/account");
  }

  return <SignupForm />;
}

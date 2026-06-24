import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AddressesClient } from "./AddressesClient";

export default async function AddressesPage() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Saved Addresses</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage delivery details for faster checkout.
            </p>
          </div>
          <Link href="/account" className="ghost-cta">
            Account
          </Link>
        </div>
        <AddressesClient />
      </div>
    </div>
  );
}

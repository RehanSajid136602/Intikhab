import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User, LogOut, Package, MapPin } from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "./ProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("customers")
    .select("fullName, phone, city")
    .eq("email", user.email)
    .single();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">My Account</h1>
          <p className="text-zinc-500 text-sm mt-1">{user.name || user.email || "Welcome back"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-zinc-100 text-zinc-900 font-medium whitespace-nowrap">
                <User className="w-4 h-4" />
                Dashboard
              </span>
              <Link
                href="/account/orders"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                <Package className="w-4 h-4" />
                Order History
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4" />
                Saved Addresses
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                Back to Store
              </Link>
              <a
                href="/auth/logout"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </a>
            </nav>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {user.image && (
              <div className="flex items-center gap-4 bg-white border border-zinc-200 rounded-xl p-5">
                <img
                  src={user.image}
                  alt=""
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold text-zinc-900">{user.name || "User"}</p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>
            )}

            {!user.image && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-zinc-100">
                    <dt className="text-zinc-500">Name</dt>
                    <dd className="text-zinc-900 font-medium">{user.name || "—"}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100">
                    <dt className="text-zinc-500">Email</dt>
                    <dd className="text-zinc-900 font-medium">{user.email || "—"}</dd>
                  </div>
                </dl>
              </div>
            )}

            <ProfileForm
              authName={user.name || ""}
              authEmail={user.email || ""}
              savedName={profile?.fullName || ""}
              savedPhone={profile?.phone || ""}
              savedCity={profile?.city || ""}
            />
          </main>
        </div>
      </div>
    </div>
  );
}


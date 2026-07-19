'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Shield, LogOut } from 'lucide-react';
import { verifyAdminAccessAction } from '@/app/admin/actions';
import { signIn, signOut, useSession } from '@/lib/auth-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    const initAuthCheck = async () => {
      if (isPending) return;

      try {
        if (session && session.user && session.user.email) {
          const allowed = await verifyAdminAccessAction(session.user.email);
          if (allowed) {
            window.location.href = '/admin';
            return;
          } else {
            setUserEmail(session.user.email);
            setIsUnauthorized(true);
          }
        }
      } catch (err) {
        console.error('Error during initial auth verification:', err);
      } finally {
        setIsChecking(false);
      }
    };
    initAuthCheck();
  }, [session, isPending, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await signIn.email({
        email,
        password,
      }, {
        onSuccess: async () => {
          // Override automatic redirect to perform admin authorization check manually
        }
      });

      if (response?.error) {
        toast.error(response.error.message || 'Authentication failed.');
        setIsLoading(false);
        return;
      }

      const activeUser = response?.data?.user;
      if (activeUser && activeUser.email) {
        const allowed = await verifyAdminAccessAction(activeUser.email);
        if (allowed) {
          toast.success('Signed in successfully.');
          setIsLoading(false);
          window.location.href = '/admin';
        } else {
          setUserEmail(activeUser.email);
          setIsUnauthorized(true);
          setIsLoading(false);
        }
      } else {
        toast.error('Unable to retrieve user session.');
        setIsLoading(false);
      }
    } catch {
      toast.error('An error occurred while logging in');
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsChecking(true);
    try {
      await signOut();
      setUserEmail(null);
      setIsUnauthorized(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Error during signout:', err);
      toast.error('Failed to sign out properly');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="text-center font-mono space-y-4 relative z-10">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
          <p className="text-[10px] uppercase tracking-widest text-cyan-400">Verifying authorization status...</p>
        </div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-red-400 font-mono text-[9px] tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          ACCESS BLOCKED
        </div>

        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-8 shadow-2xl relative z-10">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
                Unauthorized Email
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Security clearance failure
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 mb-6 font-mono text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              You are signed in as: <strong className="text-cyan-400">{userEmail}</strong>
            </p>
            <p className="text-red-400/90 font-sans">
              You are signed in, but this email is not allowed to access the admin panel.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs tracking-widest uppercase py-3 rounded-lg transition-all active:scale-[0.99] font-medium"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Sign Out / Switch Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-10 pointer-events-none" />
      
      {/* Cyber/Tech Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Console Status Badge */}
      <div className="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-[9px] tracking-wider uppercase mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        SECURE INTERNAL ACCESS
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="relative w-9 h-9 opacity-80 filter invert brightness-200">
            <Image
              src="/favicon.ico"
              alt="Intikhab Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
              Intikhab Admin
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Store operations control panel
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5"
            >
              Access Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-4 py-2.5 text-slate-200 text-sm font-mono placeholder-slate-700 outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
              placeholder="operator@intikhab.pk"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5"
            >
              Security Passphrase
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-4 py-2.5 text-slate-200 text-sm font-mono placeholder-slate-700 outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800/50 disabled:text-slate-500 disabled:border-slate-800 disabled:cursor-not-allowed border border-cyan-500/30 text-white font-mono text-xs tracking-widest uppercase py-3 rounded-lg transition-all active:scale-[0.99] font-medium mt-2 shadow-lg shadow-cyan-950/30"
          >
            {isLoading ? 'Verifying credentials...' : 'Authenticate'}
          </button>
        </form>

        {/* Tech Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center font-mono text-[9px] tracking-widest text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5 uppercase text-slate-400">
            <Shield className="w-3.5 h-3.5 text-cyan-500/70 animate-pulse" />
            Protected System Access
          </div>
          <p className="uppercase text-[8px] text-slate-500">
            Orders &bull; Inventory &bull; Customers
          </p>
        </div>

      </div>
    </div>
  );
}

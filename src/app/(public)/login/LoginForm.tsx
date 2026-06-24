"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true);
    try {
      const response = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl || "/",
      });

      if (response?.error) {
        toast.error(response.error.message || "Failed to log in. Please check your credentials.");
      } else {
        toast.success("Successfully logged in!");
        router.push(callbackUrl || "/");
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-brand-background">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md space-y-8 surface-card p-8 rounded-card border border-brand-border shadow-md"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold uppercase tracking-wider text-brand-dark">
            Intikhab
          </h2>
          <p className="mt-2 text-xs text-brand-dark/60 font-medium uppercase tracking-widest">
            Log in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-brand-dark/45" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`form-field pl-10 ${
                    errors.email ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20" : ""
                  }`}
                  placeholder="name@example.com"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-brand-red">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-brand-dark/45" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`form-field pl-10 pr-10 ${
                    errors.password ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20" : ""
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-dark/45 hover:text-brand-dark/75 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-brand-red">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-dark hover:bg-black text-white py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-brand-border">
          <p className="text-xs text-brand-dark/60 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-red font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

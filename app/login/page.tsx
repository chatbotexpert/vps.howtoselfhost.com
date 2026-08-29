"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Server, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Failed to login");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-accent/10 border border-accent/20 rounded-2xl mb-4 text-accent">
              <Server className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-sm text-muted mt-2">Manage your servers and deployments</p>
          </div>

          <div className="bg-surface py-8 px-6 sm:px-8 shadow-sm border border-divider rounded-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-divider rounded-xl shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-sm bg-background text-foreground transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-foreground mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-divider rounded-xl shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-sm bg-background text-foreground transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-accent focus:ring-accent/40 border-divider rounded bg-background"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-muted">
                    Remember me
                  </label>
                </div>

                <a href="#" className="font-medium text-accent hover:underline">
                  Forgot password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-accent/20 text-sm font-semibold text-white dark:text-background bg-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-muted">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-accent hover:underline transition-colors">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
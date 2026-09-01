"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Server, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requiresVerification) {
          setRequiresVerification(true);
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        setError(data.error || "Failed to register");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: verificationCode }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Verification failed");
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
              {requiresVerification ? "Check your email" : "Create an account"}
            </h2>
            <p className="text-sm text-muted mt-2">
              {requiresVerification ? `We sent a code to ${formData.email}` : "Get started with dedicated cloud compute"}
            </p>
          </div>

          <div className="bg-surface py-8 px-6 sm:px-8 shadow-sm border border-divider rounded-2xl">
            {error && (
              <div className="p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {!requiresVerification ? (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 border border-divider rounded-xl shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-sm bg-background text-foreground transition-colors"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 border border-divider rounded-xl shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-sm bg-background text-foreground transition-colors"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 border border-divider rounded-xl shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-sm bg-background text-foreground transition-colors"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 border border-divider rounded-xl shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-sm bg-background text-foreground transition-colors"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-accent/20 text-sm font-semibold text-white dark:text-background bg-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Creating Account..." : "Sign up"}
                  </button>
                </div>

                <div className="pt-2 text-center text-xs text-muted">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-accent hover:underline transition-colors">
                    Sign in
                  </Link>
                </div>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleVerify}>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 text-center">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="w-full px-3.5 py-3 text-center tracking-widest text-lg font-mono border border-divider rounded-xl shadow-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent bg-background text-foreground transition-colors"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-accent/20 text-sm font-semibold text-white dark:text-background bg-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Verifying..." : "Verify & Log In"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

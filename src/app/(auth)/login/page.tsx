"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/_components/ui/Button";
import { Input } from "@/_components/ui/Input";
import { useAuth } from "@/features/auth/useAuth";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { isLoading } = useProtectedRoute({
    requireAuth: false,
    redirectTo: "/",
  });

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const email = formState.email.trim();
    const password = formState.password.trim();

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    // cegah submit ganda
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await login({
        email,
        password,
      });
      router.push("/");
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Unable to login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // biar nggak kedip pas hooknya lagi cek auth
  if (isLoading) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-16">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="text-base text-slate-600">
            Access your lead dashboard by signing in to your account.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-600"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-600"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={formState.password}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-primary hover:text-blue-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;

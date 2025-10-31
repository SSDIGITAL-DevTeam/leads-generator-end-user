"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/useAuth";

interface UseProtectedRouteOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

export const useProtectedRoute = (
  options: UseProtectedRouteOptions = {}
) => {
  const { requireAuth = true, redirectTo } = options;
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo ?? "/login");
    }

    if (!requireAuth && isAuthenticated) {
      router.replace(redirectTo ?? "/dashboard");
    }
  }, [requireAuth, isAuthenticated, redirectTo, router, isLoading]);

  return {
    isAuthenticated,
    isLoading
  };
};

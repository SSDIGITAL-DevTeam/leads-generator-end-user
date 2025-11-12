"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";

interface UseProtectedRouteOptions {
  // kalau true, user harus login
  requireAuth?: boolean;
  // harus berupa path ("/..."), biar cocok sama typed route Next
  redirectTo?: `/${string}`;
}

export const useProtectedRoute = (
  options: UseProtectedRouteOptions = {}
) => {
  const { requireAuth = true, redirectTo } = options;
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // kalau butuh auth tapi belum login
    if (requireAuth && !isAuthenticated) {
      // default ke /login
      const target = (redirectTo ?? "/login") as `/${string}`;
      router.replace(target as any);
      return;
    }

    // kalau TIDAK butuh auth (misal di /login) tapi user SUDAH login
    if (!requireAuth && isAuthenticated) {
      // default ke dashboard utama
      const target = (redirectTo ?? "/pages/dashboard") as `/${string}`;
      router.replace(target as any);
    }
  }, [requireAuth, isAuthenticated, redirectTo, router, isLoading]);

  return {
    isAuthenticated,
    isLoading,
  };
};

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthContextValue, LoginPayload, User } from "./types";
import {
  loginToBackend,
  registerToBackend,
} from "@/lib/api";

const AUTH_TOKEN_KEY = "app_token";
const AUTH_USER_KEY = "app_user";

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // load dari localStorage pas awal
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const savedUser = window.localStorage.getItem(AUTH_USER_KEY);
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async ({ email, password }: LoginPayload) => {
      // call route Next.js → teruskan ke Go
      const token = await loginToBackend(email, password);

      const authenticatedUser: User = {
        // topbar butuh name → ambil dari email
        name: email.split("@")[0],
        email,
      };

      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      window.localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(authenticatedUser)
      );
      setUser(authenticatedUser);
    },
    []
  );

  // register langsung ke backend, lalu auto-login
  const register = useCallback(
    async ({ email, password }: LoginPayload) => {
      const token = await registerToBackend(email, password);

      const authenticatedUser: User = {
        name: email.split("@")[0],
        email,
      };

      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      window.localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(authenticatedUser)
      );
      setUser(authenticatedUser);
    },
    []
  );

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      // override: login & logout; register kita selipin ke login page
      login,
      logout,
      register,
    }),
    [user, isLoading, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};

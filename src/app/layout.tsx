import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/features/auth/AuthProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lead Generator | Business Data Finder",
  description:
    "Discover qualified business leads with a guided filtering experience tailored for growth teams."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-slate-100">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

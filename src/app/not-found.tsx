"use client";

import Link from "next/link";

import { Button } from "@/_components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg shadow-slate-200">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M4.52 19h14.96c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L2.79 16c-.77 1.33.19 3 1.73 3z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-3xl font-semibold text-slate-900">
          Page Not Found
        </h1>
        <p className="mb-8 text-base text-slate-600">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s
          guide you back to the dashboard.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 min-h-[3rem] items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-base font-medium text-white transition-colors duration-200 ease-in-out hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

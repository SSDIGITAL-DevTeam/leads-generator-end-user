"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Topbar } from "@/_components/Topbar";
import { buttonStyles } from "@/_components/ui/Button";
import { Modal } from "@/_components/ui/Modal";
import { useAuth } from "@/features/auth/useAuth";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { DataTable } from "@/_components/DataTable";
import { businessLeads } from "@/lib/mockData";
import { useFilters } from "@/features/search/useFilters";
import { ResultTable } from "@/features/search/ResultTable";


const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, open, close } = useModal(false);

    const { filters, filteredData, setFilter, resetFilters } =
      useFilters(businessLeads);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      open();
    } else {
      close();
    }
  }, [isAuthenticated, isLoading, open, close]);

  return (
    <>
      {/* MODAL LOGIN DULU */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Silakan login dulu"
        description="Masuk ke akun Lead Generator untuk mengakses dashboard dan mulai mencari data bisnis yang relevan."
        action={
          <Link
            href="/login"
            onClick={close}
            className={cn(
              buttonStyles.base,
              buttonStyles.variants.primary,
              "w-full justify-center"
            )}
          >
            Pergi ke Halaman Login
          </Link>
        }
      >
        <p>
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-primary hover:text-blue-600"
          >
            Buat akun baru sekarang.
          </Link>
        </p>
      </Modal>

      {/* WRAPPER HALAMAN */}
      <main className="min-h-screen bg-[#E9ECF3]">
        {/* TOPBAR GELAP (sudah punya komponen) */}
        <Topbar />

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 pt-8 lg:px-0">
          {/* HOW TO USE SECTION */}
          <section className="rounded-xl">
            <h2 className="mb-4 text-lg font-semibold text-[#22538C]">
              How to Use the Lead Generator
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "1. Set Your Filters",
                  desc: "Use the expandable filter sections below to define your desired criteria such as job titles, seniority levels, industry types, and geographic regions.",
                },
                {
                  title: "2. Search Database",
                  desc: "Click 'Search Database' to apply your selected filters and access relevant leads from our extensive database.",
                },
                {
                  title: "3. Review Results",
                  desc: "Review the detailed lead information in the results table below, including contact availability status and company details.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-slate-100 bg-[#F6F7FB] p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FILTERS SECTION */}
          <section className="overflow-hidden">
            {/* header atas putih */}
            <header className="flex items-center justify-between gap-2 bg-white px-6 py-4 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3366FF]/10 text-[#3366FF]">
                  {/* icon filter */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path d="M3 5h18" strokeLinecap="round" />
                    <path d="M6 12h12" strokeLinecap="round" />
                    <path d="M10 19h4" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-800">Filters</p>
              </div>
              <button className="text-slate-400 transition hover:text-slate-500">
                {/* panah collapse */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    d="m9 5 7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </header>

            {/* body abu-abu muda seperti gambar */}
            <div className=" px-6 pb-6 pt-4">
              {/* judul data filter dengan icon lingkaran */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#3366FF]/30 text-[#3366FF]">
                  {/* icon semacam refresh/filter */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path
                      d="M4 4v5h.582M20 20v-5h-.581"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.843 15A6.002 6.002 0 0 0 18 13.197"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.157 9A6.002 6.002 0 0 0 6 10.803"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Data Filter
                  </p>
                </div>
              </div>

              {/* 2 kolom persis seperti gambar */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* kolom kiri: input panjang */}
                <div className="space-y-4">
                  {/* Type Business */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Type Business
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Marketing Manager, Founder"
                      className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Rating
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., San Francisco"
                      className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                    />
                  </div>
                </div>

                {/* kolom kanan: city & country */}
                <div className="space-y-4">
                  {/* City */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Berlin"
                      className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Germany"
                      className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                    />
                  </div>
                </div>
              </div>

              {/* bar tombol bawah */}
              <div className="mt-6 flex flex-col gap-3 lg:flex-row">
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#3366FF] bg-white px-6 text-sm font-semibold text-[#1F3F7F] transition hover:bg-[#f3f5ff] lg:w-[230px]">
                  {/* icon clear */}
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#EEF0F6] text-base">
                    🧹
                  </span>
                  CLEAR ALL FILTERS
                </button>
                <button
                  // kalau belum login panggil modal
                  onClick={() => {
                    // nanti di-isi dari parent
                    // if (!isAuthenticated) open();
                  }}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2E65FF] text-sm font-semibold text-white transition hover:bg-[#2050CC]"
                >
                  <span className="text-lg leading-none">🔍</span>
                  SEARCH DATABASE
                </button>
              </div>
            </div>
          </section>

          {/* RESULT SECTION */}
          <section className="rounded-xl bg-white shadow-sm">
            {/* table */}
            <div className="w-full overflow-x-auto">
              <ResultTable data={filteredData} total={businessLeads.length} />
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default LandingPage;

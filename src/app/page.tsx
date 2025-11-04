"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/_components/Topbar";
import { buttonStyles } from "@/_components/ui/Button";
import { Modal } from "@/_components/ui/Modal";
import { useAuth } from "@/features/auth/useAuth";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { businessLeads } from "@/lib/mockData";
import { useFilters } from "@/features/search/useFilters";
import { ResultTable } from "@/features/search/ResultTable";
import { Pagination } from "@/_components/ui/Pagination";

const DEFAULT_PAGE_SIZE = 10;

/* -------------------------------------------------------------------------- */
/*  SearchableSelect (dropdown + search, no library)                          */
/* -------------------------------------------------------------------------- */
interface SearchableSelectProps {
  label: string;
  placeholder?: string;
  value?: string;
  onSelect: (value: string | undefined) => void;
  options: string[];
  disabled?: boolean;
}

function SearchableSelect({
  label,
  placeholder = "Type to search...",
  value,
  onSelect,
  options,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // tutup kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // filter berdasarkan query
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="mb-1 block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-full border border-[#C7D5FF] bg-white px-4 text-left text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20",
          disabled && "cursor-not-allowed bg-slate-100 text-slate-400"
        )}
      >
        <span className={cn(!value && "text-slate-400")}>
          {value || placeholder}
        </span>
        <span className="flex items-center gap-1">
          {value ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelect(undefined);
                setQuery("");
              }}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-700 hover:bg-slate-300"
            >
              ×
            </span>
          ) : null}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "h-4 w-4 transition",
              open ? "rotate-180" : "rotate-0"
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* dropdown panel */}
      {open && !disabled ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* input search */}
          <div className="p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/10"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-xs text-slate-400">
                No results found
              </p>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100",
                    opt === value && "bg-slate-100 font-medium"
                  )}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, open, close } = useModal(false);

  const { filters, filteredData, setFilter, resetFilters } =
    useFilters(businessLeads);

  // ⬇️ pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // buat list negara unik dari data mock
  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    businessLeads.forEach((item) => {
      if (item.country) set.add(item.country);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  // buat list kota unik tergantung country yang dipilih
  const cityOptions = useMemo(() => {
    // kalau belum pilih country → ambil semua city (atau bisa dikosongin)
    if (!filters.country) {
      const set = new Set<string>();
      businessLeads.forEach((item) => {
        if (item.city) set.add(item.city);
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }

    // kalau sudah pilih country → ambil city khusus country itu
    const set = new Set<string>();
    businessLeads.forEach((item) => {
      if (item.country === filters.country && item.city) {
        set.add(item.city);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [filters.country]);

  // kalau filter berubah ATAU page size berubah -> balikin ke page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length, pageSize]);

  // data yang ditampilkan di tabel (sudah dipotong sesuai page + pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  // buka modal kalau belum login
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
            <header className="flex items-center justify-between gap-2 rounded-xl bg-white px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3366FF]/10 text-[#3366FF]">
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

            <div className="px-6 pb-6 pt-4">
              {/* filter formnya boleh kamu sambungin ke useFilters */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#3366FF]/30 text-[#3366FF]">
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

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Type Business
                    </label>
                    <input
                      type="text"
                      value={filters.businessType || ""}
                      onChange={(e) => setFilter("businessType", e.target.value)}
                      placeholder="e.g., Agency, Retail, Software"
                      className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Rating
                    </label>
                    <input
                      type="text"
                      value={filters.rating || ""}
                      onChange={(e) => setFilter("rating", e.target.value)}
                      placeholder="e.g., 4.5"
                      className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Country jadi dropdown searchable */}
                  <SearchableSelect
                    label="Country"
                    value={filters.country || ""}
                    onSelect={(val) => {
                      // kalau country diganti, city harus direset
                      setFilter("country", val || "");
                      setFilter("city", "");
                    }}
                    options={countryOptions}
                    placeholder="Select country…"
                  />

                  {/* City jadi dropdown searchable, tergantung country */}
                  <SearchableSelect
                    label="City"
                    value={filters.city || ""}
                    onSelect={(val) => {
                      setFilter("city", val || "");
                    }}
                    options={cityOptions}
                    placeholder={
                      filters.country
                        ? "Select city…"
                        : "Select country first…"
                    }
                    disabled={!filters.country && cityOptions.length === 0}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 lg:flex-row">
                <button
                  onClick={() => {
                    resetFilters();
                    setCurrentPage(1);
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#3366FF] bg-white px-6 text-sm font-semibold text-[#1F3F7F] transition hover:bg-[#f3f5ff] lg:w-[230px]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#EEF0F6] text-base">
                    🧹
                  </span>
                  CLEAR ALL FILTERS
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      open();
                      return;
                    }
                    // TODO: kalau sudah login, panggil fetch real backend di sini
                  }}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2451CC] text-sm font-semibold text-white transition hover:bg-[#2050CC]"
                >
                  <span className="text-lg leading-none">🔍</span>
                  SEARCH DATABASE
                </button>
              </div>
            </div>
          </section>

          {/* RESULT SECTION */}
          <section className="rounded-xl bg-white shadow-sm">
            <div className="w-full overflow-x-auto">
              <ResultTable data={paginatedData} total={filteredData.length} />
            </div>

            {/* Pagination */}
            <Pagination
              totalItems={filteredData.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default LandingPage;

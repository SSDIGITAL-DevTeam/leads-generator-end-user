"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonStyles } from "@/_components/ui/Button";
import { Modal } from "@/_components/ui/Modal";
import { useAuth } from "@/features/auth/useAuth";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { businessLeads } from "@/lib/mockData";
import { useFilters } from "@/features/search/useFilters";
import { ResultTable } from "@/features/search/ResultTable";

const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, open, close } = useModal(false);

  const { filters, setFilter, resetFilters } = useFilters(businessLeads);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [backendData, setBackendData] = useState<any[]>([]);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  const handleScrape = async () => {
  console.groupCollapsed("🟦 [SCRAPE FLOW START]");
  console.log("Step 1️⃣ - Mulai scraping process dari client...");

  setScrapeError(null);
  setBackendData([]);
  setScraping(true);

  const businessType = (filters.businessType || "").trim();
  const finalCountry = country.trim();
  const finalCity = city.trim();

  if (!businessType || !finalCountry || !finalCity) {
    console.warn("Step ⚠️ - Validasi gagal → field belum lengkap");
    setScrapeError("Type business, country, dan city harus diisi.");
    setScraping(false);
    console.groupEnd();
    return;
  }

  const payload = {
    type_business: businessType,
    city: finalCity,
    country: finalCountry,
    min_rating: filters.rating ? Number(filters.rating) : 0,
  };

  console.log("Step 2️⃣ - Payload dikirim ke /api/scrape:", payload);

  try {
    console.log("Step 3️⃣ - Hit ke /api/scrape...");
    const scrapeRes = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // penting biar cookie ikut
    });

    const scrapeJson = await scrapeRes.json().catch(() => ({}));
    console.log("Step 4️⃣ - Response /api/scrape diterima:", scrapeJson);

    if (!scrapeRes.ok || scrapeJson?.ok === false) {
      throw new Error(scrapeJson?.message || "Scraping gagal di backend.");
    }

    console.log("Step 5️⃣ - Tunggu backend update database (3 detik)...");
    await new Promise((res) => setTimeout(res, 3000));

    console.log("Step 6️⃣ - Fetch /api/companies untuk hasil terbaru...");
    const companiesRes = await fetch("/api/companies?per_page=200", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      credentials: "include",
    });

    const companiesJson = await companiesRes.json().catch(() => ({}));
    console.log("Step 7️⃣ - Response /api/companies:", companiesJson);

    const rows = Array.isArray(companiesJson)
      ? companiesJson
      : companiesJson.data || companiesJson.items || [];

    console.log(`Step 8️⃣ - Jumlah data hasil scraping: ${rows.length}`);

    setBackendData(rows);
  } catch (err: any) {
    console.error("❌ ERROR FLOW:", err);
    setScrapeError(err.message || "Terjadi kesalahan.");
  } finally {
    setScraping(false);
    console.groupEnd();
  }
};

  // kalau masih scraping → kita kirim array kosong supaya tabel nggak nampilin data lama
  const sourceData = scraping
    ? []
    : backendData.length > 0
    ? backendData
    : [];

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
          Belum memiliki akun{" "}
          <Link
            href="/register"
            className="font-medium text-brand-primary hover:text-blue-600"
          >
            Buat akun baru sekarang.
          </Link>
        </p>
      </Modal>

      <div className="flex flex-col gap-6">
        {/* HOW TO USE SECTION */}
        <section className="rounded-xl">
          <h2 className="mb-4 text-lg font-semibold text-[#22538C]">
            How to Use the Lead Generator
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "1. Set Your Filters",
                desc: "Use the filter inputs below to define your desired criteria.",
              },
              {
                title: "2. Search Database",
                desc: "Click 'Search Database' to fetch relevant business leads.",
              },
              {
                title: "3. Review Results",
                desc: "Review the results in the table below.",
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
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#3366FF]/30 text-[#3366FF]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path d="M4 4v5h.582M20 20v-5h-.581" strokeLinecap="round" />
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
                    placeholder="e.g., cafe, agency, retail"
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
                    placeholder="e.g., 4"
                    className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="h-10 w-full rounded-full border border-[#C7D5FF] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#3366FF] focus:ring-2 focus:ring-[#3366FF]/20"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 lg:flex-row">
              <button
                onClick={() => {
                  resetFilters();
                  setBackendData([]);
                  setCountry("");
                  setCity("");
                  setScrapeError(null);
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
                  void handleScrape();
                }}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2451CC] text-sm font-semibold text-white transition hover:bg-[#2050CC]"
                disabled={scraping}
              >
                <span className="text-lg leading-none">🔍</span>
                {scraping ? "Scraping..." : "SEARCH DATABASE"}
              </button>
            </div>
            {scrapeError ? (
              <p className="mt-2 text-xs text-red-500">{scrapeError}</p>
            ) : null}
          </div>
        </section>

        {/* RESULT SECTION */}
        <section className="rounded-xl bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <ResultTable
              data={sourceData}
              total={sourceData.length}
              fullData={sourceData}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;

"use client";

import { useEffect, useMemo, useState } from "react";
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

const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, open, close } = useModal(false);

  // masih pakai filters bawaanmu utk businessType & rating
  const { filters, setFilter, resetFilters } = useFilters(businessLeads);

  // ⬇️ country & city sekarang jadi state biasa
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [backendData, setBackendData] = useState<any[]>([]);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const handleScrape = async () => {
    setScrapeError(null);

    const payload = {
      type_business: (filters.businessType || "").trim(),
      city: city.trim(),
      country: country.trim(),
      min_rating: filters.rating ? Number(filters.rating) : 0,
      max_pages: 1,
    };

    console.log("[CLIENT] scrape payload →", payload);

    setScraping(true);
    try {
      // 1) jalankan scrap
      const scrapRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const scrapJson = await scrapRes.json().catch(() => ({}));
      console.log("[CLIENT] scrape status →", scrapRes.status);
      console.log("[CLIENT] scrape json →", scrapJson);

      if (!scrapRes.ok || scrapJson?.ok === false) {
        // terjemahan error untuk user
        const code = scrapJson?.code ?? scrapRes.status;
        let userMsg =
          scrapJson?.message || "Gagal menjalankan scraping. Coba lagi.";

        if (code === 401) {
          userMsg =
            "Sesi kamu sudah habis atau token tidak valid. Silakan login lagi.";
        } else if (code === 400) {
          // backend kamu sebelumnya protes soal city/country
          userMsg =
            "Data yang kamu kirim belum lengkap. Pastikan city dan country diisi.";
        } else if (code >= 500) {
          userMsg =
            "Layanan scraping sedang bermasalah. Coba lagi beberapa saat.";
        }

        throw new Error(userMsg);
      }

      // 2) ambil data companies
      const companiesRes = await fetch("/api/companies?per_page=200", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const companiesJson = await companiesRes.json().catch(() => ({}));
      console.log("[CLIENT] companies status →", companiesRes.status);
      console.log("[CLIENT] companies json →", companiesJson);

      if (!companiesRes.ok || companiesJson?.ok === false) {
        const code = companiesJson?.code ?? companiesRes.status;
        let userMsg =
          companiesJson?.message || "Gagal mengambil data hasil scraping.";

        if (code === 401) {
          userMsg = "Sesi kamu sudah habis. Silakan login lagi.";
        }

        throw new Error(userMsg);
      }

      // 3) normalisasi
      const rows: any[] = Array.isArray(companiesJson)
        ? companiesJson
        : companiesJson.data
        ? companiesJson.data
        : companiesJson.items
        ? companiesJson.items
        : [];

      const normalized = rows.map((item: any, idx: number) => {
        const ratingNum =
          typeof item.rating === "number"
            ? item.rating
            : item.rating
            ? Number(item.rating)
            : payload.min_rating;

        const reviewsVal =
          typeof item.reviews === "number"
            ? item.reviews
            : typeof item.user_ratings_total === "number"
            ? item.user_ratings_total
            : typeof item.views === "number"
            ? item.views
            : null;

        return {
          id: item.id ?? `company-${idx + 1}`,
          name: item.name ?? item.company ?? "",
          company: item.company ?? item.name ?? "",
          phone: item.phone ?? item.formatted_phone_number ?? "",
          email: item.email ?? "",
          website: item.website ?? item.url ?? "",
          rating: ratingNum,
          reviews: reviewsVal,
          type_business:
            item.type_business ??
            item.business_type ??
            payload.type_business ??
            "",
          businessType:
            item.type_business ??
            item.business_type ??
            payload.type_business ??
            "",
          address:
            item.address ?? item.formatted_address ?? item.place_address ?? "",
          country: item.country ?? payload.country ?? "",
          city: item.city ?? payload.city ?? "",
          location:
            item.city && item.country
              ? `${item.city}, ${item.country}`
              : item.city ?? item.country ?? "",
          raw: item,
        };
      });

      setBackendData(normalized);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("[CLIENT] scrape/companies error →", err);
      setScrapeError(err.message || "Terjadi kesalahan.");
      setBackendData([]);
    } finally {
      setScraping(false);
    }
  };

  const sourceData = backendData.length > 0 ? backendData : [];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sourceData.slice(start, end);
  }, [sourceData, currentPage, pageSize]);

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
                      onChange={(e) =>
                        setFilter("businessType", e.target.value)
                      }
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
                    setCurrentPage(1);
                    setCountry("");
                    setCity("");
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
                data={paginatedData}
                total={sourceData.length}
                fullData={sourceData}
              />
            </div>

            <Pagination
              totalItems={sourceData.length}
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

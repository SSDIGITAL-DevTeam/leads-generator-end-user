"use client";

import { useState } from "react";
import Link from "next/link";

import { Button, buttonStyles } from "@/_components/ui/Button";
import { Modal } from "@/_components/ui/Modal";
import { useAuth } from "@/features/auth/useAuth";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { ResultTable } from "@/features/search/ResultTable";
import { businessLeads } from "@/lib/mockData";
import type { BusinessLead } from "@/types/business";

const PromptPage = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<BusinessLead[]>(businessLeads);

  const { isAuthenticated } = useAuth();
  const { isOpen, open, close } = useModal(false);

  const requireLogin = () => {
    if (!isAuthenticated) {
      open();
      return true;
    }
    return false;
  };

  // fungsi kecil buat nyamain struktur dari backend ke BusinessLead
  const normalizePromptRows = (rows: any[]): BusinessLead[] => {
    return rows.map((item, idx) => {
      const ratingNum =
        typeof item.rating === "number"
          ? item.rating
          : item.rating
          ? Number(item.rating)
          : undefined;

      const reviewsVal =
        typeof item.reviews === "number"
          ? item.reviews
          : typeof item.user_ratings_total === "number"
          ? item.user_ratings_total
          : typeof item.views === "number"
          ? item.views
          : undefined;

      const city = item.city ?? item.kota ?? "";
      const country = item.country ?? item.negara ?? "";
      const location =
        item.location ??
        (city && country ? `${city}, ${country}` : city || country || "");

      return {
        id: item.id ?? item.place_id ?? `prompt-${idx + 1}`,
        name: item.name ?? item.company ?? "",
        company: item.company ?? item.name ?? "",
        phone: item.phone ?? item.formatted_phone_number ?? "",
        email: item.email ?? "",
        // kadang backend kirim website/url
        links: {
          website: item.website ?? item.url ?? undefined,
        },
        rating: ratingNum,
        reviews: reviewsVal,
        // semua variasi biar tabelmu aman
        type_business:
          item.type_business ??
          item.business_type ??
          item.category ??
          item.businessType ??
          "",
        address:
          item.address ?? item.formatted_address ?? item.place_address ?? "",
        country,
        city,
        location,
        // simpan raw kalau mau dipakai
        raw: item,
      } as BusinessLead;
    });
  };

  const handlePromptSubmit = async () => {
    setError(null);

    if (requireLogin()) return;

    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Prompt tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/prompt-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const json = await res.json().catch(() => ({}));
      console.log("[PROMPT] client got →", json);

      // kalau token mati dari backend
      if (!res.ok || json?.ok === false) {
        // kalau backend kita balikin 401 → buka modal login
        if (res.status === 401 || json?.code === 401) {
          open();
        }
        setError(
          json?.message ||
            "Gagal menjalankan prompt search. Coba lagi beberapa saat."
        );
        return;
      }

      // backend kadang bisa balikin: [] atau {data: []} atau {items: []}
      const rows: any[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.items)
        ? json.items
        : [];

      const normalized = rows.length > 0 ? normalizePromptRows(rows) : [];
      // kalau kosong banget, boleh fallback ke mock supaya UI gak blank
      setResults(normalized.length > 0 ? normalized : []);
    } catch (err) {
      console.error("[PROMPT] client error →", err);
      setError("Terjadi kesalahan ketika terhubung ke server prompt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Silakan login dulu"
        description="Masuk untuk menggunakan prompt AI dan mengunduh hasil."
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
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-primary hover:text-blue-600"
          >
            Daftar sekarang.
          </Link>
        </p>
      </Modal>

      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Prompt AI</p>
              <p className="text-xs text-slate-500">
                Tulis instruksi seperti di OpenAI untuk menghasilkan daftar
                leads.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#F7F9FF] p-4 shadow-inner">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[160px] w-full resize-none border-none bg-transparent text-sm text-slate-800 outline-none"
                placeholder="Contoh: Carikan daftar digital marketing agency di Jakarta yang punya rating di atas 4.5"
              />
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="flex-1 sm:flex-none"
                onClick={handlePromptSubmit}
                isLoading={isSubmitting}
              >
                Scrape
              </Button>
            </div>
            {error ? (
              <p className="text-xs text-red-500">{error}</p>
            ) : (
              <p className="text-xs text-slate-400">
                Prompt akan segera terhubung ke backend AI setelah siap.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white shadow-sm">
          <ResultTable
            data={results}
            total={results.length}
            fullData={results}
          />
        </section>
      </div>
    </>
  );
};

export default PromptPage;
  
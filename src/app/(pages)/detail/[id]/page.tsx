// src/app/(pages)/detail/[id]/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

type CrawlSocials = Record<string, string[] | undefined>;

type CrawlDetail = {
  about_summary?: string | null;
  address?: string | null;
  company_id?: string;
  company?: string | null;
  name?: string | null;
  contact_form_url?: string | null;
  emails?: string[];
  pages_crawled?: number;
  phones?: string[];
  socials?: CrawlSocials;
  website?: string | null;
};

type CrawlMeta = {
  status?: string;
  message?: string;
};

type CrawlResult = {
  detail: CrawlDetail | null;
  meta: CrawlMeta;
};

// ✅ Next.js 15: params & searchParams adalah Promise
type CrawlPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined> | undefined>;
};

type SocialLinkRow = {
  label: string;
  url: string;
  type: "social" | "website" | "form";
};

const BACKEND_BASE =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

async function fetchCrawlDetail(companyId: string): Promise<CrawlResult> {
  // ✅ Next.js 15: cookies() harus di-await
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value ||
    cookieStore.get("access_token")?.value ||
    cookieStore.get("jwt")?.value ||
    null;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${BACKEND_BASE}/companies/${companyId}/crawl`, {
      method: "GET",
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        detail: null,
        meta: {
          status: payload?.status ?? "error",
          message:
            payload?.message ?? "Tidak dapat mengambil detail crawl perusahaan.",
        },
      };
    }

    const detail: CrawlDetail | null =
      (payload?.data as CrawlDetail | undefined) ??
      (Array.isArray(payload) ? payload[0] : (payload as CrawlDetail)) ??
      null;

    return {
      detail,
      meta: { status: payload?.status ?? "success", message: payload?.message },
    };
  } catch (error) {
    console.error(`[detail/${companyId}] failed to fetch crawl detail`, error);
    return {
      detail: null,
      meta: { status: "error", message: "Terjadi kesalahan ketika memuat data crawl." },
    };
  }
}

const capitalizeWords = (value: string) =>
  value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeQueryValue = (value?: string | string[]): string | undefined => {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  return decodeURIComponent(raw).replace(/\+/g, " ").trim();
};

const buildSocialRows = (detail: CrawlDetail | null): SocialLinkRow[] => {
  if (!detail) return [];
  const rows: SocialLinkRow[] = [];

  if (detail.website) {
    rows.push({ label: "Website", url: detail.website, type: "website" });
  }
  if (detail.contact_form_url) {
    rows.push({ label: "Contact Form", url: detail.contact_form_url, type: "form" });
  }
  if (detail.socials) {
    Object.entries(detail.socials).forEach(([platform, urls]) => {
      (urls ?? [])
        .filter((url): url is string => Boolean(url))
        .forEach((url, index) => {
          const suffix = (urls?.length ?? 0) > 1 ? ` #${index + 1}` : "";
          rows.push({ label: `${capitalizeWords(platform)}${suffix}`, url, type: "social" });
        });
    });
  }
  return rows;
};

const formatPhones = (phones?: string[]): string[] =>
  (phones ?? [])
    .map((phone) => phone.trim())
    .filter((phone) => phone.length > 0);

const InfoBlock = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
    <div className="mt-2 text-sm text-slate-900">{children}</div>
  </div>
);

export default async function CrawlDetailPage({ params, searchParams }: CrawlPageProps) {
  // ✅ WAJIB: await dulu sebelum akses propertinya
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  const { detail, meta } = await fetchCrawlDetail(id);

  const queryName = normalizeQueryValue(sp?.name);
  const companyName =
    queryName ||
    detail?.name ||
    detail?.company ||
    detail?.company_id ||
    `Perusahaan ${id.slice(0, 8)}`;

  const phones = formatPhones(detail?.phones);
  const socials = buildSocialRows(detail);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Detail {companyName}</h1>
          </div>

          <Link
            href={`/scoring/${id}` as any}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2"
          >
            Score
          </Link>
        </div>

        <nav aria-label="Breadcrumb" className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{companyName}</span>
        </nav>

        {meta.message && (
          <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {meta.message}
          </p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoBlock label="Alamat">
            {detail?.address ? (
              detail.address.split("\n").map((line, idx) => (
                <p key={`${line}-${idx}`} className="text-sm leading-relaxed">
                  {line}
                </p>
              ))
            ) : (
              <span className="text-slate-400">Alamat belum tersedia.</span>
            )}
          </InfoBlock>

          <InfoBlock label="Nomor Telepon">
            {phones.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {phones.map((phone) => (
                  <li
                    key={phone}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-800"
                  >
                    {phone}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-400">Tidak ada nomor telepon.</span>
            )}
          </InfoBlock>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sosial Media & Website</h2>
            <p className="text-sm text-slate-500">Kumpulan tautan resmi milik {companyName}.</p>
          </div>

          {typeof detail?.pages_crawled === "number" && (
            <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              Pages Crawled: {detail.pages_crawled}
            </span>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Channel</th>
                <th className="px-3 py-2">URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {socials.length > 0 ? (
                socials.map((item) => (
                  <tr key={`${item.label}-${item.url}`}>
                    <td className="px-3 py-3 font-medium text-slate-900">{item.label}</td>
                    <td className="px-3 py-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-secondary"
                      >
                        {item.url}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="h-4 w-4"
                        >
                          <path d="M13 5h6v6" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11 13 19 5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 13v6H5V5h6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-3 py-4 text-center text-sm text-slate-400">
                    Belum ada tautan sosial media atau website yang tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {detail?.about_summary && (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tentang Perusahaan</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {detail.about_summary}
          </p>
        </section>
      )}
    </div>
  );
}

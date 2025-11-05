// src/app/api/_backend.ts
import { cookies } from "next/headers";

/**
 * Basis URL ke backend-mu.
 * Boleh pakai salah satu:
 * - BACKEND_API_BASE_URL (paling disarankan)
 * - API_BASE_URL
 * - NEXT_PUBLIC_API_URL
 */
const RAW_BASE =
  process.env.BACKEND_API_BASE_URL ||
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

// Kalau mau pakai di route lain, bisa dipanggil dulu
export function ensureEnvOrThrow() {
  if (!RAW_BASE) throw new Error("API_BASE_URL / BACKEND_API_BASE_URL is not set");
}

/** Join path dengan 1 slash saja */
function join(a: string, b: string) {
  return `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;
}

/**
 * Terima path setelah v1, misal "products?..." → hasilkan http://host/api/v1/products?...
 * Ini cocok kalau backend kamu pakai pola /api/v1/...
 */
export function makeApiUrl(pathAfterV1: string) {
  const base = (RAW_BASE || "").replace(/\/+$/, "");
  if (/\/api\/v1$/i.test(base)) return join(base, pathAfterV1);
  if (/\/api$/i.test(base)) return join(base, join("v1", pathAfterV1));
  return join(base, join("api/v1", pathAfterV1));
}

/**
 * (opsional) helper parse cookie dari header (kalau nanti kamu perlu di server action lain)
 */
export function readCookie(header: string | null, name: string) {
  if (!header) return undefined;
  const target = `${name}=`;
  const hit = header
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(target));
  return hit ? decodeURIComponent(hit.slice(target.length)) : undefined;
}

/**
 * Proxy request dari Next API ke backend.
 * Otomatis tempel Authorization dari cookie "auth_token" kalau ada.
 */
export async function callBackend(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  ensureEnvOrThrow();

  // baca cookie dari request server
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  // pastikan headers berbentuk object biasa
  const headers: Record<string, string> = {};

  // kalau caller sudah kirim headers, salin dulu
  if (init.headers) {
    // init.headers bisa macam-macam → kita paksa ke Record
    const original = init.headers as Record<string, string>;
    for (const [key, value] of Object.entries(original)) {
      headers[key] = value;
    }
  }

  // tempel bearer
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // tentukan URL final
  // kalau path sudah absolut (http...), jangan di-join lagi
  const finalUrl = path.startsWith("http")
    ? path
    : // kalau kamu mau semua lewat /api/v1 backend-mu:
      // makeApiUrl(path.replace(/^\/+/, ""))
      join(RAW_BASE, path.replace(/^\/+/, ""));

  const res = await fetch(finalUrl, {
    ...init,
    headers,
    // kalau mau jangan di-cache:
    cache: "no-store",
  });

  return res;
}

/**
 * Helper biar route kamu gampang balikin JSON dari backend
 */
export async function forwardJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "content-type": "application/json",
    },
  });
}

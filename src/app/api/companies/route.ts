// src/app/api/companies/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080"; // sesuaikan dengan backend kamu

export async function GET(req: NextRequest) {
  // ambil seluruh query dari request asli
  const url = new URL(req.url);
  const qs = url.searchParams.toString(); // contoh: "per_page=200&page=1"

  // coba ambil token dari beberapa nama cookie
  const cookieToken =
    req.cookies.get("token")?.value ||
    req.cookies.get("access_token")?.value ||
    req.cookies.get("jwt")?.value ||
    null;

  // kalau user kirim Authorization di fetch dari browser, kita ikutkan
  const headerAuth = req.headers.get("authorization");

  // rakit URL backend lengkap + query
  const backendUrl = `${BACKEND_BASE}/companies${qs ? `?${qs}` : ""}`;
  // console.log("[API] forward ke backend:", backendUrl);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // pilih sumber auth
  if (headerAuth) {
    headers["Authorization"] = headerAuth;
  } else if (cookieToken) {
    headers["Authorization"] = `Bearer ${cookieToken}`;
  }

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    // forward status & body persis
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("[API /companies] error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Gagal mengambil data companies dari backend.",
      },
      { status: 500 },
    );
  }
}

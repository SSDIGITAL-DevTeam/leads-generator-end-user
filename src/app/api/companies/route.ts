// src/app/api/companies/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export async function GET(req: NextRequest) {
  try {
    // Ambil seluruh query dari request asli
    const url = new URL(req.url);
    const qs = url.searchParams.toString();

    // Ambil token
    const cookieToken =
      req.cookies.get("token")?.value ||
      req.cookies.get("access_token")?.value ||
      req.cookies.get("jwt")?.value ||
      null;

    const headerAuth = req.headers.get("authorization");

    // Siapkan header
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (headerAuth) {
      headers["Authorization"] = headerAuth;
    } else if (cookieToken) {
      headers["Authorization"] = `Bearer ${cookieToken}`;
    }

    const backendUrl = `${BACKEND_BASE}/companies${qs ? `?${qs}` : ""}`;
    console.log("[API /companies] Forward →", backendUrl);

    // Fetch ke backend dengan no cache
    const res = await fetch(backendUrl, {
      method: "GET",
      headers,
      cache: "no-store", // penting: cegah caching di edge/runtime
      next: { revalidate: 0 }, // pastikan revalidate 0 di Next.js 15
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
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

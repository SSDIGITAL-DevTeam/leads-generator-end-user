// src/app/api/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const SCRAPE_PATH = "/scrape";

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}));

  const incomingAuth = req.headers.get("authorization");
  const cookieToken =
    req.cookies.get("access_token")?.value ||
    req.cookies.get("token")?.value ||
    null;

  console.log("[SCRAPE] incomingAuth →", incomingAuth);
  console.log("[SCRAPE] cookieToken →", cookieToken);
  console.log("[SCRAPE] payload →", payload);

  if (!incomingAuth && !cookieToken) {
    return NextResponse.json(
      {
          ok: false,
          code: 401,
          message: "Sesi login sudah tidak berlaku. Silakan login ulang.",
        },
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (incomingAuth) {
    headers["Authorization"] = incomingAuth;
  } else if (cookieToken) {
    // kalau backend kamu pakai "Token " ganti baris di bawah ini:
    headers["Authorization"] = `Bearer ${cookieToken}`;
    // headers["Authorization"] = `Token ${cookieToken}`;
  }

  const backendRes = await fetch(`${BACKEND_API_URL}${SCRAPE_PATH}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const rawText = await backendRes.text();
  console.log("[SCRAPE] backend status →", backendRes.status);
  console.log("[SCRAPE] backend raw →", rawText);

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { raw: rawText };
  }

  if (!backendRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          code: backendRes.status,
          // coba pakai pesan dari backend, kalau gak ada pakai default
          message:
            data?.message ||
            data?.error ||
            (backendRes.status === 500
              ? "Server scrape sedang bermasalah. Coba lagi beberapa saat."
              : "Gagal menjalankan scraping."),
          detail: data,
        },
        { status: backendRes.status }
      );
    }

  return NextResponse.json(data, {
    status: backendRes.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

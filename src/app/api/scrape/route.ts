// src/app/api/scrap/route.ts
import { NextRequest, NextResponse } from "next/server";

// ini backend sebenernya — ganti ke URL service scrap kamu
// misal kamu memang punya server di http://localhost:4000/api
// tinggal ganti di sini
const BACKEND_BASE =
  process.env.SCRAPER_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8888/api";

// kalau backend kamu endpoint-nya /scrape (pakai e) ubah ini:
const SCRAPER_PATH = "/scrape";
// kalau backend kamu /scrap juga, ya biarkan "/scrap"

export async function POST(req: NextRequest) {
  const body = await req.json();

  // teruskan ke backend sebenernya
  const res = await fetch(`${BACKEND_BASE}${SCRAPER_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // kalau backend balikin non-JSON kita tetap coba kirim balik
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    data = { ok: res.ok };
  }

  return NextResponse.json(data, { status: res.status });
}

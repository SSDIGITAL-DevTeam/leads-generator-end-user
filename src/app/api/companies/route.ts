// src/app/api/companies/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.SCRAPER_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8888/api";

// ganti ke endpoint backend-mu yang ngelist hasil scraping
const COMPANIES_PATH = "/companies";

export async function GET(_req: NextRequest) {
  const res = await fetch(`${BACKEND_BASE}${COMPANIES_PATH}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // kalau butuh auth, tambah di sini
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    data = [];
  }

  return NextResponse.json(data, { status: res.status });
}

import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:8080";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();
  const url = qs
    ? `${BACKEND_API_URL}/companies?${qs}`
    : `${BACKEND_API_URL}/companies`;

  const res = await fetch(url, {
    // endpoint ini public di Go
    method: "GET",
  });

  const data = await res.json().catch(() => ({}));

  return NextResponse.json(data, { status: res.status });
}

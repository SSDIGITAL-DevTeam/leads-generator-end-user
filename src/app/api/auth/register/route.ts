// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:8080";

// supaya ini selalu dieksekusi di server (bukan static)
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ⚠️ kalau backend kamu pakainya /api/v1/auth/register
    // ganti aja di sini
    const target = `${BACKEND_API_URL}/auth/register`;

    const backendRes = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // kita baca sebagai text dulu supaya kalau backend kirim HTML / error string tetap kebaca
    const raw = await backendRes.text();

    let parsed: any = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { raw };
    }

    // kalau backend gagal (400/401/500) → terusin ke frontend dengan info detail
    if (!backendRes.ok) {
      return NextResponse.json(
        {
          message:
            parsed?.message ||
            parsed?.error ||
            "Backend register failed (see backendBody)",
          backendStatus: backendRes.status,
          backendBody: parsed,
        },
        { status: backendRes.status }
      );
    }

    // kalau sukses
    return NextResponse.json(parsed, { status: 200 });
  } catch (error: any) {
    console.error("Register API error (Next.js):", error);
    return NextResponse.json(
      {
        message: "Internal error in Next.js /api/auth/register",
        detail: error?.message,
      },
      { status: 500 }
    );
  }
}

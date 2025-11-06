// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // kirim ke backend asli
  const res = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // coba baca data JSON dari backend
  const data = await res.json().catch(() => ({}));

  // kalau login gagal, langsung terusin aja ke client
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // --- ambil token dari response backend ---
  // seringnya backend kirim nama salah satu ini:
  // { access_token: "..." } atau { token: "..." }
  const token =
    (data as any).access_token ||
    (data as any).token ||
    (data as any).jwt ||
    null;

  // bentuk response ke client
  const nextRes = NextResponse.json(
    {
      // boleh pilih apa yang mau kamu kirim ke frontend
      // biasanya user-info saja, token jangan dikirim lagi
      user: (data as any).user ?? null,
      message: (data as any).message ?? "Login success",
    },
    { status: res.status }
  );

  // kalau token ada → simpan ke cookie
  if (token) {
    nextRes.cookies.set("access_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      // secure: true, // aktifkan kalau sudah pakai https
      // maxAge: 60 * 60 * 24, // 1 hari
    });
  }

  return nextRes;
}

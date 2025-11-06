// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const resp = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json().catch(() => ({} as any));

  // ⬇️ log di server kamu akan kelihatan ini
  console.log("[LOGIN] backend status →", resp.status);
  console.log("[LOGIN] backend data →", data);

  if (!resp.ok) {
    return NextResponse.json(data, { status: resp.status });
  }

  // --- cari token di berbagai bentuk yang umum ---
  let token: string | null = null;

  // 1) { access_token: "..." }
  if (typeof (data as any).access_token === "string") {
    token = (data as any).access_token;
  }
  // 2) { token: "..." }
  else if (typeof (data as any).token === "string") {
    token = (data as any).token;
  }
  // 3) { jwt: "..." }
  else if (typeof (data as any).jwt === "string") {
    token = (data as any).jwt;
  }
  // 4) { data: { access_token: "..." } }
  else if (typeof (data as any)?.data?.access_token === "string") {
    token = (data as any).data.access_token;
  }
  // 5) { token: { access: "..." } } → ini yang sering bikin invalid
  else if (
    typeof (data as any).token === "object" &&
    typeof (data as any).token.access === "string"
  ) {
    token = (data as any).token.access;
  }

  const nextRes = NextResponse.json(
    {
      user: (data as any).user ?? null,
      message: (data as any).message ?? "Login success",
    },
    { status: 200 }
  );

  if (token) {
    console.log("[LOGIN] save cookie access_token →", token);
    nextRes.cookies.set("access_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      // secure: true, // on HTTPS
    });
  } else {
    console.log("[LOGIN] no token found, cookie NOT set");
  }

  return nextRes;
}

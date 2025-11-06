// src/app/api/companies/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const perPage = searchParams.get("per_page") || "200";

  const incomingAuth = req.headers.get("authorization");
  const cookieToken =
    req.cookies.get("access_token")?.value ||
    req.cookies.get("token")?.value ||
    null;

  // 🔴 DEBUG: lihat apa yang kita punya
  console.log("[COMPANIES] incoming Authorization →", incomingAuth);
  console.log("[COMPANIES] cookie access_token →", cookieToken);

  if (!incomingAuth && !cookieToken) {
    return NextResponse.json(
      { message: "Unauthorized: token missing" },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // pakai urutan: header dulu, baru cookie
  if (incomingAuth) {
    headers["Authorization"] = incomingAuth;
  } else if (cookieToken) {
    // kebanyakan backend pakai Bearer
    headers["Authorization"] = `Bearer ${cookieToken}`;
  }

  const backendUrl = `${BACKEND_API_URL}/companies?per_page=${encodeURIComponent(
    perPage
  )}`;

  const backendRes = await fetch(backendUrl, {
    method: "GET",
    headers,
  });

  const rawText = await backendRes.text();

  // 🔴 DEBUG: lihat respon backend
  console.log("[COMPANIES] backend status →", backendRes.status);
  console.log("[COMPANIES] backend raw →", rawText);

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { raw: rawText };
  }

  return NextResponse.json(data, {
    status: backendRes.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

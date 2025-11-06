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

  // 🔴 DEBUG SERVER: lihat apa yang dikirim client
  console.log("[SERVER] /api/scrape payload →", payload);
  console.log("[SERVER] has auth? →", Boolean(incomingAuth || cookieToken));

  if (!incomingAuth && !cookieToken) {
    console.log("[SERVER] missing token → 401");
    return NextResponse.json(
      { message: "Unauthorized: token missing" },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (incomingAuth) {
    headers["Authorization"] = incomingAuth;
  } else if (cookieToken) {
    headers["Authorization"] = `Bearer ${cookieToken}`;
  }

  const resp = await fetch(`${BACKEND_API_URL}${SCRAPE_PATH}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const rawText = await resp.text();

  // 🔴 DEBUG SERVER: lihat balasan backend asli
  console.log("[SERVER] backend status →", resp.status);
  console.log("[SERVER] backend raw →", rawText);

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { raw: rawText };
  }

  return new NextResponse(JSON.stringify(data), {
    status: resp.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

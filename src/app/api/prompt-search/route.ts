// src/app/api/prompt-search/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const PROMPT_PATH = "/prompt-search"; // endpoint backend-mu

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}));

  const incomingAuth = req.headers.get("authorization");
  const cookieToken =
    req.cookies.get("access_token")?.value ||
    req.cookies.get("token")?.value ||
    null;

  console.log("[PROMPT] incomingAuth →", incomingAuth);
  console.log("[PROMPT] cookieToken →", cookieToken);
  console.log("[PROMPT] payload →", payload);

  if (!incomingAuth && !cookieToken) {
    return NextResponse.json(
      {
        ok: false,
        code: 401,
        message: "Sesi login sudah tidak berlaku. Silakan login ulang.",
      },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // pilih sumber auth
  if (incomingAuth) {
    headers["Authorization"] = incomingAuth;
  } else if (cookieToken) {
    // kalau backend pakai "Token " ganti ke `Token`
    headers["Authorization"] = `Bearer ${cookieToken}`;
  }

  try {
    const backendRes = await fetch(`${BACKEND_API_URL}${PROMPT_PATH}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const rawText = await backendRes.text();
    console.log("[PROMPT] backend status →", backendRes.status);
    console.log("[PROMPT] backend raw →", rawText);

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
          message:
            data?.message ||
            data?.error ||
            (backendRes.status === 500
              ? "Server prompt sedang bermasalah. Coba lagi beberapa saat."
              : "Gagal menjalankan prompt search."),
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
  } catch (error: any) {
    console.error("[PROMPT] fetch error →", error);
    return NextResponse.json(
      {
        ok: false,
        code: 500,
        message:
          "Tidak dapat menghubungi server prompt-search. Coba lagi beberapa saat.",
        error: error?.message || error,
      },
      { status: 500 }
    );
  }
}

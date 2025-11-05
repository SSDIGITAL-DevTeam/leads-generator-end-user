// src/service/scraping.ts
export type ScrapePayload = {
  type_business: string;
  city: string;
  country: string;
  min_rating: number;
};

// ini tipe hasil scraping, samakan dengan yang dipakai ResultTable
// silakan adjust field-nya kalau respon backend-mu beda
export type ScrapedLead = {
  id: string;
  company: string;        // atau "name" dari backend → bisa kamu map nanti
  address?: string;
  location?: string;
  country?: string;
  rating?: number;
  type_business?: string;
  website?: string;
  // tambahkan kalau backend kirim lebih banyak kolom
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3001/api";

export async function scrapeLeads(payload: ScrapePayload): Promise<ScrapedLead[]> {
  const res = await fetch(`${API_BASE}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // kalau route-mu perlu token dari login
    // kamu bisa tambahkan:
    // headers: {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${token}`,
    // },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // biar gampang debug
    const text = await res.text();
    throw new Error(`Scrape failed: ${res.status} ${text}`);
  }

  // asumsi backend balikin: { data: [...] }
  const json = await res.json();

  // sesuaikan dengan bentuk respon backend
  return json.data ?? json ?? [];
}

// src/service/companies.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type CompanyApi = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  type_business?: string;
  rating?: number;
};

export type CompanyListResponse = {
  data: CompanyApi[];
  total: number;
  page: number;
  per_page: number;
};

export const companiesService = {
  async list({
    page = 1,
    perPage = 10,
    search = "",
  }: {
    page?: number;
    perPage?: number;
    search?: string;
  }): Promise<CompanyListResponse> {
    const qs = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      search,
    });

    // SESUAIKAN endpoint ini dengan yang sudah kamu buat di backend end-user
    // misal: /api/companies atau /api/public/companies
    const res = await fetch(`${API_BASE}/api/companies?${qs.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch companies");
    }

    const json = await res.json();

    return {
      data: json.data ?? [],
      total: json.total ?? 0,
      page: json.page ?? page,
      per_page: json.per_page ?? perPage,
    };
  },
};

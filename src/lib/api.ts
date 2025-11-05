import type { BusinessLead } from "@/types/business";

const API_BASE = "/api";

type BackendCompany = {
  id: string;
  company: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  type_business?: string;
  address?: string;
  city?: string;
  country?: string;
};

export async function loginToBackend(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Unable to login");
  }

  const payload = await res.json();
  // sesuai swagger: { status, message, data: { access_token } }
  return payload?.data?.access_token as string;
}

export async function registerToBackend(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Unable to register");
  }

  const payload = await res.json();
  return payload?.data?.access_token as string;
}

function mapBackendCompanyToLead(c: BackendCompany): BusinessLead {
  return {
    id: c.id,
    // backend gak punya "name" orang → pakai nama company supaya gak kosong di layout
    name: c.company,
    title: "",
    email: "",
    phone: c.phone || "",
    company: c.company,
    industry: c.type_business || "",
    city: c.city || "",
    country: c.country || "",
    rating: typeof c.rating === "number" ? c.rating : 0,
    businessType: c.type_business || "",
    website: c.website || "",
    linkedin: "",
  };
}

export async function fetchCompanies(params: {
  q?: string;
  type_business?: string;
  city?: string;
  country?: string;
  min_rating?: string | number;
  page?: number;
  per_page?: number;
}): Promise<BusinessLead[]> {
  const url = new URL(`${API_BASE}/companies`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
  });

  if (!res.ok) {
    return [];
  }

  const payload = await res.json();
  // backend bentuknya: { status, message, data: [...] }
  const list = (payload?.data ?? []) as BackendCompany[];
  return list.map(mapBackendCompanyToLead);
}

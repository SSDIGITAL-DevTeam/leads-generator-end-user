import type { BusinessFilters, BusinessLead } from "@/types/business";

// helper kecil: jadikan string aman, selalu string
const toStr = (v: unknown): string => (typeof v === "string" ? v : "");
const toLow = (v: unknown): string => toStr(v).toLowerCase();

export const filterBusinessLeads = (
  leads: BusinessLead[],
  filters: BusinessFilters
) => {
  const search = toStr(filters.search).trim().toLowerCase();
  const ratingValue = filters.rating ? Number(filters.rating) : undefined;
  const filterBusinessType = toLow(filters.businessType);
  const filterCity = toLow(filters.city);
  const filterCountry = toLow(filters.country);

  return leads.filter((lead) => {
    // ambil semua field yang mungkin dipakai, tapi aman
    const leadName = toLow(lead.name);
    const leadCompany = toLow(lead.company);
    const leadTitle = toLow((lead as any).title); // kadang ga ada di tipe kamu
    const leadBusinessType = toLow(
      // kadang di API kamu pakainya type_business
      (lead as any).businessType ?? (lead as any).type_business ?? lead.businessType
    );
    const leadCity = toLow(lead.city);
    const leadCountry = toLow(lead.country);

    // 1) filter pencarian teks
    const matchesSearch =
      search.length === 0 ||
      leadName.includes(search) ||
      leadCompany.includes(search) ||
      leadTitle.includes(search);

    // 2) filter type business
    const matchesBusinessType =
      !filterBusinessType || leadBusinessType === filterBusinessType;

    // 3) filter city
    const matchesCity = !filterCity || leadCity === filterCity;

    // 4) filter country
    const matchesCountry = !filterCountry || leadCountry === filterCountry;

    // 5) filter rating
    const leadRating =
      typeof lead.rating === "number"
        ? lead.rating
        : lead.rating
        ? Number(lead.rating)
        : 0;

    const matchesRating =
      ratingValue === undefined || leadRating >= ratingValue;

    return (
      matchesSearch &&
      matchesBusinessType &&
      matchesCity &&
      matchesCountry &&
      matchesRating
    );
  });
};

export const getUniqueOptions = <K extends keyof BusinessLead>(
  leads: BusinessLead[],
  key: K
): BusinessLead[K][] => {
  const seen = new Set<BusinessLead[K]>();
  leads.forEach((lead) => {
    const value = lead[key];
    if (value !== undefined && value !== null && value !== "") {
      seen.add(value);
    }
  });
  return Array.from(seen);
};

export const formatLocation = (
  lead: Pick<BusinessLead, "city" | "country">,
): string => {
  const city = toStr(lead.city);
  const country = toStr(lead.country);
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return "";
};

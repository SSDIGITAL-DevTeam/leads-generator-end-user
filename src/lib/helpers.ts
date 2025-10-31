import type { BusinessFilters, BusinessLead } from "@/types/business";

export const filterBusinessLeads = (
  leads: BusinessLead[],
  filters: BusinessFilters
) => {
  const ratingValue = filters.rating ? Number(filters.rating) : undefined;

  return leads.filter((lead) => {
    const matchesSearch =
      filters.search.trim().length === 0 ||
      lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.title.toLowerCase().includes(filters.search.toLowerCase());

    const matchesBusinessType =
      !filters.businessType ||
      lead.businessType.toLowerCase() === filters.businessType.toLowerCase();

    const matchesCity =
      !filters.city ||
      lead.city.toLowerCase() === filters.city.toLowerCase();

    const matchesCountry =
      !filters.country ||
      lead.country.toLowerCase() === filters.country.toLowerCase();

    const matchesRating =
      ratingValue === undefined || lead.rating >= ratingValue;

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
    if (value) {
      seen.add(value);
    }
  });
  return Array.from(seen);
};

export const formatLocation = (lead: Pick<BusinessLead, "city" | "country">) =>
  `${lead.city}, ${lead.country}`;

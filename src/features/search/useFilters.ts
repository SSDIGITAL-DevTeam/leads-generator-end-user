"use client";

import { useMemo, useState } from "react";

import { filterBusinessLeads } from "@/lib/helpers";
import type { BusinessFilters, BusinessLead } from "@/types/business";

const defaultFilters: BusinessFilters = {
  search: "",
  businessType: "",
  rating: "",
  city: "",
  country: ""
};

export const useFilters = (data: BusinessLead[]) => {
  const [filters, setFilters] = useState<BusinessFilters>(defaultFilters);

  const setFilter = <K extends keyof BusinessFilters>(
    key: K,
    value: BusinessFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const filteredData = useMemo(
    () => filterBusinessLeads(data, filters),
    [data, filters]
  );

  return {
    filters,
    filteredData,
    setFilter,
    resetFilters
  };
};

export type UseFiltersReturn = ReturnType<typeof useFilters>;

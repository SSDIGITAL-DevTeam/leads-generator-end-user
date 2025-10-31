"use client";

import { useCallback, useMemo } from "react";

import { Button } from "@/_components/ui/Button";
import { Input } from "@/_components/ui/Input";
import { Select } from "@/_components/ui/Select";
import type { BusinessFilters } from "@/types/business";

interface FilterBarProps {
  filters: BusinessFilters;
  onChange: <K extends keyof BusinessFilters>(
    key: K,
    value: BusinessFilters[K]
  ) => void;
  onReset: () => void;
  onSearch?: () => void;
  businessTypes: string[];
  cities: string[];
  countries: string[];
}

const ratingOptions = [
  { label: "All Ratings", value: "" },
  { label: "4.0+", value: "4.0" },
  { label: "4.5+", value: "4.5" },
  { label: "4.8+", value: "4.8" }
];

export const FilterBar = ({
  filters,
  onChange,
  onReset,
  onSearch,
  businessTypes,
  cities,
  countries
}: FilterBarProps) => {
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSearch?.();
    },
    [onSearch]
  );

  const businessTypeOptions = useMemo(
    () => ["All Types", ...businessTypes],
    [businessTypes]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M5 8h14M7 12h10m-8 4h6m-4 4h2"
            />
          </svg>
        </span>
        <div>
          <h3 className="text-xl font-medium text-slate-900">Data Filter</h3>
          <p className="text-sm text-slate-500">
            Refine the business leads with precise filters and search.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">
            Business Type
          </label>
          <Select
            value={filters.businessType}
            onChange={(event) => onChange("businessType", event.target.value)}
          >
            {businessTypeOptions.map((option) => (
              <option
                key={option}
                value={option === "All Types" ? "" : option}
              >
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">
            Rating
          </label>
          <Select
            value={filters.rating}
            onChange={(event) => onChange("rating", event.target.value)}
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">
            City
          </label>
          <Select
            value={filters.city}
            onChange={(event) => onChange("city", event.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600">
            Country
          </label>
          <Select
            value={filters.country}
            onChange={(event) => onChange("country", event.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto_auto]">
        <div className="space-y-2 md:col-span-1 md:pr-6">
          <label className="block text-sm font-medium text-slate-600">
            Search
          </label>
          <Input
            placeholder="Search by name, role, or company..."
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                />
              </svg>
            }
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-12"
          onClick={onReset}
        >
          Clear All Filters
        </Button>
        <Button type="submit" className="h-12">
          <span className="inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>
            Search Database
          </span>
        </Button>
      </div>
    </form>
  );
};

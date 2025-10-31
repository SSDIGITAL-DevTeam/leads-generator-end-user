"use client";

import { useMemo } from "react";

import { DataTable } from "@/_components/DataTable";
import { Button } from "@/_components/ui/Button";
import { Badge } from "@/_components/ui/Badge";
import { formatLocation } from "@/lib/helpers";
import type { BusinessLead } from "@/types/business";

interface ResultTableProps {
  data: BusinessLead[];
  total: number;
}

export const ResultTable = ({ data, total }: ResultTableProps) => {
  const columns = useMemo(
    () => [
      {
        key: "company",
        header: "Company",
        render: (lead: BusinessLead) => (
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">{lead.company}</p>
            <Badge tone="brand">{lead.industry}</Badge>
          </div>
        ),
      },
      {
        key: "phone",
        header: "Phone",
      },
      {
        key: "links",
        header: "Links",
        render: (lead: BusinessLead) => (
          <div className="flex items-center gap-3">
            <a
              href={lead.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-brand-primary transition hover:text-blue-700"
              aria-label={`${lead.name} LinkedIn`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 8.98h4v12.02H3zM9.5 8.98h3.83v1.64h.05c.53-1 1.82-2.06 3.75-2.06 4 0 4.74 2.63 4.74 6.05v6.39h-4v-5.67c0-1.35-.03-3.07-1.87-3.07-1.87 0-2.15 1.46-2.15 2.97v5.77h-4z" />
              </svg>
            </a>
            <a
              href={lead.website}
              target="_blank"
              rel="noreferrer"
              className="text-brand-primary transition hover:text-blue-700"
              aria-label={`${lead.name} website`}
            >
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
                  d="M12 3a9 9 0 1 0 9 9m0 0h-9m9 0a9 9 0 0 0-9-9v9"
                />
              </svg>
            </a>
          </div>
        ),
      },
      {
        key: "rating",
        header: "Rating",
        render: (lead: BusinessLead) => (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-amber-400"
            >
              <path d="M12 2l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.77l-5.8 3.1 1.11-6.47-4.7-4.58 6.49-.94L12 2z" />
            </svg>
            {lead.rating.toFixed(1)}
          </span>
        ),
      },
      {
        key: "name",
        header: "Reviews",
        render: (lead: BusinessLead) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
            <p className="text-xs text-slate-500">{lead.title}</p>
          </div>
        ),
      },
      {
        key: "email",
        header: "Business Type",
        render: (lead: BusinessLead) => (
          <a
            href={`mailto:${lead.email}`}
            className="text-sm text-brand-primary"
          >
            {lead.email}
          </a>
        ),
      },
      {
        key: "size",
        header: "Address",
      },
      {
        key: "location",
        header: "City",
        render: (lead: BusinessLead) => (
          <span className="text-sm text-slate-600">{formatLocation(lead)}</span>
        ),
      },
      {
        key: "location",
        header: "Country",
        render: (lead: BusinessLead) => (
          <span className="text-sm text-slate-600">{formatLocation(lead)}</span>
        ),
      },
    ],
    []
  );

  return (
    <section className="space-y-4">
      <div className="px-4 py-5 md:px-6">
        {/* Baris pertama: judul + subtext */}
        <div>
          <h3 className="text-base font-semibold text-slate-900 pt-3">
            Result
          </h3>
          <p className="mt-1 text-sm text-slate-500 py-3">
            {data.length} leads found from {total} total entries.
          </p>
        </div>

        {/* Baris kedua: search + download */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search box (boleh kamu sambungkan ke state/filter nanti) */}
          <div className="relative w-full md:w-72">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="11" cy="11" r="5" />
                <path d="m16 16 2.5 2.5" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search Here"
              className="h-10 w-full rounded-md border border-[#D8DDE7] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#2E65FF] focus:ring-2 focus:ring-[#2E65FF]/10"
            />
          </div>

          {/* Tombol Download (pakai logic dari kode pertama) */}
          <Button
            type="button"
            className="rounded-md bg-[#2E65FF] px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2451CC]"
            onClick={() => {
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const element = document.createElement("a");
              element.href = url;
              element.download = "leads.json";
              element.click();
              URL.revokeObjectURL(url);
            }}
          >
            {/* ⬇️ ini yang bikin pasti 1 baris */}
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  d="M12 4v11m0 0 4-4m-4 4-4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="leading-none">Download Data</span>
            </span>
          </Button>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        emptyState="No leads match the selected filters."
      />
      <div className="flex flex-col gap-3 rounded-b-xl bg-white px-4 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-6">
        {/* kiri: showing */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Showing</span>
          <select
            className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] outline-none"
            defaultValue={10}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-[11px] text-slate-500">from {total} data</span>
        </div>

        {/* kanan: pagination controls */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          {/* first */}
          <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100">
            «
          </button>
          {/* prev */}
          <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100">
            ‹
          </button>

          {/* page numbers */}
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2E65FF] text-white">
            2
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100">
            3
          </button>
          <span className="px-1">…</span>
          <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100">
            27
          </button>

          {/* next */}
          <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100">
            ›
          </button>
          {/* last */}
          <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100">
            »
          </button>

          {/* checkbox / empty square di ujung kanan */}
          <button className="ml-2 flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white" />

          {/* Go >> */}
          <button className="ml-1 text-[11px] font-medium text-[#2E65FF] hover:underline">
            Go &gt;&gt;
          </button>
        </div>
      </div>
    </section>
  );
};

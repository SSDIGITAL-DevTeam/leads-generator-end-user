"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/_components/DataTable";
import { Button } from "@/_components/ui/Button";
import { Badge } from "@/_components/ui/Badge";
import { formatLocation } from "@/lib/helpers";
import type { BusinessLead } from "@/types/business";
import Image from "next/image";

interface ResultTableProps {
  data: BusinessLead[];
  total: number;
  // optional: kalau mau download semua hasil filter dari parent
  fullData?: BusinessLead[];
}

export const ResultTable = ({ data, total, fullData }: ResultTableProps) => {
  // ⬇️ state pencarian lokal
  const [search, setSearch] = useState("");

  // fungsi cocokkan
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.trim().toLowerCase();

    return data.filter((lead) => {
      const company = lead.company?.toLowerCase() ?? "";
      const name = lead.name?.toLowerCase() ?? "";
      const email = lead.email?.toLowerCase() ?? "";
      const phone = lead.phone?.toLowerCase() ?? "";
      const website = lead.website?.toLowerCase() ?? "";
      const industry = lead.industry?.toLowerCase() ?? "";
      const loc = formatLocation(lead).toLowerCase();

      return (
        company.includes(q) ||
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        website.includes(q) ||
        industry.includes(q) ||
        loc.includes(q)
      );
    });
  }, [data, search]);

  // ⬇️ kolom tabel (perbaiki key duplikat: pakai "city" & "country")
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
              className="inline-flex items-center text-brand-primary transition hover:text-blue-700"
              aria-label={`${lead.name} LinkedIn`}
            >
              <Image
                src="/assets/icons/link.svg"
                alt={`${lead.name} Link`}
                width={30}
                height={30}
                className=" flex items-center object-contain"
              />
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
        key: "city",
        header: "location",
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
          <h3 className="pt-3 text-base font-semibold text-slate-900">
            Result
          </h3>
          <p className="py-3 text-sm text-slate-500">
            {filtered.length} leads found from {total} total entries.
          </p>
        </div>

        {/* Baris kedua: search + download */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search box */}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Here"
              className="h-10 w-full rounded-md border border-[#D8DDE7] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#2E65FF] focus:ring-2 focus:ring-[#2E65FF]/10"
            />
          </div>

          {/* Tombol Download */}
          <Button
            type="button"
            className="rounded-md !bg-[#2451CC] px-4 py-4 text-sm font-semibold text-white shadow-sm transition"
            onClick={() => {
              const rows =
                fullData && fullData.length > 0 ? fullData : filtered;

              const csvHeader = [
                "Company",
                "Industry",
                "Name",
                "Title",
                "Phone",
                "Email",
                "Website",
                "LinkedIn",
                "Rating",
                "Location",
              ];

              const escape = (val: unknown) => {
                if (val === null || val === undefined) return "";
                const str = String(val);
                return /[",\n]/.test(str)
                  ? `"${str.replace(/"/g, '""')}"`
                  : str;
              };

              const csvBody = rows
                .map((lead) => {
                  return [
                    escape(lead.company),
                    escape(lead.industry),
                    escape(lead.name),
                    escape(lead.title),
                    escape(lead.phone),
                    escape(lead.email),
                    escape(lead.website),
                    escape(lead.linkedin),
                    escape(lead.rating?.toFixed?.(1) ?? ""),
                    escape(formatLocation(lead)),
                  ].join(",");
                })
                .join("\n");

              const csv = [csvHeader.join(","), csvBody].join("\n");
              const blob = new Blob([csv], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const element = document.createElement("a");
              element.href = url;
              element.download = "leads.csv";
              element.click();
              URL.revokeObjectURL(url);
            }}
          >
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
              <span className="leading-none">Download CSV</span>
            </span>
          </Button>
        </div>
      </div>

      {/* tabel pakai hasil filter */}
      <DataTable
        data={filtered}
        columns={columns}
        emptyState="No leads match the selected filters."
      />
    </section>
  );
};

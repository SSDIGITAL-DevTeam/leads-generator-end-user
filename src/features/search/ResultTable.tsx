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
  fullData?: BusinessLead[];
}

export const ResultTable = ({ data, total, fullData }: ResultTableProps) => {
  const [search, setSearch] = useState("");

  // filter lokal
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.trim().toLowerCase();

    return data.filter((lead) => {
      const company = lead.company?.toLowerCase() ?? "";
      const name = lead.name?.toLowerCase() ?? "";
      const email = lead.email?.toLowerCase() ?? "";
      const phone = lead.phone?.toLowerCase() ?? "";
      const website =
        (lead as any)?.website?.toLowerCase?.() ??
        (lead as any)?.links?.website?.toLowerCase?.() ??
        "";
      const typeBusiness =
        (lead as any).type_business?.toLowerCase?.() ??
        lead.industry?.toLowerCase?.() ??
        "";
      const loc = formatLocation(lead).toLowerCase();

      return (
        company.includes(q) ||
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        website.includes(q) ||
        typeBusiness.includes(q) ||
        loc.includes(q)
      );
    });
  }, [data, search]);

  // kolom disamakan dengan project lain
  const columns = useMemo(
    () => [
      // 1. Company → di project lain dia pakai lead.name sebagai judul
      {
        key: "company-col",
        header: "Company",
        render: (lead: BusinessLead) => (
          <p className="text-sm font-semibold text-slate-900">
            {/* project lain pakai lead.name di kolom company */}
            {lead.name || lead.company || "-"}
          </p>
        ),
      },
      // 2. Phone
      {
        key: "phone",
        header: "Phone",
        render: (lead: BusinessLead) => (
          <span className="text-sm text-slate-700">
            {lead.phone || "-"}
          </span>
        ),
      },
      // 3. Links → project lain cuma munculin website
      {
        key: "links",
        header: "Links",
        render: (lead: BusinessLead) => {
          const website =
            (lead as any).website ||
            (lead as any).links?.website ||
            (lead as any).linkedin;
          if (!website) {
            return <span className="text-xs text-slate-400">-</span>;
          }
          return (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              aria-label={`Visit ${lead.company || lead.name || "lead"} website`}
            >
              <Image
                src="/assets/icons/link.svg"
                alt="Website"
                width={18}
                height={18}
                className="inline-block"
              />
            </a>
          );
        },
      },
      // 4. Rating
      {
        key: "rating",
        header: "Rating",
        render: (lead: BusinessLead) => (
          <span className="text-sm text-slate-700">
            {typeof lead.rating === "number"
              ? lead.rating.toFixed(1)
              : lead.rating || "0.0"}
          </span>
        ),
      },
      // 5. Reviews
      {
        key: "reviews",
        header: "Reviews",
        render: (lead: BusinessLead) => (
          <span className="text-sm text-slate-700">
            {(lead as any).reviews ?? "-"}
          </span>
        ),
      },
      // 6. Type Bussiness
      {
        key: "type_business",
        header: "Type Bussiness",
        render: (lead: BusinessLead) => {
          const typeB =
            (lead as any).type_business || lead.industry || lead.title;
          return typeB ? (
            <Badge>{typeB}</Badge>
          ) : (
            <span className="text-xs text-slate-400">-</span>
          );
        },
      },
      // 7. Address → di project lain dia pakai lead.company di kolom ini
      {
        key: "address",
        header: "Address",
        render: (lead: BusinessLead) => (
          <span className="text-sm text-slate-700">
            {(lead as any).address || lead.company || "-"}
          </span>
        ),
      },
      // 8. Location
      {
        key: "location",
        header: "Location",
        render: (lead: BusinessLead) => (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700">
              {formatLocation(lead)}
            </span>
          </div>
        ),
      },
    ],
    []
  );

  const showEmptyOnlyHeader = filtered.length === 0;

  return (
    <section className="space-y-4">
      <div className="px-4 py-5 md:px-6">
        <div>
          <h3 className="pt-3 text-base font-semibold text-slate-900">
            Result
          </h3>
          <p className="py-3 text-sm text-slate-500">
            {filtered.length} leads found from {total} total entries.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* search */}
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

          {/* download */}
          <Button
            type="button"
            className="rounded-md !bg-[#2451CC] px-4 py-4 text-sm font-semibold text-white shadow-sm transition"
            onClick={() => {
              const rows =
                fullData && fullData.length > 0 ? fullData : filtered;

              // header disamakan dengan tabel project lain
              const csvHeader = [
                "Company",
                "Phone",
                "Links",
                "Rating",
                "Reviews",
                "Type Bussiness",
                "Address",
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
                  const website =
                    (lead as any).website ||
                    (lead as any).links?.website ||
                    (lead as any).linkedin ||
                    "";
                  return [
                    escape(lead.name || lead.company || ""),
                    escape(lead.phone || ""),
                    escape(website),
                    escape(
                      typeof lead.rating === "number"
                        ? lead.rating.toFixed(1)
                        : lead.rating || ""
                    ),
                    escape((lead as any).reviews ?? ""),
                    escape(
                      (lead as any).type_business ||
                        lead.industry ||
                        lead.title ||
                        ""
                    ),
                    escape((lead as any).address || lead.company || ""),
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

      {/* tabel */}
      <DataTable
        data={filtered}
        columns={columns}
        emptyState={showEmptyOnlyHeader ? null : undefined}
      />
    </section>
  );
};

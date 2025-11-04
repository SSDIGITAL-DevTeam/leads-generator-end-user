"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showInfo?: boolean;
};

export function Pagination({
  totalItems,
  currentPage,
  onPageChange,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  showInfo = true,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const [goTo, setGoTo] = useState<string>("");

  if (totalPages <= 1 && !showInfo) return null;

  // bikin array nomor halaman seperti: [1, 2, 3, "...", 27]
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const showLeft = currentPage <= 3;
    const showRight = currentPage >= totalPages - 2;

    if (showLeft) {
      pages.push(1, 2, 3, 4, "...", totalPages);
      return pages;
    }

    if (showRight) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    // tengah
    pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    return pages;
  };

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const handleGo = () => {
    const n = Number(goTo);
    if (!Number.isNaN(n) && n >= 1 && n <= totalPages) {
      onPageChange(n);
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/30 px-4 py-4 md:flex-row md:items-center md:justify-between">
      {/* KIRI: info + page size */}
      {showInfo ? (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Showing</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className={cn(
              "h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none",
              !onPageSizeChange && "cursor-not-allowed opacity-70"
            )}
            disabled={!onPageSizeChange}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>
            from{" "}
            <span className="font-semibold text-slate-700">
              {totalItems}
            </span>{" "}
            data
          </span>
        </div>
      ) : (
        <div />
      )}

      {/* KANAN: pagination */}
      <div className="flex flex-wrap items-center gap-1">
        {/* first */}
        <button
          onClick={() => currentPage !== 1 && onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium",
            currentPage === 1
              ? "cursor-not-allowed text-slate-300"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          «
        </button>

        {/* prev */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium",
            currentPage === 1
              ? "cursor-not-allowed text-slate-300"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          ‹
        </button>

        {/* numbers */}
        {getPageNumbers().map((item, idx) => {
          if (typeof item === "string") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex h-8 min-w-8 items-center justify-center text-xs text-slate-400"
              >
                {item}
              </span>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={cn(
                "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-3 text-xs font-medium transition",
                item === currentPage
                  ? "bg-[#2E65FF] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {item}
            </button>
          );
        })}

        {/* next */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium",
            currentPage === totalPages
              ? "cursor-not-allowed text-slate-300"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          ›
        </button>

        {/* last */}
        <button
          onClick={() => currentPage !== totalPages && onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium",
            currentPage === totalPages
              ? "cursor-not-allowed text-slate-300"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          »
        </button>

        {/* input goto */}
        <input
          value={goTo}
          onChange={(e) => setGoTo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleGo();
          }}
          className="h-8 w-10 rounded-md border border-slate-200 bg-white px-2 text-center text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          placeholder=""
        />

        <button
          onClick={handleGo}
          className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-[#2E65FF] hover:bg-blue-50"
        >
          Go &gt;&gt;
        </button>
      </div>
    </div>
  );
}

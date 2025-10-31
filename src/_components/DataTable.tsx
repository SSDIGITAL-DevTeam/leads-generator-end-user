"use client";

import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyState?: React.ReactNode;
}

export const DataTable = <T extends object>({
  data,
  columns,
  emptyState
}: DataTableProps<T>) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={cn(
                    "px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-500",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-base text-slate-500"
                >
                  {emptyState ?? "No data available."}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={(row as { id?: string }).id ?? idx}
                  className={cn(
                    "transition-colors duration-200 ease-in-out",
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                    "hover:bg-brand-primary/5"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-5 py-4 text-sm text-slate-600",
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row, idx)
                        : ((row as Record<string, unknown>)[
                            column.key as string
                          ] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

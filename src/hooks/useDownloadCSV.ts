// src/hooks/useDownloadCSV.ts
"use client";

type ColumnDef<T> = {
  key: keyof T | string;      // properti di object
  header?: string;            // nama kolom di csv
  mapper?: (row: T) => string | number | null | undefined; // kalau mau custom isi kolom
};

type DownloadCSVOptions<T> = {
  fileName?: string;
  columns?: ColumnDef<T>[];
};

export function useDownloadCSV<T = any>() {
  // escape value biar aman dipakai di csv
  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes('"') || str.includes(",") || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const downloadCSV = (rows: T[], options: DownloadCSVOptions<T> = {}) => {
    const { fileName = "data.csv", columns } = options;

    if (!rows || rows.length === 0) {
      // boleh kamu ganti jadi toast
      console.warn("useDownloadCSV: no rows to download");
      return;
    }

    // kalau user nggak kasih columns → ambil dari key object pertama
    let finalColumns: ColumnDef<T>[];

    if (!columns || columns.length === 0) {
      const keys = Object.keys(rows[0] as object);
      finalColumns = keys.map((k) => ({ key: k, header: k })) as ColumnDef<T>[];
    } else {
      finalColumns = columns;
    }

    // header
    const headerLine = finalColumns
      .map((col) => escape(col.header || String(col.key)))
      .join(",");

    // rows
    const lines = rows.map((row) =>
      finalColumns
        .map((col) => {
          if (col.mapper) {
            return escape(col.mapper(row));
          }
          const value =
            typeof col.key === "string"
              ? (row as any)[col.key]
              : (row as any)[col.key as keyof T];
          return escape(value);
        })
        .join(",")
    );

    const csv = [headerLine, ...lines].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { downloadCSV };
}
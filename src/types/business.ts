// src/types/business.ts
export interface BusinessLead {
  id: string;
  // di tabel “Company” kita tampilkan name dulu, tapi kadang backend cuma kirim company
  name?: string;           // nama orang / nama lead
  company?: string;        // nama perusahaan
  title?: string;
  email?: string;
  phone?: string;

  // kategori / industri
  industry?: string;

  // supaya cocok dengan payload scraping
  businessType?: string;   // yang dipakai di filter UI
  type_business?: string;  // yang dipakai di request ke backend

  // lokasi
  city?: string;
  country?: string;
  address?: string;        // dipakai kolom Address
  location?: string;       // kalau backend sudah gabungkan city+country

  // angka
  rating?: number;
  reviews?: number | string;

  // link
  website?: string;
  linkedin?: string;
}

export interface BusinessFilters {
  search: string;
  businessType: string;
  rating: string;
  city: string;
  country: string;
}

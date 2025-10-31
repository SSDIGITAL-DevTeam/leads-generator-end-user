"use client";

import { useMemo } from "react";

import { Topbar } from "@/_components/Topbar";
import { FilterBar } from "@/features/search/FilterBar";
import { ResultTable } from "@/features/search/ResultTable";
import { useFilters } from "@/features/search/useFilters";
import { useAuth } from "@/features/auth/useAuth";
import { businessLeads } from "@/lib/mockData";
import { getUniqueOptions } from "@/lib/helpers";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/_components/ui/Modal";
import { Button } from "@/_components/ui/Button";

const DashboardPage = () => {
  // ⬇ sekarang kita TIDAK pakai useProtectedRoute
  // agar halaman dashboard tetap bisa diakses tanpa login
  const { user, isAuthenticated } = useAuth();

  const { filters, filteredData, setFilter, resetFilters } =
    useFilters(businessLeads);

  // modal untuk "silakan login dulu"
  const loginModal = useModal(false);

  const businessTypes = useMemo(
    () =>
      getUniqueOptions(businessLeads, "businessType").sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    []
  );

  const cities = useMemo(
    () =>
      getUniqueOptions(businessLeads, "city").sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    []
  );

  const countries = useMemo(
    () =>
      getUniqueOptions(businessLeads, "country").sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    []
  );

  // inilah proteksi level-aksi
  const handleSearch = () => {
    if (!isAuthenticated) {
      // belum login → tampilkan modal
      loginModal.open();
      return;
    }
    // sudah login → di sini kamu bisa panggil endpoint pencarian beneran
    // untuk saat ini data masih dari mockData
    // console.log("do search with", filters);
  };

  const handleDownload = () => {
    if (!isAuthenticated) {
      loginModal.open();
      return;
    }
    // TODO: logic download
  };

  return (
    <>
      <main className="space-y-10 bg-slate-100 px-4 py-10 md:px-10 lg:px-16">
        <Topbar />

        {/* hero / how to */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium uppercase tracking-wide text-brand-primary">
              How to use
            </span>
            <h1 className="text-3xl font-semibold text-slate-900">
              {user ? `Hi ${user.name.split(" ")[0]},` : "Welcome,"} refine your
              lead discovery
            </h1>
            <p className="max-w-3xl text-base text-slate-600">
              Follow the quick overview below to tailor search filters, browse
              the database, and export the most relevant leads for your next
              campaign.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "1. Set Your Filters",
                description:
                  "Adjust the business type, rating, and location fields to target the exact profiles you need."
              },
              {
                title: "2. Search Database",
                description:
                  'Click "Search Database" to apply your filters and surface matching business leads instantly.'
              },
              {
                title: "3. Review Results",
                description:
                  "Evaluate the lead cards and export the data to nurture deals with precise outreach."
              }
            ].map((card, index) => (
              <div
                key={card.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <span className="text-lg font-semibold">{index + 1}</span>
                </div>
                <h2 className="text-xl font-medium text-slate-900">
                  {card.title}
                </h2>
                <p className="text-sm text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* filters */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Filters</h2>
            <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-medium text-brand-primary">
              Guided search experience
            </span>
          </div>
          <FilterBar
            filters={filters}
            onChange={setFilter}
            onReset={resetFilters}
            businessTypes={businessTypes.map(String)}
            cities={cities.map(String)}
            countries={countries.map(String)}
            // ⬇⬇⬇ ini yang penting
            onSearch={handleSearch}
          />
        </section>

        {/* results */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Result ({filteredData.length})
            </h2>

            {/* kalau kamu punya tombol download di dashboard */}
            <Button variant="outline" onClick={handleDownload}>
              Download Data
            </Button>
          </div>

          <ResultTable data={filteredData} total={businessLeads.length} />
        </section>
      </main>

      {/* modal login dulu */}
      <Modal
        isOpen={loginModal.isOpen}
        onClose={loginModal.close}
        title="Login diperlukan"
        description="Kamu harus login dulu sebelum bisa melakukan pencarian database."
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={loginModal.close}>
              Tutup
            </Button>
            <Button
              onClick={() => {
                loginModal.close();
                window.location.href = "/login";
              }}
            >
              Login sekarang
            </Button>
          </div>
        }
      >
        <p>
          Akses pencarian kami batasi untuk user yang sudah login agar kuota dan
          kualitas data tetap terjaga.
        </p>
      </Modal>
    </>
  );
};

export default DashboardPage;

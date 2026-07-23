import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { getAllSuratAdmin } from "@/lib/actions/surat.actions";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/surat/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteSuratButton } from "@/components/admin/DeleteSuratButton";
import { JENIS_SURAT_CONFIG } from "@/types";
import type { StatusSurat, JenisSurat } from "@/types";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FolderOpen,
  ArrowUpRight,
  Inbox,
  FileDown,
  Settings,
  Calendar,
  Sparkles,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardPageProps {
  searchParams: Promise<{
    status?: string;
    jenis?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status as StatusSurat | undefined;
  const jenisFilter = resolvedParams.jenis as JenisSurat | undefined;

  const result = await getAllSuratAdmin({
    status: statusFilter,
    jenis_surat: jenisFilter,
  });

  if (!result.success) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold">{result.error}</p>
      </div>
    );
  }

  const { suratList, stats } = result.data;
  const todayStr = format(new Date(), "EEEE, d MMMM yyyy", { locale: idLocale });

  const filterTabs = [
    { label: "Semua Surat", value: undefined, count: stats.total },
    { label: "Menunggu Verifikasi", value: "PENDING", count: stats.pending, badgeColor: "bg-amber-100 text-amber-800" },
    { label: "Telah Disetujui", value: "APPROVED", count: stats.approved, badgeColor: "bg-emerald-100 text-emerald-800" },
    { label: "Ditolak", value: "REJECTED", count: stats.rejected, badgeColor: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            {todayStr} · Pantau dan verifikasi permohonan surat warga Desa Klitih
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/pengaturan"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <Settings className="h-4 w-4 text-slate-500" />
            Pengaturan TTD &amp; Stempel
          </Link>
        </div>
      </div>

      {/* ─── Statistik ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Permohonan"
          value={stats.total}
          icon={FolderOpen}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          accentGradient="from-blue-500 to-indigo-600"
          trend="Total permohonan warga"
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={stats.pending}
          icon={Clock}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
          accentGradient="from-amber-500 to-orange-600"
          trend={`${stats.pending} butuh tindakan`}
        />
        <StatCard
          label="Telah Disetujui"
          value={stats.approved}
          icon={CheckCircle2}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          accentGradient="from-emerald-500 to-teal-600"
          trend="PDF siap diunduh"
        />
        <StatCard
          label="Permohonan Ditolak"
          value={stats.rejected}
          icon={XCircle}
          colorClass="text-red-600"
          bgClass="bg-red-50"
          accentGradient="from-red-500 to-rose-600"
          trend="Perlu perbaikan syarat"
        />
      </div>

      {/* ─── Antrean / Tabel Surat ─── */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Daftar Pengajuan Surat</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Menampilkan <span className="font-bold text-slate-900">{suratList.length}</span> permohonan
                {statusFilter ? ` dengan status ${statusFilter}` : " terbaru"}
              </CardDescription>
            </div>
          </div>

          {/* Status Filter Tab Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.value;
              const href = tab.value ? `/admin/dashboard?status=${tab.value}` : "/admin/dashboard";
              return (
                <Link
                  key={tab.label}
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : tab.badgeColor ?? "bg-slate-100 text-slate-600"
                    )}
                  >
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3.5 w-[160px]">
                    Tanggal Masuk
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3.5">
                    Pemohon / NIK
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3.5">
                    Jenis Surat
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3.5 w-[160px]">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3.5 text-right w-[160px]">
                    Aksi &amp; Opsi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suratList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-56 text-center">
                      <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700 text-sm">Tidak Ada Surat Ditemukan</p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                        Tidak ada permohonan surat dengan kriteria filter saat ini.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  suratList.map((surat) => {
                    const jenisConfig = JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG];
                    const initials = surat.nama_lengkap
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();

                    return (
                      <TableRow
                        key={surat.id}
                        className="border-slate-100 hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Tanggal */}
                        <TableCell className="px-6 py-4 text-xs font-medium text-slate-500">
                          {format(new Date(surat.created_at), "d MMM yyyy", { locale: idLocale })}
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            {format(new Date(surat.created_at), "HH:mm")} WIB
                          </span>
                        </TableCell>

                        {/* Pemohon & NIK */}
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-sm flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-snug">
                                {surat.nama_lengkap}
                              </p>
                              <p className="text-xs font-mono text-slate-500 mt-0.5">
                                NIK: {surat.nik}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Jenis Surat */}
                        <TableCell className="px-6 py-4">
                          <span className="inline-block text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                            {jenisConfig?.label ?? surat.jenis_surat}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-6 py-4">
                          <StatusBadge status={surat.status} />
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Download PDF Shortcut (if approved) */}
                            {surat.status === "APPROVED" && (
                              <a
                                href={`/api/generate-pdf?id=${surat.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Unduh PDF Surat"
                                className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              >
                                <FileDown className="h-4 w-4" />
                              </a>
                            )}

                            {/* Detail Button */}
                            <Link
                              href={`/admin/dashboard/surat/${surat.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Detail
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>

                            {/* Delete Button */}
                            <DeleteSuratButton id={surat.id} namaPemohon={surat.nama_lengkap} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { FilterSelect } from "@/components/admin/FilterSelect";
import { DeleteSuratButton } from "@/components/admin/DeleteSuratButton";
import { JENIS_SURAT_CONFIG } from "@/types";
import type { StatusSurat, JenisSurat } from "@/types";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FolderOpen,
  ArrowUpRight,
  Inbox,
} from "lucide-react";

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

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Layanan Surat
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau dan verifikasi permohonan surat administrasi warga Desa Klitih
          </p>
        </div>
      </div>

      {/* ─── Statistik ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Masuk"
          value={stats.total}
          icon={FolderOpen}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={stats.pending}
          icon={Clock}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
          trend={`${stats.pending} antrian aktif`}
        />
        <StatCard
          label="Telah Disetujui"
          value={stats.approved}
          icon={CheckCircle2}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard
          label="Ditolak"
          value={stats.rejected}
          icon={XCircle}
          colorClass="text-red-600"
          bgClass="bg-red-50"
        />
      </div>

      {/* ─── Antrean / Tabel Surat ─── */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Daftar Pengajuan Surat</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Menampilkan {suratList.length} surat berdasarkan filter
            </CardDescription>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <FilterSelect defaultValue={statusFilter ?? "ALL"} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3 w-[150px]">
                    Tanggal Masuk
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3 w-[150px]">
                    NIK
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3">
                    Nama Lengkap
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3">
                    Jenis Surat
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3 w-[160px]">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-500 text-xs font-semibold px-6 py-3 text-right w-[100px]">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suratList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-600">Tidak Ada Surat</p>
                      <p className="text-xs text-slate-400">
                        Tidak ada pengajuan surat dengan kriteria filter saat ini.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  suratList.map((surat) => {
                    const jenisConfig = JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG];
                    return (
                      <TableRow key={surat.id} className="border-slate-100 hover:bg-slate-50/50">
                        <TableCell className="px-6 py-4 text-xs font-medium text-slate-500">
                          {format(new Date(surat.created_at), "d MMM yyyy, HH:mm", { locale: idLocale })}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs font-mono font-medium text-slate-900">
                          {surat.nik}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {surat.nama_lengkap}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm font-medium text-slate-600">
                          {jenisConfig?.label ?? surat.jenis_surat}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <StatusBadge status={surat.status} />
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end">
                            <Link
                              href={`/admin/dashboard/surat/${surat.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Detail
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
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

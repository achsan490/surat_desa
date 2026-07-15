"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/surat/StatusBadge";
import { getSuratByNIK } from "@/lib/actions/surat.actions";
import { JENIS_SURAT_CONFIG } from "@/types";
import type { SuratWithId } from "@/types";
import {
  Search,
  Download,
  AlertCircle,
  XCircle,
  Clock,
  FileText,
  CreditCard,
  CalendarDays,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

function CekStatus() {
  const searchParams = useSearchParams();
  const [nik, setNik] = useState(searchParams.get("nik") ?? "");
  const [suratList, setSuratList] = useState<SuratWithId[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Auto-search jika redirect dari form pengajuan
  useEffect(() => {
    const submitted = searchParams.get("submitted");
    const nikParam = searchParams.get("nik");
    if (submitted === "true" && nikParam) {
      toast.success("Pengajuan berhasil! Berikut status surat Anda.");
      handleSearch(nikParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (searchNik?: string) => {
    const targetNik = searchNik ?? nik;
    if (!targetNik || targetNik.length !== 16) {
      toast.error("NIK harus 16 digit angka");
      return;
    }

    startTransition(async () => {
      const result = await getSuratByNIK(targetNik);
      setHasSearched(true);
      if (result.success) {
        setSuratList(result.data);
        if (result.data.length === 0) {
          toast.info("Tidak ditemukan pengajuan surat untuk NIK ini.");
        }
      } else {
        toast.error(result.error);
        setSuratList([]);
      }
    });
  };

  const handleDownload = async (id: string, namaLengkap: string, jenisSurat: string) => {
    setDownloadingId(id);
    try {
      const res = await fetch(`/api/generate-pdf?id=${id}`);
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Gagal mengunduh surat");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Surat_${jenisSurat}_${namaLengkap.replace(/\s/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Surat berhasil diunduh!");
    } catch {
      toast.error("Gagal mengunduh surat. Coba lagi.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg mx-auto">
            <Search className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Cek Status Pengajuan</h1>
          <p className="text-slate-500 text-sm">
            Masukkan NIK Anda untuk melihat status surat yang telah diajukan
          </p>
        </div>

        {/* Search Box */}
        <Card className="border border-slate-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="nikSearch" className="text-sm font-medium">
                  <CreditCard className="h-3.5 w-3.5 inline mr-1.5 text-slate-500" />
                  Nomor Induk Kependudukan (NIK)
                </Label>
                <Input
                  id="nikSearch"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="Masukkan 16 digit NIK"
                  maxLength={16}
                  inputMode="numeric"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="text-base"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => handleSearch()}
                  disabled={isPending || nik.length !== 16}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      Mencari...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Cari
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Skeleton */}
        {isPending && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="border border-slate-200">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!isPending && hasSearched && (
          <div className="space-y-4">
            {suratList.length === 0 ? (
              <Card className="border border-slate-200">
                <CardContent className="p-12 text-center space-y-3">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700">Tidak Ada Data Ditemukan</p>
                  <p className="text-sm text-slate-400">
                    Tidak ada pengajuan surat untuk NIK <strong>{nik}</strong>. Pastikan NIK yang dimasukkan benar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-slate-500 font-medium px-1">
                  Ditemukan <span className="text-slate-900 font-bold">{suratList.length}</span> pengajuan untuk NIK{" "}
                  <span className="font-mono text-slate-900">{nik}</span>
                </p>
                {suratList.map((surat) => {
                  const jenisConfig = JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG];
                  return (
                    <Card
                      key={surat.id}
                      className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Status top-bar */}
                      <div
                        className={`h-1.5 w-full ${
                          surat.status === "APPROVED"
                            ? "bg-emerald-500"
                            : surat.status === "REJECTED"
                            ? "bg-red-500"
                            : "bg-amber-400"
                        }`}
                      />
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                              {jenisConfig?.label ?? surat.jenis_surat}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {format(new Date(surat.created_at), "d MMMM yyyy, HH:mm", { locale: idLocale })}
                            </div>
                          </div>
                          <StatusBadge status={surat.status} />
                        </div>

                        {/* Detail info */}
                        <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 font-mono">
                          ID: {surat.id.split("-")[0]}...
                        </div>

                        {/* Alasan penolakan */}
                        {surat.status === "REJECTED" && surat.alasan_penolakan && (
                          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-red-700 mb-1">
                                Alasan Penolakan dari Perangkat Desa:
                              </p>
                              <p className="text-sm text-red-800 leading-relaxed">
                                {surat.alasan_penolakan}
                              </p>
                              <p className="text-xs text-red-500 mt-2">
                                Silakan ajukan kembali dengan melengkapi kekurangan di atas.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Status info bagi pending */}
                        {surat.status === "PENDING" && (
                          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-amber-700 mb-1">
                                Menunggu Verifikasi Perangkat Desa
                              </p>
                              <p className="text-sm text-amber-800">
                                Pengajuan Anda sedang dalam antrian verifikasi. Proses biasanya memakan waktu 1×24 jam kerja.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Approved — download button */}
                        {surat.status === "APPROVED" && (
                          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-emerald-700 mb-1">
                                Surat Telah Disetujui & Siap Diunduh
                              </p>
                              <p className="text-sm text-emerald-800 mb-3">
                                Dokumen resmi desa dengan tanda tangan Kepala Desa tersedia untuk diunduh.
                              </p>
                              <Button
                                onClick={() =>
                                  handleDownload(surat.id, surat.nama_lengkap, surat.jenis_surat)
                                }
                                disabled={downloadingId === surat.id}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                              >
                                {downloadingId === surat.id ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Menyiapkan PDF...
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Unduh Surat PDF
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Berkas syarat link */}
                        {surat.url_berkas_syarat && (
                          <a
                            href={surat.url_berkas_syarat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Lihat berkas syarat yang diunggah
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Info awal sebelum search */}
        {!hasSearched && !isPending && (
          <Card className="border border-dashed border-slate-200 bg-transparent">
            <CardContent className="p-10 text-center space-y-3">
              <Search className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-sm">
                Masukkan NIK 16 digit Anda dan klik tombol <strong>Cari</strong> untuk melihat status pengajuan surat.
              </p>
              <p className="text-xs text-slate-400">
                Belum mengajukan surat?{" "}
                <a href="/ajukan-surat" className="text-blue-600 hover:underline font-medium">
                  Ajukan sekarang
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function CekStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Clock className="h-10 w-10 animate-spin text-slate-400 mx-auto" />
          <p className="text-slate-500 text-sm">Memuat halaman...</p>
        </div>
      </div>
    }>
      <CekStatus />
    </Suspense>
  );
}

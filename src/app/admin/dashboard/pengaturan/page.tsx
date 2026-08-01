"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  getPengaturanDesa,
  updatePengaturanDesa,
  getTemplateSurat,
  type TemplateSuratMap,
} from "@/lib/actions/pengaturan.actions";
import { JENIS_SURAT_CONFIG, type JenisSuratKey } from "@/types";
import {
  Settings,
  Upload,
  UserCheck,
  FileBadge,
  Save,
  CheckCircle2,
  FileImage,
  Loader2,
  RefreshCw,
  FileText,
  Download,
  Trash2,
  ScrollText,
  FileCheck2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

// ─── Daftar jenis surat untuk template grid ───────────────────────────────────
const JENIS_SURAT_LIST = Object.entries(JENIS_SURAT_CONFIG).map(([key, val]) => ({
  key: key as JenisSuratKey,
  label: val.label,
}));

// ─── Helper: ikon per jenis surat ────────────────────────────────────────────
function getFileIcon(url: string) {
  if (url.endsWith(".pdf")) return "PDF";
  if (url.endsWith(".docx") || url.endsWith(".doc")) return "DOCX";
  return "FILE";
}

export default function PengaturanPage() {
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // ── Pengaturan TTD & Stempel ──────────────────────────────────────────────
  const [namaKades, setNamaKades] = useState("");
  const [jabatanKades, setJabatanKades] = useState("");
  const [urlTtd, setUrlTtd] = useState("");
  const [urlStempel, setUrlStempel] = useState("");
  const [uploadingTtd, setUploadingTtd] = useState(false);
  const [uploadingStempel, setUploadingStempel] = useState(false);

  // ── Template Surat ────────────────────────────────────────────────────────
  const [templateMap, setTemplateMap] = useState<TemplateSuratMap>({});
  const [uploadingTemplate, setUploadingTemplate] = useState<Record<string, boolean>>({});
  const [deletingTemplate, setDeletingTemplate] = useState<Record<string, boolean>>({});

  const isMountedRef = useRef(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const [settingsRes, templateRes] = await Promise.all([
      getPengaturanDesa(),
      getTemplateSurat(),
    ]);

    if (isMountedRef.current) {
      if (settingsRes.success && settingsRes.data) {
        setNamaKades(settingsRes.data.nama_kades);
        setJabatanKades(settingsRes.data.jabatan_kades);
        setUrlTtd(settingsRes.data.url_ttd);
        setUrlStempel(settingsRes.data.url_stempel);
      }
      if (templateRes.success && templateRes.data) {
        setTemplateMap(templateRes.data);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadSettings();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadSettings]);

  // ── Upload TTD / Stempel ──────────────────────────────────────────────────
  const handleFileUpload = async (file: File, type: "ttd" | "stempel") => {
    if (type === "ttd") setUploadingTtd(true);
    else setUploadingStempel(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Gagal mengunggah gambar");
        return;
      }

      const data = await res.json();
      if (type === "ttd") {
        setUrlTtd(data.url);
        toast.success("Foto Tanda Tangan berhasil diunggah!");
      } else {
        setUrlStempel(data.url);
        toast.success("Foto Stempel Desa berhasil diunggah!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah berkas.");
    } finally {
      if (type === "ttd") setUploadingTtd(false);
      else setUploadingStempel(false);
    }
  };

  // ── Upload Template Surat ─────────────────────────────────────────────────
  const handleTemplateUpload = async (file: File, jenisSurat: string) => {
    setUploadingTemplate((prev) => ({ ...prev, [jenisSurat]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jenisSurat", jenisSurat);

      const res = await fetch("/api/upload-template", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal mengunggah template");
        return;
      }

      setTemplateMap((prev) => ({ ...prev, [jenisSurat]: data.url }));
      toast.success("Template surat berhasil diunggah!");
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah template.");
    } finally {
      setUploadingTemplate((prev) => ({ ...prev, [jenisSurat]: false }));
    }
  };

  // ── Hapus Template Surat ──────────────────────────────────────────────────
  const handleTemplateDelete = async (jenisSurat: string) => {
    setDeletingTemplate((prev) => ({ ...prev, [jenisSurat]: true }));
    try {
      const res = await fetch("/api/delete-template", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisSurat }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal menghapus template");
        return;
      }

      setTemplateMap((prev) => {
        const next = { ...prev };
        delete next[jenisSurat];
        return next;
      });
      toast.success("Template berhasil dihapus.");
    } catch {
      toast.error("Terjadi kesalahan saat menghapus template.");
    } finally {
      setDeletingTemplate((prev) => ({ ...prev, [jenisSurat]: false }));
    }
  };

  // ── Simpan Pengaturan TTD & Stempel ──────────────────────────────────────
  const handleSave = () => {
    if (!namaKades.trim()) {
      toast.error("Nama penandatangan tidak boleh kosong.");
      return;
    }
    if (!jabatanKades.trim()) {
      toast.error("Jabatan penandatangan tidak boleh kosong.");
      return;
    }

    startTransition(async () => {
      const res = await updatePengaturanDesa({
        nama_kades: namaKades,
        jabatan_kades: jabatanKades,
        url_ttd: urlTtd,
        url_stempel: urlStempel,
      });

      if (res.success) {
        toast.success(res.message ?? "Pengaturan berhasil disimpan!");
      } else {
        toast.error(res.error ?? "Gagal menyimpan pengaturan.");
      }
    });
  };

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Pengaturan Surat</h1>
              <p className="text-sm text-slate-500">
                Kelola TTD, stempel, identitas penandatangan, dan template surat resmi desa
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={loadSettings}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* ─── Identitas Penandatangan ──────────────────────────────────────────── */}
      <div className="space-y-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-indigo-600" />
              Identitas Penandatangan Surat
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Nama dan jabatan di bawah ini akan tercetak pada bagian footer di setiap PDF surat yang diunduh warga.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaKades" className="text-sm font-medium">
                  Nama Kepala Desa / Pejabat
                </Label>
                <Input
                  id="namaKades"
                  value={namaKades}
                  onChange={(e) => setNamaKades(e.target.value)}
                  placeholder="Contoh: Siti Ro'aini"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jabatanKades" className="text-sm font-medium">
                  Jabatan Penandatangan
                </Label>
                <Input
                  id="jabatanKades"
                  value={jabatanKades}
                  onChange={(e) => setJabatanKades(e.target.value)}
                  placeholder="Contoh: Kepala Desa Klitih"
                  className="bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Upload TTD & Stempel ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Tanda Tangan */}
          <Card className="border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-indigo-600" />
                  Foto Tanda Tangan (TTD)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Gunakan format PNG dengan latar transparan agar hasil cetak surat optimal.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/80 flex flex-col items-center justify-center min-h-[160px]">
                  {urlTtd ? (
                    <div className="relative w-full h-32 flex items-center justify-center bg-white rounded-lg border border-slate-200 p-2 shadow-inner">
                      <Image
                        src={urlTtd}
                        alt="Tanda Tangan"
                        width={200}
                        height={100}
                        className="object-contain max-h-28"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="text-center space-y-2 text-slate-400 py-4">
                      <FileImage className="h-10 w-10 mx-auto opacity-50" />
                      <p className="text-xs font-medium">Belum ada gambar TTD khusus</p>
                      <p className="text-[10px] text-slate-400">Menggunakan TTD default desa</p>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="ttdFileInput"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "ttd");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingTtd}
                    onClick={() => document.getElementById("ttdFileInput")?.click()}
                    className="w-full gap-2 border-slate-300 hover:bg-slate-100"
                  >
                    {uploadingTtd ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                        Mengunggah TTD...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-slate-600" />
                        Unggah Tanda Tangan Baru
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Card Stempel Desa */}
          <Card className="border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-indigo-600" />
                  Foto Stempel Desa
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Gunakan cap/stempel desa format PNG transparan untuk tampilan resmi.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/80 flex flex-col items-center justify-center min-h-[160px]">
                  {urlStempel ? (
                    <div className="relative w-full h-32 flex items-center justify-center bg-white rounded-lg border border-slate-200 p-2 shadow-inner">
                      <Image
                        src={urlStempel}
                        alt="Stempel Desa"
                        width={140}
                        height={140}
                        className="object-contain max-h-28 opacity-90"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="text-center space-y-2 text-slate-400 py-4">
                      <FileImage className="h-10 w-10 mx-auto opacity-50" />
                      <p className="text-xs font-medium">Belum ada gambar Stempel khusus</p>
                      <p className="text-[10px] text-slate-400">Menggunakan Stempel default desa</p>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="stempelFileInput"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "stempel");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingStempel}
                    onClick={() => document.getElementById("stempelFileInput")?.click()}
                    className="w-full gap-2 border-slate-300 hover:bg-slate-100"
                  >
                    {uploadingStempel ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                        Mengunggah Stempel...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-slate-600" />
                        Unggah Stempel Desa Baru
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Submit Card */}
        <Card className="border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-slate-900">Siap menyimpan perubahan?</p>
                <p className="text-xs text-slate-500">
                  Perubahan akan langsung berlaku pada dokumen PDF surat berikutnya yang diunduh warga.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isPending || uploadingTtd || uploadingStempel}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 shadow-sm gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ─── Template Surat Resmi ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Template Surat Resmi</h2>
              <p className="text-sm text-slate-500">
                Unggah file template (.docx / .pdf) per jenis surat sebagai acuan format surat resmi desa
              </p>
            </div>
          </div>

          {/* Stats badge */}
          <div className="hidden sm:flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 gap-1.5">
              <FileCheck2 className="h-3 w-3" />
              {Object.keys(templateMap).length} / {JENIS_SURAT_LIST.length} diunggah
            </Badge>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Template ini berfungsi sebagai <strong>panduan format resmi</strong> yang dapat diunduh oleh admin.
            Format yang diterima: <strong>DOCX</strong> (Word) dan <strong>PDF</strong>, maksimal 10 MB per file.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {JENIS_SURAT_LIST.map(({ key, label }) => {
            const templateUrl = templateMap[key];
            const isUploading = !!uploadingTemplate[key];
            const isDeleting = !!deletingTemplate[key];
            const hasTemplate = !!templateUrl;
            const fileType = hasTemplate ? getFileIcon(templateUrl) : null;

            return (
              <Card
                key={key}
                className={`border shadow-sm transition-all hover:shadow-md ${
                  hasTemplate
                    ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Header card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                          hasTemplate
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {hasTemplate ? (
                          fileType === "PDF" ? (
                            <span className="text-[10px]">PDF</span>
                          ) : (
                            <span className="text-[10px]">DOC</span>
                          )
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2">
                          {label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{key}</p>
                      </div>
                    </div>

                    {/* Status badge */}
                    {hasTemplate ? (
                      <Badge className="flex-shrink-0 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-[10px] px-1.5 py-0.5">
                        ✓ Ada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex-shrink-0 text-slate-400 border-slate-200 text-[10px] px-1.5 py-0.5">
                        Kosong
                      </Badge>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100" />

                  {/* Actions */}
                  <div className="flex gap-2">
                    {/* Upload */}
                    <div className="flex-1">
                      <input
                        type="file"
                        id={`template-input-${key}`}
                        accept=".docx,.doc,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleTemplateUpload(file, key);
                          // reset input agar bisa upload ulang file sama
                          e.target.value = "";
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading || isDeleting}
                        onClick={() =>
                          document.getElementById(`template-input-${key}`)?.click()
                        }
                        className="w-full gap-1.5 text-xs border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Mengunggah...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3" />
                            {hasTemplate ? "Ganti" : "Upload"}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Download — hanya jika ada template */}
                    {hasTemplate && (
                      <a
                        href={templateUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          title="Unduh template"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </a>
                    )}

                    {/* Delete — hanya jika ada template */}
                    {hasTemplate && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isDeleting || isUploading}
                        onClick={() => handleTemplateDelete(key)}
                        className="gap-1.5 text-xs border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        title="Hapus template"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

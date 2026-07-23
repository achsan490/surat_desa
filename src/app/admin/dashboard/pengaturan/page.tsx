"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPengaturanDesa, updatePengaturanDesa } from "@/lib/actions/pengaturan.actions";
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
} from "lucide-react";
import Image from "next/image";

export default function PengaturanPage() {
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [namaKades, setNamaKades] = useState("");
  const [jabatanKades, setJabatanKades] = useState("");
  const [urlTtd, setUrlTtd] = useState("");
  const [urlStempel, setUrlStempel] = useState("");

  const [uploadingTtd, setUploadingTtd] = useState(false);
  const [uploadingStempel, setUploadingStempel] = useState(false);

  const isMountedRef = useRef(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const res = await getPengaturanDesa();
    if (isMountedRef.current) {
      if (res.success && res.data) {
        setNamaKades(res.data.nama_kades);
        setJabatanKades(res.data.jabatan_kades);
        setUrlTtd(res.data.url_ttd);
        setUrlStempel(res.data.url_stempel);
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

  const handleFileUpload = async (
    file: File,
    type: "ttd" | "stempel"
  ) => {
    if (type === "ttd") setUploadingTtd(true);
    else setUploadingStempel(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

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

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Pengaturan TTD & Stempel</h1>
              <p className="text-sm text-slate-500">
                Atur identitas penandatangan dan unggah gambar TTD & Stempel resmi untuk PDF surat
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

      {/* Main Form */}
      <div className="grid grid-cols-1 gap-6">
        {/* Identitas Penandatangan */}
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

        {/* Upload TTD & Stempel */}
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
                {/* Preview Box */}
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

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="ttdFileInput"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
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
                {/* Preview Box */}
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

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="stempelFileInput"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
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
    </div>
  );
}

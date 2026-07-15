"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DynamicFormFields } from "@/components/surat/DynamicFormFields";
import { createSurat } from "@/lib/actions/surat.actions";
import { cn } from "@/lib/utils";
import { JENIS_SURAT_CONFIG } from "@/types";
import type { JenisSuratKey } from "@/types";
import { FileText, Upload, AlertCircle, CheckCircle2, Loader2, User, Phone, CreditCard } from "lucide-react";

const JENIS_OPTIONS = Object.entries(JENIS_SURAT_CONFIG).map(([key, val]) => ({
  value: key as JenisSuratKey,
  label: val.label,
}));

export default function AjukanSuratPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [noWhatsapp, setNoWhatsapp] = useState("");
  const [jenisSurat, setJenisSurat] = useState<JenisSuratKey | "">("");
  const [dataKustom, setDataKustom] = useState<Record<string, string>>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleJenisSuratChange = (val: JenisSuratKey | "" | null) => {
    setJenisSurat(val ?? "");
    setDataKustom({}); // Reset dynamic fields
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5 MB");
      return;
    }
    setUploadFile(file);
    if (file.type.startsWith("image/")) {
      setUploadPreview(URL.createObjectURL(file));
    } else {
      setUploadPreview("");
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      newErrors.nik = "NIK harus 16 digit angka";
    }
    if (!namaLengkap || namaLengkap.length < 3) {
      newErrors.namaLengkap = "Nama lengkap minimal 3 karakter";
    }
    if (!noWhatsapp || !/^(\+62|62|0)[0-9]{8,12}$/.test(noWhatsapp)) {
      newErrors.noWhatsapp = "Format nomor WhatsApp tidak valid (contoh: 08123456789)";
    }
    if (!jenisSurat) {
      newErrors.jenisSurat = "Pilih jenis surat";
    }

    // Validasi field dinamis
    if (jenisSurat) {
      const fields = JENIS_SURAT_CONFIG[jenisSurat]?.fields ?? [];
      for (const field of fields) {
        if (field.required && !dataKustom[field.name]) {
          newErrors[`custom_${field.name}`] = `${field.label} wajib diisi`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    startTransition(async () => {
      let urlBerkasSyarat: string | null = null;

      // Upload file jika ada
      if (uploadFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", uploadFile);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: uploadForm });
          const data = await res.json();
          if (res.ok) {
            urlBerkasSyarat = data.url;
          } else {
            toast.error(data.error ?? "Gagal mengunggah berkas");
            return;
          }
        } catch {
          toast.error("Gagal mengunggah berkas. Periksa koneksi Anda.");
          return;
        }
      }

      const formData = new FormData();
      formData.set("nik", nik);
      formData.set("nama_lengkap", namaLengkap);
      formData.set("no_whatsapp", noWhatsapp);
      formData.set("jenis_surat", jenisSurat);
      formData.set("data_kustom", JSON.stringify(dataKustom));
      if (urlBerkasSyarat) formData.set("url_berkas_syarat", urlBerkasSyarat);

      const result = await createSurat(formData);

      if (result.success) {
        toast.success("Pengajuan berhasil dikirim! Simpan NIK Anda untuk cek status.");
        router.push(`/cek-status?nik=${nik}&submitted=true`);
      } else {
        toast.error(result.error);
      }
    });
  };

  const customErrors: Record<string, string> = {};
  for (const [key, val] of Object.entries(errors)) {
    if (key.startsWith("custom_")) {
      customErrors[key.replace("custom_", "")] = val;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg mx-auto">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Formulir Pengajuan Surat</h1>
          <p className="text-slate-500 text-sm">
            Isi formulir di bawah dengan data yang benar dan lengkap
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Data Diri Pemohon
              </CardTitle>
              <CardDescription>Pastikan data sesuai KTP yang berlaku</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* NIK */}
              <div className="space-y-1.5">
                <Label htmlFor="nik" className="text-sm font-medium">
                  <CreditCard className="h-3.5 w-3.5 inline mr-1.5 text-slate-500" />
                  Nomor Induk Kependudukan (NIK) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nik"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="16 digit angka sesuai KTP"
                  maxLength={16}
                  inputMode="numeric"
                  className={errors.nik ? "border-red-400 focus-visible:ring-red-400" : ""}
                />
                {errors.nik && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.nik}
                  </p>
                )}
                {nik.length === 16 && !errors.nik && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> NIK valid
                  </p>
                )}
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <Label htmlFor="namaLengkap" className="text-sm font-medium">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="namaLengkap"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  className={errors.namaLengkap ? "border-red-400 focus-visible:ring-red-400" : ""}
                />
                {errors.namaLengkap && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.namaLengkap}
                  </p>
                )}
              </div>

              {/* No WhatsApp */}
              <div className="space-y-1.5">
                <Label htmlFor="noWhatsapp" className="text-sm font-medium">
                  <Phone className="h-3.5 w-3.5 inline mr-1.5 text-slate-500" />
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="noWhatsapp"
                  value={noWhatsapp}
                  onChange={(e) => setNoWhatsapp(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  inputMode="tel"
                  className={errors.noWhatsapp ? "border-red-400 focus-visible:ring-red-400" : ""}
                />
                {errors.noWhatsapp && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.noWhatsapp}
                  </p>
                )}
                <p className="text-xs text-slate-400">
                  Notifikasi status pengajuan dapat dikirim melalui WhatsApp
                </p>
              </div>

              <Separator />

              {/* Jenis Surat */}
              <div className="space-y-3">
                <Label htmlFor="jenisSurat" className="text-sm font-medium">
                  <FileText className="h-3.5 w-3.5 inline mr-1.5 text-slate-500" />
                  Pilih Jenis Surat yang Dimohon <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {JENIS_OPTIONS.map(({ value, label }) => {
                    const config = JENIS_SURAT_CONFIG[value];
                    const isSelected = jenisSurat === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleJenisSuratChange(value)}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                          isSelected
                            ? "border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-sm"
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg mt-0.5 flex-shrink-0",
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                        )}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={cn(
                            "text-sm font-semibold leading-tight",
                            isSelected ? "text-blue-900 font-bold" : "text-slate-800"
                          )}>
                            {label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 leading-normal line-clamp-2">
                            {config.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.jenisSurat && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.jenisSurat}
                  </p>
                )}
              </div>

              {/* Dynamic Fields */}
              {jenisSurat && (
                <DynamicFormFields
                  jenisSurat={jenisSurat}
                  values={dataKustom}
                  onChange={(field, value) =>
                    setDataKustom((prev) => ({ ...prev, [field]: value }))
                  }
                  errors={customErrors}
                />
              )}

              <Separator />

              {/* Upload Berkas */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <Upload className="h-3.5 w-3.5 inline mr-1.5 text-slate-500" />
                  Upload Berkas Syarat (KTP / KK)
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    id="fileUpload"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                  >
                    {uploadPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={uploadPreview}
                        alt="Preview berkas"
                        className="h-28 w-auto object-contain rounded-lg p-1"
                      />
                    ) : uploadFile ? (
                      <div className="text-center space-y-1">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                        <p className="text-sm text-emerald-600 font-medium">{uploadFile.name}</p>
                        <p className="text-xs text-slate-400">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto group-hover:text-blue-500 transition-colors" />
                        <p className="text-sm text-slate-500">
                          <span className="font-semibold text-blue-600">Klik untuk upload</span> atau drag & drop
                        </p>
                        <p className="text-xs text-slate-400">JPG, PNG, WebP, PDF (maks. 5 MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold h-12 text-base shadow-md hover:shadow-lg transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Mengirim Pengajuan...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Kirim Pengajuan Surat
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-slate-400">
                Setelah pengajuan dikirim, simpan NIK Anda untuk memantau status di halaman{" "}
                <a href="/cek-status" className="text-blue-600 hover:underline font-medium">
                  Cek Status
                </a>
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { getSuratById } from "@/lib/actions/surat.actions";
import { StatusBadge } from "@/components/surat/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { approveSurat, rejectSurat } from "@/lib/actions/surat.actions";
import { JENIS_SURAT_CONFIG } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Phone,
  User,
  CreditCard,
  Check,
  X,
  FileDown,
  FileCheck,
  AlertTriangle,
  MessageCircle,
  Clock,
  ExternalLink,
  Building2,
} from "lucide-react";

interface DetailSuratPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailSuratPage({ params }: DetailSuratPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const result = await getSuratById(id);
  if (!result.success) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Surat Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm">{result.error}</p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const surat = result.data;
  const jenisConfig = JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG];

  // Format WA Link
  const cleanWaNumber = surat.no_whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  const waChatUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Halo Sdr/i ${surat.nama_lengkap}, mengenai pengajuan ${jenisConfig?.label ?? surat.jenis_surat} di Kantor Desa Klitih...`
  )}`;

  // Helper form action for approve
  const handleApproveAction = async () => {
    "use server";
    await approveSurat(id);
  };

  // Helper form action for reject
  const handleRejectAction = async (formData: FormData) => {
    "use server";
    await rejectSurat(id, formData);
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Antrian Surat
        </Link>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {surat.jenis_surat}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {surat.id}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            {jenisConfig?.label ?? surat.jenis_surat}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Diajukan pada {format(new Date(surat.created_at), "d MMMM yyyy, HH:mm", { locale: idLocale })} WIB
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={surat.status} className="text-sm px-3.5 py-1.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Data Pemohon & Detail Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Data Pemohon */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  Data Identitas Pemohon
                </span>

                <a
                  href={waChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Hubungi WA Pemohon
                </a>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-3.5 text-xs md:text-sm">
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-slate-500 font-medium col-span-1">Nama Lengkap</span>
                <span className="text-slate-900 font-bold col-span-2">{surat.nama_lengkap}</span>
              </div>
              <Separator className="bg-slate-100" />
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-slate-500 font-medium col-span-1">NIK (16 Digit)</span>
                <span className="text-slate-900 font-mono font-bold col-span-2">{surat.nik}</span>
              </div>
              <Separator className="bg-slate-100" />
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-slate-500 font-medium col-span-1">No. WhatsApp</span>
                <span className="text-slate-900 font-semibold col-span-2">{surat.no_whatsapp}</span>
              </div>
            </CardContent>
          </Card>

          {/* Data Kustom / Detail Formulir */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-indigo-600" />
                Rincian Isian Surat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5 text-xs md:text-sm">
              {Object.entries(surat.data_kustom).length === 0 ? (
                <p className="text-slate-400 italic">Tidak ada data tambahan untuk jenis surat ini.</p>
              ) : (
                Object.entries(surat.data_kustom).map(([key, val]) => {
                  const fieldConfig = jenisConfig?.fields.find((f) => f.name === key);
                  const label = fieldConfig?.label ?? key;
                  return (
                    <div key={key} className="grid grid-cols-3 gap-2 py-1 border-b border-slate-50 last:border-0">
                      <span className="text-slate-500 font-medium col-span-1">{label}</span>
                      <span className="text-slate-900 font-semibold col-span-2 whitespace-pre-wrap">
                        {val || "-"}
                      </span>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Alasan Penolakan (Jika status REJECTED) */}
          {surat.status === "REJECTED" && (
            <div className="bg-red-50 border border-red-200/80 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-red-800 flex items-center gap-2">
                <X className="h-4 w-4 rounded-full bg-red-100 p-0.5 text-red-600" />
                Alasan Penolakan Berkas:
              </h4>
              <p className="text-sm text-red-900 leading-relaxed bg-white border border-red-100 rounded-xl p-3.5 shadow-xs font-medium">
                {surat.alasan_penolakan ?? "Tidak ada alasan penolakan yang dicatat."}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Berkas Syarat & Verifikasi Actions */}
        <div className="space-y-6">
          {/* Berkas Syarat */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                Berkas Syarat Warga
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-center">
              {surat.url_berkas_syarat ? (
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                    {surat.url_berkas_syarat.endsWith(".pdf") ? (
                      <div className="text-center space-y-1">
                        <FileDown className="h-10 w-10 text-red-500 mx-auto" />
                        <span className="text-xs text-slate-600 font-bold block">Dokumen PDF Syarat</span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={surat.url_berkas_syarat}
                        alt="Berkas Syarat KTP/KK"
                        className="max-h-full max-w-full object-contain rounded-md"
                      />
                    )}
                  </div>

                  <a
                    href={surat.url_berkas_syarat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Buka File Ukuran Penuh
                  </a>
                </div>
              ) : (
                <div className="py-8 text-slate-400 text-xs font-medium">
                  Pemohon tidak melampirkan berkas syarat tambahan.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Box untuk PENDING */}
          {surat.status === "PENDING" && (
            <Card className="border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-purple-50/40 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-indigo-100 p-5">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600 animate-pulse" />
                  Keputusan Verifikasi Admin
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Pilih keputusan untuk permohonan surat ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {/* Form Approve */}
                <form action={handleApproveAction}>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 h-11 rounded-xl shadow-sm transition-all"
                  >
                    <Check className="h-4 w-4" />
                    Setujui &amp; Generate PDF Resmi
                  </Button>
                </form>

                {/* Reject Dialog */}
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 font-bold flex items-center justify-center gap-2 h-11 rounded-xl"
                      />
                    }
                  >
                    <X className="h-4 w-4" />
                    Tolak Permohonan
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form action={handleRejectAction} className="space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-red-700 font-bold">Tolak Permohonan Surat</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                          Masukkan alasan penolakan yang jelas agar warga mengetahui kekurangan berkas yang harus diperbaiki.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-2">
                        <Label htmlFor="alasan_penolakan" className="text-xs font-semibold text-slate-700">
                          Catatan / Alasan Penolakan <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="alasan_penolakan"
                          name="alasan_penolakan"
                          placeholder="Contoh: Foto KK/KTP terpotong/buram, mohon upload foto ulang yang jelas."
                          rows={4}
                          className="resize-none text-xs"
                          required
                          minLength={10}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" variant="destructive" className="w-full sm:w-auto font-bold text-xs">
                          Ya, Tolak Permohonan
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* Action Box untuk APPROVED */}
          {surat.status === "APPROVED" && (
            <Card className="border border-emerald-100 bg-emerald-50/40 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 text-center space-y-3">
                <Check className="h-10 w-10 text-emerald-600 mx-auto bg-emerald-100 rounded-full p-2" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">Surat Telah Disetujui</p>
                  <p className="text-xs text-slate-500">
                    File PDF resmi desa sudah diterbitkan dan dapat diunduh oleh warga dari HP mereka.
                  </p>
                </div>
                <a
                  href={`/api/generate-pdf?id=${surat.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  Unduh File PDF Surat
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

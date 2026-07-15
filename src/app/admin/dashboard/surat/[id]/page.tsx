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
        <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
        <p className="text-slate-500">{result.error}</p>
        <Button render={<Link href="/admin/dashboard" />} variant="outline" nativeButton={false}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const surat = result.data;
  const jenisConfig = JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG];

  // Helper form action for approve
  const handleApproveAction = async () => {
    "use server";
    const approveResult = await approveSurat(id);
    if (!approveResult.success) {
      // API actions return errors directly
    }
  };

  // Helper form action for reject
  const handleRejectAction = async (formData: FormData) => {
    "use server";
    const rejectResult = await rejectSurat(id, formData);
    if (!rejectResult.success) {
      // API actions return errors directly
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Antrian
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {surat.jenis_surat}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {surat.id}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            {jenisConfig?.label ?? surat.jenis_surat}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Diajukan pada {format(new Date(surat.created_at), "d MMMM yyyy, HH:mm", { locale: idLocale })}
          </p>
        </div>
        <div>
          <StatusBadge status={surat.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Data Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Data Pemohon */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Data Pemohon
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium col-span-1">Nama Lengkap</span>
                <span className="text-slate-900 font-semibold col-span-2">{surat.nama_lengkap}</span>
              </div>
              <Separator className="bg-slate-100" />
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium col-span-1">NIK</span>
                <span className="text-slate-900 font-mono font-semibold col-span-2">{surat.nik}</span>
              </div>
              <Separator className="bg-slate-100" />
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium col-span-1">No. WhatsApp</span>
                <span className="text-slate-900 font-semibold col-span-2">{surat.no_whatsapp}</span>
              </div>
            </CardContent>
          </Card>

          {/* Data Kustom / Detail Surat */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-600" />
                Detail Formulir Surat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              {Object.entries(surat.data_kustom).length === 0 ? (
                <p className="text-slate-400 italic">Tidak ada data tambahan untuk jenis surat ini.</p>
              ) : (
                Object.entries(surat.data_kustom).map(([key, val]) => {
                  // Find label in field config
                  const fieldConfig = jenisConfig?.fields.find((f) => f.name === key);
                  const label = fieldConfig?.label ?? key;
                  return (
                    <div key={key} className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium col-span-1">{label}</span>
                      <span className="text-slate-900 font-semibold col-span-2 whitespace-pre-wrap">
                        {val}
                      </span>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Rejection / Approval Info Box */}
          {surat.status === "REJECTED" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-red-800 flex items-center gap-2">
                <X className="h-4 w-4 rounded-full bg-red-100 p-0.5" />
                Surat Ditolak
              </h4>
              <p className="text-sm text-red-800 leading-relaxed bg-white border border-red-100 rounded-lg p-3">
                {surat.alasan_penolakan ?? "Tidak ada alasan penolakan yang dicatat."}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Upload Document / Actions */}
        <div className="space-y-6">
          {/* Berkas Syarat */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Berkas Syarat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-center">
              {surat.url_berkas_syarat ? (
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                    {surat.url_berkas_syarat.endsWith(".pdf") ? (
                      <div className="text-center">
                        <FileDown className="h-10 w-10 text-red-400 mx-auto" />
                        <span className="text-xs text-slate-500 font-medium mt-1 block">
                          Format File PDF
                        </span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={surat.url_berkas_syarat}
                        alt="Berkas KTP/KK"
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                  <Button render={<a href={surat.url_berkas_syarat} target="_blank" rel="noopener noreferrer" />} size="sm" variant="outline" className="w-full text-xs" nativeButton={false}>
                    Buka Dokumen Penuh
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-slate-400 text-xs">
                  Tidak ada berkas syarat yang diunggah pemohon.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action buttons (only for PENDING state) */}
          {surat.status === "PENDING" && (
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold">Aksi Verifikasi</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {/* Approve Form */}
                <form action={handleApproveAction}>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 h-10 shadow-sm"
                  >
                    <Check className="h-4.5 w-4.5" />
                    Setujui & Generate PDF
                  </Button>
                </form>

                {/* Reject Dialog */}
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 font-semibold flex items-center justify-center gap-1.5 h-10"
                      />
                    }
                  >
                    <X className="h-4.5 w-4.5" />
                    Tolak Permohonan
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form action={handleRejectAction} className="space-y-4">
                      <DialogHeader>
                        <DialogTitle className="text-red-700">Tolak Permohonan Surat</DialogTitle>
                        <DialogDescription>
                          Anda wajib memasukkan alasan penolakan secara jelas agar warga dapat memperbaikinya.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-2">
                        <Label htmlFor="alasan_penolakan" className="text-sm font-medium text-slate-700">
                          Alasan Penolakan <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="alasan_penolakan"
                          name="alasan_penolakan"
                          placeholder="Contoh: Foto KK kurang jelas/buram, mohon upload file dokumen asli."
                          rows={4}
                          className="resize-none"
                          required
                          minLength={10}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" variant="destructive" className="w-full sm:w-auto">
                          Ya, Tolak Permohonan
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* Actions available if approved */}
          {surat.status === "APPROVED" && (
            <Card className="border border-slate-200 shadow-sm bg-slate-50/50">
              <CardContent className="p-5 text-center space-y-3">
                <Check className="h-8 w-8 text-emerald-600 mx-auto bg-emerald-100 rounded-full p-1.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 text-sm">Surat Telah Selesai</p>
                  <p className="text-xs text-slate-400">
                    PDF resmi desa sudah tersedia dan siap diunduh oleh warga.
                  </p>
                </div>
                <Button render={<a href={`/api/generate-pdf?id=${surat.id}`} />} size="sm" variant="outline" className="w-full" nativeButton={false}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Unduh Arsip Surat (PDF)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

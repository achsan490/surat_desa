import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Upload,
  Download,
  ArrowRight,
  Building2,
  HandHeart,
  Briefcase,
  HeartHandshake,
  PhoneCall,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Layanan pengajuan surat keterangan desa Klitih secara online. Cepat, mudah, dan transparan.",
};

const LAYANAN = [
  {
    key: "SKTM",
    icon: HandHeart,
    label: "Surat Keterangan Tidak Mampu",
    singkat: "SKTM",
    desc: "Untuk keperluan beasiswa, pengobatan, dan bantuan sosial pemerintah.",
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    key: "SURAT_KEMATIAN",
    icon: HeartHandshake,
    label: "Surat Keterangan Kematian",
    singkat: "SKM",
    desc: "Surat resmi untuk pelaporan kematian warga keperluan administrasi kependudukan.",
    color: "from-violet-500 to-violet-700",
    bgLight: "bg-violet-50",
    textColor: "text-violet-700",
  },
  {
    key: "SURAT_DOMISILI",
    icon: MapPin,
    label: "Surat Keterangan Domisili",
    singkat: "SKDOM",
    desc: "Bukti resmi tempat tinggal untuk SKCK, perbankan, melamar pekerjaan, dan keperluan lainnya.",
    color: "from-emerald-500 to-emerald-700",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    key: "SURAT_KETERANGAN_USAHA",
    icon: Briefcase,
    label: "Surat Keterangan Usaha",
    singkat: "SKU",
    desc: "Legalitas usaha kecil dan mikro warga desa untuk keperluan permodalan dan perizinan.",
    color: "from-orange-500 to-orange-700",
    bgLight: "bg-orange-50",
    textColor: "text-orange-700",
  },
];

const ALUR = [
  {
    step: "01",
    icon: FileText,
    label: "Isi Formulir Online",
    desc: "Lengkapi form pengajuan dengan data diri dan upload berkas syarat (KTP/KK).",
    color: "bg-blue-600",
  },
  {
    step: "02",
    icon: ShieldCheck,
    label: "Verifikasi Perangkat Desa",
    desc: "Tim perangkat desa memeriksa kelengkapan berkas dan memverifikasi data Anda.",
    color: "bg-indigo-600",
  },
  {
    step: "03",
    icon: Download,
    label: "Unduh Surat Resmi",
    desc: "Setelah disetujui, unduh surat resmi bertanda tangan Kepala Desa dalam format PDF.",
    color: "bg-emerald-600",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/20 px-4 py-1 text-xs font-medium">
                <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Building2 className="h-3 w-3 mr-1.5" />
                  Desa Klitih — Kab. Jombang
                </a>
            </Badge>

            <p className="text-xs md:text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Sistem Informasi Pelayanan Administrasi Surat (SIPAS)
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mt-2">
              Layanan Surat Desa{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Online & Resmi
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Ajukan surat keterangan desa dari mana saja, kapan saja. Proses cepat, transparan, dan dokumen resmi siap unduh setelah diverifikasi perangkat desa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/ajukan-surat"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                )}
              >
                <FileText className="h-5 w-5 mr-2" />
                Ajukan Surat Sekarang
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/cek-status"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                )}
              >
                <Search className="h-5 w-5 mr-2" />
                Cek Status Surat
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Surat Diterbitkan", value: "500+" },
              { label: "Jenis Layanan", value: "4" },
              { label: "Jam Proses", value: "< 24" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Layanan Section ─── */}
      <section className="py-20 bg-white" id="layanan">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
              Layanan Kami
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              4 Jenis Surat yang Tersedia
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Semua layanan dapat diajukan secara online tanpa perlu antri di kantor desa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAYANAN.map(({ key, icon: Icon, label, singkat, desc, color, bgLight, textColor }) => (
              <Card
                key={key}
                className="group border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-default overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${bgLight} ${textColor} mb-2`}>
                      {singkat}
                    </span>
                    <h3 className="font-semibold text-slate-900 leading-snug">{label}</h3>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
                  </div>
                  <Link
                    href="/ajukan-surat"
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${textColor} group-hover:gap-2 transition-all`}
                  >
                    Ajukan Sekarang <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Alur Pengajuan ─── */}
      <section className="py-20 bg-slate-50" id="alur">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
              Cara Pengajuan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">3 Langkah Mudah</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Proses pengajuan surat dirancang sesederhana mungkin agar semua warga bisa melakukannya.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-emerald-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ALUR.map(({ step, icon: Icon, label, desc, color }) => (
                <div key={step} className="flex flex-col items-center text-center space-y-4">
                  <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${color} shadow-lg text-white`}>
                    <Icon className="h-8 w-8" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-200 text-xs font-bold text-slate-700">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/ajukan-surat"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md inline-flex items-center justify-center"
              )}
            >
              <Upload className="h-5 w-5 mr-2" />
              Mulai Pengajuan
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Info Jam Layanan ─── */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Jam Pelayanan Kantor Desa</h3>
                <p className="text-blue-200 text-sm mt-1">
                  Senin – Jumat: 08.00–15.00 WIB &nbsp;|&nbsp; Sabtu: 08.00–12.00 WIB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <PhoneCall className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Butuh Bantuan?</h3>
                <p className="text-blue-200 text-sm mt-1">Hubungi: (0321) 123456</p>
              </div>
            </div>
            <Link
              href="/cek-status"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/30 bg-white/10 hover:bg-white/20 text-white"
              )}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Cek Status Surat Saya
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

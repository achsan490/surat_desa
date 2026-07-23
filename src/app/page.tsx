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
  Wifi,
  Timer,
  ChevronDown,
  Users,
  Landmark,
  Heart,
  Baby,
  Truck,
  Wallet,
  FileBadge,
  BadgeCheck,
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
    desc: "Bukti resmi tempat tinggal untuk SKCK, perbankan, dan melamar pekerjaan.",
    color: "from-emerald-500 to-emerald-700",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    key: "SURAT_KETERANGAN_USAHA",
    icon: Briefcase,
    label: "Surat Keterangan Usaha",
    singkat: "SKU",
    desc: "Legalitas usaha kecil dan mikro warga desa untuk permodalan dan perizinan.",
    color: "from-orange-500 to-orange-700",
    bgLight: "bg-orange-50",
    textColor: "text-orange-700",
  },
  {
    key: "SURAT_BELUM_MENIKAH",
    icon: Heart,
    label: "Surat Keterangan Belum Menikah",
    singkat: "SKBM",
    desc: "Keterangan status belum pernah menikah untuk melamar kerja atau beasiswa.",
    color: "from-pink-500 to-pink-700",
    bgLight: "bg-pink-50",
    textColor: "text-pink-700",
  },
  {
    key: "SURAT_KELAHIRAN",
    icon: Baby,
    label: "Surat Keterangan Kelahiran",
    singkat: "SKK",
    desc: "Keterangan kelahiran bayi untuk pembuatan Akta Kelahiran dan Kartu Keluarga.",
    color: "from-cyan-500 to-cyan-700",
    bgLight: "bg-cyan-50",
    textColor: "text-cyan-700",
  },
  {
    key: "SURAT_PINDAH",
    icon: Truck,
    label: "Surat Keterangan Pindah",
    singkat: "SKP",
    desc: "Pengurusan surat kepindahan domisili penduduk keluar wilayah desa.",
    color: "from-indigo-500 to-indigo-700",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    key: "SURAT_PENGHASILAN",
    icon: Wallet,
    label: "Surat Keterangan Penghasilan",
    singkat: "SKP",
    desc: "Rincian rata-rata penghasilan bulanan untuk kredit bank atau beasiswa anak.",
    color: "from-teal-500 to-teal-700",
    bgLight: "bg-teal-50",
    textColor: "text-teal-700",
  },
  {
    key: "SURAT_AHLI_WARIS",
    icon: Users,
    label: "Surat Keterangan Ahli Waris",
    singkat: "SKAW",
    desc: "Keterangan daftar ahli waris sah dari almarhum pewaris untuk hukum.",
    color: "from-amber-500 to-amber-700",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    key: "SURAT_PENGANTAR_NIKAH",
    icon: FileBadge,
    label: "Surat Pengantar Nikah",
    singkat: "SPN",
    desc: "Surat pengantar rekomendasi akad nikah untuk dikirimkan ke KUA.",
    color: "from-rose-500 to-rose-700",
    bgLight: "bg-rose-50",
    textColor: "text-rose-700",
  },
  {
    key: "SURAT_KEPEMILIKAN_TANAH",
    icon: Landmark,
    label: "Kepemilikan Tanah",
    singkat: "SKKT",
    desc: "Bukti penguasaan fisik tanah sertifikat/petok D milik warga desa.",
    color: "from-lime-600 to-lime-800",
    bgLight: "bg-lime-50",
    textColor: "text-lime-700",
  },
  {
    key: "SURAT_PENGANTAR_SKCK",
    icon: ShieldCheck,
    label: "Surat Pengantar SKCK",
    singkat: "SKCK",
    desc: "Surat pengantar berkelakuan baik untuk pembuatan SKCK di kepolisian.",
    color: "from-slate-600 to-slate-800",
    bgLight: "bg-slate-50",
    textColor: "text-slate-700",
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

const KEUNGGULAN = [
  {
    icon: Wifi,
    title: "100% Online",
    desc: "Ajukan surat dari rumah, warung, atau mana saja. Cukup HP dan koneksi internet.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Timer,
    title: "Proses Cepat",
    desc: "Verifikasi dilakukan pada hari kerja. Surat siap diunduh dalam waktu kurang dari 24 jam.",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: BadgeCheck,
    title: "Dokumen Resmi",
    desc: "Surat diterbitkan resmi oleh Kantor Desa Klitih, lengkap dengan tanda tangan Kepala Desa.",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Users,
    title: "Tanpa Antri",
    desc: "Tidak perlu datang ke kantor desa. Hemat waktu dan tenaga untuk keperluan lainnya.",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
];

const FAQ = [
  {
    q: "Apa saja berkas yang perlu disiapkan untuk pengajuan surat?",
    a: "Secara umum Anda hanya perlu menyiapkan scan/foto KTP dan Kartu Keluarga (KK). Untuk jenis surat tertentu mungkin ada persyaratan tambahan yang akan tertera di formulir pengajuan.",
  },
  {
    q: "Berapa lama proses verifikasi hingga surat jadi?",
    a: "Proses verifikasi dilakukan pada hari dan jam kerja (Senin–Jumat 08.00–15.00 WIB). Estimasi waktu proses adalah 1×24 jam kerja setelah pengajuan diterima.",
  },
  {
    q: "Bagaimana cara mengunduh surat setelah disetujui?",
    a: "Setelah surat disetujui, buka halaman Cek Status Surat dan masukkan NIK Anda. Akan muncul tombol 'Unduh Surat PDF' pada pengajuan yang sudah disetujui.",
  },
  {
    q: "Apakah surat yang diunduh sah secara hukum?",
    a: "Ya, surat yang diterbitkan melalui SIPAS adalah dokumen resmi dari Kantor Desa Klitih yang ditandatangani oleh Kepala Desa dan memiliki kekuatan hukum yang sama dengan surat konvensional.",
  },
  {
    q: "Bagaimana jika pengajuan saya ditolak?",
    a: "Jika ditolak, akan ada keterangan alasan penolakan dari perangkat desa. Anda dapat memperbaiki kekurangan tersebut dan mengajukan kembali melalui formulir yang sama.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        {/* Decorative blobs — smaller on mobile to prevent overflow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-[300px] w-[300px] md:h-[600px] md:w-[600px] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[250px] w-[250px] md:h-[500px] md:w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-14 sm:py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-5">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/20 px-4 py-1 text-xs font-medium">
              <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Building2 className="h-3 w-3 mr-1.5" />
                Desa Klitih — Kab. Jombang
              </a>
            </Badge>

            <p className="text-[11px] sm:text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Sistem Informasi Pelayanan Administrasi Surat (SIPAS)
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Layanan Surat Desa{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Online &amp; Resmi
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Ajukan surat keterangan desa dari mana saja, kapan saja. Proses cepat, transparan, dan dokumen resmi siap unduh setelah diverifikasi perangkat desa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/ajukan-surat"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all w-full sm:w-auto justify-center"
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
                  "border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm w-full sm:w-auto justify-center"
                )}
              >
                <Search className="h-5 w-5 mr-2" />
                Cek Status Surat
              </Link>
            </div>
          </div>

          {/* Stats Bar — with icons, tighter gap on mobile */}
          <div className="mt-10 md:mt-16 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
            {[
              { label: "Surat Diterbitkan", value: "500+", icon: FileText },
              { label: "Jenis Layanan", value: "12", icon: Landmark },
              { label: "Jam Proses", value: "< 24", icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Icon className="h-4 w-4 text-blue-400 mx-auto mb-1 opacity-80" />
                <p className="text-lg sm:text-2xl font-bold text-white">{value}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-10 md:mt-14">
            <a
              href="#layanan"
              className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors group"
              aria-label="Scroll ke layanan"
            >
              <span className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Lihat Layanan</span>
              <ChevronDown className="h-5 w-5 animate-bounce text-blue-400" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Layanan Section ─── */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-50" id="layanan">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 space-y-3">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-4 py-1">
              Layanan Kami
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
              12 Jenis Surat yang Tersedia
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
              Semua layanan dapat diajukan secara online tanpa perlu antri di kantor desa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {LAYANAN.map(({ key, icon: Icon, label, singkat, desc, color, bgLight, textColor }) => (
              <Card
                key={key}
                className="group relative border border-slate-200 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default overflow-hidden bg-white"
              >
                {/* Colored top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <CardContent className="p-5 md:p-6 space-y-4 pt-7">
                  <div className={`inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${bgLight} ${textColor} mb-2 border border-current/10`}>
                      {singkat}
                    </span>
                    <h3 className="font-bold text-slate-900 leading-snug text-sm md:text-base">{label}</h3>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
                  </div>
                  <Link
                    href="/ajukan-surat"
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${textColor} group-hover:gap-3 transition-all duration-200`}
                  >
                    Ajukan Sekarang <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kenapa SIPAS ─── */}
      <section className="py-16 md:py-20 bg-slate-50" id="keunggulan">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 space-y-3">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-4 py-1">
              Keunggulan Kami
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
              Kenapa Pilih SIPAS?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
              Dirancang khusus untuk memudahkan warga Desa Klitih dalam mengurus administrasi surat.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {KEUNGGULAN.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <div
                key={title}
                className={`group flex flex-col items-center text-center p-5 md:p-6 rounded-2xl ${bg} border ${border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-md mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-sm md:text-base">{title}</h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Alur Pengajuan ─── */}
      <section className="py-16 md:py-20 bg-white" id="alur">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 space-y-3">
            <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
              Cara Pengajuan
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">3 Langkah Mudah</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
              Proses pengajuan surat dirancang sesederhana mungkin agar semua warga bisa melakukannya.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-emerald-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {ALUR.map(({ step, icon: Icon, label, desc, color }) => (
                <div key={step} className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                  <div className={`relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl ${color} shadow-lg text-white`}>
                    <Icon className="h-7 w-7 md:h-8 md:w-8" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-200 text-xs font-bold text-slate-700">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10 md:mt-12">
            <Link
              href="/ajukan-surat"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md inline-flex items-center justify-center w-full sm:w-auto"
              )}
            >
              <Upload className="h-5 w-5 mr-2" />
              Mulai Pengajuan
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 space-y-3">
            <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50 px-4 py-1">
              Pertanyaan Umum
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900">
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
              Temukan jawaban atas pertanyaan umum seputar layanan SIPAS Desa Klitih.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <details
                key={i}
                className="group border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none font-semibold text-slate-800 text-sm md:text-base hover:text-blue-700 transition-colors">
                  <span>{q}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500">
              Masih ada pertanyaan?{" "}
              <a
                href="https://wa.me/6282335448476"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Hubungi kami via WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Info Jam Layanan ─── */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
              <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-white/20 flex-shrink-0">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold">Jam Pelayanan Kantor Desa</h3>
                <p className="text-blue-200 text-sm mt-0.5">
                  Senin – Jumat: 08.00–15.00 WIB &nbsp;|&nbsp; Sabtu: 08.00–12.00 WIB
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
              <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-white/20 flex-shrink-0">
                <PhoneCall className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold">Butuh Bantuan?</h3>
                <p className="text-blue-200 text-sm mt-0.5">Hubungi: +62 823-3544-8476</p>
              </div>
            </div>
            <Link
              href="/cek-status"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/30 bg-white/10 hover:bg-white/20 text-white w-full sm:w-auto"
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



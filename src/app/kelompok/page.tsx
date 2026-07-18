import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Phone, Users, Compass, BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kelompok 27 KKN 2026",
  description: "Daftar Anggota Kelompok 27 KKN 2026 pengembang SIPAS Desa Klitih.",
};

const DPL = {
  nama: "Fitri Umardiyah, M. Pd.",
  peran: "Dosen Pembimbing Lapangan (DPL)",
  wa: "085730403338",
  waLink: "https://wa.me/6285730403338",
  foto: "/dpl.jpg",
};

const ANGGOTA = [
  {
    nama: "Ananda Nuria Haliza Putri",
    nim: "2301012961",
    jurusan: "Pendidikan Agama Islam",
    foto: "/nuria.jpg",
  },
  {
    nama: "ARIEJ MASHITOH AL BANY",
    nim: "2301012981",
    jurusan: "Pendidikan Agama Islam",
    foto: "/sita.jpg",
  },
  {
    nama: "SERLINA MAGFIROH",
    nim: "2301013028",
    jurusan: "Pendidikan Agama Islam",
    foto: "/lina.jpg",
  },
  {
    nama: "A'A KAFABIHI DZULQORNAIN",
    nim: "2301013076",
    jurusan: "Pendidikan Agama Islam",
    foto: "/kafa.jpg",
  },
  {
    nama: "DIMAS EKA PRASETYO",
    nim: "2301013108",
    jurusan: "Pendidikan Agama Islam",
    foto: "/dimas%20eka.jpg",
  },
  {
    nama: "NADIA RAMA DIWANTI",
    nim: "2301013118",
    jurusan: "Pendidikan Agama Islam",
    foto: "/nadia.jpg",
  },
  {
    nama: "MOH. THOILUN NI'AM",
    nim: "2301013182",
    jurusan: "Pendidikan Agama Islam",
    foto: "/thoil.jpg",
  },
  {
    nama: "MURNI",
    nim: "2301021002",
    jurusan: "Pendidikan Bahasa Arab",
    foto: "/murni.jpg",
  },
  {
    nama: "TYAS ARTIKA ANGGRAINI",
    nim: "2301290363",
    jurusan: "Ekonomi Syariah",
    foto: "/tyas.jpg",
  },
  {
    nama: "MOHAMAD YUSRIL BAIHAQI",
    nim: "2301290376",
    jurusan: "Ekonomi Syariah",
    foto: "/baihaqi.jpg",
  },
  // ─── TENGAH ───
  {
    nama: "M. achsanul Khuluq Izzulchaq",
    nim: "2202041078",
    jurusan: "Informatika",
    foto: "/achsan.jpg",
  },
  // ─────────────
  {
    nama: "SALMAN ALFARIDHO FARDIANSYAH",
    nim: "2302041163",
    jurusan: "Informatika",
    foto: "/salman.jpg",
  },
  {
    nama: "YOGI BACHTIAR",
    nim: "2302050817",
    jurusan: "Sistem Informasi",
    foto: "/yogi.jpg",
  },
  {
    nama: "ALMA NUR KURNIAWAN",
    nim: "2302050834",
    jurusan: "Sistem Informasi",
    foto: "/alma.jpg",
  },
  {
    nama: "HAKIKI RAMADHAN",
    nim: "2303070212",
    jurusan: "Agroekoteknologi",
    foto: "/hakiki.jpg",
  },
  {
    nama: "LAILATUL MUFIDAH",
    nim: "2304100179",
    jurusan: "Pendidikan Biologi",
    foto: "/laila.jpg",
  },
  {
    nama: "KIA SALUNG SHAFA",
    nim: "2304130230",
    jurusan: "Pendidikan Bahasa Inggris",
    foto: "/kisa.jpg",
  },
  {
    nama: "AKHLIS BUDIANTO",
    nim: "2305140670",
    jurusan: "Manajemen",
    foto: "/aklis.jpg",
  },
  {
    nama: "NADYA HUSNUL KHOTIMAH",
    nim: "2305140682",
    jurusan: "Manajemen",
    foto: "/nadya.jpg",
  },
  {
    nama: "DIVA NUGRAHANI",
    nim: "2305140704",
    jurusan: "Manajemen",
    foto: "/diva.jpg",
  },
  {
    nama: "ARINDA ISLAMIYAH",
    nim: "2305140736",
    jurusan: "Manajemen",
    foto: "/arinda.jpg",
  },
  {
    nama: "MUKHAMMAD DANU ARTA",
    nim: "2305140737",
    jurusan: "Manajemen",
    foto: "/danu.jpg",
  },
];

export default function KelompokPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ─── Hero / Header ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>

          <div className="max-w-3xl space-y-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1 text-xs">
              <Compass className="h-3.5 w-3.5 mr-1.5" />
              KKN Tematik 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Kelompok 27 KKN 2026
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              Kami adalah tim mahasiswa pengembang sistem digitalisasi pelayanan desa di Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang.
            </p>
          </div>
        </div>
      </section>

      {/* ─── DPL & Info Kelompok ─── */}
      <section className="py-12 container mx-auto px-4 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-slate-200/80 shadow-xl bg-white overflow-hidden">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              {/* DPL Photo */}
              <div className="flex-shrink-0 w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg bg-slate-100">
                <img
                  src={DPL.foto}
                  alt={DPL.nama}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DPL details */}
              <div className="flex-grow text-center md:text-left space-y-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    Dosen Pembimbing Lapangan
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {DPL.nama}
                  </h2>
                  <p className="text-slate-500 text-sm mt-0.5">{DPL.peran}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-1">
                  <a
                    href={DPL.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors"
                    )}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Hubungi DPL (WhatsApp)
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── Anggota Grid ─── */}
      <section className="py-12 pb-24 container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              <Users className="h-3.5 w-3.5" />
              Daftar 22 Mahasiswa KKN
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Anggota Kelompok 27</h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              Kolaborasi lintas program studi untuk membangun sistem administrasi desa yang lebih baik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ANGGOTA.map((member, index) => (
              <Card
                key={member.nim}
                className="group border border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden flex flex-col h-full"
              >
                <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                  {/* Member Photo */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden mb-5 border-4 border-slate-100 shadow-md group-hover:border-blue-100 transition-colors bg-slate-100 flex items-center justify-center">
                    <img
                      src={member.foto}
                      alt={member.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-1 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-bold tracking-wider mb-1">
                        ANGGOTA {index + 1}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem] flex items-center justify-center">
                        {member.nama}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">NIM. {member.nim}</p>
                    </div>

                    <div className="pt-4 mt-auto">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        <BookOpen className="h-3 w-3 text-slate-500" />
                        {member.jurusan}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

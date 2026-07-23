"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Phone, MapPin, Clock, Mail, MessageCircle, FileText, Search, Users } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">SIPAS</p>
                <p className="text-xs text-slate-400">Desa Klitih</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistem Informasi Pelayanan Administrasi Surat (SIPAS) Desa Klitih. Layanan cepat, transparan, dan terpercaya untuk warga.
            </p>
            {/* WA Quick Contact */}
            <a
              href="https://wa.me/6282335448476"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Layanan */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Layanan Surat (12 Jenis)</h4>
            <ul className="space-y-1.5 text-xs">
              {[
                "SKTM & Surat Kematian",
                "Domisili & Surat Usaha (SKU)",
                "Belum Menikah & Kelahiran",
                "Surat Pindah & Penghasilan",
                "Ahli Waris & Pengantar Nikah",
                "Kepemilikan Tanah & SKCK",
              ].map((s) => (
                <li key={s} className="text-slate-400 hover:text-slate-200 transition-colors cursor-default">
                  › {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Navigasi Cepat</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/ajukan-surat" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  Ajukan Surat
                </Link>
              </li>
              <li>
                <Link href="/cek-status" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <Search className="h-3.5 w-3.5 flex-shrink-0" />
                  Cek Status Surat
                </Link>
              </li>
              <li>
                <Link href="/kelompok" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <Users className="h-3.5 w-3.5 flex-shrink-0" />
                  Tim KKN 27
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  Portal Perangkat Desa
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Kontak &amp; Jam Layanan</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                Jl. Raya Klitih No. 1, Kec. Plandaan, Kab. Jombang
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                +62 823-3544-8476
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4 flex-shrink-0 text-blue-400" />
                admin@desaklitih.go.id
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" />
                <span>
                  Senin – Jumat: 08.00 – 15.00 WIB<br />
                  Sabtu: 08.00 – 12.00 WIB
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Desa Klitih, Kab. Jombang. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

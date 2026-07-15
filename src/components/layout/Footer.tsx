import Link from "next/link";
import { Building2, Phone, MapPin, Clock, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
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
          </div>

          {/* Layanan */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">Layanan Surat</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Surat Keterangan Tidak Mampu (SKTM)",
                "Surat Keterangan Kematian",
                "Surat Keterangan Domisili",
                "Surat Keterangan Usaha (SKU)",
              ].map((s) => (
                <li key={s} className="text-slate-400 hover:text-slate-200 transition-colors cursor-default">
                  › {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">Kontak & Jam Layanan</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                Jl. Raya Klitih No. 1, Kec. Plandaan, Kab. Jombang
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                (0321) 123456
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

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Desa Klitih. Hak cipta dilindungi.</p>
          <Link href="/admin/login" className="hover:text-slate-300 transition-colors">
            Portal Perangkat Desa
          </Link>
        </div>
      </div>
    </footer>
  );
}

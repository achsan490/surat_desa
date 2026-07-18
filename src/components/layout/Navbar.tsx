"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Search, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/ajukan-surat", label: "Ajukan Surat", icon: FileText },
  { href: "/cek-status", label: "Cek Status", icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Marquee Banner */}
      <div className="w-full bg-slate-900 text-white py-1.5 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs">
          <span className="bg-blue-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm flex-shrink-0 animate-pulse cursor-default select-none">
            Info
          </span>
          <div className="relative w-full overflow-hidden select-none cursor-default">
            <div className="animate-marquee whitespace-nowrap inline-block text-slate-300">
              <span className="mx-6">📢 Selamat Datang di SIPAS Desa Klitih — Pengajuan surat keterangan online aktif 24 jam.</span>
              <span className="mx-4 text-blue-400">•</span>
              <span className="mx-6">💻 Proses verifikasi dilakukan pada hari & jam kerja. Simpan NIK Anda untuk cek status surat.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* Logo — kiri */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            title="SIPAS — Sistem Informasi Pelayanan Administrasi Surat"
          >
            <img
              src="/logo-jombang.png"
              alt="Logo Kabupaten Jombang"
              className="h-10 w-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
            />
            <div className="leading-tight">
              <span className="block text-sm font-extrabold text-slate-900 tracking-tight">SIPAS</span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide">Desa Klitih · Jombang</span>
            </div>
          </Link>

          {/* Desktop Navigation — tengah */}
          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA Button — kanan */}
          <div className="hidden md:flex items-center">
            <Link
              href="/ajukan-surat"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md shadow-blue-200 hover:shadow-blue-300 transition-all duration-200"
            >
              Ajukan Surat
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 space-y-1 shadow-lg">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                pathname === href
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/ajukan-surat"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
            >
              Ajukan Surat Sekarang
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, FileText, Search, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda", icon: Building2 },
  { href: "/ajukan-surat", label: "Ajukan Surat", icon: FileText },
  { href: "/cek-status", label: "Cek Status", icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm">
      {/* Announcement Marquee Banner */}
      <div className="w-full bg-slate-900 text-white py-2 px-4 overflow-hidden relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs">
          <span className="bg-blue-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0 animate-pulse cursor-default select-none">
            Pengumuman
          </span>
          <div className="relative w-full overflow-hidden select-none cursor-default">
            <div className="animate-marquee whitespace-nowrap inline-block text-slate-200 hover:text-white transition-colors">
              <span className="mx-6">
                📢 Selamat Datang di SIPAS (Sistem Informasi Pelayanan Administrasi Surat) Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang.
              </span>
              <span className="mx-6 text-blue-400 font-bold">
                •
              </span>
              <span className="mx-6">
                💻 Pengajuan surat keterangan online aktif 24 jam. Proses verifikasi berkas oleh perangkat desa dilakukan pada hari dan jam kerja.
              </span>
              <span className="mx-6 text-blue-400 font-bold">
                •
              </span>
              <span className="mx-6">
                🔑 Mohon simpan Nomor Induk Kependudukan (NIK) Anda setelah mengajukan surat untuk melakukan pemantauan status secara berkala di menu Cek Status.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" title="Sistem Informasi Pelayanan Administrasi Surat">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md group-hover:shadow-blue-200 transition-shadow">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-slate-900 tracking-tight">SIPAS</span>
            <span className="block text-[10px] text-slate-500 font-medium">Desa Klitih</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                pathname === href
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Admin Button */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "border-slate-300 text-slate-700 hover:bg-slate-50"
            )}
          >
            <LayoutDashboard className="h-4 w-4 mr-1.5" />
            Portal Admin
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                pathname === href
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            Portal Admin
          </Link>
        </div>
      )}
    </header>
  );
}

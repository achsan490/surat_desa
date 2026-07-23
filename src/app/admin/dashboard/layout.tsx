import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Building2, LayoutDashboard, LogOut, FileText, Settings, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminNotificationBell } from "@/components/admin/AdminNotificationBell";

export const metadata: Metadata = {
  title: { default: "Dashboard Admin", template: "%s | Admin SIPAS" },
};

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard?status=PENDING", label: "Antrian Pending", icon: FileText },
  { href: "/admin/dashboard/pengaturan", label: "Pengaturan TTD & Stempel", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar Desktop — Fixed height with scrollable nav area */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-100 fixed inset-y-0 left-0 z-30 border-r border-slate-800 h-screen overflow-hidden">
        {/* Logo Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">SIPAS Admin</p>
            <p className="text-[10px] text-slate-400">Desa Klitih · Jombang</p>
          </div>
        </div>

        {/* Nav Links — Scrollable area if height is constrained */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Icon className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-slate-800/80 px-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Lihat Website Utama</span>
            </Link>
          </div>
        </nav>

        {/* User Info + Logout — Flex-shrink-0 anchored at bottom */}
        <div className="px-3 py-3 space-y-2 border-t border-slate-800 bg-slate-900 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 gap-2 text-xs h-8"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 text-white flex items-center justify-between px-4 h-14 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-400" />
          <span className="font-bold text-sm">SIPAS Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <AdminNotificationBell />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Desktop Top Header Bar — Clean Light Header */}
        <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-white text-slate-900 border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
          <div>
            <h2 className="font-bold text-sm text-slate-900">Portal Administrasi Desa Klitih</h2>
            <p className="text-[11px] text-slate-500">Kecamatan Plandaan · Kabupaten Jombang</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Lonceng Notifikasi */}
            <AdminNotificationBell />

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs">
                {session.user.name?.[0] ?? "A"}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{session.user.name}</p>
                <p className="text-[10px] text-slate-500">Perangkat Desa</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="pt-14 lg:pt-0 flex-1 bg-slate-50/50">{children}</div>
      </div>
    </div>
  );
}

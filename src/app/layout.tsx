import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SIPAS — Sistem Pelayanan Administrasi Surat Desa Klitih",
    template: "%s | SIPAS Desa Klitih",
  },
  description:
    "Layanan pengajuan surat keterangan desa secara online. Ajukan SKTM, Surat Domisili, Surat Kematian, dan SKU dengan mudah, cepat, dan transparan.",
  keywords: ["surat desa", "SIPAS", "administrasi desa", "Klitih", "surat keterangan"],
  authors: [{ name: "Desa Klitih" }],
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/logo-jombang.png",
    shortcut: "/logo-jombang.png",
    apple: "/logo-jombang.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

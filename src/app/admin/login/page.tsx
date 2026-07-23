"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User, Loader2, ShieldCheck, Eye, EyeOff, Building2, ArrowLeft } from "lucide-react";
import { loginAdminAction } from "@/lib/actions/auth.actions";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password tidak boleh kosong.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      try {
        const result = await loginAdminAction(formData);
        if (result && !result.success) {
          setError(result.error || "Login gagal.");
          toast.error("Login gagal. Periksa username & password.");
        } else {
          toast.success("Login berhasil! Selamat datang di Portal Admin SIPAS.");
          router.push("/admin/dashboard");
          router.refresh();
        }
      } catch (err) {
        console.error("Login redirect / error:", err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 mx-auto p-3.5 border border-white/10 backdrop-blur-md">
            <Image
              src="/logo-jombang.png"
              alt="Logo Kabupaten Jombang"
              width={64}
              height={64}
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Portal Admin SIPAS</h1>
            <p className="text-slate-400 text-xs font-medium mt-1">
              Sistem Informasi Pelayanan Administrasi Surat Desa Klitih
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl rounded-3xl p-2">
          <CardHeader className="text-center pb-4 pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mx-auto mb-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>Akses Khusus Perangkat Desa</span>
            </div>
            <CardTitle className="text-white text-lg font-bold">Masuk ke Akun Admin</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Masukkan kredensial yang terdaftar untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-300 text-xs font-semibold">
                  Username Admin
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    className="pl-10 h-11 bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pl-10 pr-10 h-11 bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 text-xs">
                  <Lock className="h-4 w-4 flex-shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-600/30 h-11 rounded-xl transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Memverifikasi Akun...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Masuk ke Dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

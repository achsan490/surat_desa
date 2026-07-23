"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, FileText, ChevronRight, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { getPendingNotifications, type NotificationItem } from "@/lib/actions/surat.actions";
import { JENIS_SURAT_CONFIG } from "@/types";

function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Abaikan jika audio tidak diizinkan browser
  }
}

export function AdminNotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const prevIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);
  const isMountedRef = useRef(true);

  const fetchNotifications = async (silent = false) => {
    if (!isMountedRef.current) return;
    if (!silent) setIsRefreshing(true);
    try {
      const res = await getPendingNotifications();
      if (!isMountedRef.current) return;
      if (res.success && res.data) {
        const { pendingCount: count, recentPending } = res.data;
        setPendingCount(count);
        setItems(recentPending);

        const newIds = new Set(recentPending.map((item) => item.id));

        // Jika bukan pemuatan pertama, cek apakah ada ID baru yang masuk
        if (!isFirstLoadRef.current) {
          const newlyAdded = recentPending.filter((item) => !prevIdsRef.current.has(item.id));

          if (newlyAdded.length > 0) {
            playChimeSound();
            newlyAdded.forEach((surat) => {
              const jenisLabel =
                JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG]?.label ??
                surat.jenis_surat;

              toast.info(`🔔 Pengajuan Surat Baru!`, {
                description: `${surat.nama_lengkap} (${jenisLabel})`,
                duration: 7000,
                action: {
                  label: "Lihat Surat",
                  onClick: () => router.push(`/admin/dashboard/surat/${surat.id}`),
                },
              });
            });
          }
        } else {
          isFirstLoadRef.current = false;
        }

        prevIdsRef.current = newIds;
      }
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
    } finally {
      if (!silent && isMountedRef.current) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchNotifications();

    // Polling setiap 12 detik
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 12000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* Tombol Lonceng */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        title="Notifikasi Pengajuan Surat"
        aria-label="Notifikasi"
      >
        <Bell className="h-5 w-5" />

        {/* Indikator Badge Merah jika ada pending */}
        {pendingCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-red-500 text-[11px] font-extrabold text-white shadow-md animate-pulse">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          </>
        )}
      </button>

      {/* Popover Dropdown Notifikasi */}
      {isOpen && (
        <>
          {/* Backdrop pembatal popover */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-slate-900">
            {/* Header Popover */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-400" />
                <span className="font-bold text-sm">Notifikasi Pengajuan</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchNotifications(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                  title="Perbarui data"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
                <span className="text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-300 px-2 py-0.5 rounded-full">
                  {pendingCount} Pending
                </span>
              </div>
            </div>

            {/* List Surat Pending Terbaru */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {items.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                  <p className="font-semibold text-xs text-slate-700">Semua Terverifikasi!</p>
                  <p className="text-[11px] text-slate-400">
                    Tidak ada permohonan surat yang sedang menunggu verifikasi saat ini.
                  </p>
                </div>
              ) : (
                items.map((item) => {
                  const jenisConfig =
                    JENIS_SURAT_CONFIG[item.jenis_surat as keyof typeof JENIS_SURAT_CONFIG];
                  return (
                    <Link
                      key={item.id}
                      href={`/admin/dashboard/surat/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start gap-3 p-3.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 flex-shrink-0 mt-0.5 border border-amber-200/60">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                            {item.nama_lengkap}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(item.created_at), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                          {jenisConfig?.label ?? item.jenis_surat}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">
                          NIK: {item.nik}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 self-center" />
                    </Link>
                  );
                })
              )}
            </div>

            {/* Footer Popover */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                href="/admin/dashboard?status=PENDING"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 py-1"
              >
                <Clock className="h-3.5 w-3.5" />
                Lihat Semua Antrean Pending ({pendingCount})
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

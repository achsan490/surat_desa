"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, CheckCircle2, AlertCircle, X, ExternalLink } from "lucide-react";

interface SuratPreviewModalProps {
  suratId: string;
  namaPemohon: string;
  jenisSuratLabel: string;
  triggerClassName?: string;
  variant?: "button" | "icon";
}

export function SuratPreviewModal({
  suratId,
  namaPemohon,
  jenisSuratLabel,
  triggerClassName = "",
  variant = "button",
}: SuratPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const pdfUrl = `/api/generate-pdf?id=${suratId}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Pratinjau / Cek Surat Sebelum Unduh"
          className={`p-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors ${triggerClassName}`}
        >
          <Eye className="h-4 w-4" />
        </button>
      ) : (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 h-10 px-4 rounded-xl shadow-sm transition-all ${triggerClassName}`}
        >
          <Eye className="h-4 w-4" />
          Cek &amp; Pratinjau Surat
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200">
          {/* Header Modal */}
          <DialogHeader className="p-5 border-b border-slate-100 bg-slate-50/80 flex flex-row items-center justify-between">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  Pratinjau Sebelum Unduh
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {suratId.slice(0, 8)}...</span>
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {jenisSuratLabel} — {namaPemohon}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Periksa kesesuaian Kop Surat, data pemohon, logo, serta posisi TTD &amp; Stempel sebelum mengunduh.
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Body Viewer (iFrame PDF Preview) */}
          <div className="flex-1 bg-slate-100 p-2 md:p-4 min-h-[450px] relative overflow-hidden flex flex-col items-center justify-center">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
              className="w-full h-full min-h-[440px] rounded-xl border border-slate-200 bg-white shadow-inner"
              title={`Pratinjau Surat - ${namaPemohon}`}
            />
          </div>

          {/* Footer & Aksi Konfirmasi */}
          <DialogFooter className="p-4 bg-white border-t border-slate-100 flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 w-full sm:w-auto">
              <input
                type="checkbox"
                id={`check-confirm-${suratId}`}
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor={`check-confirm-${suratId}`} className="cursor-pointer font-medium select-none">
                Saya sudah mengecek dan mengonfirmasi isi surat sudah benar
              </label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold rounded-xl h-10"
              >
                Batal
              </Button>

              <Button
                type="button"
                onClick={handleDownload}
                disabled={!isConfirmed}
                className={`text-xs font-bold gap-2 rounded-xl h-10 px-5 transition-all shadow-sm ${
                  isConfirmed
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <FileDown className="h-4 w-4" />
                Unduh Berkas Surat
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [tooltip, setTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {tooltip && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl px-4 py-3 text-sm font-medium text-slate-700 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
          💬 Hubungi Kantor Desa
          <p className="text-xs text-slate-400 mt-0.5">Senin – Sabtu, 08.00–15.00 WIB</p>
        </div>
      )}

      {/* Button */}
      <a
        href="https://wa.me/6285730403338"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Kantor Desa via WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-110 transition-all duration-200"
      >
        {/* Pulse ring */}
        <span className="absolute h-14 w-14 rounded-full bg-emerald-500/40 animate-ping opacity-75" />
        <MessageCircle className="h-7 w-7 text-white relative z-10 drop-shadow" />
      </a>
    </div>
  );
}

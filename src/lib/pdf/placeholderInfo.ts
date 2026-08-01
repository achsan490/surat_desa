/**
 * placeholderInfo.ts
 *
 * Data statis daftar placeholder yang bisa digunakan di template Word.
 * Dipisah dari generateFromTemplate.ts agar bisa diimport di client component.
 */

import { JENIS_SURAT_CONFIG } from "@/types";

export const PLACEHOLDER_INFO = {
  universal: [
    { key: "{nama_lengkap}", desc: "Nama lengkap pemohon" },
    { key: "{nik}", desc: "NIK 16 digit pemohon" },
    { key: "{no_whatsapp}", desc: "Nomor WhatsApp pemohon" },
    { key: "{tanggal}", desc: "Tanggal surat (otomatis)" },
    { key: "{nomor_surat}", desc: "Nomor surat resmi" },
    { key: "{jenis_surat_label}", desc: "Nama jenis surat lengkap" },
  ],
  perJenis: Object.entries(JENIS_SURAT_CONFIG).reduce(
    (acc, [key, val]) => {
      if (val.fields.length > 0) {
        acc[key] = val.fields.map((f) => ({
          key: `{${f.name}}`,
          desc: f.label,
        }));
      }
      return acc;
    },
    {} as Record<string, { key: string; desc: string }[]>
  ),
};

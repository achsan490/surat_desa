import { z } from "zod";

export const suratBaseSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  nama_lengkap: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  no_whatsapp: z
    .string()
    .min(10, "Nomor WhatsApp tidak valid")
    .max(15, "Nomor WhatsApp tidak valid")
    .regex(/^(\+62|62|0)[0-9]{8,12}$/, "Format nomor WhatsApp tidak valid (contoh: 08123456789)"),
  jenis_surat: z.enum(
    [
      "SKTM",
      "SURAT_KEMATIAN",
      "SURAT_DOMISILI",
      "SURAT_KETERANGAN_USAHA",
      "SURAT_BELUM_MENIKAH",
      "SURAT_KELAHIRAN",
      "SURAT_PINDAH",
      "SURAT_PENGHASILAN",
      "SURAT_AHLI_WARIS",
      "SURAT_PENGANTAR_NIKAH",
      "SURAT_KEPEMILIKAN_TANAH",
      "SURAT_PENGANTAR_SKCK"
    ],
    { message: "Pilih jenis surat" }
  ),
  data_kustom: z.record(z.string(), z.string()),
});

export type SuratFormData = z.infer<typeof suratBaseSchema>;

export const cekStatusSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
});

export type CekStatusData = z.infer<typeof cekStatusSchema>;

export const rejectSchema = z.object({
  alasan_penolakan: z
    .string()
    .min(10, "Alasan penolakan minimal 10 karakter")
    .max(500, "Alasan penolakan maksimal 500 karakter"),
});

export type RejectData = z.infer<typeof rejectSchema>;

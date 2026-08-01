/**
 * generateFromTemplate.ts
 *
 * Mengisi placeholder di file DOCX template dengan data surat warga.
 * Jika template tidak ditemukan → return null (fallback ke PDFKit).
 *
 * Placeholder yang didukung di dalam file .docx:
 *   {nama_lengkap}   {nik}          {no_whatsapp}
 *   {tanggal}        {nomor_surat}  {jenis_surat_label}
 *   + semua field kustom per jenis surat sesuai data_kustom
 *   Contoh: {keperluan}, {nama_almarhum}, {tanggal_meninggal}, dll.
 */

import path from "path";
import fs from "fs";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { SuratWithId } from "@/types";
import { JENIS_SURAT_CONFIG } from "@/types";
import { PLACEHOLDER_INFO } from "./placeholderInfo";

const TEMPLATES_DIR = path.join(process.cwd(), "public", "templates");

/** Cek ekstensi template yang tersedia untuk jenis surat tertentu */
function resolveTemplatePath(jenisSurat: string): { filePath: string; ext: "docx" | "pdf" } | null {
  for (const ext of ["docx", "pdf"] as const) {
    const filePath = path.join(TEMPLATES_DIR, `${jenisSurat}.${ext}`);
    if (fs.existsSync(filePath)) {
      return { filePath, ext };
    }
  }
  return null;
}

/** Bangun map placeholder dari data surat */
function buildPlaceholders(surat: SuratWithId): Record<string, string> {
  const tanggal = format(new Date(surat.created_at), "d MMMM yyyy", { locale: idLocale });
  const tahun = new Date(surat.created_at).getFullYear();

  const kodeJenis: Record<string, string> = {
    SKTM: "SKTM",
    SURAT_KEMATIAN: "SKM",
    SURAT_DOMISILI: "SKDOM",
    SURAT_KETERANGAN_USAHA: "SKU",
    SURAT_BELUM_MENIKAH: "SKBM",
    SURAT_KELAHIRAN: "SKKL",
    SURAT_PINDAH: "SKP",
    SURAT_PENGHASILAN: "SKPH",
    SURAT_AHLI_WARIS: "SKAW",
    SURAT_PENGANTAR_NIKAH: "SKPN",
    SURAT_KEPEMILIKAN_TANAH: "SKKT",
    SURAT_PENGANTAR_SKCK: "SKCK",
  };

  const kode = kodeJenis[surat.jenis_surat] ?? "SK";
  const nomorSurat = `001/SK/${kode}/DESA-PK/${tahun}`;
  const jenisLabel =
    JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG]?.label ??
    surat.jenis_surat;

  return {
    nama_lengkap: surat.nama_lengkap,
    nik: surat.nik,
    no_whatsapp: surat.no_whatsapp,
    tanggal,
    nomor_surat: nomorSurat,
    jenis_surat_label: jenisLabel,
    // Spread semua field kustom (keperluan, nama_almarhum, dll.)
    ...surat.data_kustom,
  };
}

/**
 * Coba generate dokumen dari template yang diupload admin.
 *
 * @returns Buffer dokumen (DOCX atau PDF), atau null jika tidak ada template.
 */
export async function generateFromTemplate(
  surat: SuratWithId
): Promise<{ buffer: Buffer; ext: "docx" | "pdf" } | null> {
  const template = resolveTemplatePath(surat.jenis_surat);
  if (!template) return null;

  const { filePath, ext } = template;

  // ── PDF template: kembalikan langsung tanpa modifikasi ──────────────────
  if (ext === "pdf") {
    const buffer = fs.readFileSync(filePath);
    return { buffer, ext: "pdf" };
  }

  // ── DOCX template: isi placeholder dengan docxtemplater ─────────────────
  try {
    // Import secara dinamis agar tidak error saat module belum terinstall
    const PizZip = (await import("pizzip")).default;
    const Docxtemplater = (await import("docxtemplater")).default;

    const fileContent = fs.readFileSync(filePath, "binary");
    const zip = new PizZip(fileContent);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const placeholders = buildPlaceholders(surat);
    doc.render(placeholders);

    const outputBuffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    }) as Buffer;

    return { buffer: outputBuffer, ext: "docx" };
  } catch (err) {
    console.error("[generateFromTemplate] Gagal mengisi template DOCX:", err);
    // Jika template error (placeholder salah, dll.) → fallback ke PDFKit
    return null;
  }
}

// Re-export untuk backward compatibility
export { PLACEHOLDER_INFO } from "./placeholderInfo";

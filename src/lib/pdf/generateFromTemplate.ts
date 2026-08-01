/**
 * generateFromTemplate.ts
 *
 * Mengisi data surat warga ke dalam file DOCX template.
 *
 * Mendukung DUA mode template:
 * 1. Template dengan placeholder {variable} → isi otomatis via docxtemplater
 * 2. Template tanpa placeholder (titik-titik / kosong) → injeksi data via XML patching
 *
 * Jika template tidak ditemukan → return null (fallback ke PDFKit).
 */

import path from "path";
import fs from "fs";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { SuratWithId } from "@/types";
import { JENIS_SURAT_CONFIG } from "@/types";

const TEMPLATES_DIR = path.join(process.cwd(), "public", "templates");

/** Cek ekstensi template yang tersedia untuk jenis surat tertentu */
function resolveTemplatePath(
  jenisSurat: string
): { filePath: string; ext: "docx" | "pdf" } | null {
  for (const ext of ["docx", "pdf"] as const) {
    const filePath = path.join(TEMPLATES_DIR, `${jenisSurat}.${ext}`);
    if (fs.existsSync(filePath)) {
      return { filePath, ext };
    }
  }
  return null;
}

/** Bangun map placeholder dari data surat — mencakup SEMUA field yang diinput user */
function buildPlaceholders(surat: SuratWithId): Record<string, string> {
  const tanggal = format(new Date(surat.created_at), "d MMMM yyyy", {
    locale: idLocale,
  });
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
    JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG]
      ?.label ?? surat.jenis_surat;

  // Sanitasi nilai: ubah null/undefined menjadi string kosong
  const safeData: Record<string, string> = {};
  for (const [k, v] of Object.entries(surat.data_kustom ?? {})) {
    safeData[k] = v ?? "";
  }

  return {
    // ── Data identitas dari form warga ────────────────────────────────────
    nama_lengkap: surat.nama_lengkap ?? "",
    nik: surat.nik ?? "",
    no_whatsapp: surat.no_whatsapp ?? "",
    no_hp: surat.no_whatsapp ?? "",        // alias
    telepon: surat.no_whatsapp ?? "",       // alias
    // ── Data sistem ───────────────────────────────────────────────────────
    tanggal,
    tanggal_surat: tanggal,
    nomor_surat: nomorSurat,
    jenis_surat: surat.jenis_surat,
    jenis_surat_label: jenisLabel,
    tahun: String(tahun),
    // ── Semua field kustom dari form (keperluan, nama_almarhum, dll.) ─────
    ...safeData,
  };
}

/**
 * Deteksi apakah DOCX template memiliki placeholder {variable}.
 * Cek di XML konten word/document.xml.
 */
function hasPlaceholders(xml: string): boolean {
  // Cari pola {kata} yang bukan tag XML
  return /\{[a-zA-Z_][a-zA-Z0-9_]*\}/.test(xml);
}

/**
 * Patch XML: Ganti pola titik-titik (.....) setelah label umum
 * dengan data warga secara langsung di dalam XML string.
 *
 * Pendekatan ini bekerja untuk template desa yang memakai format:
 *   Nama : ................................................................
 *   NIK  : ................................................................
 */
function patchXmlWithData(xml: string, data: Record<string, string>): string {
  // Helper: escape karakter XML
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Pola: teks titik-titik panjang (5+) dalam XML bisa terpecah antar tag
  // Kita flatten dulu, patch, lalu return
  // Strategi: ganti semua run yang mengandung ..... dengan data

  // Ganti pola titik-titik yang ada setelah label dalam bentuk plain text di XML
  const dotPattern = /(\.|&#46;|&#x2E;){5,}/g;

  // Kita akan inject berdasarkan konteks: cari semua <w:t>.....</w:t>
  // dan ganti dengan nilai yang relevan berdasarkan label terdekat sebelumnya

  let result = xml;

  // ── Mapping label → nilai yang perlu diinjeksikan ───────────────────────
  const labelValueMap: Array<[RegExp, string]> = [
    // Nama
    [/(<w:t[^>]*>)([^<]*Nama\s*:?\s*)(<\/w:t>)[\s\S]*?<w:t[^>]*>(\.*)\s*<\/w:t>/i,
      `$1$2$3`],
  ];

  // Pendekatan lebih sederhana dan reliable:
  // Pisah XML menjadi chunks berdasarkan paragraph (<w:p>)
  // dan match label + titik-titik dalam satu paragraph

  const paragraphs = result.split(/(?=<w:p[ >])/);
  const processed = paragraphs.map((para) => {
    // Extract teks plain dari paragraph
    const textMatches = para.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) ?? [];
    const plainText = textMatches
      .map((m) => m.replace(/<[^>]+>/g, ""))
      .join("");

    if (!dotPattern.test(plainText)) return para;

    // Tentukan nilai yang akan diisikan berdasarkan label
    let valueToInsert = "";

    if (/nama\s*[:：]/i.test(plainText)) {
      valueToInsert = esc(data.nama_lengkap);
    } else if (/\bnik\b/i.test(plainText)) {
      valueToInsert = esc(data.nik);
    } else if (/no\.?\s*kk/i.test(plainText)) {
      valueToInsert = "-";
    } else if (/no\.?\s*(hp|hp|telepon|wa|whatsapp)/i.test(plainText)) {
      valueToInsert = esc(data.no_whatsapp);
    } else if (/keperluan/i.test(plainText)) {
      valueToInsert = esc(data.keperluan ?? data.tujuan_surat ?? "");
    } else if (/pekerjaan/i.test(plainText)) {
      valueToInsert = esc(data.sumber_penghasilan ?? "-");
    } else if (/alamat/i.test(plainText)) {
      valueToInsert = "Desa Klitih, Kecamatan Plandaan, Kab. Jombang";
    } else if (/tanggal/i.test(plainText) && /meninggal/i.test(plainText)) {
      valueToInsert = esc(data.tanggal_meninggal ?? "-");
    } else if (/tanggal/i.test(plainText)) {
      valueToInsert = esc(data.tanggal ?? data.tanggal_lahir ?? "");
    } else if (/tempat/i.test(plainText)) {
      valueToInsert = esc(data.tempat_meninggal ?? data.tempat_lahir ?? "-");
    } else {
      return para; // tidak tahu mau diisi apa, biarkan
    }

    if (!valueToInsert) return para;

    // Ganti semua pola titik-titik dalam paragraph ini
    return para.replace(dotPattern, valueToInsert);
  });

  return processed.join("");
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

  // ── DOCX template: isi dengan data warga ────────────────────────────────
  try {
    const PizZip = (await import("pizzip")).default;
    const Docxtemplater = (await import("docxtemplater")).default;

    const fileContent = fs.readFileSync(filePath, "binary");
    const zip = new PizZip(fileContent);

    const xmlContent = zip.files["word/document.xml"].asText();
    const placeholders = buildPlaceholders(surat);

    let outputBuffer: Buffer;

    if (hasPlaceholders(xmlContent)) {
      // ── Mode 1: Template memiliki {placeholder} → pakai docxtemplater ───
      console.log(`[generateFromTemplate] Mode: placeholder → ${surat.jenis_surat}`);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => "", // placeholder tidak ada → string kosong
      });

      doc.render(placeholders);

      outputBuffer = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      }) as Buffer;
    } else {
      // ── Mode 2: Template pakai titik-titik → patch XML langsung ─────────
      console.log(
        `[generateFromTemplate] Mode: xml-patch (titik-titik) → ${surat.jenis_surat}`
      );

      const patchedXml = patchXmlWithData(xmlContent, placeholders);
      zip.file("word/document.xml", patchedXml);

      outputBuffer = zip.generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      }) as Buffer;
    }

    return { buffer: outputBuffer, ext: "docx" };
  } catch (err) {
    console.error("[generateFromTemplate] Error:", err);
    return null; // fallback ke PDFKit
  }
}

// Re-export info placeholder
export { PLACEHOLDER_INFO } from "./placeholderInfo";

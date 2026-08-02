import fs from "fs";
import path from "path";
import type { SuratWithId } from "@/types";
import { getPengaturanDesa, type PengaturanDesa } from "@/lib/actions/pengaturan.actions";

interface TemplateGenerateResult {
  buffer: Buffer;
  ext: "docx" | "pdf";
}

/**
 * Format tanggal Indonesia: 2026-03-30 -> "30 Maret 2026"
 */
function formatTanggalIndo(dateStr?: string | Date | null): string {
  if (!dateStr) {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  const dateObj = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(dateObj.getTime())) {
    return String(dateStr);
  }
  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Mencari file template di public/templates/ berdasarkan jenis_surat.
 */
function findTemplateFile(jenisSurat: string): { filePath: string; ext: "docx" | "pdf" } | null {
  const dir = path.join(process.cwd(), "public", "templates");
  if (!fs.existsSync(dir)) return null;

  const docxName = `${jenisSurat}.docx`;
  const docxPath = path.join(dir, docxName);
  if (fs.existsSync(docxPath)) return { filePath: docxPath, ext: "docx" };

  const pdfName = `${jenisSurat}.pdf`;
  const pdfPath = path.join(dir, pdfName);
  if (fs.existsSync(pdfPath)) return { filePath: pdfPath, ext: "pdf" };

  const files = fs.readdirSync(dir);
  const match = files.find((f) => {
    const nameWithoutExt = path.parse(f).name.toUpperCase();
    return nameWithoutExt === jenisSurat.toUpperCase();
  });

  if (match) {
    const ext = path.extname(match).toLowerCase() === ".docx" ? "docx" : "pdf";
    return { filePath: path.join(dir, match), ext };
  }

  return null;
}

/**
 * Membangun map placeholder dari data surat dan data kustom.
 */
function buildPlaceholders(surat: SuratWithId, pengaturan?: PengaturanDesa): Record<string, string> {
  const tglFormatted = formatTanggalIndo(surat.created_at);

  const kadesNama = pengaturan?.nama_kades ?? "Siti Ro'aini";
  const kadesJabatan = pengaturan?.jabatan_kades ?? "Kepala Desa Klitih";

  const map: Record<string, string> = {
    nama_lengkap: surat.nama_lengkap ?? "",
    nik: surat.nik ?? "",
    no_whatsapp: surat.no_whatsapp ?? "",
    jenis_surat: surat.jenis_surat ?? "",
    nomor_surat: (surat as Record<string, any>).nomor_surat ?? `470/${surat.id.slice(0, 4)}/415.54.08/2026`,
    status: surat.status ?? "",
    tanggal: tglFormatted,
    tanggal_surat: tglFormatted,

    nama_kades: kadesNama,
    jabatan_kades: kadesJabatan,
    nama_kepala_desa: kadesNama,
    jabatan_kepala_desa: kadesJabatan,

    nama: surat.nama_lengkap ?? "",
    no_wa: surat.no_whatsapp ?? "",
    telepon: surat.no_whatsapp ?? "",
  };

  if (surat.data_kustom && typeof surat.data_kustom === "object") {
    for (const [key, val] of Object.entries(surat.data_kustom)) {
      if (val !== undefined && val !== null) {
        map[key] = String(val);
      }
    }
  }

  return map;
}

/**
 * Mengecek apakah xml document berisi placeholder {nama}
 */
function hasPlaceholders(xmlText: string): boolean {
  return /\{[a-zA-Z0-9_-]+\}/.test(xmlText);
}

/**
 * Melakukan replacement sederhana jika docxtemplater gagal
 */
function fallbackSimpleReplace(xmlText: string, placeholders: Record<string, string>): string {
  let result = xmlText;
  for (const [key, val] of Object.entries(placeholders)) {
    const escapedVal = val
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const regex = new RegExp(`\\{${key}\\}`, "g");
    result = result.replace(regex, escapedVal);
  }
  return result;
}

/**
 * Helper untuk mengubah URL/path gambar menjadi Buffer jika valid.
 */
function resolveImageBuffer(imgUrl?: string | null): Buffer | null {
  if (!imgUrl) return null;
  try {
    if (imgUrl.startsWith("data:image/")) {
      const base64Data = imgUrl.split(",")[1];
      if (base64Data) return Buffer.from(base64Data, "base64");
    }
    let localPath = imgUrl;
    if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      return null;
    }
    if (imgUrl.startsWith("/")) {
      localPath = path.join(process.cwd(), "public", imgUrl);
    }
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  } catch (err) {
    console.warn("[generateFromTemplate] Gagal membaca buffer gambar:", imgUrl, err);
  }
  return null;
}

/**
 * Fungsi Utama: Generate buffer surat dari template di public/templates/
 */
export async function generateFromTemplate(
  surat: SuratWithId
): Promise<TemplateGenerateResult | null> {
  const found = findTemplateFile(surat.jenis_surat);
  if (!found) {
    console.log(`[generateFromTemplate] Template tidak ditemukan untuk: ${surat.jenis_surat}`);
    return null;
  }

  const { filePath, ext } = found;

  if (ext === "pdf") {
    console.log(`[generateFromTemplate] Menggunakan file PDF statis: ${filePath}`);
    const buffer = fs.readFileSync(filePath);
    return { buffer, ext: "pdf" };
  }

  const settingsResult = await getPengaturanDesa();
  const pengaturan = settingsResult.success ? settingsResult.data : undefined;

  try {
    const PizZip = (await import("pizzip")).default;
    const Docxtemplater = (await import("docxtemplater")).default;

    const fileContent = fs.readFileSync(filePath, "binary");
    const zip = new PizZip(fileContent);

    // ── Update gambar TTD & Stempel (TIDAK PERNAH MENYENTUH LOGO IMAGE1) ──────
    const mediaPngs = Object.keys(zip.files).filter(
      (f) => f.startsWith("word/media/") && (f.endsWith(".png") || f.endsWith(".jpeg") || f.endsWith(".jpg"))
    );

    // Filter out Kop logo: image1.png SELALU LOGO PEMKAB JOMBANG di Kop Surat!
    const signatureMedia = mediaPngs.filter(
      (f) =>
        !f.toLowerCase().endsWith("image1.png") &&
        !f.toLowerCase().endsWith("image1.jpeg") &&
        !f.toLowerCase().endsWith("image1.jpg")
    );

    if (signatureMedia.length > 0) {
      const combinedPath = path.join(process.cwd(), "public", "assets", "ttd-dan-stempel.png");
      const combinedBuf = fs.existsSync(combinedPath) ? fs.readFileSync(combinedPath) : null;

      if (pengaturan?.url_stempel || pengaturan?.url_ttd) {
        const customStempel = pengaturan?.url_stempel ? resolveImageBuffer(pengaturan.url_stempel) : null;
        const customTTD = pengaturan?.url_ttd ? resolveImageBuffer(pengaturan.url_ttd) : null;
        const bufToUse = customStempel || customTTD || combinedBuf;
        if (bufToUse) {
          zip.file(signatureMedia[0], bufToUse);
        }
      } else if (combinedBuf) {
        zip.file(signatureMedia[0], combinedBuf);
      }
    }

    const xmlContent = zip.files["word/document.xml"].asText();
    const placeholders = buildPlaceholders(surat, pengaturan);

    let outputBuffer: Buffer;

    if (hasPlaceholders(xmlContent)) {
      console.log(`[generateFromTemplate] Mode: placeholder → ${surat.jenis_surat}`);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{", end: "}" },
      });

      doc.render(placeholders);
      outputBuffer = doc.getZip().generate({ type: "nodebuffer" }) as Buffer;
    } else {
      console.log(`[generateFromTemplate] Mode: fallback replace → ${surat.jenis_surat}`);

      const newXml = fallbackSimpleReplace(xmlContent, placeholders);
      zip.file("word/document.xml", newXml);
      outputBuffer = zip.generate({ type: "nodebuffer" }) as Buffer;
    }

    return { buffer: outputBuffer, ext: "docx" };
  } catch (err) {
    console.error(`[generateFromTemplate] Error memproses template ${filePath}:`, err);
    return null;
  }
}

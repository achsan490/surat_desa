import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { SuratWithId } from "@/types";
import { getPengaturanDesa, type PengaturanDesa } from "@/lib/actions/pengaturan.actions";

const ASSETS_DIR = path.join(process.cwd(), "public", "assets");

function getAssetPath(filename: string): string {
  return path.join(ASSETS_DIR, filename);
}

function resolveImageSource(url?: string): string | Buffer | null {
  if (!url) return null;
  if (url.startsWith("data:")) {
    const base64Data = url.split(",")[1];
    return Buffer.from(base64Data, "base64");
  }
  const localPath = path.join(process.cwd(), "public", url);
  if (fs.existsSync(localPath)) return localPath;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// KOP SURAT
// ─────────────────────────────────────────────────────────────────────────────

function drawKopSuratStandard(doc: PDFKit.PDFDocument) {
  const logoJombangPath = getAssetPath("logo-jombang.png");
  const marginLeft = 54;
  const marginRight = doc.page.width - 54;
  const logoSize = 64;
  const logoX = marginLeft;
  const logoY = 32;

  if (fs.existsSync(logoJombangPath)) {
    doc.image(logoJombangPath, logoX, logoY, { width: logoSize });
  }

  const textX = logoX + logoSize + 10;
  const textWidth = marginRight - textX;

  doc.font("Times-Bold").fontSize(12).fillColor("#000").text("PEMERINTAH KABUPATEN JOMBANG", textX, 32, { align: "center", width: textWidth });
  doc.font("Times-Bold").fontSize(12).text("KECAMATAN PLANDAAN", textX, 47, { align: "center", width: textWidth });
  doc.font("Times-Bold").fontSize(16).text("DESA KLITIH", textX, 62, { align: "center", width: textWidth });
  doc.font("Times-Roman").fontSize(8.5).text("Alamat : Jl. Raya Klitih No.07 Kode Pos 61456", textX, 83, { align: "center", width: textWidth });

  // Double Line Kop
  doc.moveTo(marginLeft, 98).lineTo(marginRight, 98).lineWidth(2.5).strokeColor("#000").stroke();
  doc.moveTo(marginLeft, 101.5).lineTo(marginRight, 101.5).lineWidth(0.8).strokeColor("#000").stroke();
}

function drawKopSuratNikah(doc: PDFKit.PDFDocument) {
  const marginLeft = 54;
  const marginRight = doc.page.width - 54;
  const bodyWidth = marginRight - marginLeft;

  doc.font("Times-Roman").fontSize(7.5).fillColor("#333");
  doc.text("LAMPIRAN IV", marginLeft, 32, { width: bodyWidth, align: "left" });
  doc.text("KEPUTUSAN DIREKTUR JENDERAL BIMBINGAN MASYARAKAT ISLAM", marginLeft, 41, { width: bodyWidth, align: "left" });
  doc.text("NOMOR 473 TAHUN 2020 TENTANG PETUNJUK TEKNIS PELAKSANAAN PENCATATAN PERNIKAHAN", marginLeft, 50, { width: bodyWidth - 100, align: "left" });
  
  doc.font("Times-Bold").fontSize(9.5).text("Model N1", marginRight - 80, 32, { width: 80, align: "right" });

  let y = 68;
  doc.font("Times-Roman").fontSize(9).fillColor("#000");
  doc.text("FORMULIR SURAT PENGANTAR NIKAH", marginLeft, y);
  y += 13;
  doc.text("KANTOR DESA/KELURAHAN", marginLeft, y, { continued: true, width: 160 }).text(" : KLITIH");
  y += 13;
  doc.text("KECAMATAN", marginLeft, y, { continued: true, width: 160 }).text(" : PLANDAAN");
  y += 13;
  doc.text("KABUPATEN/KOTA", marginLeft, y, { continued: true, width: 160 }).text(" : JOMBANG");
}

// ─────────────────────────────────────────────────────────────────────────────
// TANDA TANGAN FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function drawSignatures(
  doc: PDFKit.PDFDocument,
  surat: SuratWithId,
  pengaturan: PengaturanDesa | undefined,
  startY: number,
  isDualSignature: boolean = false
) {
  const marginLeft = 54;
  const marginRight = doc.page.width - 54;
  const tanggalStr = format(new Date(surat.created_at), "dd MMMM yyyy", { locale: idLocale });
  const namaKades = pengaturan?.nama_kades || "SITI RO'AINI";
  const jabatanKades = pengaturan?.jabatan_kades || "Kepala Desa Klitih";

  let ttdSource: string | Buffer | null = null;
  if (pengaturan?.url_ttd === "") {
    ttdSource = null;
  } else if (pengaturan?.url_ttd) {
    ttdSource = resolveImageSource(pengaturan.url_ttd);
  } else {
    ttdSource = getAssetPath("tanda-tangan-kades.png");
  }

  let stempelSource: string | Buffer | null = null;
  if (pengaturan?.url_stempel === "") {
    stempelSource = null;
  } else if (pengaturan?.url_stempel) {
    stempelSource = resolveImageSource(pengaturan.url_stempel);
  } else {
    stempelSource = getAssetPath("stempel-desa.png");
  }

  const kadesX = marginRight - 200;
  let y = startY;

  // Tanggal & Jabatan Kades (Rata Kanan)
  doc.font("Times-Roman").fontSize(10).fillColor("#000").text(`Klitih , ${tanggalStr}`, kadesX, y, { align: "center", width: 200 });
  y += 14;
  doc.font("Times-Roman").fontSize(10).text(jabatanKades, kadesX, y, { align: "center", width: 200 });

  // Jika Dual Signature (misal SKCK & SKU: Pemohon di Kiri)
  if (isDualSignature) {
    const pemohonX = marginLeft;
    doc.font("Times-Roman").fontSize(10).text("Yang Bersangkutan", pemohonX, y, { align: "center", width: 180 });
    
    // Nama Pemohon di Kiri Bawah
    const pemohonNamaY = y + 55;
    doc.font("Times-Bold").fontSize(10).text(surat.nama_lengkap.toUpperCase(), pemohonX, pemohonNamaY, { align: "center", width: 180 });
  }

  // TTD Kades (Gambar / Space)
  const ttdY = y + 10;
  if (ttdSource && (typeof ttdSource !== "string" || fs.existsSync(ttdSource))) {
    doc.image(ttdSource, kadesX + 45, ttdY, { width: 110, height: 50 });
  }

  // Stempel Desa Kades
  if (stempelSource && (typeof stempelSource !== "string" || fs.existsSync(stempelSource))) {
    doc.save();
    doc.opacity(0.85);
    doc.image(stempelSource, kadesX + 20, ttdY - 10, { width: 90, height: 90 });
    doc.restore();
  }

  // Nama Kades (Rata Kanan Bawah)
  const kadesNamaY = y + 55;
  doc.font("Times-Bold").fontSize(10).fillColor("#000").text(namaKades.toUpperCase(), kadesX, kadesNamaY, { align: "center", width: 200 });
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER SURAT PENGANTAR NIKAH (MODEL N1)
// ─────────────────────────────────────────────────────────────────────────────

function renderSuratNikahN1(doc: PDFKit.PDFDocument, surat: SuratWithId, pengaturan?: PengaturanDesa) {
  drawKopSuratNikah(doc);

  const marginLeft = 54;
  const marginRight = doc.page.width - 54;
  const bodyWidth = marginRight - marginLeft;
  const dk = surat.data_kustom;
  let y = 135;

  // Judul
  doc.font("Times-Bold").fontSize(11).fillColor("#000").text("FORMULIR PENGANTAR NIKAH", marginLeft, y, { align: "center", width: bodyWidth });
  y += 14;
  const thn = new Date(surat.created_at).getFullYear();
  doc.font("Times-Roman").fontSize(10).text(`Nomor : 470/        /415.65.07/${thn}`, marginLeft, y, { align: "center", width: bodyWidth });
  y += 24;

  doc.font("Times-Roman").fontSize(9.5).text("Yang bertanda tangan di bawah ini menjelaskan dengan sesungguhnya bahwa:", marginLeft, y);
  y += 16;

  const row = (num: string, label: string, val: string, indent = 0) => {
    const xLabel = marginLeft + indent;
    const xVal = marginLeft + 210;
    doc.font("Times-Roman").fontSize(9).fillColor("#000");
    if (num) {
      doc.text(num, xLabel, y, { width: 20 });
      doc.text(label, xLabel + 20, y, { width: 190 });
    } else {
      doc.text(label, xLabel, y, { width: 210 });
    }
    doc.text(":", xVal - 10, y);
    doc.text(val || "-", xVal, y, { width: bodyWidth - 210 });
    y += 13.5;
  };

  // 1. Data Pemohon (Calon)
  row("1.", "Nama", surat.nama_lengkap.toUpperCase());
  row("2.", "Nomor Induk Kependudukan (NIK)", surat.nik);
  row("3.", "jenis Kelamin", dk.jenis_kelamin || "Perempuan");
  row("4.", "Tempat dan tanggal lahir", `${dk.tempat_lahir || "Jombang"}, ${dk.tanggal_lahir || ""}    Umur ${dk.umur || "-"} Tahun`);
  row("5.", "Kewarganegaraan", dk.kewarganegaraan || "Indonesia");
  row("6.", "Agama", dk.agama || "Islam");
  row("7.", "Pekerjaan", dk.pekerjaan || "Karyawan Swasta");
  row("8.", "Pendidikan Terakhir", dk.pendidikan_terakhir || "SLTA");
  row("9.", "Alamat", dk.alamat || `Ds. Klitih Kec. Plandaan Kab. Jombang`);
  
  row("10.", "Status pernikahan", "");
  const isPria = (dk.jenis_kelamin || "").toLowerCase().includes("laki");
  row("", "a. Laki-laki : Jejaka, Duda, atau beristri ke ....", isPria ? (dk.status_pernikahan || "-") : "-", 20);
  row("", "b. Perempuan : Perawan, Janda", !isPria ? (dk.status_pernikahan || "PERAWAN") : "-", 20);
  row("11.", "Nama istri/suami Terdahulu", dk.nama_istri_suami_terdahulu || "-");
  y += 6;

  // 2. Data Ayah
  doc.font("Times-Roman").fontSize(9.5).text("Adalah benar anak dari pernikahan seorang pria:", marginLeft, y);
  y += 14;
  row("", "Nama Lengkap dan alias", (dk.nama_ayah || "-").toUpperCase());
  row("", "Nomor Induk Kependudukan (NIK)", dk.nik_ayah || "-");
  row("", "Tempat dan tanggal lahir", dk.ttl_ayah || "-");
  row("", "Kewarganegaraan", dk.kewarganegaraan_ayah || "Indonesia");
  row("", "Agama", dk.agama_ayah || "Islam");
  row("", "Pekerjaan", dk.pekerjaan_ayah || "Petani");
  row("", "Alamat", dk.alamat_ayah || `Ds. Klitih Kec. Plandaan Kab. Jombang`);
  y += 6;

  // 3. Data Ibu
  doc.font("Times-Roman").fontSize(9.5).text("dengan seorang wanita:", marginLeft, y);
  y += 14;
  row("", "Nama Lengkap dan alias", (dk.nama_ibu || "-").toUpperCase());
  row("", "Nomor Induk Kependudukan (NIK)", dk.nik_ibu || "-");
  row("", "Tempat dan tanggal lahir", dk.ttl_ibu || "-");
  row("", "Kewarganegaraan", dk.kewarganegaraan_ibu || "Indonesia");
  row("", "Agama", dk.agama_ibu || "Islam");
  row("", "Pekerjaan", dk.pekerjaan_ibu || "Karyawan Swasta");
  row("", "Alamat", dk.alamat_ibu || `Ds. Klitih Kec. Plandaan Kab. Jombang`);
  y += 12;

  // Penutup
  doc.font("Times-Roman").fontSize(9.5).text(
    "Demikian, Surat pengantar ini dibuat dengan mengingat sumpah jabatan dan untuk dipergunakan sebagaimana mestinya.",
    marginLeft, y, { width: bodyWidth, align: "justify" }
  );
  y += 24;

  drawSignatures(doc, surat, pengaturan, y, false);
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER SURAT PENGANTAR SKCK
// ─────────────────────────────────────────────────────────────────────────────

function renderSuratSKCK(doc: PDFKit.PDFDocument, surat: SuratWithId, pengaturan?: PengaturanDesa) {
  drawKopSuratStandard(doc);

  const marginLeft = 54;
  const marginRight = doc.page.width - 54;
  const bodyWidth = marginRight - marginLeft;
  const dk = surat.data_kustom;
  let y = 120;

  // Judul
  doc.font("Times-Bold").fontSize(11).fillColor("#000").text("SURAT KETERANGAN CATATAN KEPOLISIAN", marginLeft, y, { align: "center", width: bodyWidth, underline: true });
  y += 14;
  const thn = new Date(surat.created_at).getFullYear();
  doc.font("Times-Bold").fontSize(10).text(`NOMOR : 470/ 47 /415.65.07/${thn}`, marginLeft, y, { align: "center", width: bodyWidth });
  y += 26;

  doc.font("Times-Roman").fontSize(10).text("Yang bertanda tangan dibawah ini :", marginLeft, y);
  y += 16;
  doc.text("Nama", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text(pengaturan?.nama_kades || "SITI RO'AINI", marginLeft + 185, y);
  y += 14;
  doc.text("Jabatan", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text("Kepala Desa Klitih Kec. Plandaan Kab. Jombang", marginLeft + 185, y, { width: bodyWidth - 185 });
  y += 22;

  doc.font("Times-Roman").fontSize(10).text("Menerangkan dengan sebenarnya bahwa :", marginLeft, y);
  y += 16;

  const row = (label: string, val: string) => {
    doc.font("Times-Roman").fontSize(10).fillColor("#000");
    doc.text(label, marginLeft + 30, y, { width: 140 });
    doc.text(":", marginLeft + 170, y);
    doc.text(val || "-", marginLeft + 185, y, { width: bodyWidth - 185 });
    y += 14.5;
  };

  row("Nama", surat.nama_lengkap.toUpperCase());
  row("Tempat Tanggal Lahir", `${dk.tempat_lahir || "Jombang"}, ${dk.tanggal_lahir || ""}`);
  row("NIK", surat.nik);
  row("Jenis Kelamin", dk.jenis_kelamin || "Laki-laki");
  row("Kewarganegaraan", dk.kewarganegaraan || "Indonesia");
  row("Agama", dk.agama || "Islam");
  row("Pekerjaan", dk.pekerjaan || "-");
  row("Status", dk.status_pernikahan || "Belum Kawin");
  row("Alamat", dk.alamat || "Dsn. Klitih RT/RW : 005/008 Ds. Klitih Kec. Plandaan Kab. Jombang.");
  y += 12;

  doc.font("Times-Roman").fontSize(10).text("Surat keterangan ini akan di pergunakan untuk administrasi :", marginLeft, y);
  y += 20;

  // Keperluan SKCK (Centered Bold)
  const keperluanText = `"${(dk.keperluan || "PERSYARATAN MELAMAR PEKERJAAN").toUpperCase()}"`;
  doc.font("Times-Bold").fontSize(11).text(keperluanText, marginLeft, y, { align: "center", width: bodyWidth });
  y += 24;

  doc.font("Times-Roman").fontSize(10).text(
    "Orang tersebut diatas adalah benar-benar penduduk Desa Klitih Kecamatan Plandaan Kabupaten Jombang dan sepanjang penelitian kami sampai saat ini dikeluarkannya surat keterangan ini orang tersebut tidak pernah tersangkut urusan pihak yang berwajib/Polisi, berkelakuan baik.",
    marginLeft, y, { width: bodyWidth, align: "justify", lineGap: 3 }
  );
  y += 48;

  doc.font("Times-Roman").fontSize(10).text("Demikian untuk menjadikan periksa.", marginLeft, y);
  y += 36;

  drawSignatures(doc, surat, pengaturan, y, true);
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER SURAT DOMISILI
// ─────────────────────────────────────────────────────────────────────────────

function renderSuratDomisili(doc: PDFKit.PDFDocument, surat: SuratWithId, pengaturan?: PengaturanDesa) {
  drawKopSuratStandard(doc);

  const marginLeft = 54;
  const marginRight = doc.page.width - 54;
  const bodyWidth = marginRight - marginLeft;
  const dk = surat.data_kustom;
  let y = 120;

  // Judul
  doc.font("Times-Bold").fontSize(11).fillColor("#000").text("SURAT KETERANGAN DOMISILI", marginLeft, y, { align: "center", width: bodyWidth, underline: true });
  y += 14;
  const thn = new Date(surat.created_at).getFullYear();
  doc.font("Times-Bold").fontSize(10).text(`No : 470/ 113 /415.65.07/${thn}`, marginLeft, y, { align: "center", width: bodyWidth });
  y += 26;

  doc.font("Times-Roman").fontSize(10).text("Yang bertanda tangan dibawah ini :", marginLeft, y);
  y += 16;
  doc.text("Nama", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text(pengaturan?.nama_kades || "SITI RO'AINI", marginLeft + 185, y);
  y += 14;
  doc.text("Jabatan", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text("Kepala Desa Klitih", marginLeft + 185, y);
  y += 22;

  doc.font("Times-Roman").fontSize(10).text("Menerangkan dengan sebenarnya bahwa :", marginLeft, y);
  y += 16;

  doc.font("Times-Bold").fontSize(10).text("Nama Lembaga", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text((dk.nama_lembaga || "PEMERINTAH DESA KLITIH").toUpperCase(), marginLeft + 185, y, { width: bodyWidth - 185 });
  y += 16;
  doc.font("Times-Roman").fontSize(10).text("Tempat", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text(dk.tempat_domisili || "Jl. Raya Klitih No.07 Desa Klitih Kecamatan Plandaan Kabupaten Jombang.", marginLeft + 185, y, { width: bodyWidth - 185, lineGap: 2 });
  y += 32;

  doc.font("Times-Roman").fontSize(10).text(
    "adalah benar berdomisili di Desa Klitih Kecamatan Plandaan Kabupaten Jombang.",
    marginLeft, y, { width: bodyWidth, align: "left" }
  );
  y += 28;

  doc.font("Times-Roman").fontSize(10).text(
    "Demikian Surat Keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.",
    marginLeft, y, { width: bodyWidth, align: "justify", lineGap: 3 }
  );
  y += 48;

  drawSignatures(doc, surat, pengaturan, y, false);
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER SURAT KETERANGAN USAHA (SKU)
// ─────────────────────────────────────────────────────────────────────────────

function renderSuratSKU(doc: PDFKit.PDFDocument, surat: SuratWithId, pengaturan?: PengaturanDesa) {
  drawKopSuratStandard(doc);

  const marginLeft = 54;
  const marginRight = doc.page.width - 54;
  const bodyWidth = marginRight - marginLeft;
  const dk = surat.data_kustom;
  let y = 120;

  // Judul
  doc.font("Times-Bold").fontSize(11).fillColor("#000").text("SURAT KETERANGAN KEPEMILIKAN USAHA", marginLeft, y, { align: "center", width: bodyWidth, underline: true });
  y += 14;
  const thn = new Date(surat.created_at).getFullYear();
  doc.font("Times-Bold").fontSize(10).text(`NO. 511/ 40 /415.65.07/${thn}`, marginLeft, y, { align: "center", width: bodyWidth });
  y += 26;

  doc.font("Times-Roman").fontSize(10).text("Yang bertanda tangan dibawah ini :", marginLeft, y);
  y += 16;
  doc.text("Nama", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text(pengaturan?.nama_kades || "SITI RO'AINI", marginLeft + 185, y);
  y += 14;
  doc.text("Jabatan", marginLeft + 30, y, { width: 140 }).text(":", marginLeft + 170, y).text("Kepala Desa Klitih", marginLeft + 185, y);
  y += 22;

  doc.font("Times-Roman").fontSize(10).text("Menerangkan dengan sebenarnya bahwa :", marginLeft, y);
  y += 16;

  const row = (label: string, val: string) => {
    doc.font("Times-Roman").fontSize(10).fillColor("#000");
    doc.text(label, marginLeft + 30, y, { width: 140 });
    doc.text(":", marginLeft + 170, y);
    doc.text(val || "-", marginLeft + 185, y, { width: bodyWidth - 185 });
    y += 14.5;
  };

  row("Nama", surat.nama_lengkap.toUpperCase());
  row("Tempat/ tgl lahir", `${dk.tempat_lahir || "Jombang"}, ${dk.tanggal_lahir || ""}`);
  row("NIK", surat.nik);
  row("Jenis kelamin", dk.jenis_kelamin || "Perempuan");
  row("Agama", dk.agama || "Islam");
  row("Pekerjaan", dk.pekerjaan || "Mengurus Rumah Tangga");
  row("Alamat", dk.alamat || "Dsn. Waturupit RT/RW. 001/006 Ds. Klitih Kec. Plandaan Kab. Jombang");
  y += 16;

  const bidangUsaha = (dk.bidang_usaha || "Pertanian").trim();
  doc.font("Times-Roman").fontSize(10).text(
    `Orang tersebut di atas adalah benar-benar penduduk Desa Klitih Kecamatan Plandaan Kabupaten Jombang dan memiliki usaha di bidang `,
    marginLeft, y, { width: bodyWidth, continued: true, align: "justify" }
  ).font("Times-BoldItalic").text(`${bidangUsaha} .`, { continued: false });
  y += 26;

  const keperluanText = (dk.keperluan || "persyaratan pengajuan pinjaman ke BRI UNIT PLANDAAN KANCA JOMBANG").trim();
  doc.font("Times-Roman").fontSize(10).text(
    `Surat keterangan ini dipergunakan untuk ${keperluanText}.`,
    marginLeft, y, { width: bodyWidth, align: "justify" }
  );
  y += 26;

  doc.font("Times-Roman").fontSize(10).text(
    "Demikian surat keterangan kepemilikan usaha ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.",
    marginLeft, y, { width: bodyWidth, align: "justify", lineGap: 3 }
  );
  y += 42;

  drawSignatures(doc, surat, pengaturan, y, true);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function generateSuratPDF(surat: SuratWithId): Promise<Buffer> {
  const settingsResult = await getPengaturanDesa();
  const pengaturan = settingsResult.success ? settingsResult.data : undefined;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 54, // 0.75 inch margin for standard official letter
      info: {
        Title: `Surat Keterangan - ${surat.nama_lengkap}`,
        Author: "Desa Klitih",
        Subject: surat.jenis_surat,
        Creator: "SIPAS Desa Klitih",
      },
    });

    const buffers: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Route to exact template renderer
    switch (surat.jenis_surat) {
      case "SURAT_PENGANTAR_NIKAH":
        renderSuratNikahN1(doc, surat, pengaturan);
        break;
      case "SURAT_PENGANTAR_SKCK":
        renderSuratSKCK(doc, surat, pengaturan);
        break;
      case "SURAT_DOMISILI":
        renderSuratDomisili(doc, surat, pengaturan);
        break;
      case "SURAT_KETERANGAN_USAHA":
        renderSuratSKU(doc, surat, pengaturan);
        break;
      default:
        renderSuratSKU(doc, surat, pengaturan);
        break;
    }

    doc.end();
  });
}

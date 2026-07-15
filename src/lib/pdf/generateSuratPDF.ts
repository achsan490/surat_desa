import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { SuratWithId } from "@/types";
import { JENIS_SURAT_CONFIG } from "@/types";

const ASSETS_DIR = path.join(process.cwd(), "public", "assets");

function getAssetPath(filename: string): string {
  return path.join(ASSETS_DIR, filename);
}

function drawHeader(doc: PDFKit.PDFDocument) {
  const logoPath = getAssetPath("logo-desa.png");
  const pageWidth = doc.page.width;
  const marginLeft = 72;
  const marginRight = pageWidth - 72;

  // Coba embed logo desa jika ada
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, marginLeft, 40, { width: 65, height: 65 });
  }

  // Header teks kop surat
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#1a1a2e")
    .text("PEMERINTAH KABUPATEN JOMBANG", marginLeft + 80, 42, {
      align: "center",
      width: pageWidth - 224,
    });

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("KECAMATAN PLANDAAN", marginLeft + 80, 56, {
      align: "center",
      width: pageWidth - 224,
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("DESA KLITIH", marginLeft + 80, 70, {
      align: "center",
      width: pageWidth - 224,
    });

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#555")
    .text(
      "Jl. Raya Klitih No. 1, Kec. Plandaan, Kab. Jombang, Jawa Timur | Telp: (0321) 123456",
      marginLeft + 80,
      87,
      { align: "center", width: pageWidth - 224 }
    );

  // Garis kop surat (double line)
  doc
    .moveTo(marginLeft, 110)
    .lineTo(marginRight, 110)
    .lineWidth(3)
    .strokeColor("#1a1a2e")
    .stroke();

  doc
    .moveTo(marginLeft, 114)
    .lineTo(marginRight, 114)
    .lineWidth(1)
    .strokeColor("#1a1a2e")
    .stroke();
}

function drawFooter(doc: PDFKit.PDFDocument, surat: SuratWithId) {
  const pageWidth = doc.page.width;
  const marginLeft = 72;
  const marginRight = pageWidth - 72;
  const footerY = doc.page.height - 200;

  // Kota dan tanggal
  const tanggalStr = format(new Date(surat.created_at), "d MMMM yyyy", { locale: idLocale });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#333")
    .text(`Klitih, ${tanggalStr}`, marginRight - 200, footerY, { align: "right", width: 200 });

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Kepala Desa Klitih,", marginRight - 200, footerY + 16, {
      align: "right",
      width: 200,
    });

  // TTD & Stempel
  const ttdPath = getAssetPath("tanda-tangan-kades.png");
  const stempelPath = getAssetPath("stempel-desa.png");

  const ttdX = marginRight - 170;
  const ttdY = footerY + 34;

  if (fs.existsSync(stempelPath)) {
    doc.save();
    doc.opacity(0.6);
    doc.image(stempelPath, ttdX - 30, ttdY - 10, { width: 90 });
    doc.restore();
  }
  if (fs.existsSync(ttdPath)) {
    doc.image(ttdPath, ttdX, ttdY, { width: 110, height: 55 });
  } else {
    // Fallback jika file aset belum ada
    doc.rect(ttdX, ttdY, 110, 50).dash(4, { space: 2 }).stroke("#aaa").undash();
    doc.font("Helvetica").fontSize(8).fillColor("#aaa").text("[Tanda Tangan]", ttdX, ttdY + 18, { width: 110, align: "center" });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#333")
    .text("SUYOTO, S.Pd.", marginRight - 200, ttdY + 60, { align: "right", width: 200 });

  doc
    .font("Helvetica")
    .fontSize(9)
    .text("NIP. 19750101 200003 1 001", marginRight - 200, ttdY + 74, { align: "right", width: 200 });

  // Garis bawah
  doc
    .moveTo(marginLeft, doc.page.height - 50)
    .lineTo(marginRight, doc.page.height - 50)
    .lineWidth(1)
    .strokeColor("#ccc")
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor("#999")
    .text(
      `Dokumen ini diterbitkan secara resmi oleh Sistem Informasi Desa Klitih | ID: ${surat.id}`,
      marginLeft,
      doc.page.height - 42,
      { align: "center", width: marginRight - marginLeft }
    );
}

function drawNomorSurat(doc: PDFKit.PDFDocument, surat: SuratWithId, nomorUrut: string) {
  const tahun = new Date(surat.created_at).getFullYear();
  const kodeJenis: Record<string, string> = {
    SKTM: "SKTM",
    SURAT_KEMATIAN: "SKM",
    SURAT_DOMISILI: "SKDOM",
    SURAT_KETERANGAN_USAHA: "SKU",
  };
  const kode = kodeJenis[surat.jenis_surat] ?? "SK";
  const nomorSurat = `${nomorUrut}/SK/${kode}/DESA-PK/${tahun}`;

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#1a1a2e")
    .text(JENIS_SURAT_CONFIG[surat.jenis_surat as keyof typeof JENIS_SURAT_CONFIG]?.label?.toUpperCase() ?? "SURAT KETERANGAN", 72, 130, {
      align: "center",
      width: doc.page.width - 144,
    });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#555")
    .text(`Nomor: ${nomorSurat}`, 72, 150, { align: "center", width: doc.page.width - 144 });

  doc
    .moveTo(200, 168)
    .lineTo(doc.page.width - 200, 168)
    .lineWidth(0.5)
    .strokeColor("#999")
    .stroke();
}

function drawBodyContent(doc: PDFKit.PDFDocument, surat: SuratWithId) {
  const marginLeft = 72;
  const bodyWidth = doc.page.width - 144;
  let y = 190;

  const lineHeight = 18;

  const p = (label: string, value: string) => {
    doc.font("Helvetica").fontSize(10).fillColor("#222");
    doc.text(label, marginLeft, y, { continued: false, width: 180 });
    doc.text(":", marginLeft + 180, y, { continued: false, width: 15 });
    doc.text(value, marginLeft + 200, y, { continued: false, width: bodyWidth - 200 });
    y += lineHeight;
  };

  // Pembuka
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#222")
    .text(
      "Yang bertanda tangan di bawah ini, Kepala Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang, Provinsi Jawa Timur, dengan ini menerangkan bahwa:",
      marginLeft,
      y,
      { width: bodyWidth, align: "justify" }
    );
  y += 42;

  // Data pemohon
  p("Nama Lengkap", surat.nama_lengkap);
  p("NIK", surat.nik);
  p("No. WhatsApp", surat.no_whatsapp);

  // Data kustom per jenis surat
  const dataKustom = surat.data_kustom;

  if (surat.jenis_surat === "SKTM") {
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      `Adalah benar warga Desa Klitih yang tercatat sebagai warga kurang mampu. Surat ini diterbitkan untuk keperluan: ${dataKustom.keperluan ?? "-"}.`,
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 52;
  } else if (surat.jenis_surat === "SURAT_KEMATIAN") {
    p("Nama Almarhum/ah", dataKustom.nama_almarhum ?? "-");
    p("Tanggal Meninggal", dataKustom.tanggal_meninggal ?? "-");
    p("Tempat Meninggal", dataKustom.tempat_meninggal ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      "Adalah benar telah meninggal dunia sebagaimana tercatat di atas. Surat keterangan ini diterbitkan untuk keperluan administrasi kependudukan.",
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 42;
  } else if (surat.jenis_surat === "SURAT_DOMISILI") {
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      `Adalah benar berdomisili and bertempat tinggal di Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang. Surat ini diterbitkan untuk keperluan: ${dataKustom.tujuan_surat ?? "-"}.`,
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 52;
  } else if (surat.jenis_surat === "SURAT_KETERANGAN_USAHA") {
    p("Nama Usaha", dataKustom.nama_usaha ?? "-");
    p("Jenis Usaha", dataKustom.jenis_usaha ?? "-");
    p("Alamat Usaha", dataKustom.alamat_usaha ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      "Adalah benar menjalankan usaha sebagaimana tersebut di atas di wilayah Desa Klitih. Surat keterangan ini diterbitkan sebagai bukti legalitas usaha.",
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 42;
  } else if (surat.jenis_surat === "SURAT_BELUM_MENIKAH") {
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      `Berdasarkan data kependudukan dan catatan desa kami, menerangkan bahwa yang bersangkutan sepanjang pengetahuan kami belum pernah menikah dengan siapapun. Surat keterangan ini dibuat untuk keperluan: ${dataKustom.keperluan ?? "-"}.`,
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 52;
  } else if (surat.jenis_surat === "SURAT_KELAHIRAN") {
    p("Nama Bayi", dataKustom.nama_bayi ?? "-");
    p("Tanggal Lahir", dataKustom.tanggal_lahir ?? "-");
    p("Tempat Lahir", dataKustom.tempat_lahir ?? "-");
    p("Nama Ayah", dataKustom.nama_ayah ?? "-");
    p("Nama Ibu", dataKustom.nama_ibu ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      "Adalah benar nama bayi tersebut di atas telah lahir sebagai anak kandung dari pasangan suami istri yang sah sebagaimana tercantum dalam catatan kependudukan Desa Klitih.",
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 42;
  } else if (surat.jenis_surat === "SURAT_PINDAH") {
    p("Alamat Asal", dataKustom.alamat_asal ?? "-");
    p("Alamat Tujuan", dataKustom.alamat_tujuan ?? "-");
    p("Alasan Pindah", dataKustom.alasan_pindah ?? "-");
    p("Jumlah Pengikut", dataKustom.jumlah_pengikut ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      "Menerangkan bahwa yang bersangkutan mengajukan permohonan pindah domisili dari Desa Klitih menuju alamat tujuan yang tercantum di atas bersama dengan seluruh pengikutnya.",
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 42;
  } else if (surat.jenis_surat === "SURAT_PENGHASILAN") {
    p("Nominal Penghasilan", `Rp ${dataKustom.nominal_penghasilan ?? "-"}`);
    p("Pekerjaan / Sumber", dataKustom.sumber_penghasilan ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      `Menerangkan bahwa yang bersangkutan memiliki rata-rata penghasilan per bulan sebagaimana tercantum di atas. Surat keterangan ini diterbitkan untuk memenuhi persyaratan: ${dataKustom.keperluan ?? "-"}.`,
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 52;
  } else if (surat.jenis_surat === "SURAT_AHLI_WARIS") {
    p("Nama Pewaris", dataKustom.nama_pewaris ?? "-");
    p("Tanggal Meninggal", dataKustom.tanggal_meninggal ?? "-");
    p("Jumlah Ahli Waris", dataKustom.jumlah_ahli_waris ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      "Menyatakan dengan sebenarnya bahwa nama-nama tersebut di atas adalah ahli waris sah dari almarhum/almarhumah pewaris, yang berhak atas seluruh harta peninggalan menurut ketentuan hukum yang berlaku.",
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 42;
  } else if (surat.jenis_surat === "SURAT_PENGANTAR_NIKAH") {
    p("Nama Calon Pasangan", dataKustom.nama_pasangan ?? "-");
    p("NIK Calon Pasangan", dataKustom.nik_pasangan ?? "-");
    p("Rencana Tempat Nikah", dataKustom.tempat_nikah ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      "Menerangkan bahwa yang bersangkutan adalah warga Desa Klitih yang bersiap melangsungkan pernikahan dengan calon pasangan tersebut di atas. Surat pengantar ini diterbitkan untuk pengurusan ke KUA setempat.",
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 42;
  } else if (surat.jenis_surat === "SURAT_KEPEMILIKAN_TANAH") {
    p("Nomor Sertifikat/Girik", dataKustom.nomor_sertifikat ?? "-");
    p("Luas Bidang Tanah", dataKustom.luas_tanah ?? "-");
    p("Lokasi / Alamat Tanah", dataKustom.alamat_tanah ?? "-");
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      "Menerangkan secara resmi bahwa bidang tanah dengan keterangan di atas dikuasai/dimiliki secara fisik oleh yang bersangkutan dan tidak dalam status sengketa pihak lain.",
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 42;
  } else if (surat.jenis_surat === "SURAT_PENGANTAR_SKCK") {
    y += 8;
    doc.font("Helvetica").fontSize(10).fillColor("#222").text(
      `Menerangkan bahwa sepanjang pengetahuan kami yang bersangkutan berkelakuan baik, tidak pernah terlibat kasus hukum, dan surat pengantar ini diberikan untuk pengurusan SKCK di kepolisian untuk keperluan: ${dataKustom.keperluan ?? "-"}.`,
      marginLeft, y, { width: bodyWidth, align: "justify" }
    );
    y += 52;
  }

  // Penutup
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#222")
    .text(
      "Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.",
      marginLeft,
      y,
      { width: bodyWidth, align: "justify" }
    );
}

// ────────────────────────────────────────────────
// MAIN: Generate PDF dan return sebagai Buffer
// ────────────────────────────────────────────────
export async function generateSuratPDF(surat: SuratWithId): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 72,
      info: {
        Title: `Surat Keterangan - ${surat.nama_lengkap}`,
        Author: "Desa Klitih",
        Subject: surat.jenis_surat,
        Creator: "SIPAS - Sistem Pelayanan Administrasi Surat",
      },
    });



    const buffers: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Render komponen surat
    drawHeader(doc);
    drawNomorSurat(doc, surat, "001");
    drawBodyContent(doc, surat);
    drawFooter(doc, surat);

    doc.end();
  });
}

import fs from "fs";
import path from "path";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  VerticalAlign,
} from "docx";

const OUTPUT_DIR = path.join(process.cwd(), "public", "templates");
const LOGO_PATH = path.join(process.cwd(), "public", "assets", "logo-jombang.png");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const FONT = "Times New Roman";
const hasLogo = fs.existsSync(LOGO_PATH);
const logoBuffer = hasLogo ? fs.readFileSync(LOGO_PATH) : null;

const TTD_PATH = path.join(process.cwd(), "public", "assets", "tanda-tangan-kades.png");
const STEMPEL_PATH = path.join(process.cwd(), "public", "assets", "stempel-desa.png");
const ttdBuffer = fs.existsSync(TTD_PATH) ? fs.readFileSync(TTD_PATH) : null;
const stempelBuffer = fs.existsSync(STEMPEL_PATH) ? fs.readFileSync(STEMPEL_PATH) : null;

interface FieldDef {
  key: string;
  label: string;
}

function createTemplateDoc(
  title: string,
  extraFields: FieldDef[],
  bodyParagraph: string
): Document {
  // Kop Surat: Tabel 2 Kolom (Kiri: Logo, Kanan: Teks Kop)
  const kopTextParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: "PEMERINTAH KABUPATEN JOMBANG",
          bold: true,
          font: FONT,
          size: 24, // 12pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: "KECAMATAN PLANDAAN",
          bold: true,
          font: FONT,
          size: 24, // 12pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "DESA KLITIH",
          bold: true,
          font: FONT,
          size: 30, // 15pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [
        new TextRun({
          text: "Jl. Raya Klitih No. 1, Kecamatan Plandaan, Kabupaten Jombang, Jawa Timur 61456",
          italics: true,
          font: FONT,
          size: 18, // 9pt
        }),
      ],
    }),
  ];

  const kopLogoCell = new TableCell({
    width: { size: 1600, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: logoBuffer
          ? [
              new ImageRun({
                data: logoBuffer,
                transformation: {
                  width: 72,
                  height: 72,
                },
                type: "png",
              }),
            ]
          : [],
      }),
    ],
  });

  const kopTextCell = new TableCell({
    width: { size: 7400, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    children: kopTextParagraphs,
  });

  const kopTable = new Table({
    rows: [
      new TableRow({
        children: [kopLogoCell, kopTextCell],
      }),
    ],
    width: { size: 9000, type: WidthType.DXA },
  });

  // Garis Bawah Kop Surat (Double Line Border)
  const kopSeparatorLine = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 200 },
    border: {
      bottom: {
        color: "000000",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 18, // Garis Tebal Kop Surat
      },
    },
    children: [],
  });

  // Judul & Nomor Surat
  const titleParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          underline: {},
          font: FONT,
          size: 28, // 14pt
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Nomor: {nomor_surat}",
          font: FONT,
          size: 22, // 11pt
        }),
      ],
    }),
  ];

  // Pembuka
  const openingParagraph = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200, line: 360 }, // 1.5 line spacing
    children: [
      new TextRun({
        text: "Yang bertanda tangan di bawah ini Kepala Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang, Provinsi Jawa Timur, menerangkan dengan sebenarnya bahwa:",
        font: FONT,
        size: 24, // 12pt
      }),
    ],
  });

  // Table Data Identitas
  const allFields: FieldDef[] = [
    { key: "{nama_lengkap}", label: "Nama Lengkap" },
    { key: "{nik}", label: "NIK" },
    { key: "{no_whatsapp}", label: "No. Telepon / WA" },
    ...extraFields,
  ];

  const tableRows = allFields.map(
    (f) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: f.label, font: FONT, size: 24 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 400, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: ":", font: FONT, size: 24 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 5600, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: f.key, font: FONT, size: 24, bold: true }),
                ],
              }),
            ],
          }),
        ],
      })
  );

  const identityTable = new Table({
    rows: tableRows,
    width: { size: 9000, type: WidthType.DXA },
  });

  // Isi Surat
  const contentParagraph = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 200, after: 200, line: 360 },
    children: [
      new TextRun({
        text: bodyParagraph,
        font: FONT,
        size: 24,
      }),
    ],
  });

  // Penutup
  const closingParagraph = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 400, line: 360 },
    children: [
      new TextRun({
        text: "Demikian Surat Keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.",
        font: FONT,
        size: 24,
      }),
    ],
  });

  // Tanda Tangan Rata Kanan
  const signatureParagraphs = [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Klitih, {tanggal}",
          font: FONT,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Kepala Desa Klitih,",
          bold: true,
          font: FONT,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 20, after: 20 },
      children: [
        ...(stempelBuffer
          ? [
              new ImageRun({
                data: stempelBuffer,
                transformation: {
                  width: 90,
                  height: 90,
                },
                type: "png",
              }),
            ]
          : []),
        ...(ttdBuffer
          ? [
              new ImageRun({
                data: ttdBuffer,
                transformation: {
                  width: 130,
                  height: 65,
                },
                type: "png",
              }),
            ]
          : []),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "SITI RO'AINI",
          bold: true,
          underline: {},
          font: FONT,
          size: 24,
        }),
      ],
    }),
  ];

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          kopTable,
          kopSeparatorLine,
          ...titleParagraphs,
          openingParagraph,
          identityTable,
          contentParagraph,
          closingParagraph,
          ...signatureParagraphs,
        ],
      },
    ],
  });
}

// ── Rincian per jenis surat ──────────────────────────────────────────────────
const TEMPLATE_DEFINITIONS: Array<{
  filename: string;
  title: string;
  extraFields: FieldDef[];
  body: string;
}> = [
  {
    filename: "SKTM.docx",
    title: "Surat Keterangan Tidak Mampu (SKTM)",
    extraFields: [{ key: "{keperluan}", label: "Keperluan Surat" }],
    body: "Bahwa nama tersebut di atas adalah benar-benar warga yang berdomisili di Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang dan tergolong dalam keluarga Tidak Mampu (Masyarakat Berpenghasilan Rendah). Surat keterangan ini dibuat untuk keperluan: {keperluan}.",
  },
  {
    filename: "SURAT_KEMATIAN.docx",
    title: "Surat Keterangan Kematian",
    extraFields: [
      { key: "{nama_almarhum}", label: "Nama Almarhum/ah" },
      { key: "{tanggal_meninggal}", label: "Tanggal Meninggal" },
      { key: "{tempat_meninggal}", label: "Tempat Meninggal" },
    ],
    body: "Menerangkan bahwa almarhum/almarhumah yang tersebut di atas adalah benar warga Desa Klitih dan telah meninggal dunia pada tanggal {tanggal_meninggal} bertempat di {tempat_meninggal}. Surat keterangan ini dipergunakan untuk kelengkapan administrasi kependudukan.",
  },
  {
    filename: "SURAT_DOMISILI.docx",
    title: "Surat Keterangan Domisili",
    extraFields: [{ key: "{tujuan_surat}", label: "Keperluan / Tujuan" }],
    body: "Adalah benar berdomisili dan bertempat tinggal di Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang. Surat Keterangan ini diberikan kepada yang bersangkutan untuk keperluan: {tujuan_surat}.",
  },
  {
    filename: "SURAT_KETERANGAN_USAHA.docx",
    title: "Surat Keterangan Usaha (SKU)",
    extraFields: [
      { key: "{nama_usaha}", label: "Nama Usaha" },
      { key: "{jenis_usaha}", label: "Jenis Usaha" },
      { key: "{alamat_usaha}", label: "Alamat Usaha" },
    ],
    body: "Bahwa nama tersebut di atas benar-benar memiliki dan menjalankan usaha {nama_usaha} di bidang {jenis_usaha} yang berlokasi di {alamat_usaha}, Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang. Surat Keterangan Usaha ini dibuat sebagai bukti legalitas usaha.",
  },
  {
    filename: "SURAT_BELUM_MENIKAH.docx",
    title: "Surat Keterangan Belum Menikah",
    extraFields: [{ key: "{keperluan}", label: "Keperluan Surat" }],
    body: "Berdasarkan catatan kependudukan Desa Klitih, menerangkan bahwa yang bersangkutan hingga surat ini diterbitkan belum pernah menikah (jejaka / perawan). Surat Keterangan ini dibuat untuk keperluan: {keperluan}.",
  },
  {
    filename: "SURAT_KELAHIRAN.docx",
    title: "Surat Keterangan Kelahiran",
    extraFields: [
      { key: "{nama_bayi}", label: "Nama Bayi" },
      { key: "{tanggal_lahir}", label: "Tanggal Lahir" },
      { key: "{tempat_lahir}", label: "Tempat Lahir" },
      { key: "{nama_ayah}", label: "Nama Ayah" },
      { key: "{nama_ibu}", label: "Nama Ibu" },
    ],
    body: "Menerangkan bahwa telah lahir seorang bayi laki-laki / perempuan bernama {nama_bayi} pada tanggal {tanggal_lahir} di {tempat_lahir}, anak kandung dari pasangan suami istri {nama_ayah} dan {nama_ibu} warga Desa Klitih.",
  },
  {
    filename: "SURAT_PINDAH.docx",
    title: "Surat Keterangan Pindah Domisili",
    extraFields: [
      { key: "{alamat_asal}", label: "Alamat Asal" },
      { key: "{alamat_tujuan}", label: "Alamat Tujuan" },
      { key: "{alasan_pindah}", label: "Alasan Pindah" },
      { key: "{jumlah_pengikut}", label: "Jumlah Pengikut" },
    ],
    body: "Menerangkan bahwa penduduk tersebut di atas mengajukan permohonan pindah domisili dari {alamat_asal} ke {alamat_tujuan} dengan alasan {alasan_pindah} beserta pengikut sebanyak {jumlah_pengikut} jiwa.",
  },
  {
    filename: "SURAT_PENGHASILAN.docx",
    title: "Surat Keterangan Penghasilan",
    extraFields: [
      { key: "{nominal_penghasilan}", label: "Nominal Penghasilan" },
      { key: "{sumber_penghasilan}", label: "Pekerjaan / Sumber" },
      { key: "{keperluan}", label: "Keperluan Surat" },
    ],
    body: "Menerangkan bahwa nama tersebut di atas bekerja sebagai {sumber_penghasilan} dengan rata-rata penghasilan per bulan sebesar Rp {nominal_penghasilan}. Surat Keterangan ini dibuat untuk keperluan: {keperluan}.",
  },
  {
    filename: "SURAT_AHLI_WARIS.docx",
    title: "Surat Keterangan Ahli Waris",
    extraFields: [
      { key: "{nama_pewaris}", label: "Nama Pewaris" },
      { key: "{tanggal_meninggal}", label: "Tanggal Meninggal Pewaris" },
      { key: "{jumlah_ahli_waris}", label: "Jumlah Ahli Waris" },
    ],
    body: "Menerangkan dengan sebenarnya bahwa yang bersangkutan bersama keluarga terdaftar adalah ahli waris sah dari Almarhum/ah {nama_pewaris} yang meninggal pada {tanggal_meninggal}, dengan total ahli waris sebanyak {jumlah_ahli_waris} orang.",
  },
  {
    filename: "SURAT_PENGANTAR_NIKAH.docx",
    title: "Surat Pengantar Nikah",
    extraFields: [
      { key: "{nama_pasangan}", label: "Nama Calon Pasangan" },
      { key: "{nik_pasangan}", label: "NIK Calon Pasangan" },
      { key: "{tempat_nikah}", label: "Rencana Tempat Nikah" },
    ],
    body: "Menerangkan bahwa yang bersangkutan adalah warga Desa Klitih yang bermaksud melangsungkan pernikahan dengan {nama_pasangan} (NIK: {nik_pasangan}) di {tempat_nikah}. Surat pengantar ini dibuat untuk persyaratan pendaftaran di KUA.",
  },
  {
    filename: "SURAT_KEPEMILIKAN_TANAH.docx",
    title: "Surat Keterangan Kepemilikan Tanah",
    extraFields: [
      { key: "{nomor_sertifikat}", label: "No. Sertifikat / Petok D" },
      { key: "{luas_tanah}", label: "Luas Tanah" },
      { key: "{alamat_tanah}", label: "Lokasi Tanah" },
    ],
    body: "Menerangkan bahwa bidang tanah dengan No. Sertifikat/Petok {nomor_sertifikat} seluas {luas_tanah} m² yang terletak di {alamat_tanah} adalah benar dikuasai dan dimiliki oleh yang bersangkutan serta tidak dalam sengketa.",
  },
  {
    filename: "SURAT_PENGANTAR_SKCK.docx",
    title: "Surat Pengantar SKCK",
    extraFields: [{ key: "{keperluan}", label: "Keperluan SKCK" }],
    body: "Menerangkan bahwa sepanjang pengetahuan kami yang bersangkutan berkelakuan baik, tidak pernah tersangkut perkara pidana, dan surat pengantar ini diberikan untuk pengurusan SKCK di kepolisian untuk keperluan: {keperluan}.",
  },
];

async function main() {
  console.log("Re-generating 12 official DOCX templates WITH LOGO for Desa Klitih...");
  for (const def of TEMPLATE_DEFINITIONS) {
    const doc = createTemplateDoc(def.title, def.extraFields, def.body);
    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(OUTPUT_DIR, def.filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Generated with Logo: ${def.filename}`);
  }
  console.log("All templates WITH LOGO successfully updated in public/templates!");
}

main().catch(console.error);

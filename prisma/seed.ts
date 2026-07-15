import { PrismaClient, JenisSurat, StatusSurat } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database SIPAS...");

  // Hapus data lama
  await prisma.surat.deleteMany();

  // Seed surat PENDING
  await prisma.surat.create({
    data: {
      nik: "3502010101010001",
      nama_lengkap: "Budi Santoso",
      no_whatsapp: "081234567890",
      jenis_surat: JenisSurat.SKTM,
      data_kustom: { keperluan: "Beasiswa pendidikan anak" },
      url_berkas_syarat: null,
      status: StatusSurat.PENDING,
    },
  });

  await prisma.surat.create({
    data: {
      nik: "3502010101010002",
      nama_lengkap: "Siti Rahayu",
      no_whatsapp: "081234567891",
      jenis_surat: JenisSurat.SURAT_DOMISILI,
      data_kustom: { tujuan_surat: "Pembuatan SKCK Kepolisian" },
      url_berkas_syarat: null,
      status: StatusSurat.PENDING,
    },
  });

  // Seed surat APPROVED
  await prisma.surat.create({
    data: {
      nik: "3502010101010003",
      nama_lengkap: "Ahmad Fauzi",
      no_whatsapp: "081234567892",
      jenis_surat: JenisSurat.SURAT_KETERANGAN_USAHA,
      data_kustom: {
        nama_usaha: "Toko Sembako Makmur",
        jenis_usaha: "Perdagangan Sembako",
        alamat_usaha: "Jl. Desa Pojok Klitih No. 15",
      },
      url_berkas_syarat: null,
      status: StatusSurat.APPROVED,
    },
  });

  // Seed surat REJECTED
  await prisma.surat.create({
    data: {
      nik: "3502010101010004",
      nama_lengkap: "Dewi Lestari",
      no_whatsapp: "081234567893",
      jenis_surat: JenisSurat.SURAT_KEMATIAN,
      data_kustom: {
        nama_almarhum: "Pak Harto",
        tanggal_meninggal: "2024-01-15",
        tempat_meninggal: "RS Dr. Soetomo Surabaya",
      },
      url_berkas_syarat: null,
      status: StatusSurat.REJECTED,
      alasan_penolakan: "Foto KTP pemohon tidak jelas/buram. Mohon upload ulang dengan foto yang lebih terang.",
    },
  });

  // Seed surat ke-2 untuk NIK yang sama (Budi Santoso) agar cek status ada hasilnya
  await prisma.surat.create({
    data: {
      nik: "3502010101010001",
      nama_lengkap: "Budi Santoso",
      no_whatsapp: "081234567890",
      jenis_surat: JenisSurat.SURAT_DOMISILI,
      data_kustom: { tujuan_surat: "Melamar pekerjaan" },
      url_berkas_syarat: null,
      status: StatusSurat.APPROVED,
    },
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

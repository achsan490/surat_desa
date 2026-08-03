import { JenisSurat, StatusSurat } from "@prisma/client";

export type { JenisSurat, StatusSurat };

export interface SuratWithId {
  id: string;
  nik: string;
  nama_lengkap: string;
  no_whatsapp: string;
  jenis_surat: JenisSurat;
  data_kustom: Record<string, string>;
  url_berkas_syarat: string | null;
  status: StatusSurat;
  alasan_penolakan: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

// Konfigurasi field dinamis per jenis surat (Fokus 4 Template Utama)
export const JENIS_SURAT_CONFIG = {
  SURAT_PENGANTAR_NIKAH: {
    label: "Formulir Surat Pengantar Nikah (Model N1)",
    description: "Surat pengantar rekomendasi nikah (N1) resmi Desa Klitih",
    fields: [
      // Data Calon Pengantin / Pemohon
      {
        name: "jenis_kelamin",
        label: "Jenis Kelamin Pemohon",
        type: "select" as const,
        options: ["Laki-laki", "Perempuan"],
        placeholder: "Pilih Jenis Kelamin",
        required: true,
      },
      {
        name: "tempat_lahir",
        label: "Tempat Lahir Pemohon",
        type: "text" as const,
        placeholder: "Contoh: Jombang",
        required: true,
      },
      {
        name: "tanggal_lahir",
        label: "Tanggal Lahir Pemohon",
        type: "date" as const,
        placeholder: "",
        required: true,
      },
      {
        name: "umur",
        label: "Umur Pemohon (Tahun)",
        type: "text" as const,
        placeholder: "Contoh: 22",
        required: true,
      },
      {
        name: "kewarganegaraan",
        label: "Kewarganegaraan Pemohon",
        type: "text" as const,
        placeholder: "Indonesia",
        required: true,
      },
      {
        name: "agama",
        label: "Agama Pemohon",
        type: "text" as const,
        placeholder: "Islam",
        required: true,
      },
      {
        name: "pekerjaan",
        label: "Pekerjaan Pemohon",
        type: "text" as const,
        placeholder: "Contoh: Karyawan Swasta",
        required: true,
      },
      {
        name: "pendidikan_terakhir",
        label: "Pendidikan Terakhir Pemohon",
        type: "text" as const,
        placeholder: "Contoh: SLTA, S1",
        required: true,
      },
      {
        name: "alamat",
        label: "Alamat Lengkap Pemohon",
        type: "textarea" as const,
        placeholder: "Contoh: Dsn. Pojok RT/RW 004/003 Ds. Klitih Kec. Plandaan",
        required: true,
      },
      {
        name: "status_pernikahan",
        label: "Status Pernikahan Pemohon",
        type: "text" as const,
        placeholder: "Contoh: Perawan / Jejaka / Duda / Janda",
        required: true,
      },
      {
        name: "nama_istri_suami_terdahulu",
        label: "Nama Istri/Suami Terdahulu (Isi '-' jika tidak ada)",
        type: "text" as const,
        placeholder: "-",
        required: false,
      },

      // Data Ayah Kandung
      {
        name: "nama_ayah",
        label: "Nama Lengkap Ayah Kandung",
        type: "text" as const,
        placeholder: "Nama lengkap ayah kandung",
        required: true,
      },
      {
        name: "nik_ayah",
        label: "NIK Ayah Kandung",
        type: "text" as const,
        placeholder: "16 digit NIK Ayah",
        required: true,
      },
      {
        name: "ttl_ayah",
        label: "Tempat & Tanggal Lahir Ayah",
        type: "text" as const,
        placeholder: "Contoh: Jombang, 27 Maret 1978",
        required: true,
      },
      {
        name: "kewarganegaraan_ayah",
        label: "Kewarganegaraan Ayah",
        type: "text" as const,
        placeholder: "Indonesia",
        required: true,
      },
      {
        name: "agama_ayah",
        label: "Agama Ayah",
        type: "text" as const,
        placeholder: "Islam",
        required: true,
      },
      {
        name: "pekerjaan_ayah",
        label: "Pekerjaan Ayah",
        type: "text" as const,
        placeholder: "Contoh: Petani",
        required: true,
      },
      {
        name: "alamat_ayah",
        label: "Alamat Ayah Kandung",
        type: "textarea" as const,
        placeholder: "Alamat lengkap Ayah",
        required: true,
      },

      // Data Ibu Kandung
      {
        name: "nama_ibu",
        label: "Nama Lengkap Ibu Kandung",
        type: "text" as const,
        placeholder: "Nama lengkap ibu kandung",
        required: true,
      },
      {
        name: "nik_ibu",
        label: "NIK Ibu Kandung",
        type: "text" as const,
        placeholder: "16 digit NIK Ibu",
        required: true,
      },
      {
        name: "ttl_ibu",
        label: "Tempat & Tanggal Lahir Ibu",
        type: "text" as const,
        placeholder: "Contoh: Jombang, 10 April 1980",
        required: true,
      },
      {
        name: "kewarganegaraan_ibu",
        label: "Kewarganegaraan Ibu",
        type: "text" as const,
        placeholder: "Indonesia",
        required: true,
      },
      {
        name: "agama_ibu",
        label: "Agama Ibu",
        type: "text" as const,
        placeholder: "Islam",
        required: true,
      },
      {
        name: "pekerjaan_ibu",
        label: "Pekerjaan Ibu",
        type: "text" as const,
        placeholder: "Contoh: Karyawan Swasta",
        required: true,
      },
      {
        name: "alamat_ibu",
        label: "Alamat Ibu Kandung",
        type: "textarea" as const,
        placeholder: "Alamat lengkap Ibu",
        required: true,
      },
    ],
  },

  SURAT_PENGANTAR_SKCK: {
    label: "Surat Keterangan Catatan Kepolisian (SKCK)",
    description: "Surat keterangan pengantar SKCK resmi Desa Klitih",
    fields: [
      {
        name: "tempat_lahir",
        label: "Tempat Lahir",
        type: "text" as const,
        placeholder: "Contoh: Jombang",
        required: true,
      },
      {
        name: "tanggal_lahir",
        label: "Tanggal Lahir",
        type: "date" as const,
        placeholder: "",
        required: true,
      },
      {
        name: "jenis_kelamin",
        label: "Jenis Kelamin",
        type: "select" as const,
        options: ["Laki-laki", "Perempuan"],
        placeholder: "Pilih Jenis Kelamin",
        required: true,
      },
      {
        name: "kewarganegaraan",
        label: "Kewarganegaraan",
        type: "text" as const,
        placeholder: "Indonesia",
        required: true,
      },
      {
        name: "agama",
        label: "Agama",
        type: "text" as const,
        placeholder: "Islam",
        required: true,
      },
      {
        name: "pekerjaan",
        label: "Pekerjaan",
        type: "text" as const,
        placeholder: "Contoh: Swasta, Petani, Belum Bekerja",
        required: true,
      },
      {
        name: "status_pernikahan",
        label: "Status Pernikahan",
        type: "text" as const,
        placeholder: "Contoh: Belum Kawin / Kawin / Duda / Janda",
        required: true,
      },
      {
        name: "alamat",
        label: "Alamat Lengkap",
        type: "textarea" as const,
        placeholder: "Contoh: Dsn. Klitih RT/RW 005/008 Ds. Klitih Kec. Plandaan",
        required: true,
      },
      {
        name: "keperluan",
        label: "Keperluan Administrasi SKCK",
        type: "text" as const,
        placeholder: "Contoh: PERSYARATAN MELAMAR PEKERJAAN",
        required: true,
      },
    ],
  },

  SURAT_DOMISILI: {
    label: "Surat Keterangan Domisili",
    description: "Surat keterangan tempat tinggal / domisili lembaga resmi",
    fields: [
      {
        name: "nama_lembaga",
        label: "Nama Lembaga / Pemohon Domisili",
        type: "text" as const,
        placeholder: "Contoh: PEMERINTAH DESA KLITIH atau nama perorangan",
        required: true,
      },
      {
        name: "tempat_domisili",
        label: "Tempat / Alamat Lengkap Domisili",
        type: "textarea" as const,
        placeholder: "Contoh: Jl. Raya Klitih No.07 Desa Klitih Kecamatan Plandaan Kabupaten Jombang",
        required: true,
      },
      {
        name: "keperluan",
        label: "Keperluan Surat Domisili (Opsional)",
        type: "text" as const,
        placeholder: "Contoh: Kelengkapan berkas administrasi",
        required: false,
      },
    ],
  },

  SURAT_KETERANGAN_USAHA: {
    label: "Surat Keterangan Kepemilikan Usaha (SKU)",
    description: "Surat keterangan kepemilikan usaha resmi warga Desa Klitih",
    fields: [
      {
        name: "tempat_lahir",
        label: "Tempat Lahir",
        type: "text" as const,
        placeholder: "Contoh: Jombang",
        required: true,
      },
      {
        name: "tanggal_lahir",
        label: "Tanggal Lahir",
        type: "date" as const,
        placeholder: "",
        required: true,
      },
      {
        name: "jenis_kelamin",
        label: "Jenis Kelamin",
        type: "select" as const,
        options: ["Laki-laki", "Perempuan"],
        placeholder: "Pilih Jenis Kelamin",
        required: true,
      },
      {
        name: "agama",
        label: "Agama",
        type: "text" as const,
        placeholder: "Islam",
        required: true,
      },
      {
        name: "pekerjaan",
        label: "Pekerjaan Pemohon",
        type: "text" as const,
        placeholder: "Contoh: Mengurus Rumah Tangga / Petani",
        required: true,
      },
      {
        name: "alamat",
        label: "Alamat Tempat Tinggal",
        type: "textarea" as const,
        placeholder: "Contoh: Dsn. Waturupit RT/RW 001/006 Ds. Klitih Kec. Plandaan",
        required: true,
      },
      {
        name: "bidang_usaha",
        label: "Usaha di Bidang",
        type: "text" as const,
        placeholder: "Contoh: Pertanian, Perdagangan Sembako, Peternakan",
        required: true,
      },
      {
        name: "keperluan",
        label: "Keperluan / Persyaratan Pengajuan",
        type: "text" as const,
        placeholder: "Contoh: persyaratan pengajuan pinjaman ke BRI UNIT PLANDAAN KANCA JOMBANG",
        required: true,
      },
    ],
  },
} as const;

export type JenisSuratKey = keyof typeof JENIS_SURAT_CONFIG;

export const STATUS_LABELS: Record<StatusSurat, string> = {
  PENDING: "Menunggu Verifikasi",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

export const STATUS_COLORS: Record<StatusSurat, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

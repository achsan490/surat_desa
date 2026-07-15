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

// Konfigurasi field dinamis per jenis surat
export const JENIS_SURAT_CONFIG = {
  SKTM: {
    label: "Surat Keterangan Tidak Mampu (SKTM)",
    description: "Surat keterangan untuk keperluan sosial dan pendidikan",
    fields: [
      {
        name: "keperluan",
        label: "Keperluan Surat",
        type: "textarea" as const,
        placeholder: "Contoh: Beasiswa pendidikan anak, pengobatan gratis, dll.",
        required: true,
      },
    ],
  },
  SURAT_KEMATIAN: {
    label: "Surat Keterangan Kematian",
    description: "Surat keterangan resmi desa untuk pelaporan kematian warga",
    fields: [
      {
        name: "nama_almarhum",
        label: "Nama Almarhum/Almarhumah",
        type: "text" as const,
        placeholder: "Nama lengkap almarhum/almarhumah",
        required: true,
      },
      {
        name: "tanggal_meninggal",
        label: "Tanggal Meninggal",
        type: "date" as const,
        placeholder: "",
        required: true,
      },
      {
        name: "tempat_meninggal",
        label: "Tempat Meninggal",
        type: "text" as const,
        placeholder: "Contoh: RS Dr. Soetomo Surabaya, Rumah kediaman",
        required: true,
      },
    ],
  },
  SURAT_DOMISILI: {
    label: "Surat Keterangan Domisili",
    description: "Surat keterangan tempat tinggal resmi warga desa",
    fields: [
      {
        name: "tujuan_surat",
        label: "Tujuan / Keperluan Surat",
        type: "text" as const,
        placeholder: "Contoh: Pembuatan SKCK, melamar pekerjaan, perbankan",
        required: true,
      },
    ],
  },
  SURAT_KETERANGAN_USAHA: {
    label: "Surat Keterangan Usaha (SKU)",
    description: "Surat keterangan untuk keperluan legalitas usaha kecil",
    fields: [
      {
        name: "nama_usaha",
        label: "Nama Usaha",
        type: "text" as const,
        placeholder: "Contoh: Toko Sembako Makmur",
        required: true,
      },
      {
        name: "jenis_usaha",
        label: "Jenis Usaha",
        type: "text" as const,
        placeholder: "Contoh: Perdagangan sembako, warung makan, bengkel",
        required: true,
      },
      {
        name: "alamat_usaha",
        label: "Alamat Usaha",
        type: "textarea" as const,
        placeholder: "Alamat lengkap tempat usaha",
        required: true,
      },
    ],
  },
  SURAT_BELUM_MENIKAH: {
    label: "Surat Keterangan Belum Menikah",
    description: "Surat keterangan yang menerangkan status belum pernah menikah",
    fields: [
      {
        name: "keperluan",
        label: "Keperluan Surat",
        type: "text" as const,
        placeholder: "Contoh: Melamar pekerjaan, persyaratan beasiswa, dll.",
        required: true,
      },
    ],
  },
  SURAT_KELAHIRAN: {
    label: "Surat Keterangan Kelahiran",
    description: "Surat keterangan untuk pelaporan kelahiran anak/warga baru",
    fields: [
      {
        name: "nama_bayi",
        label: "Nama Bayi",
        type: "text" as const,
        placeholder: "Nama lengkap bayi",
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
        name: "tempat_lahir",
        label: "Tempat Lahir",
        type: "text" as const,
        placeholder: "Contoh: Jombang, RSUD Jombang",
        required: true,
      },
      {
        name: "nama_ayah",
        label: "Nama Ayah",
        type: "text" as const,
        placeholder: "Nama lengkap ayah kandung",
        required: true,
      },
      {
        name: "nama_ibu",
        label: "Nama Ibu",
        type: "text" as const,
        placeholder: "Nama lengkap ibu kandung",
        required: true,
      },
    ],
  },
  SURAT_PINDAH: {
    label: "Surat Keterangan Pindah",
    description: "Surat keterangan pindah domisili penduduk keluar desa",
    fields: [
      {
        name: "alamat_asal",
        label: "Alamat Asal",
        type: "textarea" as const,
        placeholder: "Alamat lengkap asal sebelum pindah",
        required: true,
      },
      {
        name: "alamat_tujuan",
        label: "Alamat Tujuan",
        type: "textarea" as const,
        placeholder: "Alamat lengkap daerah tujuan pindah",
        required: true,
      },
      {
        name: "alasan_pindah",
        label: "Alasan Pindah",
        type: "text" as const,
        placeholder: "Contoh: Pekerjaan, ikut keluarga, dll.",
        required: true,
      },
      {
        name: "jumlah_pengikut",
        label: "Jumlah Pengikut Pindah (Jiwa)",
        type: "text" as const,
        placeholder: "Contoh: 3 orang (istri dan 2 anak)",
        required: true,
      },
    ],
  },
  SURAT_PENGHASILAN: {
    label: "Surat Keterangan Penghasilan",
    description: "Surat keterangan rincian penghasilan bulanan warga",
    fields: [
      {
        name: "nominal_penghasilan",
        label: "Nominal Penghasilan per Bulan (Rp)",
        type: "text" as const,
        placeholder: "Contoh: 2.500.000",
        required: true,
      },
      {
        name: "sumber_penghasilan",
        label: "Pekerjaan / Sumber Penghasilan",
        type: "text" as const,
        placeholder: "Contoh: Buruh harian lepas, Petani, dll.",
        required: true,
      },
      {
        name: "keperluan",
        label: "Keperluan Surat",
        type: "text" as const,
        placeholder: "Contoh: Pengajuan kredit bank, beasiswa anak, dll.",
        required: true,
      },
    ],
  },
  SURAT_AHLI_WARIS: {
    label: "Surat Keterangan Ahli Waris",
    description: "Surat keterangan resmi ahli waris dari pewaris yang meninggal",
    fields: [
      {
        name: "nama_pewaris",
        label: "Nama Pewaris (Almarhum/ah)",
        type: "text" as const,
        placeholder: "Nama lengkap pewaris yang telah meninggal",
        required: true,
      },
      {
        name: "tanggal_meninggal",
        label: "Tanggal Meninggal Pewaris",
        type: "date" as const,
        placeholder: "",
        required: true,
      },
      {
        name: "jumlah_ahli_waris",
        label: "Jumlah Ahli Waris (Jiwa)",
        type: "text" as const,
        placeholder: "Contoh: 4 orang (1 istri dan 3 anak)",
        required: true,
      },
    ],
  },
  SURAT_PENGANTAR_NIKAH: {
    label: "Surat Pengantar Nikah",
    description: "Surat pengantar rekomendasi nikah (N1-N4) dari desa",
    fields: [
      {
        name: "nama_pasangan",
        label: "Nama Calon Pasangan",
        type: "text" as const,
        placeholder: "Nama lengkap calon pasangan (suami/istri)",
        required: true,
      },
      {
        name: "nik_pasangan",
        label: "NIK Calon Pasangan",
        type: "text" as const,
        placeholder: "16 digit NIK calon pasangan",
        required: true,
      },
      {
        name: "tempat_nikah",
        label: "Rencana Tempat Akad Nikah",
        type: "text" as const,
        placeholder: "Contoh: KUA Kecamatan Plandaan, Jombang",
        required: true,
      },
    ],
  },
  SURAT_KEPEMILIKAN_TANAH: {
    label: "Surat Keterangan Kepemilikan Tanah",
    description: "Surat keterangan penguasaan fisik bidang tanah milik warga",
    fields: [
      {
        name: "nomor_sertifikat",
        label: "Nomor Sertifikat / Girik / Petok D",
        type: "text" as const,
        placeholder: "Contoh: Sertifikat No. 1234 atau Petok D No. 56",
        required: true,
      },
      {
        name: "luas_tanah",
        label: "Luas Bidang Tanah (m²)",
        type: "text" as const,
        placeholder: "Contoh: 450 m²",
        required: true,
      },
      {
        name: "alamat_tanah",
        label: "Alamat / Lokasi Bidang Tanah",
        type: "textarea" as const,
        placeholder: "Alamat lengkap letak bidang tanah berada",
        required: true,
      },
    ],
  },
  SURAT_PENGANTAR_SKCK: {
    label: "Surat Pengantar SKCK",
    description: "Surat pengantar dari desa untuk pengurusan SKCK di Polsek/Polres",
    fields: [
      {
        name: "keperluan",
        label: "Keperluan SKCK",
        type: "text" as const,
        placeholder: "Contoh: Melamar pekerjaan di BUMN, mendaftar TNI/POLRI",
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

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export interface PengaturanDesa {
  nama_kades: string;
  jabatan_kades: string;
  url_ttd: string;
  url_stempel: string;
}

const DEFAULT_PENGATURAN: PengaturanDesa = {
  nama_kades: "Siti Ro'aini",
  jabatan_kades: "Kepala Desa Klitih",
  url_ttd: "/assets/tanda-tangan-kades.png",
  url_stempel: "/assets/stempel-desa.png",
};

/**
 * Ambil konfigurasi desa dari database, fallback ke default jika belum diset.
 */
export async function getPengaturanDesa(): Promise<ActionResult<PengaturanDesa>> {
  try {
    const list = await prisma.pengaturan.findMany();
    const map = new Map<string, string>();
    list.forEach((item) => map.set(item.key, item.value));

    const rawTtd = map.get("url_ttd");
    const rawStempel = map.get("url_stempel");

    return {
      success: true,
      data: {
        nama_kades: map.get("nama_kades") || DEFAULT_PENGATURAN.nama_kades,
        jabatan_kades: map.get("jabatan_kades") || DEFAULT_PENGATURAN.jabatan_kades,
        url_ttd: rawTtd !== undefined ? (rawTtd === "none" ? "" : rawTtd) : DEFAULT_PENGATURAN.url_ttd,
        url_stempel: rawStempel !== undefined ? (rawStempel === "none" ? "" : rawStempel) : DEFAULT_PENGATURAN.url_stempel,
      },
    };
  } catch (error) {
    console.error("[getPengaturanDesa] Error:", error);
    return {
      success: true,
      data: DEFAULT_PENGATURAN,
    };
  }
}

/**
 * Update pengaturan desa (Nama, Jabatan, TTD, Stempel)
 */
export async function updatePengaturanDesa(
  data: Partial<PengaturanDesa>
): Promise<ActionResult> {
  try {
    const entries = Object.entries(data);

    for (const [key, value] of entries) {
      if (value !== undefined && value !== null) {
        const valueToSave = (key === "url_ttd" || key === "url_stempel") && value === "" ? "none" : value;
        await prisma.pengaturan.upsert({
          where: { key },
          update: { value: valueToSave },
          create: { key, value: valueToSave },
        });
      }
    }

    revalidatePath("/admin/dashboard/pengaturan");
    revalidatePath("/admin/dashboard");
    return { success: true, data: undefined, message: "Pengaturan berhasil diperbarui!" };
  } catch (error) {
    console.error("[updatePengaturanDesa] Error:", error);
    return { success: false, error: "Gagal menyimpan pengaturan. Silakan coba lagi." };
  }
}

// ─── Template Surat ────────────────────────────────────────────────────────────

export interface TemplateSuratMap {
  [jenisSurat: string]: string; // key: JenisSuratKey, value: url file
}

/**
 * Ambil semua template surat yang sudah diunggah (key prefix "template_")
 */
export async function getTemplateSurat(): Promise<ActionResult<TemplateSuratMap>> {
  try {
    const list = await prisma.pengaturan.findMany({
      where: { key: { startsWith: "template_" } },
    });

    const map: TemplateSuratMap = {};
    list.forEach((item) => {
      const jenisSurat = item.key.replace("template_", "");
      map[jenisSurat] = item.value;
    });

    return { success: true, data: map };
  } catch (error) {
    console.error("[getTemplateSurat] Error:", error);
    return { success: false, error: "Gagal mengambil data template surat." };
  }
}

/**
 * Simpan / update URL template untuk satu jenis surat
 */
export async function updateTemplateSurat(
  jenisSurat: string,
  url: string
): Promise<ActionResult> {
  try {
    const key = `template_${jenisSurat}`;
    await prisma.pengaturan.upsert({
      where: { key },
      update: { value: url },
      create: { key, value: url },
    });

    revalidatePath("/admin/dashboard/pengaturan");
    return { success: true, data: undefined, message: "Template berhasil disimpan." };
  } catch (error) {
    console.error("[updateTemplateSurat] Error:", error);
    return { success: false, error: "Gagal menyimpan template. Silakan coba lagi." };
  }
}

/**
 * Hapus URL template untuk satu jenis surat dari database
 */
export async function deleteTemplateSurat(jenisSurat: string): Promise<ActionResult> {
  try {
    const key = `template_${jenisSurat}`;
    await prisma.pengaturan.deleteMany({ where: { key } });

    revalidatePath("/admin/dashboard/pengaturan");
    return { success: true, data: undefined, message: "Template berhasil dihapus." };
  } catch (error) {
    console.error("[deleteTemplateSurat] Error:", error);
    return { success: false, error: "Gagal menghapus template. Silakan coba lagi." };
  }
}

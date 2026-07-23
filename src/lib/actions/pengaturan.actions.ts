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

    return {
      success: true,
      data: {
        nama_kades: map.get("nama_kades") || DEFAULT_PENGATURAN.nama_kades,
        jabatan_kades: map.get("jabatan_kades") || DEFAULT_PENGATURAN.jabatan_kades,
        url_ttd: map.get("url_ttd") || DEFAULT_PENGATURAN.url_ttd,
        url_stempel: map.get("url_stempel") || DEFAULT_PENGATURAN.url_stempel,
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
        await prisma.pengaturan.upsert({
          where: { key },
          update: { value },
          create: { key, value },
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

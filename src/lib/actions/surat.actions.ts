"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { JenisSurat, StatusSurat } from "@prisma/client";
import type { ActionResult, DashboardStats, SuratWithId } from "@/types";
import { suratBaseSchema, rejectSchema } from "@/lib/validators/surat.schema";

// ────────────────────────────────────────────────
// WARGA: Buat pengajuan surat baru
// ────────────────────────────────────────────────
export async function createSurat(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const rawData = {
      nik: formData.get("nik") as string,
      nama_lengkap: formData.get("nama_lengkap") as string,
      no_whatsapp: formData.get("no_whatsapp") as string,
      jenis_surat: formData.get("jenis_surat") as string,
      data_kustom: JSON.parse((formData.get("data_kustom") as string) ?? "{}"),
    };

    const validated = suratBaseSchema.safeParse(rawData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Data tidak valid";
      return { success: false, error: firstError };
    }

    const url_berkas_syarat = formData.get("url_berkas_syarat") as string | null;

    const surat = await prisma.surat.create({
      data: {
        nik: validated.data.nik,
        nama_lengkap: validated.data.nama_lengkap,
        no_whatsapp: validated.data.no_whatsapp,
        jenis_surat: validated.data.jenis_surat as JenisSurat,
        data_kustom: validated.data.data_kustom as any,
        url_berkas_syarat: url_berkas_syarat ?? null,
        status: StatusSurat.PENDING,
      },
    });

    return { success: true, data: { id: surat.id } };
  } catch (error) {
    console.error("[createSurat] Error:", error);
    return { success: false, error: "Terjadi kesalahan server. Silakan coba lagi." };
  }
}

// ────────────────────────────────────────────────
// WARGA: Cek status surat berdasarkan NIK
// ────────────────────────────────────────────────
export async function getSuratByNIK(nik: string): Promise<ActionResult<SuratWithId[]>> {
  try {
    if (!nik || nik.length !== 16) {
      return { success: false, error: "NIK harus 16 digit" };
    }

    const suratList = await prisma.surat.findMany({
      where: { nik },
      orderBy: { created_at: "desc" },
    });

    return {
      success: true,
      data: suratList.map((s) => ({
        ...s,
        data_kustom: s.data_kustom as Record<string, string>,
      })),
    };
  } catch (error) {
    console.error("[getSuratByNIK] Error:", error);
    return { success: false, error: "Gagal mengambil data. Silakan coba lagi." };
  }
}

// ────────────────────────────────────────────────
// ADMIN: Ambil semua surat dengan filter & statistik
// ────────────────────────────────────────────────
export async function getAllSuratAdmin(
  filter: { status?: StatusSurat; jenis_surat?: JenisSurat } = {}
): Promise<ActionResult<{ suratList: SuratWithId[]; stats: DashboardStats }>> {
  try {
    const [suratList, stats] = await Promise.all([
      prisma.surat.findMany({
        where: {
          ...(filter.status ? { status: filter.status } : {}),
          ...(filter.jenis_surat ? { jenis_surat: filter.jenis_surat } : {}),
        },
        orderBy: { created_at: "desc" },
        take: 100,
      }),
      prisma.surat.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    const statsMap = stats.reduce(
      (acc, s) => {
        acc[s.status] = s._count.id;
        return acc;
      },
      {} as Record<StatusSurat, number>
    );

    const dashboardStats: DashboardStats = {
      total: (statsMap.PENDING ?? 0) + (statsMap.APPROVED ?? 0) + (statsMap.REJECTED ?? 0),
      pending: statsMap.PENDING ?? 0,
      approved: statsMap.APPROVED ?? 0,
      rejected: statsMap.REJECTED ?? 0,
    };

    return {
      success: true,
      data: {
        suratList: suratList.map((s) => ({
          ...s,
          data_kustom: s.data_kustom as Record<string, string>,
        })),
        stats: dashboardStats,
      },
    };
  } catch (error) {
    console.error("[getAllSuratAdmin] Error:", error);
    return { success: false, error: "Gagal mengambil data dashboard." };
  }
}

// ────────────────────────────────────────────────
// ADMIN: Ambil satu surat berdasarkan ID
// ────────────────────────────────────────────────
export async function getSuratById(id: string): Promise<ActionResult<SuratWithId>> {
  try {
    const surat = await prisma.surat.findUnique({ where: { id } });

    if (!surat) {
      return { success: false, error: "Surat tidak ditemukan." };
    }

    return {
      success: true,
      data: {
        ...surat,
        data_kustom: surat.data_kustom as Record<string, string>,
      },
    };
  } catch (error) {
    console.error("[getSuratById] Error:", error);
    return { success: false, error: "Gagal mengambil detail surat." };
  }
}

// ────────────────────────────────────────────────
// ADMIN: Setujui surat → status APPROVED
// ────────────────────────────────────────────────
export async function approveSurat(id: string): Promise<ActionResult> {
  try {
    const surat = await prisma.surat.findUnique({ where: { id } });
    if (!surat) return { success: false, error: "Surat tidak ditemukan." };
    if (surat.status !== StatusSurat.PENDING) {
      return { success: false, error: "Surat ini sudah diproses sebelumnya." };
    }

    await prisma.surat.update({
      where: { id },
      data: {
        status: StatusSurat.APPROVED,
        alasan_penolakan: null,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/dashboard/surat/${id}`);
    return { success: true, data: undefined, message: "Surat berhasil disetujui." };
  } catch (error) {
    console.error("[approveSurat] Error:", error);
    return { success: false, error: "Gagal menyetujui surat. Silakan coba lagi." };
  }
}

// ────────────────────────────────────────────────
// ADMIN: Tolak surat → status REJECTED + alasan
// ────────────────────────────────────────────────
export async function rejectSurat(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const raw = { alasan_penolakan: formData.get("alasan_penolakan") as string };
    const validated = rejectSchema.safeParse(raw);

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message ?? "Alasan tidak valid." };
    }

    const surat = await prisma.surat.findUnique({ where: { id } });
    if (!surat) return { success: false, error: "Surat tidak ditemukan." };
    if (surat.status !== StatusSurat.PENDING) {
      return { success: false, error: "Surat ini sudah diproses sebelumnya." };
    }

    await prisma.surat.update({
      where: { id },
      data: {
        status: StatusSurat.REJECTED,
        alasan_penolakan: validated.data.alasan_penolakan,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/dashboard/surat/${id}`);
    return { success: true, data: undefined, message: "Surat berhasil ditolak." };
  } catch (error) {
    console.error("[rejectSurat] Error:", error);
    return { success: false, error: "Gagal menolak surat. Silakan coba lagi." };
  }
}

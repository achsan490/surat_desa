import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSuratPDF } from "@/lib/pdf/generateSuratPDF";
import type { SuratWithId } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // ── Guard: ID harus ada
  if (!id) {
    return NextResponse.json(
      { error: "Parameter 'id' diperlukan." },
      { status: 400 }
    );
  }

  // ── Ambil data surat dari database
  const surat = await prisma.surat.findUnique({ where: { id } });

  if (!surat) {
    return NextResponse.json(
      { error: "Surat tidak ditemukan." },
      { status: 404 }
    );
  }

  // ── Guard Validasi Dua Arah: hanya surat APPROVED yang bisa diunduh
  if (surat.status !== "APPROVED") {
    return NextResponse.json(
      {
        error:
          "Akses ditolak. Surat hanya dapat diunduh setelah mendapat persetujuan dari perangkat desa.",
        status: surat.status,
      },
      { status: 403 }
    );
  }

  // ── Generate PDF
  try {
    const suratData: SuratWithId = {
      ...surat,
      data_kustom: surat.data_kustom as Record<string, string>,
    };

    const pdfBuffer = await generateSuratPDF(suratData);

    // Nama file yang aman
    const safeNama = surat.nama_lengkap.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Surat_${surat.jenis_surat}_${safeNama}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[generate-pdf] Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat file PDF. Silakan hubungi petugas desa." },
      { status: 500 }
    );
  }
}

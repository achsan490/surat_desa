import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSuratPDF } from "@/lib/pdf/generateSuratPDF";
import { generateFromTemplate } from "@/lib/pdf/generateFromTemplate";
import type { SuratWithId } from "@/types";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

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

  // ── Guard: hanya surat APPROVED yang bisa diunduh
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

  const suratData: SuratWithId = {
    ...surat,
    data_kustom: surat.data_kustom as Record<string, string>,
  };

  const safeNama = surat.nama_lengkap.replace(/[^a-zA-Z0-9]/g, "_");

  // ── 1. Coba generate dari template yang diupload admin ──────────────────
  try {
    const templateResult = await generateFromTemplate(suratData);

    if (templateResult) {
      const { buffer, ext } = templateResult;
      const contentType = ext === "docx" ? DOCX_MIME : "application/pdf";
      const filename = `Surat_${surat.jenis_surat}_${safeNama}.${ext}`;

      console.log(`[generate-pdf] Menggunakan template: ${surat.jenis_surat}.${ext}`);

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "no-store",
        },
      });
    }
  } catch (templateErr) {
    // Template error → lanjut ke fallback PDFKit
    console.warn("[generate-pdf] Template error, fallback ke PDFKit:", templateErr);
  }

  // ── 2. Fallback: Generate PDF dengan PDFKit (template universal) ─────────
  try {
    const pdfBuffer = await generateSuratPDF(suratData);
    const filename = `Surat_${surat.jenis_surat}_${safeNama}.pdf`;

    console.log(`[generate-pdf] Fallback PDFKit untuk: ${surat.jenis_surat}`);

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
    console.error("[generate-pdf] Error PDFKit:", error);
    return NextResponse.json(
      { error: "Gagal membuat file surat. Silakan hubungi petugas desa." },
      { status: 500 }
    );
  }
}

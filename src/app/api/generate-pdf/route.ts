import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSuratPDF } from "@/lib/pdf/generateSuratPDF";
import { generateFromTemplate } from "@/lib/pdf/generateFromTemplate";
import type { SuratWithId } from "@/types";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const formatParam = searchParams.get("format");
  const isDownload = searchParams.get("download") === "true";

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

  // ── Guard: hanya surat APPROVED yang bisa diunduh/dipratinjau
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

  // ── 1. Jika pengguna meminta format DOCX secara khusus ────────────────────
  if (formatParam === "docx") {
    try {
      const templateResult = await generateFromTemplate(suratData);
      if (templateResult) {
        const { buffer, ext } = templateResult;
        const filename = `Surat_${surat.jenis_surat}_${safeNama}.${ext}`;

        return new NextResponse(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": DOCX_MIME,
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "no-store",
          },
        });
      }
    } catch (templateErr) {
      console.warn("[generate-pdf] Gagal generate DOCX template, fallback ke PDF:", templateErr);
    }
  }

  // ── 2. Default: PDF untuk Pratinjau Inline & Unduh PDF ───────────────────
  try {
    const pdfBuffer = await generateSuratPDF(suratData);
    const filename = `Surat_${surat.jenis_surat}_${safeNama}.pdf`;
    const dispositionType = isDownload ? "attachment" : "inline";

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${filename}"`,
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

import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { deleteTemplateSurat } from "@/lib/actions/pengaturan.actions";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const jenisSurat = body?.jenisSurat as string | undefined;

    if (!jenisSurat) {
      return NextResponse.json({ error: "Jenis surat tidak diketahui." }, { status: 400 });
    }

    // Coba hapus file dari disk (abaikan jika tidak ditemukan)
    const extensions = [".pdf", ".docx", ".doc"];
    for (const ext of extensions) {
      const filePath = path.join(process.cwd(), "public", "templates", `${jenisSurat}${ext}`);
      try {
        await unlink(filePath);
        break; // berhasil hapus salah satu
      } catch {
        // file tidak ada, lanjut cek ekstensi lain
      }
    }

    // Hapus dari database
    const dbResult = await deleteTemplateSurat(jenisSurat);
    if (!dbResult.success) {
      return NextResponse.json({ error: "Gagal menghapus data template dari database." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Template berhasil dihapus." });
  } catch (error) {
    console.error("[delete-template] Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus template. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

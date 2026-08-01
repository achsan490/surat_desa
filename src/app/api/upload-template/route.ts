import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { updateTemplateSurat } from "@/lib/actions/pengaturan.actions";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const ALLOWED_EXT_MAP: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const jenisSurat = formData.get("jenisSurat") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    if (!jenisSurat) {
      return NextResponse.json({ error: "Jenis surat tidak diketahui." }, { status: 400 });
    }

    // Validasi tipe file
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak diizinkan. Gunakan format DOCX atau PDF." },
        { status: 415 }
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10 MB." },
        { status: 413 }
      );
    }

    const ext = ALLOWED_EXT_MAP[file.type] ?? ".docx";
    const fileName = `${jenisSurat}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "templates");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/templates/${fileName}`;

    // Simpan URL ke database
    const dbResult = await updateTemplateSurat(jenisSurat, url);
    if (!dbResult.success) {
      return NextResponse.json({ error: "File berhasil diunggah namun gagal disimpan ke database." }, { status: 500 });
    }

    return NextResponse.json(
      { url, filename: fileName, jenisSurat },
      { status: 201 }
    );
  } catch (error) {
    console.error("[upload-template] Error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah template. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

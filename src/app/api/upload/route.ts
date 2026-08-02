import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    const mimeType = (file.type || "").toLowerCase();
    const isImage = mimeType.startsWith("image/") || /\.(jpg|jpeg|png|heic|heif|webp)$/i.test(file.name);
    const isPdf = mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    // Validasi tipe file
    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Tipe file tidak diizinkan. Gunakan foto JPG, PNG, WebP, atau dokumen PDF." },
        { status: 415 }
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar (maksimal 10 MB)." },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const rawExt = path.extname(file.name).toLowerCase();
    const ext = rawExt ? rawExt : isPdf ? ".pdf" : ".jpg";
    const uniqueName = `${uuidv4()}${ext}`;

    // Coba simpan ke sistem berkas lokal
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);

      return NextResponse.json(
        { url: `/uploads/${uniqueName}`, filename: uniqueName },
        { status: 201 }
      );
    } catch (fsErr) {
      console.warn("[upload] Storage lokal ditolak/read-only (lingkungan Vercel/Serverless), beralih ke Base64 Data URL:", fsErr);
      // Fallback otomatis untuk Vercel / Serverless (Read-only filesystem)
      const finalMime = mimeType || (isPdf ? "application/pdf" : "image/jpeg");
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${finalMime};base64,${base64Data}`;

      return NextResponse.json(
        { url: dataUrl, filename: uniqueName },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[upload] Error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

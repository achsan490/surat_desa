/**
 * injectPlaceholders.ts
 *
 * Script untuk menginjeksi placeholder {variable} ke dalam file DOCX
 * yang belum punya placeholder, dengan mengganti pola titik-titik (...) 
 * yang umum dipakai di template Word lama desa.
 *
 * Jalankan: node -r ts-node/register src/scripts/injectPlaceholders.ts
 */

import path from "path";
import fs from "fs";

async function main() {
  const PizZip = (await import("pizzip")).default;
  const Docxtemplater = (await import("docxtemplater")).default;

  const templatePath = path.join(process.cwd(), "public", "templates", "SKTM.docx");
  if (!fs.existsSync(templatePath)) {
    console.error("File tidak ditemukan:", templatePath);
    process.exit(1);
  }

  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);

  let xml = zip.files["word/document.xml"].asText();

  // Log sebelum
  const textBefore = xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  console.log("Text sebelum:", textBefore.substring(0, 500));

  // Ganti pola titik-titik setelah label dengan placeholder
  // Contoh: "Nama :..................................." -> "Nama : {nama_lengkap}"
  const replacements: [RegExp, string][] = [
    [/Nama\s*:\s*\.{5,}/gi, "Nama                          : {nama_lengkap}"],
    [/NIK\s*:\s*\.{5,}/gi, "NIK                           : {nik}"],
    [/No\.\s*KK\s*:\s*\.{5,}/gi, "No. KK                        : -"],
    [/No\.\s*Telepon\s*:\s*\.{5,}/gi, "No. Telepon                   : {no_whatsapp}"],
    [/No\.\s*HP\s*:\s*\.{5,}/gi, "No. HP                        : {no_whatsapp}"],
    [/WhatsApp\s*:\s*\.{5,}/gi, "WhatsApp                      : {no_whatsapp}"],
    [/Pekerjaan\s*:\s*\.{5,}/gi, "Pekerjaan                     : -"],
    [/Keperluan\s*:\s*\.{5,}/gi, "Keperluan                     : {keperluan}"],
    [/keperluan\s+\.{5,}/gi, "keperluan: {keperluan}."],
  ];

  // Ini terlalu kompleks untuk regex di XML karena teks di XML terpecah jadi tag
  // Lebih baik: report apa adanya
  console.log("\nXML snippet:");
  console.log(xml.substring(0, 2000));
}

main().catch(console.error);

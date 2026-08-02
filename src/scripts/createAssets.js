const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ASSETS_DIR = path.join(process.cwd(), "public", "assets");

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Helper: Create a raw RGBA PNG buffer
function createPngBuffer(width, height, drawPixelFn) {
  const rawRowLen = 1 + width * 4;
  const rawBuf = Buffer.alloc(rawRowLen * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rawRowLen;
    rawBuf[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixelFn(x, y, width, height);
      rawBuf[pxOffset] = r;
      rawBuf[pxOffset + 1] = g;
      rawBuf[pxOffset + 2] = b;
      rawBuf[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawBuf);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = createChunk("IHDR", ihdrData);
  const idatChunk = createChunk("IDAT", compressedData);
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);

  const crcBuf = Buffer.alloc(4 + len);
  chunk.copy(crcBuf, 0, 4, 8 + len);
  const crc = crc32(crcBuf);
  chunk.writeUInt32BE(crc, 8 + len);

  return chunk;
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ── 1. Create Stempel Desa Klitih (Blue Stamp PNG) ──────────────────────────
function generateStempelPng() {
  const W = 300, H = 300;
  const cx = W / 2, cy = H / 2;
  const outerR = 135, innerR = 85, borderThick = 4;
  const blueInk = [0x1e, 0x3a, 0x8a];

  return createPngBuffer(W, H, (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (Math.abs(dist - outerR) <= borderThick || Math.abs(dist - (outerR - 10)) <= 2) {
      return [...blueInk, 220];
    }
    if (Math.abs(dist - innerR) <= 2) {
      return [...blueInk, 220];
    }

    const angle = Math.atan2(dy, dx);
    if (Math.abs(dist - 110) < 8) {
      if (dist > innerR + 5 && dist < outerR - 12) {
        if (Math.abs(angle) < 0.15 || Math.abs(angle - Math.PI) < 0.15 || Math.abs(angle + Math.PI) < 0.15) {
          return [...blueInk, 200];
        }
        const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const rand = hash - Math.floor(hash);
        if (rand > 0.45 && (y < cy - 20 || y > cy + 20)) {
          return [...blueInk, 180];
        }
      }
    }

    if (dist < 35) {
      const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const rand = hash - Math.floor(hash);
      if (rand > 0.5) return [...blueInk, 190];
    }

    return [0, 0, 0, 0];
  });
}

// ── 2. Create Tanda Tangan Kades (Digital Signature PNG) ─────────────────────
function generateSignaturePng() {
  const W = 350, H = 180;
  const darkBlue = [0x0f, 0x17, 0x2a];

  return createPngBuffer(W, H, (x, y) => {
    const normX = x / W;
    const normY = y / H;

    const mainCurveY = 0.4 + 0.25 * Math.sin(normX * Math.PI * 3) * Math.cos(normX * Math.PI * 1.5);
    const distMain = Math.abs(normY - mainCurveY);

    const loopX = (x - 60) / 40;
    const loopY = (y - 70) / 40;
    const distLoop = Math.abs(loopX * loopX + loopY * loopY - 1);

    const flourishY = 0.75 + 0.05 * Math.sin(normX * Math.PI * 2);
    const distFlourish = Math.abs(normY - flourishY);

    if (distMain < 0.025 && normX > 0.15 && normX < 0.85) {
      return [...darkBlue, 240];
    }
    if (distLoop < 0.3 && normX > 0.08 && normX < 0.35) {
      return [...darkBlue, 230];
    }
    if (distFlourish < 0.02 && normX > 0.1 && normX < 0.9) {
      return [...darkBlue, 220];
    }

    return [0, 0, 0, 0];
  });
}

// ── 3. Create Combined Stamp + Signature (Overlapping PNG) ─────────────────
function generateCombinedPng() {
  const W = 450, H = 220;
  const darkBlue = [0x0f, 0x17, 0x2a];
  const blueInk = [0x1e, 0x3a, 0x8a];
  const stampCx = 150, stampCy = 110, stampR = 90;

  return createPngBuffer(W, H, (x, y) => {
    // TTD Signature lines
    const normX = x / W;
    const normY = y / H;

    const mainCurveY = 0.4 + 0.25 * Math.sin(normX * Math.PI * 3) * Math.cos(normX * Math.PI * 1.5);
    const distMain = Math.abs(normY - mainCurveY);

    const loopX = (x - 140) / 45;
    const loopY = (y - 90) / 45;
    const distLoop = Math.abs(loopX * loopX + loopY * loopY - 1);

    const flourishY = 0.75 + 0.05 * Math.sin(normX * Math.PI * 2);
    const distFlourish = Math.abs(normY - flourishY);

    let isTTD = false;
    if (
      (distMain < 0.025 && normX > 0.15 && normX < 0.85) ||
      (distLoop < 0.3 && normX > 0.1 && normX < 0.4) ||
      (distFlourish < 0.02 && normX > 0.15 && normX < 0.9)
    ) {
      isTTD = true;
    }

    // Stamp circle lines
    const dx = x - stampCx;
    const dy = y - stampCy;
    const distStamp = Math.sqrt(dx * dx + dy * dy);
    let isStamp = false;

    if (
      Math.abs(distStamp - stampR) <= 3 ||
      Math.abs(distStamp - (stampR - 8)) <= 1.5 ||
      Math.abs(distStamp - 55) <= 1.5
    ) {
      isStamp = true;
    }

    const angle = Math.atan2(dy, dx);
    if (distStamp > 55 && distStamp < stampR - 10) {
      const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const rand = hash - Math.floor(hash);
      if (rand > 0.52 && (y < stampCy - 15 || y > stampCy + 15)) {
        isStamp = true;
      }
    }

    if (distStamp < 25) {
      const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const rand = hash - Math.floor(hash);
      if (rand > 0.5) isStamp = true;
    }

    if (isStamp && isTTD) {
      return [0x1e, 0x3a, 0x8a, 245];
    }
    if (isStamp) {
      return [...blueInk, 210];
    }
    if (isTTD) {
      return [...darkBlue, 245];
    }

    return [0, 0, 0, 0];
  });
}

console.log("Generating default assets...");

fs.writeFileSync(path.join(ASSETS_DIR, "stempel-desa.png"), generateStempelPng());
console.log("✓ Created public/assets/stempel-desa.png");

fs.writeFileSync(path.join(ASSETS_DIR, "tanda-tangan-kades.png"), generateSignaturePng());
console.log("✓ Created public/assets/tanda-tangan-kades.png");

fs.writeFileSync(path.join(ASSETS_DIR, "ttd-dan-stempel.png"), generateCombinedPng());
console.log("✓ Created public/assets/ttd-dan-stempel.png");

console.log("Default stamp, signature, and combined assets successfully generated!");

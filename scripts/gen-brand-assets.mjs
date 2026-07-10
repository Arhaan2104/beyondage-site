// Generates the full BeyondAge icon system from the brand mark: a premium
// emerald-gloss ground + a clean ivory logomark, at every size a platform needs.
// Deterministic (sharp + SVG), no network, no fonts. Run: node scripts/gen-brand-assets.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = "tmp/brand";
mkdirSync(OUT, { recursive: true });

// Brand tokens (globals.css)
const C = {
  emLight: "#0b5e45", emBase: "#064d39", emDeep: "#04321f", emBlack: "#021a12",
  gold: "#d9b86c", goldBright: "#f1dda6", ivory: "#f3ede0",
};

// --- 1. Lift a clean, high-res ivory (and black) mark from icon.png -----------
// The source mark is dark emerald (marbled) on cream; map luminance -> alpha so
// the marble becomes solid and the cream drops out. T_low..T_high is the edge ramp.
async function extractMark(fill) {
  const T_LOW = 0.58, T_HIGH = 0.72;
  // Preserved copy of the original brand mark (icon.png gets overwritten by this run).
  const { data, info } = await sharp("scripts/assets/mark-source.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: N } = info;
  const out = Buffer.alloc(W * H * 4);
  const [fr, fg, fb] = fill;
  for (let p = 0, q = 0; p < data.length; p += N, q += 4) {
    const lum = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
    let a = (T_HIGH - lum) / (T_HIGH - T_LOW);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    out[q] = fr; out[q + 1] = fg; out[q + 2] = fb; out[q + 3] = Math.round(a * 255);
  }
  // trim transparent margin so we control padding precisely
  return sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().trim().toBuffer();
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// --- 2. The gloss ground as an SVG (rasterised crisp at any size) -------------
function groundSVG(N, { radius = 0.22, hairline = true } = {}) {
  const R = Math.round(N * radius);
  const inset = Math.max(1, Math.round(N * 0.055));
  const sw = Math.max(1, Math.round(N * 0.006));
  const lip = Math.max(1, Math.round(N * 0.004));
  return Buffer.from(`<svg width="${N}" height="${N}" viewBox="0 0 ${N} ${N}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="field" cx="32%" cy="20%" r="98%">
      <stop offset="0" stop-color="${C.emLight}"/>
      <stop offset="0.4" stop-color="${C.emBase}"/>
      <stop offset="0.76" stop-color="${C.emDeep}"/>
      <stop offset="1" stop-color="${C.emBlack}"/>
    </radialGradient>
    <radialGradient id="toplight" cx="50%" cy="-6%" r="72%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0.55" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="0.26" stop-color="#ffffff" stop-opacity="0.02"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="lip" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="clip"><rect x="0" y="0" width="${N}" height="${N}" rx="${R}" ry="${R}"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${N}" height="${N}" fill="url(#field)"/>
    <rect width="${N}" height="${N}" fill="url(#toplight)"/>
    <rect width="${N}" height="${N}" fill="url(#sheen)"/>
    <rect x="0" y="0" width="${N}" height="${Math.round(N * 0.5)}" fill="url(#lip)" opacity="0.5"/>
  </g>
  ${hairline ? `<rect x="${inset}" y="${inset}" width="${N - 2 * inset}" height="${N - 2 * inset}" rx="${Math.max(0, R - inset)}" ry="${Math.max(0, R - inset)}" fill="none" stroke="${C.gold}" stroke-opacity="0.55" stroke-width="${sw}"/>` : ""}
  <rect x="0" y="0" width="${N}" height="${lip}" rx="${lip}" fill="#ffffff" opacity="0.18" clip-path="url(#clip)"/>
</svg>`);
}

async function scaleAlpha(buf, f) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * f);
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

// --- 3. Compose one icon ------------------------------------------------------
async function makeIcon({ size, markRatio, radius, hairline, shadow = true, name }) {
  const ground = await sharp(groundSVG(size, { radius, hairline })).png().toBuffer();
  const markPx = Math.round(size * markRatio);
  const resizeOpts = { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } };
  const ivory = await sharp(markIvory).resize(markPx, markPx, resizeOpts).toBuffer();
  const centre = Math.round((size - markPx) / 2);
  const layers = [];
  if (shadow) {
    // sharp ignores `gravity` when top/left are given, so centre it explicitly
    const sh = await scaleAlpha(
      await sharp(markBlack).resize(markPx, markPx, resizeOpts).blur(Math.max(1, size * 0.012)).toBuffer(),
      0.3
    );
    layers.push({ input: sh, top: centre + Math.round(size * 0.014), left: centre });
  }
  layers.push({ input: ivory, top: centre, left: centre });
  const png = await sharp(ground).composite(layers).png().toBuffer();
  writeFileSync(`${OUT}/${name}`, png);
  return png;
}

// --- run ----------------------------------------------------------------------
const markIvory = await extractMark(hex(C.ivory));
const markBlack = await extractMark([2, 12, 8]);
writeFileSync(`${OUT}/_mark-ivory.png`, await sharp(markIvory).resize(400).png().toBuffer());

// App / PWA "any" — rounded emerald tile, mark ~0.52
await makeIcon({ size: 512, markRatio: 0.5, radius: 0.22, hairline: true, name: "icon-512.png" });
await makeIcon({ size: 192, markRatio: 0.5, radius: 0.22, hairline: true, name: "icon-192.png" });
// Maskable — full-bleed square, generous safe zone (mark ~0.4)
await makeIcon({ size: 512, markRatio: 0.4, radius: 0, hairline: false, name: "icon-maskable-512.png" });
// Apple touch — full-bleed square (iOS rounds), no transparency, mark ~0.5
await makeIcon({ size: 180, markRatio: 0.5, radius: 0, hairline: true, name: "apple-icon.png" });
// Favicon master — bolder mark, no hairline (aliases away tiny), rounded
await makeIcon({ size: 96, markRatio: 0.62, radius: 0.24, hairline: false, name: "favicon-96.png" });

// Downscale favicon variants from the 96 master (high-quality)
const icoBufs = {};
for (const s of [48, 32, 16]) {
  const buf = await sharp(`${OUT}/favicon-96.png`).resize(s, s, { kernel: "lanczos3" }).png().toBuffer();
  writeFileSync(`${OUT}/favicon-${s}.png`, buf);
  icoBufs[s] = buf;
}

// --- 4. Pack favicon.ico (PNG-compressed entries: 16/32/48) --------------------
function buildIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6 + 16 * count);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(count, 4);
  let offset = 6 + 16 * count;
  const blobs = [];
  entries.forEach((e, i) => {
    const o = 6 + 16 * i;
    header.writeUInt8(e.size >= 256 ? 0 : e.size, o);
    header.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1);
    header.writeUInt8(0, o + 2); header.writeUInt8(0, o + 3);
    header.writeUInt16LE(1, o + 4); header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(e.buf.length, o + 8); header.writeUInt32LE(offset, o + 12);
    offset += e.buf.length; blobs.push(e.buf);
  });
  return Buffer.concat([header, ...blobs]);
}
writeFileSync(`${OUT}/favicon.ico`, buildIco([
  { size: 16, buf: icoBufs[16] }, { size: 32, buf: icoBufs[32] }, { size: 48, buf: icoBufs[48] },
]));

console.log("brand assets written to", OUT);

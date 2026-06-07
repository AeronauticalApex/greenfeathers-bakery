// Full asset pipeline for the real Greenfeathers chicken logo.
// Reads public/chicken-logo.jpg (black hen on off-white) and produces:
//   - public/chicken-logo.png      transparent PNG (off-white knocked out), tight crop
//   - src/components/ChickenMark.tsx   inline-SVG React mark (traced path, currentColor)
//   - src/app/icon.svg             favicon (cream hen on green tile)
// The traced feather flecks become transparent holes (show the bg through), like the original.
//
// Run: node scripts/process-logo.cjs
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const potrace = require("potrace");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "chicken-logo.jpg");
const OUT_PNG = path.join(ROOT, "public", "chicken-logo.png");
const TMP_BW = path.join(__dirname, "_bw.png");
const OUT_SVG_RAW = path.join(__dirname, "_traced.svg");
const OUT_COMPONENT = path.join(ROOT, "src", "components", "ChickenMark.tsx");
const OUT_ICON = path.join(ROOT, "src", "app", "icon.svg");

const THRESHOLD = 150; // luminance below this = "ink"
const PAD = 6; // px padding around tight crop

function writeComponent(viewBox, d) {
  const tsx = `interface ChickenMarkProps {
  className?: string;
  title?: string;
}

// The real Greenfeathers Farm hen, traced from the hand-drawn logo
// (public/chicken-logo.jpg) into a clean vector. The feather flecks are
// transparent holes, so the background shows through just like the original.
// Fill is \`currentColor\`, so the parent controls the tint (ink on light
// surfaces, cream on the green footer). Crisp at any size.
export default function ChickenMark({
  className,
  title = "Greenfeathers Farm hen",
}: ChickenMarkProps) {
  return (
    <svg
      viewBox="${viewBox}"
      role="img"
      aria-label={title}
      className={className}
      fill="currentColor"
      fillRule="evenodd"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path d="${d}" />
    </svg>
  );
}
`;
  fs.writeFileSync(OUT_COMPONENT, tsx);
  console.log("wrote", OUT_COMPONENT);
}

function writeIcon(viewBox, d) {
  // Nested SVG scales the traced hen into a padded green rounded tile.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Favicon: cream Greenfeathers hen (traced from the real logo) on a deep-green tile. -->
  <rect width="100" height="100" rx="22" fill="#2f4a3a" />
  <svg viewBox="${viewBox}" x="16" y="14" width="68" height="72" preserveAspectRatio="xMidYMid meet">
    <path d="${d}" fill="#faf5ea" fill-rule="evenodd" />
  </svg>
</svg>
`;
  fs.writeFileSync(OUT_ICON, svg);
  console.log("wrote", OUT_ICON);
}

(async () => {
  const img = await Jimp.read(SRC);
  const { width, height } = img.bitmap;

  // 1) Tight bbox of dark pixels.
  let minX = width, minY = height, maxX = 0, maxY = 0;
  img.scan(0, 0, width, height, function (x, y, idx) {
    const lum =
      0.299 * this.bitmap.data[idx] +
      0.587 * this.bitmap.data[idx + 1] +
      0.114 * this.bitmap.data[idx + 2];
    if (lum < THRESHOLD) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  });
  minX = Math.max(0, minX - PAD);
  minY = Math.max(0, minY - PAD);
  maxX = Math.min(width - 1, maxX + PAD);
  maxY = Math.min(height - 1, maxY + PAD);
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  console.log(`source ${width}x${height}; tight crop ${cw}x${ch} at (${minX},${minY})`);

  // 2) Transparent PNG: ink -> opaque near-black, else transparent.
  const trans = img.clone().crop(minX, minY, cw, ch);
  trans.scan(0, 0, cw, ch, function (x, y, idx) {
    const lum =
      0.299 * this.bitmap.data[idx] +
      0.587 * this.bitmap.data[idx + 1] +
      0.114 * this.bitmap.data[idx + 2];
    if (lum < THRESHOLD) {
      this.bitmap.data[idx] = 0x16;
      this.bitmap.data[idx + 1] = 0x14;
      this.bitmap.data[idx + 2] = 0x12;
      this.bitmap.data[idx + 3] = 255;
    } else {
      this.bitmap.data[idx + 3] = 0;
    }
  });
  await trans.writeAsync(OUT_PNG);
  console.log("wrote", OUT_PNG);

  // 3) Crisp B/W bitmap for tracing.
  const bw = img.clone().crop(minX, minY, cw, ch).greyscale();
  bw.scan(0, 0, cw, ch, function (x, y, idx) {
    const v = this.bitmap.data[idx] < THRESHOLD ? 0 : 255;
    this.bitmap.data[idx] = v;
    this.bitmap.data[idx + 1] = v;
    this.bitmap.data[idx + 2] = v;
    this.bitmap.data[idx + 3] = 255;
  });
  await bw.writeAsync(TMP_BW);

  // 4) Trace -> SVG, then write the component + favicon from the path.
  potrace.trace(
    TMP_BW,
    { threshold: 128, turdSize: 4, optTolerance: 0.2, color: "#000000", background: "transparent" },
    (err, svg) => {
      if (err) throw err;
      fs.writeFileSync(OUT_SVG_RAW, svg);
      const viewBox = `0 0 ${cw} ${ch}`;
      const dMatch = svg.match(/ d="([^"]+)"/);
      if (!dMatch) throw new Error("no path found in traced svg");
      const d = dMatch[1].replace(/\s+/g, " ").trim();
      console.log("traced viewBox:", viewBox, "| path:", d.length, "chars");
      writeComponent(viewBox, d);
      writeIcon(viewBox, d);
      // tidy temp bitmap
      try { fs.unlinkSync(TMP_BW); } catch {}
      console.log("DONE");
    },
  );
})();

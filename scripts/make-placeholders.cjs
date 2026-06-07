// Generates tasteful BRANDED PLACEHOLDER images so the photo slots (per-item
// featured cards + section/hero backgrounds) look intentional until the client's
// real photos arrive. Warm bakery tones + a faint chicken watermark.
// Run: node scripts/make-placeholders.cjs
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.join(__dirname, "..", "public", "placeholders");
fs.mkdirSync(OUT, { recursive: true });

const hen =
  "data:image/png;base64," +
  fs.readFileSync(path.join(__dirname, "..", "public", "chicken-logo.png")).toString("base64");

// label is a small, honest "placeholder" tag so these never look like a bug.
function tile(grad) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;box-sizing:border-box}html,body{width:100%;height:100%}
    body{display:flex;align-items:center;justify-content:center;background:${grad};position:relative;overflow:hidden;font-family:Georgia,serif}
    .hen{width:42%;opacity:.10;filter:saturate(0)}
    .tag{position:absolute;bottom:18px;right:22px;font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:rgba(43,38,32,.32)}
  </style></head><body>
    <img class="hen" src="${hen}" />
    <div class="tag">photo placeholder</div>
  </body></html>`;
}

function bg(grad) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;box-sizing:border-box}html,body{width:100%;height:100%}
    body{background:${grad};position:relative;overflow:hidden}
    .hen{position:absolute;right:-4%;bottom:-12%;width:46%;opacity:.06;filter:saturate(0)}
  </style></head><body><img class="hen" src="${hen}" /></body></html>`;
}

const JOBS = [
  // Product tiles — warm, mid-tone so white overlay text stays readable.
  { file: "product-1.jpg", w: 1280, h: 800, html: tile("linear-gradient(135deg,#caa46a 0%,#a87b43 60%,#8a6231 100%)") },
  { file: "product-2.jpg", w: 1280, h: 800, html: tile("linear-gradient(135deg,#c98a5a 0%,#a85f36 55%,#7e4526 100%)") },
  { file: "product-3.jpg", w: 1280, h: 800, html: tile("linear-gradient(135deg,#9fae7e 0%,#6f8a59 55%,#4e6b41 100%)") },
  // Soft backgrounds for hero/section slots — light, airy.
  { file: "hero-bg.jpg", w: 1600, h: 1000, html: bg("radial-gradient(1200px 700px at 25% 10%,#f3ead6,transparent 60%),linear-gradient(160deg,#eef0e2 0%,#dde6d0 60%,#cfd9bf 100%)") },
  { file: "section-bg.jpg", w: 1600, h: 900, html: bg("radial-gradient(1000px 600px at 80% 0%,#f4ecda,transparent 55%),linear-gradient(160deg,#eef1e4 0%,#e0e7d4 70%,#d4ddc6 100%)") },
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  for (const job of JOBS) {
    const page = await browser.newPage();
    await page.setViewport({ width: job.w, height: job.h, deviceScaleFactor: 1 });
    await page.setContent(job.html, { waitUntil: "networkidle0" });
    await page.screenshot({ path: path.join(OUT, job.file), type: "jpeg", quality: 82 });
    await page.close();
    console.log("wrote placeholders/" + job.file);
  }
  await browser.close();
})();

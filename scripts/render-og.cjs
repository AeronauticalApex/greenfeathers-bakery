// Renders the social/OG image (1200x630) to public/og.png using headless Chrome.
// Embeds the processed transparent chicken (public/chicken-logo.png) as the mark.
// Run AFTER process-logo.cjs. Run: node scripts/render-og.cjs
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PNG = path.join(__dirname, "..", "public", "chicken-logo.png");
const OUT = path.join(__dirname, "..", "public", "og.png");

const chickenDataUri =
  "data:image/png;base64," + fs.readFileSync(PNG).toString("base64");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 6px;
    font-family: Georgia, 'Times New Roman', serif;
    background:
      radial-gradient(900px 520px at 18% 0%, rgba(120,150,110,0.22), transparent 60%),
      radial-gradient(1000px 700px at 100% 100%, rgba(47,74,58,0.14), transparent 55%),
      linear-gradient(160deg, #f7f1e4 0%, #e9eedd 55%, #dde6d2 100%);
    color: #2f4a3a;
  }
  .hen { height: 300px; margin-bottom: 8px; }
  h1 { font-size: 76px; font-weight: 700; letter-spacing: -0.5px; }
  .tag { font-size: 30px; color: #6b5a36; font-style: italic; margin-top: 6px; }
  .pill {
    margin-top: 26px; font-size: 28px; font-family: ui-sans-serif, system-ui, sans-serif;
    font-weight: 600; color: #faf5ea; background: #2f4a3a;
    padding: 14px 30px; border-radius: 999px;
  }
</style></head><body>
  <img class="hen" src="${chickenDataUri}" />
  <h1>Greenfeathers Farm Bakery</h1>
  <div class="tag">Fresh sourdough · baked weekly · Springfield, Vermont</div>
  <div class="pill">Text your order · (802) 245-9095</div>
</body></html>`;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--force-device-scale-factor=2"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({ path: OUT });
  await browser.close();
  console.log("wrote", OUT);
})();

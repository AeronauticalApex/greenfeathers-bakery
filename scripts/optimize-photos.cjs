// Optimize the client's photos from incoming-photos/ into public/photos/ as
// web-sized webp with clean kebab-case names. Originals are left untouched.
// Run: node scripts/optimize-photos.cjs
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "incoming-photos");
const OUT = path.join(__dirname, "..", "public", "photos");
fs.mkdirSync(OUT, { recursive: true });

// role → output width + webp quality
const ROLE = {
  product: { width: 1000, quality: 80 },
  bg: { width: 1920, quality: 72 },
  about: { width: 1300, quality: 80 },
  misc: { width: 1200, quality: 78 },
};

// src filename → [output slug (no ext), role]
const MAP = [
  ["cainamin raisen boule.jpg", "cinnamon-raisin", "product"],
  ["challah.jpg", "challah", "product"],
  ["cherry almond.jpg", "cherry-almond-scone", "product"],
  ["chocolate boule.jpg", "dark-chocolate-espresso", "product"],
  ["cinamon rolls.jpg", "cinnamon-rolls", "product"],
  ["classic boule.jpg", "classic-boule", "product"],
  ["english muffins.jpg", "english-muffins", "product"],
  ["everything bagles.jpg", "everything-bagels", "product"],
  ["grahm ckrackers.jpg", "graham-crackers", "product"],
  ["jalapeno cheddar boule.jpg", "jalapeno-cheddar", "product"],
  ["moms white bread.jpg", "sandwich-loaf", "product"],
  ["morning glory.jpg", "morning-glory", "product"],
  ["oatmeal reisen boule.jpg", "honey-oat", "product"],
  ["pienutbutter cookies.jpg", "peanut-butter-cookies", "product"],
  ["pumpernickle loaf.jpg", "pumpernickel", "product"],
  // backgrounds (hero / section fade slots)
  ["peach tree.jpg", "hero-blossoms", "bg"],
  ["rustic ficosia.jpg", "focaccia", "bg"],
  // about / scenic
  ["gffb .jpg", "the-bakers", "about"],
  ["chiken.jpg", "rooster", "about"],
  ["fresh morning eggs.jpg", "fresh-eggs", "about"],
  ["mothers day market.jpg", "market-stall", "about"],
  ["making valintines day cookies.jpg", "decorating-cookies", "about"],
  ["more challah bread.jpg", "shabbat-challah", "about"],
  ["loafs of bread.jpg", "shop-shelf", "about"],
  ["more loafs of bread.jpg", "shop-shelf-2", "about"],
  ["cherry almond scones.jpg", "scones-cooling", "about"],
  // leftovers (optimized + ready, not referenced in code yet)
  ["babka muffins.jpg", "babka-muffins", "misc"],
  ["green feathers farm.jpg", "paper-menu", "misc"],
  ["hommade flowercards.jpg", "pressed-flower-cards", "misc"],
  ["organic honey.jpg", "wildflower-honey", "misc"],
  ["porch pickup.jpg", "sunporch-pickup", "misc"],
  ["purrmont cinamin rolls.jpg", "cinnamon-rolls-baking", "misc"],
  ["scones.jpg", "plain-scones", "misc"],
  ["toat bags from recycled grain.jpg", "feedbag-totes", "misc"],
  ["valintines day cookies.jpg", "valentine-heart-cookies", "misc"],
];

(async () => {
  let ok = 0;
  for (const [src, slug, role] of MAP) {
    const srcPath = path.join(SRC, src);
    if (!fs.existsSync(srcPath)) {
      console.log(`MISSING: ${src}`);
      continue;
    }
    const { width, quality } = ROLE[role];
    const outPath = path.join(OUT, `${slug}.webp`);
    const meta = await sharp(srcPath).rotate(); // respect EXIF orientation
    await meta
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outPath);
    const kb = Math.round(fs.statSync(outPath).size / 1024);
    ok++;
    console.log(`${role.padEnd(7)} ${slug}.webp  (${kb} KB)`);
  }
  console.log(`\nDone: ${ok}/${MAP.length} optimized into public/photos/`);
})();

import type { MenuItem, Section, WeeklyMenu } from "./types";

// The full product catalog. This data is used:
//   1. As the public fallback when Supabase isn't configured (so the site
//      always demos correctly), and
//   2. As the source of truth for supabase/seed.sql.
//
// `available: true` means the product is on THIS WEEK's menu (Menu for May 29).
// Everything else lives in the catalog but is off this week.
// Keep this in sync with supabase/seed.sql.

export const SEED_MENU: WeeklyMenu = {
  id: "seed-week",
  week_label: "Menu for May 29",
  order_deadline: "Order by 8 PM Tuesday May 26 for pickup Friday May 29",
  active: true,
};

// Helper to keep rows terse; sort_order + photo_url are assigned below.
type Row = Omit<MenuItem, "id" | "sort_order" | "photo_url">;

const ROWS: Row[] = [
  // ---- Breads: $10 each ----
  { name: "Classic Boule", price: 10, unit_note: "", section: "Breads", not_sourdough: false, available: true },
  { name: "Classic Batard", price: 10, unit_note: "", section: "Breads", not_sourdough: false, available: true },
  { name: "Challah", price: 10, unit_note: "", section: "Breads", not_sourdough: true, available: true },
  { name: "Sourdough Sandwich Loaf", price: 10, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  // ---- Breads: $15 each ----
  { name: "Jalapeño-Cheddar", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: true },
  { name: "White Cheddar-Dill", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Cinnamon-Raisin", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Blueberry-Lemon", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Parmesan-Herb", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Jewish Rye", price: 15, unit_note: "(loaf only)", section: "Breads", not_sourdough: false, available: true },
  { name: "Pumpernickel", price: 15, unit_note: "(loaf only)", section: "Breads", not_sourdough: false, available: true },
  { name: "Multigrain", price: 15, unit_note: "(loaf only)", section: "Breads", not_sourdough: false, available: false },
  { name: "Garlic-Rosemary", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Za'atar and Kalamata Olive", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Hot Italian", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Cracked Pepper-Parmesan", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Honey Oat", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },
  { name: "Dark Chocolate-Espresso", price: 15, unit_note: "", section: "Breads", not_sourdough: false, available: false },

  // ---- Sourdough Cookies: $15 a dozen ----
  { name: "Chocolate Chip with Sea Salt", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Lemon Crinkle", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: true },
  { name: "Chocolate Crinkle", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Molasses-Ginger", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Orange-Cardamom Shortbread", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Oatmeal-Raisin", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Peanut Butter", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Apple Cider Snickerdoodles", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Chai", price: 15, unit_note: "(12)", section: "Sourdough Cookies", not_sourdough: false, available: false },
  { name: "Graham Crackers (animal shapes)", price: 15, unit_note: "(25)", section: "Sourdough Cookies", not_sourdough: false, available: false },

  // ---- Sweet Rolls & Brownies ----
  { name: "Iced Saigon-Cinnamon Sweet Rolls", price: 18, unit_note: "(4)", section: "Sweet Rolls & Brownies", not_sourdough: false, available: true },
  { name: "Sourdough Super Fudgy Brownies", price: 18, unit_note: "(6)", section: "Sweet Rolls & Brownies", not_sourdough: false, available: false },

  // ---- Sweet Scones: 4 for $15, with glaze ----
  { name: "Maple-Pecan", price: 15, unit_note: "(4)", section: "Sweet Scones", not_sourdough: false, available: false },
  { name: "Lemon-Poppyseed", price: 15, unit_note: "(4)", section: "Sweet Scones", not_sourdough: false, available: false },
  { name: "Dark Chocolate Espresso", price: 15, unit_note: "(4)", section: "Sweet Scones", not_sourdough: false, available: true },
  { name: "Cherry-Almond", price: 15, unit_note: "(4)", section: "Sweet Scones", not_sourdough: false, available: false },
  { name: "Mini Chocolate Chip", price: 15, unit_note: "(4)", section: "Sweet Scones", not_sourdough: false, available: false },

  // ---- Savory Scones: 4 for $15 ----
  { name: "Mediterranean", price: 15, unit_note: "(4)", section: "Savory Scones", not_sourdough: false, available: true },
  { name: "Jalapeño-Cheddar", price: 15, unit_note: "(4)", section: "Savory Scones", not_sourdough: false, available: false },
  { name: "Parmesan-Herb", price: 15, unit_note: "(4)", section: "Savory Scones", not_sourdough: false, available: false },

  // ---- Muffins ----
  { name: "Morning Glory", price: 15, unit_note: "(4)", section: "Muffins", not_sourdough: true, available: true },
  { name: "Gluten-free Morning Glory", price: 19, unit_note: "(4)", section: "Muffins", not_sourdough: true, available: true },

  // ---- Sourdough Bagels: 6 for $12 ----
  { name: "Plain", price: 12, unit_note: "(6)", section: "Sourdough Bagels", not_sourdough: false, available: false },
  { name: "Everything", price: 12, unit_note: "(6)", section: "Sourdough Bagels", not_sourdough: false, available: false },
  { name: "Sesame", price: 12, unit_note: "(6)", section: "Sourdough Bagels", not_sourdough: false, available: false },
  { name: "Poppy", price: 12, unit_note: "(6)", section: "Sourdough Bagels", not_sourdough: false, available: false },
  { name: "Garlic-Parmesan", price: 12, unit_note: "(6)", section: "Sourdough Bagels", not_sourdough: false, available: false },
  { name: "Pumpernickel", price: 12, unit_note: "(6)", section: "Sourdough Bagels", not_sourdough: false, available: false },
  { name: "Cinnamon-Raisin", price: 12, unit_note: "(6)", section: "Sourdough Bagels", not_sourdough: false, available: false },

  // ---- English Muffins: 6 for $12 ----
  { name: "Plain Sourdough", price: 12, unit_note: "(6)", section: "English Muffins", not_sourdough: false, available: true },
  { name: "Cinnamon-Raisin Sourdough", price: 12, unit_note: "(6)", section: "English Muffins", not_sourdough: false, available: true },
];

// Real client product photos (optimized into /public/photos). Keyed by
// section + name because some names (Jalapeño-Cheddar, Cinnamon-Raisin,
// Pumpernickel) exist in more than one section.
const SEED_PHOTOS: { section: Section; name: string; url: string }[] = [
  { section: "Breads", name: "Classic Boule", url: "/photos/classic-boule.webp" },
  { section: "Breads", name: "Challah", url: "/photos/challah.webp" },
  { section: "Breads", name: "Jalapeño-Cheddar", url: "/photos/jalapeno-cheddar.webp" },
  { section: "Breads", name: "Cinnamon-Raisin", url: "/photos/cinnamon-raisin.webp" },
  { section: "Breads", name: "Pumpernickel", url: "/photos/pumpernickel.webp" },
  { section: "Breads", name: "Dark Chocolate-Espresso", url: "/photos/dark-chocolate-espresso.webp" },
  { section: "Breads", name: "Honey Oat", url: "/photos/honey-oat.webp" },
  { section: "Breads", name: "Sourdough Sandwich Loaf", url: "/photos/sandwich-loaf.webp" },
  { section: "Sourdough Cookies", name: "Peanut Butter", url: "/photos/peanut-butter-cookies.webp" },
  { section: "Sourdough Cookies", name: "Graham Crackers (animal shapes)", url: "/photos/graham-crackers.webp" },
  { section: "Sweet Rolls & Brownies", name: "Iced Saigon-Cinnamon Sweet Rolls", url: "/photos/cinnamon-rolls.webp" },
  { section: "Sweet Scones", name: "Cherry-Almond", url: "/photos/cherry-almond-scone.webp" },
  { section: "Muffins", name: "Morning Glory", url: "/photos/morning-glory.webp" },
  { section: "Sourdough Bagels", name: "Everything", url: "/photos/everything-bagels.webp" },
  { section: "English Muffins", name: "Plain Sourdough", url: "/photos/english-muffins.webp" },
];

export const SEED_ITEMS: MenuItem[] = ROWS.map((row, i) => ({
  ...row,
  id: `seed-${i + 1}`,
  sort_order: i + 1,
  photo_url:
    SEED_PHOTOS.find((p) => p.section === row.section && p.name === row.name)?.url ?? null,
}));

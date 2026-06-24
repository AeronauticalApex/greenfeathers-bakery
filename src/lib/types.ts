// Shared data types for the bakery menu.

export const SECTIONS = [
  "Breads",
  "Sourdough Cookies",
  "Sweet Rolls & Brownies",
  "Sweet Scones",
  "Savory Scones",
  "Muffins",
  "Sourdough Bagels",
  "English Muffins",
] as const;

export type Section = (typeof SECTIONS)[number];

export interface WeeklyMenu {
  id: string;
  /** e.g. "Menu for May 29" */
  week_label: string;
  /** e.g. "Order by 8 PM Tuesday May 26 for pickup Friday May 29" */
  order_deadline: string;
  /** Only one menu should be active at a time; it's the one shown publicly. */
  active: boolean;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  /** Whole or decimal dollars, e.g. 10 or 12.5 */
  price: number;
  /** Quantity note shown after the name, e.g. "(6)", "(4)", "(12)" */
  unit_note: string;
  section: Section;
  /** When true, renders the "*" footnote marker (item not made with sourdough) */
  not_sourdough: boolean;
  sort_order: number;
  available: boolean;
  /** Optional product photo (public bucket URL, or local placeholder path). */
  photo_url: string | null;
}

/** Shape used by the admin editor forms / API payloads. */
export type MenuItemInput = Omit<MenuItem, "id">;

/** Single-row site-wide settings (id = 1). Matches the site_settings table. */
export interface SiteSettings {
  /** Vacation/break window start (date only, "YYYY-MM-DD") or null. */
  closed_from: string | null;
  /** Vacation/break window end (inclusive, "YYYY-MM-DD") or null. */
  closed_to: string | null;
  /** Force the closed banner on regardless of dates. */
  force_closed: boolean;
  /** Shown in the banner when the bakery is closed. */
  closed_message: string;
  /** Shown in the slim banner when the bakery is open. */
  open_message: string;
  flash_sale_enabled: boolean;
  flash_sale_title: string;
  flash_sale_body: string;
  pickup_delivery_enabled: boolean;
  pickup_delivery_title: string;
  pickup_delivery_body: string;
  updated_at?: string;
}

import "server-only";
import { getReadClient, getServiceClient } from "./supabase";
import { SEED_ITEMS, SEED_MENU } from "./seed";
import type { MenuItem, WeeklyMenu } from "./types";

// Data access for the weekly menu. Reads fall back to the seeded menu when
// Supabase isn't configured, so the public site always renders. Writes require
// the service-role client and throw a friendly error otherwise.

export interface MenuData {
  menu: WeeklyMenu | null;
  items: MenuItem[];
  /** True when data came from the seed fallback rather than Supabase. */
  usingFallback: boolean;
}

/** The active week + its items, for the public site. */
export async function getActiveMenu(): Promise<MenuData> {
  const client = getReadClient();
  if (!client) {
    return { menu: SEED_MENU, items: SEED_ITEMS, usingFallback: true };
  }

  const { data: menu, error: menuError } = await client
    .from("weekly_menu")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (menuError || !menu) {
    // Table empty or unreachable — fall back so the site still works.
    return { menu: SEED_MENU, items: SEED_ITEMS, usingFallback: true };
  }

  const { data: items, error: itemsError } = await client
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (itemsError) {
    return { menu, items: [], usingFallback: false };
  }

  return { menu, items: (items ?? []) as MenuItem[], usingFallback: false };
}

/** Full menu + ALL items (incl. unavailable) for the admin editor. */
export async function getAdminMenu(): Promise<MenuData> {
  const client = getServiceClient();
  if (!client) {
    return { menu: SEED_MENU, items: SEED_ITEMS, usingFallback: true };
  }

  const { data: menu } = await client
    .from("weekly_menu")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: items } = await client
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return {
    menu: (menu as WeeklyMenu | null) ?? null,
    items: (items ?? []) as MenuItem[],
    usingFallback: false,
  };
}

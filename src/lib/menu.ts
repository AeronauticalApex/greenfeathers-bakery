import "server-only";
import { getReadClient, getServiceClient } from "./supabase";
import { SEED_ITEMS, SEED_MENU } from "./seed";
import type { MenuItem, WeeklyMenu } from "./types";

// Data access for the weekly menu.
//
// Robustness rules:
//  - Every Supabase read has a hard timeout so a hung request fails fast to the
//    seed instead of hanging the page.
//  - The public path (getActiveMenu) falls back to the seed on ANY failure or
//    empty result from EITHER query, so the public site never renders empty.

export interface MenuData {
  menu: WeeklyMenu | null;
  items: MenuItem[];
  /** True when data came from the seed fallback rather than Supabase. */
  usingFallback: boolean;
}

// Fail fast: if Supabase has not answered in this window, use the seed.
const QUERY_TIMEOUT_MS = 4000;

// Abort signal that trips after `ms`, plus a cleanup to clear the timer.
function deadline(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

function asMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// The seed fallback. Pass a reason only for genuine failures (so the log fires
// when something is wrong, not for normal unconfigured/preview rendering).
function seedFallback(reason?: string): MenuData {
  if (reason) console.warn("[menu] Supabase read failed, using seed fallback:", reason);
  return { menu: SEED_MENU, items: SEED_ITEMS, usingFallback: true };
}

/** The active week + its items, for the public site. Never renders empty. */
export async function getActiveMenu(): Promise<MenuData> {
  const client = getReadClient();
  if (!client) return seedFallback();

  // Active week.
  let menu: WeeklyMenu;
  try {
    const d = deadline(QUERY_TIMEOUT_MS);
    const { data, error } = await client
      .from("weekly_menu")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .abortSignal(d.signal)
      .maybeSingle();
    d.cancel();
    if (error || !data) return seedFallback(error?.message ?? "no active week row");
    menu = data as WeeklyMenu;
  } catch (e) {
    return seedFallback(asMessage(e));
  }

  // Menu items. Any failure OR an empty result falls back to the seed.
  try {
    const d = deadline(QUERY_TIMEOUT_MS);
    const { data, error } = await client
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .abortSignal(d.signal);
    d.cancel();
    if (error || !data || data.length === 0) {
      return seedFallback(error?.message ?? "menu_items returned empty");
    }
    return { menu, items: data as MenuItem[], usingFallback: false };
  } catch (e) {
    return seedFallback(asMessage(e));
  }
}

/** Full menu + ALL items (incl. unavailable) for the admin editor. */
export async function getAdminMenu(): Promise<MenuData> {
  const client = getServiceClient();
  if (!client) return seedFallback();

  try {
    const dw = deadline(QUERY_TIMEOUT_MS);
    const { data: menu, error: menuError } = await client
      .from("weekly_menu")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .abortSignal(dw.signal)
      .maybeSingle();
    dw.cancel();

    const di = deadline(QUERY_TIMEOUT_MS);
    const { data: items, error: itemsError } = await client
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .abortSignal(di.signal);
    di.cancel();

    // On a real error/timeout, fall back so the admin doesn't hang or blank out.
    // A legitimately empty catalog is left empty so the admin reflects reality.
    if (menuError || itemsError) {
      return seedFallback((menuError ?? itemsError)?.message ?? "admin read error");
    }

    return {
      menu: (menu as WeeklyMenu | null) ?? null,
      items: (items ?? []) as MenuItem[],
      usingFallback: false,
    };
  } catch (e) {
    return seedFallback(asMessage(e));
  }
}

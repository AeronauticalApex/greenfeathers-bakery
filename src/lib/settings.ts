import "server-only";
import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getReadClient, getServiceClient } from "./supabase";
import type { SiteSettings } from "./types";

// Site-wide settings (single row, id = 1). Reads use the same fail-fast timeout
// and safe-default fallback as menu.ts, so the site never breaks if the row or
// Supabase is unavailable.

// Defaults mirror the table defaults: open, no flash sale, pickup enabled.
export const DEFAULT_SETTINGS: SiteSettings = {
  closed_from: null,
  closed_to: null,
  force_closed: false,
  closed_message: "We're taking a short break. Check back soon!",
  open_message: "Now taking orders for this week. Text us to order!",
  flash_sale_enabled: false,
  flash_sale_title: "",
  flash_sale_body: "",
  pickup_delivery_enabled: true,
  pickup_delivery_title: "",
  pickup_delivery_body: "",
};

const QUERY_TIMEOUT_MS = 4000;

function deadline(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

async function readSettings(client: SupabaseClient): Promise<SiteSettings> {
  try {
    const d = deadline(QUERY_TIMEOUT_MS);
    const { data, error } = await client
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .abortSignal(d.signal)
      .maybeSingle();
    d.cancel();
    if (error || !data) return DEFAULT_SETTINGS;
    // Keep defaults for any column that comes back null/undefined.
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== null && v !== undefined),
    );
    return { ...DEFAULT_SETTINGS, ...clean } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Public read (anon client). Never throws; returns defaults on any problem.
 * Wrapped in React cache() so layout + page share one query per request.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const client = getReadClient();
  if (!client) return DEFAULT_SETTINGS;
  return readSettings(client);
});

/** Admin read (service client) for the editor's initial values. */
export async function getAdminSettings(): Promise<SiteSettings> {
  const client = getServiceClient();
  if (!client) return DEFAULT_SETTINGS;
  return readSettings(client);
}

// Today's date in America/New_York as "YYYY-MM-DD" (en-CA formats that way).
function todayInNewYork(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}

/**
 * True when the bakery should show as closed: force_closed is on, OR both
 * closed_from and closed_to are set and today (New York date) falls within
 * [closed_from, closed_to] inclusive. Date-only comparison.
 */
export function isBakeryClosed(settings: SiteSettings): boolean {
  if (settings.force_closed) return true;
  if (settings.closed_from && settings.closed_to) {
    const today = todayInNewYork();
    return today >= settings.closed_from && today <= settings.closed_to;
  }
  return false;
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Centralized Supabase access for the server.
//
// The public site reads with the anon key (or falls back to seed data when
// Supabase isn't configured). The admin writes use the service role key, which
// must NEVER be exposed to the browser — these helpers are server-only.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when read credentials are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** True when write (service role) credentials are present. */
export function isAdminWriteConfigured(): boolean {
  return Boolean(url && serviceKey);
}

/** Read-only client (anon key). Returns null when not configured. */
export function getReadClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Service-role client for admin writes. Returns null when not configured. */
export function getServiceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

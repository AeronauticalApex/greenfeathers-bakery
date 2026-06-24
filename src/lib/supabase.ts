import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Centralized Supabase access for the server.
//
// The public site reads with the anon key (or falls back to seed data when
// Supabase isn't configured). The admin writes use the service role key, which
// must NEVER be exposed to the browser. These helpers are server-only.
//
// The clients are created once per server instance and reused across requests,
// so we don't pay the TLS/handshake cost on every page load.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const options = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

/** True when read credentials are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** True when write (service role) credentials are present. */
export function isAdminWriteConfigured(): boolean {
  return Boolean(url && serviceKey);
}

// `undefined` = not yet initialized; `null` = initialized but not configured.
let readClient: SupabaseClient | null | undefined;
let serviceClient: SupabaseClient | null | undefined;

/** Read-only client (anon key), memoized. Returns null when not configured. */
export function getReadClient(): SupabaseClient | null {
  if (readClient === undefined) {
    readClient = url && anonKey ? createClient(url, anonKey, options) : null;
  }
  return readClient;
}

/** Service-role client (admin writes), memoized. Returns null when not configured. */
export function getServiceClient(): SupabaseClient | null {
  if (serviceClient === undefined) {
    serviceClient = url && serviceKey ? createClient(url, serviceKey, options) : null;
  }
  return serviceClient;
}

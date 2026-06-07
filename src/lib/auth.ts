import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

// Admin session handling: a signed, expiring cookie plus a simple in-memory
// rate limiter for the login endpoint. No database needed.

export const SESSION_COOKIE = "gf_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  // Fall back to the password so dev works even without the secret set;
  // production should always set a dedicated random ADMIN_SESSION_SECRET.
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "greenfeathers-dev-secret"
  );
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Check a submitted password against ADMIN_PASSWORD (constant-time). */
export function verifyPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(submitted, expected);
}

/** Create a signed session token valid for SESSION_TTL_MS. */
export function createSessionToken(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

/** Validate a session token's signature and expiry. */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

/** Read the session cookie and report whether the caller is authenticated. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}

export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);

// ---- Rate limiting (in-memory, per-process) -------------------------------

interface Attempt {
  count: number;
  firstAt: number;
  blockedUntil: number;
}

const attempts = new Map<string, Attempt>();
const WINDOW_MS = 1000 * 60 * 15; // 15 minute window
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 1000 * 60 * 15; // lock out for 15 minutes after too many

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may try again (when blocked). */
  retryAfter: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = attempts.get(key);

  if (entry && entry.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((entry.blockedUntil - now) / 1000) };
  }
  if (entry && now - entry.firstAt > WINDOW_MS) {
    attempts.delete(key); // window expired, reset
  }
  return { allowed: true, retryAfter: 0 };
}

/** Record a failed attempt; blocks the key once MAX_ATTEMPTS is reached. */
export function recordFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now, blockedUntil: 0 });
    return;
  }
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
  }
}

/** Clear attempts after a successful login. */
export function recordSuccess(key: string): void {
  attempts.delete(key);
}

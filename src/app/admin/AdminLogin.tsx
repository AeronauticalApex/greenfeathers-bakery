"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ChickenMark from "@/components/ChickenMark";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "That code didn't work. Please try again.");
        setPassword("");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-16 text-center">
      <ChickenMark className="h-20 w-20 text-ink" />
      <h1 className="mt-6 font-serif text-4xl font-semibold text-green-800">Welcome back!</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/70">
        Enter your 6-digit code to manage the bakery menu.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-5">
        <input
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          pattern="[0-9]*"
          maxLength={6}
          required
          autoFocus
          aria-label="6-digit code"
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
          placeholder="● ● ● ● ● ●"
          className="w-full rounded-2xl border-2 border-cream-300 bg-cream-50 px-4 py-5 text-center text-3xl tracking-[0.4em] text-ink outline-none focus:border-green-700 focus:ring-4 focus:ring-green-700/15"
        />
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="w-full rounded-2xl bg-green-700 py-5 text-xl font-semibold text-cream-50 shadow-soft transition-colors hover:bg-green-800 disabled:opacity-50"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

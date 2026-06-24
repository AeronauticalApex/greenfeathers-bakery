"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import ChickenMark from "@/components/ChickenMark";
import { formatPrice } from "@/lib/format";
import { SECTIONS, type MenuItem, type Section, type SiteSettings, type WeeklyMenu } from "@/lib/types";

interface AdminEditorProps {
  initialMenu: WeeklyMenu | null;
  initialItems: MenuItem[];
  initialSettings: SiteSettings;
  writeEnabled: boolean;
}

type Tab = "week" | "catalog" | "settings";

type Draft = {
  id?: string;
  name: string;
  price: string;
  unit_note: string;
  section: Section;
  not_sourdough: boolean;
  available: boolean;
  sort_order: number;
  photo_url: string | null;
};

type Confirm = {
  message: string;
  confirmLabel: string;
  danger?: boolean;
  action: () => void | Promise<void>;
};

export default function AdminEditor({
  initialMenu,
  initialItems,
  initialSettings,
  writeEnabled,
}: AdminEditorProps) {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("week");
  const [menuId] = useState(initialMenu?.id);
  const [weekLabel, setWeekLabel] = useState(initialMenu?.week_label ?? "");
  const [deadline, setDeadline] = useState(initialMenu?.order_deadline ?? "");
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  // Which products to show on the "This Week" screen. Seeded with everything
  // already on the menu; items stay visible (toggling just flips ON/OFF in place)
  // so a tap never makes a card vanish confusingly.
  const [shown, setShown] = useState<Set<string>>(
    () => new Set(initialItems.filter((i) => i.available).map((i) => i.id)),
  );

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const onMenuCount = useMemo(() => items.filter((i) => i.available).length, [items]);
  const nextSort = useMemo(
    () => (items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1),
    [items],
  );

  function notify(kind: "ok" | "err", text: string) {
    setFlash({ kind, text });
    if (kind === "ok") setTimeout(() => setFlash((f) => (f?.text === text ? null : f)), 4000);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markShown(id: string) {
    setShown((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  // Persist to the API when connected; in preview mode act locally only so the
  // whole flow is fully usable. Returns false (and shows an error) on real failure.
  async function persist(url: string, method: string, body: unknown): Promise<boolean> {
    if (!writeEnabled) return true;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        notify("err", data.error || "Sorry, that didn't save. Please try again.");
        return false;
      }
      if (typeof window !== "undefined") router.refresh();
      return true;
    } catch {
      notify("err", "Couldn't reach the server. Please try again.");
      return false;
    }
  }

  // ---- Week details -------------------------------------------------------
  async function saveWeek() {
    if (!weekLabel.trim() || !deadline.trim()) {
      notify("err", "Please fill in both the week and the deadline.");
      return;
    }
    setBusy(true);
    const ok = await persist("/api/admin/menu", "PATCH", {
      id: menuId,
      week_label: weekLabel.trim(),
      order_deadline: deadline.trim(),
    });
    setBusy(false);
    if (ok) notify("ok", "Your menu is updated ✓");
  }

  // ---- Site settings (open/closed, flash sale, pickup) --------------------
  function setSetting<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function saveSettings() {
    setBusy(true);
    const ok = await persist("/api/admin/settings", "POST", {
      force_closed: settings.force_closed,
      closed_from: settings.closed_from || null,
      closed_to: settings.closed_to || null,
      closed_message: settings.closed_message,
      open_message: settings.open_message,
      flash_sale_enabled: settings.flash_sale_enabled,
      flash_sale_title: settings.flash_sale_title,
      flash_sale_body: settings.flash_sale_body,
      pickup_delivery_enabled: settings.pickup_delivery_enabled,
      pickup_delivery_title: settings.pickup_delivery_title,
      pickup_delivery_body: settings.pickup_delivery_body,
    });
    setBusy(false);
    if (ok) notify("ok", "Your site settings are updated ✓");
  }

  // ---- Put on / take off this week (instant) ------------------------------
  async function toggleAvailable(item: MenuItem) {
    const next = !item.available;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: next } : i)));
    markShown(item.id);
    notify("ok", next ? `“${item.name}” is on this week ✓` : `“${item.name}” taken off this week`);
    const ok = await persist("/api/admin/items", "PATCH", { id: item.id, available: next });
    if (!ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: item.available } : i)));
    }
  }

  // ---- Add / edit a product ----------------------------------------------
  function openNew() {
    setDraft({
      name: "",
      price: "",
      unit_note: "",
      section: SECTIONS[0],
      not_sourdough: false,
      available: true,
      sort_order: nextSort,
      photo_url: null,
    });
  }

  function openEdit(item: MenuItem) {
    setDraft({
      id: item.id,
      name: item.name,
      price: String(item.price),
      unit_note: item.unit_note,
      section: item.section,
      not_sourdough: item.not_sourdough,
      available: item.available,
      sort_order: item.sort_order,
      photo_url: item.photo_url,
    });
  }

  async function saveDraft() {
    if (!draft) return;
    if (!draft.name.trim()) return notify("err", "Please type a name for this product.");
    const price = Number(draft.price);
    if (!Number.isFinite(price) || price < 0) return notify("err", "Please type a price, like 15.");

    const fields = {
      name: draft.name.trim(),
      price,
      unit_note: draft.unit_note.trim(),
      section: draft.section,
      not_sourdough: draft.not_sourdough,
      available: draft.available,
      sort_order: draft.sort_order,
      photo_url: draft.photo_url,
    };

    setBusy(true);
    if (draft.id) {
      const ok = await persist("/api/admin/items", "PATCH", { id: draft.id, ...fields });
      setBusy(false);
      if (!ok) return;
      const id = draft.id;
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...fields } : i)));
      if (fields.available) markShown(id);
      setDraft(null);
      notify("ok", "Your catalog is updated ✓");
    } else {
      let created: MenuItem;
      if (writeEnabled) {
        try {
          const res = await fetch("/api/admin/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
          });
          const data = await res.json().catch(() => ({}));
          setBusy(false);
          if (!res.ok || !data.item) return notify("err", data.error || "Sorry, that didn't save.");
          created = data.item as MenuItem;
          router.refresh();
        } catch {
          setBusy(false);
          return notify("err", "Couldn't reach the server. Please try again.");
        }
      } else {
        created = { id: `local-${crypto.randomUUID()}`, ...fields };
        setBusy(false);
      }
      setItems((prev) => [...prev, created]);
      if (created.available) markShown(created.id);
      setDraft(null);
      notify("ok", `“${created.name}” added to your catalog ✓`);
    }
  }

  // ---- Remove a product ---------------------------------------------------
  function askRemove(item: { id: string; name: string }) {
    setConfirm({
      message: `Remove ${item.name} from your catalog? This can't be undone.`,
      confirmLabel: "Yes, remove it",
      danger: true,
      action: async () => {
        setBusy(true);
        const ok = await persist("/api/admin/items", "DELETE", { id: item.id });
        setBusy(false);
        if (!ok) return;
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setDraft(null);
        notify("ok", `“${item.name}” removed from your catalog ✓`);
      },
    });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  // Products to show on the This Week screen, grouped by section.
  const weekSections = SECTIONS.map((section) => ({
    section,
    rows: items
      .filter((i) => shown.has(i.id) && i.section === section)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((g) => g.rows.length > 0);

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6 text-lg sm:px-6">
      {/* Friendly header */}
      <header>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ChickenMark className="h-12 w-12 flex-none text-ink" />
            <h1 className="font-serif text-2xl font-semibold leading-tight text-green-800 sm:text-3xl">
              Hi! Here&apos;s your bakery.
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex-none rounded-full border-2 border-cream-300 px-4 py-2 text-base font-semibold text-ink/70 transition-colors hover:bg-cream-200"
          >
            Log out
          </button>
        </div>

        {/* Nav */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-full bg-cream-200/70 p-1.5 font-semibold">
          {([
            { id: "week" as Tab, label: "This Week" },
            { id: "catalog" as Tab, label: "All Products" },
            { id: "settings" as Tab, label: "Settings" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3 py-3 text-base transition-colors ${
                tab === t.id ? "bg-green-700 text-cream-50 shadow-card" : "text-green-800 hover:bg-cream-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Standing preview note */}
      {!writeEnabled && (
        <p className="mt-5 rounded-2xl border-2 border-amber-300/80 bg-amber-50 px-5 py-4 text-base leading-relaxed text-amber-900">
          You&apos;re in <strong>preview mode</strong>. You can try everything here, but changes
          won&apos;t be saved until your bakery&apos;s database is connected.
        </p>
      )}

      {/* Worded success / error message */}
      {flash && (
        <div
          className={`mt-5 flex items-center gap-3 rounded-2xl px-5 py-4 text-lg font-medium ${
            flash.kind === "ok"
              ? "bg-green-700 text-cream-50 shadow-soft"
              : "bg-red-50 text-red-700 ring-2 ring-red-200"
          }`}
          role="status"
        >
          <span>{flash.text}</span>
        </div>
      )}

      {/* ============================= THIS WEEK ============================= */}
      {tab === "week" && (
        <div className="mt-7 space-y-8">
          {/* Week details */}
          <section className="rounded-3xl border-2 border-cream-300/80 bg-cream-50 p-5 shadow-card sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-green-800">Your week</h2>
            <div className="mt-5 space-y-5">
              <BigField label="Week name" helper="e.g. Menu for June 12">
                <input
                  value={weekLabel}
                  onChange={(e) => setWeekLabel(e.target.value)}
                  placeholder="Menu for June 12"
                  className={inputClass}
                />
              </BigField>
              <BigField label="Order deadline" helper="e.g. Order by 8 PM Tuesday June 9">
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Order by 8 PM Tuesday June 9"
                  className={inputClass}
                />
              </BigField>
              <button
                onClick={saveWeek}
                disabled={busy}
                className="w-full rounded-2xl bg-green-700 py-4 text-xl font-semibold text-cream-50 shadow-soft transition-colors hover:bg-green-800 disabled:opacity-50"
              >
                Save the week
              </button>
            </div>
          </section>

          {/* This week's menu */}
          <section>
            <h2 className="font-serif text-3xl font-semibold text-green-800">This week&apos;s menu</h2>
            <p className="mt-1 text-xl text-ink/70">
              {onMenuCount} {onMenuCount === 1 ? "item" : "items"} on the menu
            </p>

            <button
              onClick={() => {
                setSearch("");
                setPickerOpen(true);
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-green-700/50 bg-green-50 py-5 text-xl font-semibold text-green-800 transition-colors hover:bg-green-100"
            >
              <span className="text-2xl leading-none">+</span> Add something to this week
            </button>

            {weekSections.length === 0 ? (
              <p className="mt-6 rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50 px-5 py-10 text-center text-lg text-ink/60">
                Nothing on the menu yet. Tap the green button above to add your first item.
              </p>
            ) : (
              weekSections.map(({ section, rows }) => (
                <div key={section} className="mt-7">
                  <h3 className="mb-3 font-serif text-xl font-semibold text-crust">{section}</h3>
                  <ul className="space-y-3">
                    {rows.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleAvailable(item)}
                          aria-pressed={item.available}
                          className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all active:scale-[0.99] ${
                            item.available
                              ? "border-green-700 bg-green-50"
                              : "border-cream-300 bg-cream-100/60"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                              item.available
                                ? "border-green-700 bg-green-700 text-cream-50"
                                : "border-cream-300 bg-white text-transparent"
                            }`}
                          >
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`block text-xl font-semibold ${item.available ? "text-ink" : "text-ink/55"}`}>
                              {item.name}
                              {item.not_sourdough && <sup className="text-crust">*</sup>}
                              {item.unit_note && <span className="ml-1.5 text-base font-normal text-ink/50">{item.unit_note}</span>}
                            </span>
                            <span className="mt-0.5 block text-base">
                              <span className="font-semibold text-green-800">{formatPrice(item.price)}</span>
                              <span className={item.available ? "text-green-700" : "text-ink/45"}>
                                {" "}· {item.available ? "On the menu" : "Not this week, tap to add"}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>
        </div>
      )}

      {/* ============================= CATALOG ============================= */}
      {tab === "catalog" && (
        <div className="mt-7">
          <h2 className="font-serif text-3xl font-semibold text-green-800">All your products</h2>
          <p className="mt-1 text-xl text-ink/70">{items.length} products in your catalog</p>

          <button
            onClick={openNew}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 py-5 text-xl font-semibold text-cream-50 shadow-soft transition-colors hover:bg-green-800"
          >
            <span className="text-2xl leading-none">+</span> Add a new product
          </button>

          {SECTIONS.map((section) => {
            const rows = items
              .filter((i) => i.section === section)
              .sort((a, b) => a.sort_order - b.sort_order);
            if (rows.length === 0) return null;
            return (
              <div key={section} className="mt-7">
                <h3 className="mb-3 font-serif text-xl font-semibold text-crust">{section}</h3>
                <ul className="space-y-3">
                  {rows.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border-2 border-cream-300 bg-cream-50 px-5 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xl font-semibold text-ink">
                          {item.name}
                          {item.not_sourdough && <sup className="text-crust">*</sup>}
                          {item.unit_note && <span className="ml-1.5 text-base font-normal text-ink/50">{item.unit_note}</span>}
                        </p>
                        <p className="mt-0.5 text-base">
                          <span className="font-semibold text-green-800">{formatPrice(item.price)}</span>
                          <span className={item.available ? "text-green-700" : "text-ink/45"}>
                            {" "}· {item.available ? "on this week" : "not this week"}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => openEdit(item)}
                        className="flex-none rounded-full border-2 border-green-700 px-5 py-2.5 text-base font-semibold text-green-800 transition-colors hover:bg-green-700 hover:text-cream-50"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================= SETTINGS ============================= */}
      {tab === "settings" && (
        <div className="mt-7 space-y-8">
          {/* Open / Closed */}
          <section className="rounded-3xl border-2 border-cream-300/80 bg-cream-50 p-5 shadow-card sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-green-800">Open or closed</h2>
            <p className="mt-1 text-base text-ink/60">
              Show a notice across the whole website when you&apos;re away or on a break.
            </p>
            <div className="mt-5 space-y-5">
              <ToggleRow
                label="Close the bakery now"
                helper="Turns on the closed notice right away"
                on={settings.force_closed}
                onClick={() => setSetting("force_closed", !settings.force_closed)}
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <BigField label="Closed from" helper="Leave blank if not planning ahead">
                  <input
                    type="date"
                    value={settings.closed_from ?? ""}
                    onChange={(e) => setSetting("closed_from", e.target.value || null)}
                    className={inputClass}
                  />
                </BigField>
                <BigField label="Closed until" helper="The day you reopen">
                  <input
                    type="date"
                    value={settings.closed_to ?? ""}
                    onChange={(e) => setSetting("closed_to", e.target.value || null)}
                    className={inputClass}
                  />
                </BigField>
              </div>
              <BigField label="Closed message" helper="Shown when the bakery is closed">
                <textarea
                  value={settings.closed_message}
                  onChange={(e) => setSetting("closed_message", e.target.value)}
                  rows={2}
                  className={textareaClass}
                />
              </BigField>
              <BigField label="Open message" helper="Shown in the green bar when you're open">
                <input
                  value={settings.open_message}
                  onChange={(e) => setSetting("open_message", e.target.value)}
                  className={inputClass}
                />
              </BigField>
            </div>
          </section>

          {/* Friday Flash Sale */}
          <section className="rounded-3xl border-2 border-crust/40 bg-cream-50 p-5 shadow-card sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-crust">Friday Flash Sale</h2>
            <p className="mt-1 text-base text-ink/60">A promo box near the top of the home page.</p>
            <div className="mt-5 space-y-5">
              <ToggleRow
                label="Show flash sale"
                on={settings.flash_sale_enabled}
                onClick={() => setSetting("flash_sale_enabled", !settings.flash_sale_enabled)}
              />
              <BigField label="Title" helper="e.g. Friday Flash Sale">
                <input
                  value={settings.flash_sale_title}
                  onChange={(e) => setSetting("flash_sale_title", e.target.value)}
                  className={inputClass}
                />
              </BigField>
              <BigField label="Details">
                <textarea
                  value={settings.flash_sale_body}
                  onChange={(e) => setSetting("flash_sale_body", e.target.value)}
                  rows={4}
                  className={textareaClass}
                />
              </BigField>
            </div>
          </section>

          {/* Pick-Up / Delivery */}
          <section className="rounded-3xl border-2 border-cream-300/80 bg-cream-50 p-5 shadow-card sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-green-800">Pick-Up &amp; Delivery</h2>
            <p className="mt-1 text-base text-ink/60">A section near the how-to-order steps.</p>
            <div className="mt-5 space-y-5">
              <ToggleRow
                label="Show this section"
                on={settings.pickup_delivery_enabled}
                onClick={() => setSetting("pickup_delivery_enabled", !settings.pickup_delivery_enabled)}
              />
              <BigField label="Title" helper="e.g. Pick-Up & Delivery">
                <input
                  value={settings.pickup_delivery_title}
                  onChange={(e) => setSetting("pickup_delivery_title", e.target.value)}
                  className={inputClass}
                />
              </BigField>
              <BigField label="Details">
                <textarea
                  value={settings.pickup_delivery_body}
                  onChange={(e) => setSetting("pickup_delivery_body", e.target.value)}
                  rows={4}
                  className={textareaClass}
                />
              </BigField>
            </div>
          </section>

          <button
            onClick={saveSettings}
            disabled={busy}
            className="w-full rounded-2xl bg-green-700 py-4 text-xl font-semibold text-cream-50 shadow-soft transition-colors hover:bg-green-800 disabled:opacity-50"
          >
            Save site settings
          </button>
        </div>
      )}

      <p className="mt-12 text-center">
        <Link href="/" className="text-base text-green-700 underline-offset-4 hover:underline">
          See your live website ↗
        </Link>
      </p>

      {/* ---- Add-to-this-week picker ---- */}
      {pickerOpen && (
        <Sheet onClose={() => setPickerOpen(false)} title="Add to this week">
          <div className="border-b-2 border-cream-200 px-5 pb-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your products…"
              autoFocus
              aria-label="Search your products"
              className={inputClass}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {(() => {
              const q = search.trim().toLowerCase();
              const match = (i: MenuItem) =>
                !q || i.name.toLowerCase().includes(q) || i.section.toLowerCase().includes(q);
              const anyShown = items.some(match);
              return (
                <>
                  {SECTIONS.map((section) => {
                    const rows = items
                      .filter((i) => i.section === section && match(i))
                      .sort((a, b) => a.sort_order - b.sort_order);
                    if (rows.length === 0) return null;
                    return (
                      <div key={section} className="mb-5">
                        <h3 className="mb-3 font-serif text-xl font-semibold text-crust">{section}</h3>
                        <ul className="space-y-3">
                          {rows.map((item) => (
                            <li key={item.id}>
                              <button
                                onClick={() => toggleAvailable(item)}
                                aria-pressed={item.available}
                                className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all active:scale-[0.99] ${
                                  item.available
                                    ? "border-green-700 bg-green-50"
                                    : "border-cream-300 bg-white hover:bg-cream-50"
                                }`}
                              >
                                <span
                                  className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 ${
                                    item.available
                                      ? "border-green-700 bg-green-700 text-cream-50"
                                      : "border-cream-300 bg-white text-transparent"
                                  }`}
                                >
                                  {item.available ? (
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  ) : (
                                    <span className="text-2xl leading-none text-green-700">+</span>
                                  )}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-lg font-semibold text-ink">
                                    {item.name}
                                    {item.not_sourdough && <sup className="text-crust">*</sup>}
                                    {item.unit_note && <span className="ml-1.5 text-base font-normal text-ink/50">{item.unit_note}</span>}
                                  </span>
                                  <span className="block text-base text-ink/55">
                                    {formatPrice(item.price)}
                                    {item.available && <span className="text-green-700"> · already on</span>}
                                  </span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  {!anyShown && (
                    <p className="py-10 text-center text-lg text-ink/55">
                      No products match &ldquo;{search}&rdquo;.
                    </p>
                  )}
                </>
              );
            })()}
          </div>
          <div className="border-t-2 border-cream-200 p-5">
            <button
              onClick={() => setPickerOpen(false)}
              className="w-full rounded-2xl bg-green-700 py-4 text-xl font-semibold text-cream-50 hover:bg-green-800"
            >
              Done
            </button>
          </div>
        </Sheet>
      )}

      {/* ---- Product editor ---- */}
      {draft && (
        <Sheet onClose={() => setDraft(null)} title={draft.id ? "Edit product" : "Add a product"}>
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <PhotoUploader
              value={draft.photo_url}
              onChange={(url) => setDraft({ ...draft, photo_url: url })}
              notify={notify}
            />
            <BigField label="Name" helper="e.g. Blueberry-Lemon">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                autoFocus
                className={inputClass}
              />
            </BigField>
            <BigField label="Price (dollars)" helper="e.g. 15">
              <input
                inputMode="decimal"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                placeholder="15"
                className={inputClass}
              />
            </BigField>
            <BigField label="How many in a batch? (optional)" helper="e.g. (6) or (loaf only)">
              <input
                value={draft.unit_note}
                onChange={(e) => setDraft({ ...draft, unit_note: e.target.value })}
                placeholder="(6)"
                className={inputClass}
              />
            </BigField>
            <BigField label="Section">
              <select
                value={draft.section}
                onChange={(e) => setDraft({ ...draft, section: e.target.value as Section })}
                className={inputClass}
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </BigField>

            <ToggleRow
              label="Put on this week's menu"
              on={draft.available}
              onClick={() => setDraft({ ...draft, available: !draft.available })}
            />
            <ToggleRow
              label="Made without sourdough"
              helper="Adds a little * note on the menu"
              on={draft.not_sourdough}
              onClick={() => setDraft({ ...draft, not_sourdough: !draft.not_sourdough })}
            />

            {draft.id && (
              <button
                onClick={() => askRemove({ id: draft.id!, name: draft.name.trim() || "this product" })}
                className="w-full rounded-2xl border-2 border-red-300 py-4 text-lg font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                Remove from catalog
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t-2 border-cream-200 p-5">
            <button
              onClick={() => setDraft(null)}
              className="rounded-2xl border-2 border-cream-300 py-4 text-lg font-semibold text-ink/70 hover:bg-cream-200"
            >
              Cancel
            </button>
            <button
              onClick={saveDraft}
              disabled={busy}
              className="rounded-2xl bg-green-700 py-4 text-lg font-semibold text-cream-50 hover:bg-green-800 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </Sheet>
      )}

      {/* ---- Plain-English confirmation ---- */}
      {confirm && (
        <Sheet onClose={() => setConfirm(null)} title="Just checking…">
          <div className="p-6">
            <p className="text-xl leading-relaxed text-ink">{confirm.message}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t-2 border-cream-200 p-5">
            <button
              onClick={() => setConfirm(null)}
              className="rounded-2xl border-2 border-cream-300 py-4 text-lg font-semibold text-ink/70 hover:bg-cream-200"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                const action = confirm.action;
                setConfirm(null);
                await action();
              }}
              disabled={busy}
              className={`rounded-2xl py-4 text-lg font-semibold text-cream-50 disabled:opacity-50 ${
                confirm.danger ? "bg-red-600 hover:bg-red-700" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {confirm.confirmLabel}
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-lg text-ink outline-none focus:border-green-700 focus:ring-4 focus:ring-green-700/15";

const textareaClass = `${inputClass} min-h-[5rem] resize-y leading-relaxed`;

// Resize an image in the browser to a sensible max dimension before upload,
// returning a JPEG data URL. Keeps uploads small and fast on phone connections.
function resizeImage(file: File, maxDim = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        let { width, height } = img;
        if (width >= height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > width && height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function PhotoUploader({
  value,
  onChange,
  notify,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  notify: (kind: "ok" | "err", text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file);
      let url = dataUrl;
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl }),
        });
        if (res.ok) {
          const d = await res.json();
          url = d.url;
        } else {
          notify("ok", "Photo added. It'll be saved for real once your storage is connected.");
        }
      } catch {
        /* keep the data URL so the photo still shows */
      }
      onChange(url);
    } catch {
      notify("err", "Sorry, couldn't read that photo. Try a different one.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="block text-lg font-semibold text-ink">Photo</span>
      <span className="mb-2 block text-base text-ink/55">
        A nice photo makes this a big featured item on the menu.
      </span>
      {value ? (
        <div className="overflow-hidden rounded-2xl border-2 border-cream-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Product photo preview" className="h-48 w-full object-cover" />
          <div className="grid grid-cols-2 gap-2 p-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl border-2 border-cream-300 py-3 text-base font-semibold text-ink/70 hover:bg-cream-200"
            >
              Change photo
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-xl border-2 border-red-200 py-3 text-base font-semibold text-red-600 hover:bg-red-50"
            >
              Remove photo
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-green-700/50 bg-green-50 py-9 text-lg font-semibold text-green-800 transition-colors hover:bg-green-100 disabled:opacity-60"
        >
          {uploading ? "Adding photo…" : "📷  Add a photo"}
        </button>
      )}
      {value && uploading && <p className="mt-2 text-base text-ink/60">Adding photo…</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function BigField({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-lg font-semibold text-ink">{label}</span>
      {helper && <span className="mb-1.5 block text-base text-ink/55">{helper}</span>}
      {children}
    </label>
  );
}

function ToggleRow({
  label,
  helper,
  on,
  onClick,
}: {
  label: string;
  helper?: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
        on ? "border-green-700 bg-green-50" : "border-cream-300 bg-white"
      }`}
    >
      <span>
        <span className="block text-lg font-semibold text-ink">{label}</span>
        {helper && <span className="block text-sm text-ink/55">{helper}</span>}
      </span>
      <span
        className={`flex h-8 w-14 flex-none items-center rounded-full px-1 transition-colors ${
          on ? "justify-end bg-green-700" : "justify-start bg-cream-300"
        }`}
      >
        <span className="h-6 w-6 rounded-full bg-white shadow" />
      </span>
    </button>
  );
}

// A warm bottom-sheet (mobile) / centered card (desktop) used for the picker,
// the product form, and confirmations.
function Sheet({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="animate-fade-up flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-cream-100 shadow-soft sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <h2 className="font-serif text-2xl font-semibold text-green-800">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-2xl text-ink/50 hover:bg-cream-200"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

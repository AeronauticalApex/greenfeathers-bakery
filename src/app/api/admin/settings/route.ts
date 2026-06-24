import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getServiceClient, isAdminWriteConfigured } from "@/lib/supabase";

interface SettingsBody {
  force_closed?: boolean;
  closed_from?: string | null;
  closed_to?: string | null;
  closed_message?: string;
  open_message?: string;
  flash_sale_enabled?: boolean;
  flash_sale_title?: string;
  flash_sale_body?: string;
  pickup_delivery_enabled?: boolean;
  pickup_delivery_title?: string;
  pickup_delivery_body?: string;
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");
// Date inputs come through as "YYYY-MM-DD" or ""; store blank as null.
const dateOrNull = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;

// Upsert the single site_settings row (id = 1).
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!isAdminWriteConfigured()) {
    return NextResponse.json(
      { error: "Supabase isn't connected yet, so changes can't be saved." },
      { status: 503 },
    );
  }

  let body: SettingsBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const row = {
    id: 1,
    force_closed: Boolean(body.force_closed),
    closed_from: dateOrNull(body.closed_from),
    closed_to: dateOrNull(body.closed_to),
    closed_message: str(body.closed_message),
    open_message: str(body.open_message),
    flash_sale_enabled: Boolean(body.flash_sale_enabled),
    flash_sale_title: str(body.flash_sale_title),
    flash_sale_body: str(body.flash_sale_body),
    pickup_delivery_enabled: Boolean(body.pickup_delivery_enabled),
    pickup_delivery_title: str(body.pickup_delivery_title),
    pickup_delivery_body: str(body.pickup_delivery_body),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await getServiceClient()!
    .from("site_settings")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, settings: data });
}

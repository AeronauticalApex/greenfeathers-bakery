import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getServiceClient, isAdminWriteConfigured } from "@/lib/supabase";
import { SECTIONS } from "@/lib/types";

interface ItemBody {
  id?: string;
  name?: string;
  price?: number;
  unit_note?: string;
  section?: string;
  not_sourdough?: boolean;
  sort_order?: number;
  available?: boolean;
  photo_url?: string | null;
}

async function guard() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!isAdminWriteConfigured()) {
    return NextResponse.json(
      { error: "Supabase isn't connected yet, so changes can't be saved. Add your Supabase keys to .env.local." },
      { status: 503 },
    );
  }
  return null;
}

function validate(body: ItemBody): { fields: Record<string, unknown> } | { error: string } {
  const name = (body.name ?? "").trim();
  if (!name) return { error: "Item name is required." };

  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) return { error: "Price must be a valid amount." };

  const section = body.section ?? "";
  if (!SECTIONS.includes(section as (typeof SECTIONS)[number])) {
    return { error: "Please choose a valid section." };
  }

  return {
    fields: {
      name,
      price,
      unit_note: (body.unit_note ?? "").trim(),
      section,
      not_sourdough: Boolean(body.not_sourdough),
      sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
      available: body.available === undefined ? true : Boolean(body.available),
      photo_url: typeof body.photo_url === "string" && body.photo_url.trim() ? body.photo_url.trim() : null,
    },
  };
}

// Create a new item.
export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: ItemBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validate(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const { data, error } = await getServiceClient()!
    .from("menu_items")
    .insert(result.fields)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, item: data });
}

// Update an existing item (full fields, or a partial toggle of `available`).
export async function PATCH(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: ItemBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "Missing item id." }, { status: 400 });

  // Quick availability toggle: only `available` provided alongside id.
  const keys = Object.keys(body).filter((k) => k !== "id");
  if (keys.length === 1 && keys[0] === "available") {
    const { error } = await getServiceClient()!
      .from("menu_items")
      .update({ available: Boolean(body.available) })
      .eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const result = validate(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const { error } = await getServiceClient()!
    .from("menu_items")
    .update(result.fields)
    .eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// Remove an item.
export async function DELETE(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "Missing item id." }, { status: 400 });

  const { error } = await getServiceClient()!
    .from("menu_items")
    .delete()
    .eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getServiceClient, isAdminWriteConfigured } from "@/lib/supabase";

// Update the active week's label + deadline text.
export async function PATCH(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!isAdminWriteConfigured()) {
    return NextResponse.json(
      { error: "Supabase isn't connected yet, so changes can't be saved. Add your Supabase keys to .env.local." },
      { status: 503 },
    );
  }

  let body: { id?: string; week_label?: string; order_deadline?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const week_label = (body.week_label ?? "").trim();
  const order_deadline = (body.order_deadline ?? "").trim();
  if (!week_label || !order_deadline) {
    return NextResponse.json(
      { error: "Both the week label and deadline are required." },
      { status: 400 },
    );
  }

  const client = getServiceClient()!;

  // Find or create the single active week.
  if (body.id) {
    const { error } = await client
      .from("weekly_menu")
      .update({ week_label, order_deadline })
      .eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const { data, error } = await client
    .from("weekly_menu")
    .insert({ week_label, order_deadline, active: true })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, menu: data });
}

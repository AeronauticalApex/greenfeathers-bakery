import crypto from "crypto";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getServiceClient, isAdminWriteConfigured } from "@/lib/supabase";

const BUCKET = "menu-photos";

// Receives an already-browser-resized image (data URL) and stores it in the
// public bucket, returning its public URL. The client falls back to showing the
// data URL inline when storage isn't connected (preview mode).
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!isAdminWriteConfigured()) {
    return NextResponse.json(
      { error: "Photo storage isn't connected yet. Connect Supabase to save photos." },
      { status: 503 },
    );
  }

  let dataUrl = "";
  try {
    const body = await req.json();
    dataUrl = typeof body?.dataUrl === "string" ? body.dataUrl : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const match = dataUrl.match(/^data:(image\/(png|jpe?g|webp));base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "That doesn't look like an image." }, { status: 400 });
  }
  const contentType = match[1];
  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const buffer = Buffer.from(match[3], "base64");

  // Guard against oversized uploads (resized client-side, so this is generous).
  if (buffer.byteLength > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "That image is too large." }, { status: 413 });
  }

  const client = getServiceClient()!;
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await client.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}

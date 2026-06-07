import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const EXPECTED_TOKEN = "8kj1p4oxwpz";

function pickEmail(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const customer =
    obj.customer && typeof obj.customer === "object"
      ? (obj.customer as Record<string, unknown>)
      : null;

  const directCandidates = [
    obj.email,
    obj.buyer_email,
    obj.customer_email,
    customer?.email,
    obj.client_email,
    obj.user_email,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim().toLowerCase();
    }
  }

  return null;
}

function pickPlan(payload: unknown): "premium" | "free" {
  if (!payload || typeof payload !== "object") return "premium";
  const obj = payload as Record<string, unknown>;
  const event = String(obj.event ?? obj.type ?? obj.action ?? "").toLowerCase();
  const status = String(obj.status ?? obj.payment_status ?? obj.sale_status ?? "").toLowerCase();
  const refund = event.includes("refund") || event.includes("chargeback") || status.includes("refund") || status.includes("chargeback");
  return refund ? "free" : "premium";
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token !== EXPECTED_TOKEN) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const email = pickEmail(payload);

  if (!email) {
    return NextResponse.json({ error: "E-mail não encontrado no payload" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Configuração inválida" },
      { status: 500 },
    );
  }

  const plan = pickPlan(payload);

  const { data: profiles, error: selectError } = await supabase
    .from("profiles")
    .select("id,email,plan")
    .ilike("email", email)
    .limit(1);

  if (selectError) {
    return NextResponse.json(
      { error: selectError.message },
      { status: 500 },
    );
  }

  const profile = profiles?.[0];

  if (!profile) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Webhook recebido, mas nenhum perfil com este e-mail foi encontrado no Supabase.",
        email,
        plan,
      },
      { status: 202 },
    );
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      plan,
      email,
    })
    .eq("id", profile.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    email,
    plan,
  });
}

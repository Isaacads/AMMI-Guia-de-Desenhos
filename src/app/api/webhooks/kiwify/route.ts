import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const EXPECTED_TOKEN = "8kj1p4oxwpz";

function searchStringValue(
  value: unknown,
  keys: string[],
  transform?: (input: string) => string | null,
): string | null {
  const visited = new WeakSet<object>();

  const walk = (current: unknown): string | null => {
    if (!current || typeof current !== "object") return null;

    const obj = current as Record<string, unknown>;
    if (visited.has(obj)) return null;
    visited.add(obj);

    for (const key of keys) {
      const candidate = obj[key];
      if (typeof candidate === "string") {
        const normalized = transform ? transform(candidate) : candidate.trim();
        if (normalized) return normalized;
      }
    }

    for (const nested of Object.values(obj)) {
      if (nested && typeof nested === "object") {
        const found = walk(nested);
        if (found) return found;
      }
    }

    return null;
  };

  return walk(value);
}

function pickEmail(payload: unknown): string | null {
  return searchStringValue(
    payload,
    [
      "email",
      "buyer_email",
      "customer_email",
      "client_email",
      "user_email",
    ],
    (input) => {
      const trimmed = input.trim().toLowerCase();
      return trimmed ? trimmed : null;
    },
  );
}

function pickCpf(payload: unknown): string | null {
  return searchStringValue(
    payload,
    [
      "cpf",
      "buyer_cpf",
      "customer_cpf",
      "document",
      "document_number",
    ],
    (input) => {
      const digits = input.replace(/\D/g, "");
      return digits || null;
    },
  );
}

function pickPlan(payload: unknown): "premium" | "free" {
  const event = pickTrigger(payload);
  const status = pickStatus(payload);
  const refund = event.includes("refund") || event.includes("chargeback") || status.includes("refund") || status.includes("chargeback");
  return refund ? "free" : "premium";
}

function pickTrigger(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const found = searchStringValue(payload, ["event", "type", "action", "trigger"]);
  return String(found ?? "").toLowerCase();
}

function pickStatus(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const found = searchStringValue(payload, [
    "status",
    "payment_status",
    "sale_status",
  ]);
  return String(found ?? "").toLowerCase();
}

function isAccessEvent(trigger: string, status: string): boolean {
  const text = `${trigger} ${status}`;

  return [
    "purchase_approved",
    "compra_aprovada",
    "compra aprovada",
    "payment_approved",
    "paid",
    "approved",
    "completed",
    "refund",
    "refunded",
    "reembolso",
    "chargeback",
  ].some((term) => text.includes(term));
}

async function findAuthUserByEmail(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  email: string,
) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw error;
    }

    const match = data.users.find(
      (user) => String(user.email ?? "").trim().toLowerCase() === email,
    );

    if (match) return match;

    if (data.users.length < 1000) break;
  }

  return null;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token !== EXPECTED_TOKEN) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const email = pickEmail(payload);
  const cpf = pickCpf(payload);
  const trigger = pickTrigger(payload);
  const status = pickStatus(payload);

  if (!isAccessEvent(trigger, status)) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      trigger,
      status,
      email: email ?? null,
      message: "Evento recebido sem alterar acesso.",
    });
  }

  if (!email) {
    console.error("Kiwify webhook sem e-mail", {
      trigger,
      status,
      payload,
    });

    return NextResponse.json({
      ok: true,
      accessUpdated: false,
      trigger,
      status,
      error: "E-mail não encontrado no payload.",
    });
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

  let authUser = await findAuthUserByEmail(supabase, email);
  let createdAuthUser = false;

  if (!authUser) {
    if (!cpf) {
      console.error("Kiwify webhook sem CPF para novo usuário", {
        email,
        trigger,
        status,
        payload,
      });

      return NextResponse.json({
        ok: true,
        accessUpdated: false,
        email,
        trigger,
        status,
        error:
          "CPF não encontrado no payload. Não foi possível criar a senha inicial.",
      });
    }

    const { data: createdUser, error: createUserError } =
      await supabase.auth.admin.createUser({
        email,
        password: cpf,
        email_confirm: true,
      });

    if (createUserError) {
      return NextResponse.json(
        { error: createUserError.message },
        { status: 500 },
      );
    }

    authUser = createdUser.user ?? null;
    createdAuthUser = true;
  }

  if (!authUser?.id) {
    return NextResponse.json(
      {
        error:
          "Usuário não encontrado no Auth e também não foi possível criar um novo usuário.",
      },
      { status: 500 },
    );
  }

  const { error: upsertProfileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: authUser.id,
        email,
        plan,
        full_name: null,
        first_access_notice_seen: false,
      },
      { onConflict: "id" },
    );

  if (upsertProfileError) {
    return NextResponse.json(
      { error: upsertProfileError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    email,
    plan,
    cpfReceived: !!cpf,
    createdAuthUser,
    trigger,
  });
}

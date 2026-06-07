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
  if (!payload || typeof payload !== "object") return "premium";
  const obj = payload as Record<string, unknown>;
  const event = String(obj.event ?? obj.type ?? obj.action ?? "").toLowerCase();
  const status = String(obj.status ?? obj.payment_status ?? obj.sale_status ?? "").toLowerCase();
  const refund = event.includes("refund") || event.includes("chargeback") || status.includes("refund") || status.includes("chargeback");
  return refund ? "free" : "premium";
}

function pickTrigger(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const found = searchStringValue(payload, ["event", "type", "action", "trigger"]);
  return String(found ?? "").toLowerCase();
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

  if (trigger.includes("pix_gerado")) {
    return NextResponse.json({
      ok: true,
      plan: "free",
      trigger,
      pixGenerated: true,
      email: email ?? null,
    });
  }

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

  let authUser = await findAuthUserByEmail(supabase, email);
  let createdAuthUser = false;

  if (!authUser) {
    if (!cpf) {
      return NextResponse.json(
        {
          error:
            "CPF não encontrado no payload. Não é possível criar a senha inicial sem ele.",
        },
        { status: 400 },
      );
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

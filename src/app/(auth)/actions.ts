"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null) {
  if (!next) return null;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  return trimmed;
}

function authPath(
  base: "/entrar" | "/cadastro" | "/recuperar-senha",
  params: Record<string, string | null>,
) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  return `${base}?${searchParams.toString()}`;
}

function authErrorPath(
  base: "/entrar" | "/cadastro" | "/recuperar-senha",
  message: string,
  next: string | null,
) {
  const params = new URLSearchParams({ erro: message });
  if (next) params.set("next", next);
  return `${base}?${params.toString()}`;
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? "") || null);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(authErrorPath("/entrar", error.message, next));
  }

  redirect(next ?? "/meu-acesso");
}

export async function signUpWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const next = safeNextPath(String(formData.get("next") ?? "") || null);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(authErrorPath("/cadastro", error.message, next));
  }

  if (data.user) {
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        email,
        full_name: fullName || null,
        plan: "free",
      },
      { onConflict: "id" },
    );
  }

  redirect(next ?? "/meu-acesso");
}

export async function sendPasswordResetEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(authErrorPath("/recuperar-senha", "Informe seu email.", null));
  }

  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    `${headersList.get("x-forwarded-proto") ?? "http"}://${headersList.get("host")}`;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/alterar-senha`,
  });

  if (error) {
    redirect(authErrorPath("/recuperar-senha", error.message, null));
  }

  redirect(
    authPath("/recuperar-senha", {
      sucesso:
        "Enviamos um link para alterar sua senha. Confira seu email e siga as instruções.",
    }),
  );
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

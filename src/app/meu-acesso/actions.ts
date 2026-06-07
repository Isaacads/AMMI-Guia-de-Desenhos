"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addChild(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const age = Number(formData.get("age") ?? 0);
  const neurodivergence = String(formData.get("neurodivergence") ?? "").trim();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/entrar");

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email ?? null,
        plan: "free",
      });
    }
  } catch {}

  if (!name || !Number.isFinite(age) || age < 0 || age > 12) {
    redirect("/meu-acesso?erro=Dados%20inv%C3%A1lidos");
  }

  const neuro =
    neurodivergence.length > 0
      ? neurodivergence
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const { error } = await supabase.from("children").insert({
    user_id: data.user.id,
    name,
    age,
    neurodivergence: neuro,
  });

  if (error) {
    if (error.message.includes("children_user_id_fkey")) {
      redirect(
        `/meu-acesso?erro=${encodeURIComponent(
          "Perfil não inicializado no banco. Rode o schema.sql no Supabase e tente novamente.",
        )}`,
      );
    }
    redirect(`/meu-acesso?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/meu-acesso");
}

export async function markFirstAccessNoticeSeen() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");

  await supabase
    .from("profiles")
    .update({ first_access_notice_seen: true })
    .eq("id", data.user.id);

  redirect("/meu-acesso");
}

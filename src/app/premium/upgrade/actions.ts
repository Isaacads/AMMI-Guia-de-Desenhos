"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function setPlan(plan: "free" | "premium") {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/entrar?next=/premium/upgrade");

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      plan,
    },
    { onConflict: "id" },
  );

  revalidatePath("/meu-acesso");
  revalidatePath("/premium/catalogo");
  revalidatePath("/premium/consultorio");
  revalidatePath("/premium/plano");
  revalidatePath("/premium/recomendador");
  revalidatePath("/premium/relatorios");
  revalidatePath("/premium/upgrade");
}

export async function activatePremium() {
  await setPlan("premium");
  redirect("/meu-acesso");
}

export async function returnToFree() {
  await setPlan("free");
  redirect("/meu-acesso");
}

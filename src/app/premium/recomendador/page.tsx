import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { RecomendadorClient } from "@/app/premium/recomendador/RecomendadorClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RecomendadorPage({
  searchParams,
}: {
  searchParams?: Promise<{ idade?: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Frecomendador");

  const sp = searchParams ? await searchParams : undefined;
  const initialAge = Math.min(
    12,
    Math.max(0, Number(sp?.idade ?? 5) || 5),
  );

  const supabase = await createSupabaseServerClient();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  let plan: "free" | "premium" = viewer.plan;
  let used = 0;
  let limit: number | null = plan === "premium" ? null : 5;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", viewer.userId)
      .maybeSingle();
    plan = profile?.plan === "premium" ? "premium" : "free";
    limit = plan === "premium" ? null : 5;
  } catch {}

  try {
    const { count } = await supabase
      .from("recommendation_runs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", viewer.userId)
      .gte("created_at", start.toISOString());
    used = count ?? 0;
  } catch {}

  const initialUsage = {
    plan,
    used,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - used),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Sugestões inteligentes de desenhos
        </h1>
        <p className="max-w-3xl text-foreground/80">
          Uma ferramenta consultiva que considera idade, perfil e contexto de
          tela para orientar escolhas com mais segurança.
        </p>
      </div>

      <div className="mt-8">
        <RecomendadorClient initialAge={initialAge} initialUsage={initialUsage} />
      </div>
    </div>
  );
}

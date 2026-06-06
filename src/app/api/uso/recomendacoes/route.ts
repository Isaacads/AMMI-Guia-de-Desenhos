import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let plan: "free" | "premium" = "free";
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", authData.user.id)
      .maybeSingle();
    plan = profile?.plan === "premium" ? "premium" : "free";
  } catch {}

  const limit = plan === "premium" ? null : 5;
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  let used = 0;
  try {
    const { count } = await supabase
      .from("recommendation_runs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", authData.user.id)
      .gte("created_at", start.toISOString());
    used = count ?? 0;
  } catch {}

  return NextResponse.json({
    plan,
    used,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - used),
  });
}


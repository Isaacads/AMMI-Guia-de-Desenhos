import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Viewer = {
  userId: string;
  email: string | null;
  plan: "free" | "premium";
  fullName: string | null;
  firstAccessNoticeSeen: boolean;
};

export async function getViewer(): Promise<Viewer | null> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasSupabaseEnv) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, plan, first_access_notice_seen")
    .eq("id", user.id)
    .maybeSingle();

  const plan = profile?.plan === "premium" ? "premium" : "free";

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? null,
    fullName: profile?.full_name ?? null,
    plan,
    firstAccessNoticeSeen: profile?.first_access_notice_seen ?? false,
  };
}

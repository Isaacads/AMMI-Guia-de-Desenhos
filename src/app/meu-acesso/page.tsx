import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addChild } from "@/app/meu-acesso/actions";
import { KIWIFY_CHECKOUT_URL } from "@/lib/billing";

export const dynamic = "force-dynamic";

type ChildRow = {
  id: string;
  name: string;
  age: number;
  neurodivergence: string[] | null;
};

export default async function MeuAcessoPage({
  searchParams,
}: {
  searchParams?: Promise<{ erro?: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar");

  let children: ChildRow[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("children")
      .select("id,name,age,neurodivergence")
      .order("created_at", { ascending: false });
    children = (data as ChildRow[]) ?? [];
  } catch {}

  const sp = searchParams ? await searchParams : undefined;
  const rawError = sp?.erro ? decodeURIComponent(sp.erro) : null;
  const errorMessage = rawError?.includes("children_user_id_fkey")
    ? "Seu perfil ainda não existe na tabela profiles do Supabase. Rode o schema.sql no Supabase (SQL Editor) e tente novamente."
    : rawError;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Meu acesso</h1>
          <p className="mt-2 text-foreground/80">
            Conta: {viewer.email ?? "—"} · Plano:{" "}
            <span className="font-medium">
              {viewer.plan === "premium" ? "Premium" : "Gratuito"}
            </span>
          </p>
        </div>
        {viewer.plan !== "premium" ? (
          <Link
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
          >
            Fazer upgrade
          </Link>
        ) : (
          <Link
            href="/premium/recomendador"
            className="rounded-md bg-foreground px-5 py-3 text-center font-medium text-background"
          >
            Abrir recomendador
          </Link>
        )}
      </div>

      {errorMessage ? (
        <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Filhos</h2>
          <p className="mt-2 text-sm text-foreground/80">
            Salve idades para facilitar recomendações e relatórios.
          </p>

          <div className="mt-5 space-y-3">
            {children.length === 0 ? (
              <p className="text-sm text-foreground/80">
                Nenhum filho cadastrado ainda.
              </p>
            ) : (
              children.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-foreground/10 bg-white/60 p-4"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-foreground/80">
                      {c.age} anos
                      {c.neurodivergence && c.neurodivergence.length > 0
                        ? ` · ${c.neurodivergence.join(", ")}`
                        : ""}
                    </p>
                  </div>
                  <Link
                    href={`/premium/recomendador?idade=${c.age}`}
                    className="text-sm font-medium hover:underline"
                  >
                    Recomendar →
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Adicionar filho</h2>
          <form action={addChild} className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="age">
                Idade (0–12)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={0}
                max={12}
                required
                className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="neurodivergence">
                Neurodivergência (opcional)
              </label>
              <input
                id="neurodivergence"
                name="neurodivergence"
                type="text"
                placeholder="Ex.: TDAH, Autismo"
                className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
              />
              <p className="text-xs text-foreground/70">Separe por vírgula.</p>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-foreground px-4 py-2.5 font-medium text-background"
            >
              Salvar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

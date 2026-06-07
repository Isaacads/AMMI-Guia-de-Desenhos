import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Frelatorios");

  if (viewer.plan !== "premium") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Relatórios e acompanhamento (Premium)
        </h1>
        <p className="mt-3 text-foreground/80">
          Dashboard, registros e gráficos simples ficam disponíveis no Premium.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="https://pay.kiwify.com.br/yDSNQfj"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
          >
            Fazer upgrade
          </Link>
          <Link
            href="/premium/recomendador"
            className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
          >
            Ver recomendador
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Relatórios e acompanhamento
        </h1>
        <p className="max-w-3xl text-foreground/80">
          Registre desenhos assistidos, tempo de tela e sinais de impacto (sono,
          comportamento, atenção). Use como guia para ajustes semanais.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Horas de tela (semana)</h2>
          <div className="mt-5 rounded-xl border border-foreground/10 bg-white/60 p-6 text-sm text-foreground/80">
            Conecte registros manuais (ou integração futura) para alimentar
            gráficos simples.
          </div>
        </section>

        <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Impacto</h2>
          <div className="mt-5 rounded-xl border border-foreground/10 bg-white/60 p-6 text-sm text-foreground/80">
            Registre observações de sono, atenção e comportamento. Compare com a
            recomendação por idade para ver progresso.
          </div>
        </section>
      </div>
    </div>
  );
}

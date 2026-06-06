import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { PlanoClient } from "@/app/premium/plano/PlanoClient";

export const dynamic = "force-dynamic";

export default async function PlanoPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Fplano");

  if (viewer.plan !== "premium") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Gerador de plano (Premium)
        </h1>
        <p className="mt-3 text-foreground/80">
          Crie cronogramas saudáveis com base em idade e meta semanal.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/premium/upgrade"
            className="rounded-md bg-primary text-background px-5 py-3 text-center font-medium"
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
          Gerador de plano de visualização
        </h1>
        <p className="text-foreground/80 max-w-3xl">
          Um cronograma simples para reduzir conflitos, aumentar previsibilidade
          e manter o tempo de tela dentro do recomendado.
        </p>
      </div>

      <div className="mt-8">
        <PlanoClient />
      </div>
    </div>
  );
}

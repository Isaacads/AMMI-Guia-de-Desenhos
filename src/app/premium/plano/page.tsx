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
          Plano semanal (Premium)
        </h1>
        <p className="mt-3 text-foreground/80">
          Crie cronogramas saudáveis com base em idade e meta semanal.
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
            Ver sugestões
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Plano semanal de visualização
        </h1>
        <p className="max-w-3xl text-foreground/80">
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

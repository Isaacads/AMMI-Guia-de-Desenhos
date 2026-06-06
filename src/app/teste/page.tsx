import Link from "next/link";
import { TesteClient } from "@/app/teste/TesteClient";

export default async function TestePage({
  searchParams,
}: {
  searchParams?: Promise<{ idade?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const initialAge = Math.min(12, Math.max(0, Number(sp?.idade ?? 5) || 5));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Teste gratuito (sem cadastro)
        </h1>
        <p className="text-foreground/80 max-w-3xl">
          Em menos de 1 minuto, receba recomendações iniciais e uma dica prática.
          Para salvar histórico, exportar PDF e usar catálogo e plano semanal,
          crie sua conta.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/premium/upgrade"
            className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
          >
            Ver Premium
          </Link>
          <Link
            href="/blog"
            className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
          >
            Ver artigos
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <TesteClient initialAge={initialAge} />
      </div>
    </div>
  );
}


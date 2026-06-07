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
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center rounded-full border border-foreground/15 bg-white/60 px-3 py-1 text-xs font-medium text-foreground/75">
            Resultado em menos de 1 minuto
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Teste gratuito, com caminho claro para o Premium
          </h1>
          <p className="max-w-3xl text-foreground/80">
            Descubra rapidamente o que faz sentido para a idade da crianca, veja
            onde o conteudo comeca a pesar e entenda quando vale usar o
            catalogo e o plano semanal do Premium.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl border border-foreground/10 bg-white/70 px-4 py-3 text-center">
            <p className="text-lg font-semibold">{initialAge}</p>
            <p className="text-foreground/70">idade inicial</p>
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-white/70 px-4 py-3 text-center">
            <p className="text-lg font-semibold">3</p>
            <p className="text-foreground/70">frentes avaliadas</p>
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-white/70 px-4 py-3 text-center">
            <p className="text-lg font-semibold">PDF</p>
            <p className="text-foreground/70">saida rapida</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-foreground/10 bg-white/60 p-4">
          <p className="font-semibold">1. Ajuste a idade</p>
          <p className="mt-2 text-sm text-foreground/75">
            Comece pelo contexto real da crianca para receber uma leitura mais
            util.
          </p>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-white/60 p-4">
          <p className="font-semibold">2. Gere o resumo</p>
          <p className="mt-2 text-sm text-foreground/75">
            O teste mostra sugestoes, moderacao e o que evitar.
          </p>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-white/60 p-4">
          <p className="font-semibold">3. Siga para o Premium</p>
          <p className="mt-2 text-sm text-foreground/75">
            Use o teste como ponto de entrada para salvar historico e destravar
            recursos completos.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

      <div className="mt-8">
        <TesteClient initialAge={initialAge} />
      </div>
    </div>
  );
}

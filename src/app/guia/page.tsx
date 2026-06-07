import Link from "next/link";

const ageBlocks = [
  {
    range: "0–2 anos",
    limit: "Evitar ao máximo",
    why: "Desenvolvimento sensorial em construção",
    avoid: "Movimentos muito rápidos, cores muito saturadas",
  },
  {
    range: "2–4 anos",
    limit: "Máx. 1h/dia",
    why: "Cérebro em formação, atenção em desenvolvimento",
    avoid: "Narrativas complexas, violência implícita",
  },
  {
    range: "5–7 anos",
    limit: "Máx. 2h/dia",
    why: "Capacidade de compreensão em expansão",
    avoid: "Conteúdos muito acelerados e linguagem inadequada",
    favor: "Desenhos educativos, linguagem clara",
  },
  {
    range: "8–12 anos",
    limit: "Máx. 3h/dia",
    why: "Discernimento crítico começando",
    avoid: "Humor agressivo, violência normalizada",
    favor: "Conteúdo com mensagens positivas",
  },
] as const;

export default function GuiaPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Telas por faixa etária
        </h1>
        <p className="max-w-2xl text-foreground/80">
          Um guia rápido para tomar decisões melhores no dia a dia. A versão
          Premium traz mais detalhes, catálogo completo e recomendador
          personalizado.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {ageBlocks.map((b) => (
          <section
            key={b.range}
            className="rounded-2xl border border-foreground/10 bg-white/70 p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">{b.range}</h2>
              <span className="rounded-full bg-highlight/40 px-3 py-1 text-sm">
                {b.limit}
              </span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold">Por que</dt>
                <dd className="text-foreground/80">{b.why}</dd>
              </div>
              <div>
                <dt className="font-semibold">Características a evitar</dt>
                <dd className="text-foreground/80">{b.avoid}</dd>
              </div>
              {"favor" in b ? (
                <div>
                  <dt className="font-semibold">Características favoráveis</dt>
                  <dd className="text-foreground/80">{b.favor}</dd>
                </div>
              ) : null}
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-foreground/10 bg-white/70 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <p className="font-semibold">Nota</p>
          <p className="text-foreground/80">
            A versão completa inclui mais critérios, recomendações por perfil e
            ferramentas premium.
          </p>
        </div>
        <Link
          href="/premium/recomendador"
          className="w-full rounded-md bg-primary px-5 py-3 text-center font-medium text-background md:w-auto"
        >
          Ver Premium
        </Link>
      </div>
    </div>
  );
}

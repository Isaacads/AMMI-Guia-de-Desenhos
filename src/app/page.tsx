import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6 md:p-10">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-sm text-foreground/80">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Plataforma consultiva, mobile-first
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Tela nunca e neutra!
          </h1>
          <p className="max-w-2xl text-base text-foreground/80 md:text-lg">
            Descubra quais desenhos sao mais adequados por idade e como o ritmo,
            a linguagem e o conteudo impactam sono, atencao e comportamento.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/teste"
              className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
            >
              Fazer teste gratuito (60s)
            </Link>
            <Link
              href="/guia"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Abrir o guia
            </Link>
            <Link
              href="/entrar?next=%2Fpremium%2Frecomendador"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Entrar e gerar relatorio completo
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-foreground/10 bg-white/70 p-6 md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Como funciona em 60 segundos
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="font-semibold">1) Conte sua realidade</p>
            <p className="mt-2 text-sm text-foreground/80">
              Idade, preferencias, tempo de tela e plataformas que voce tem em
              casa.
            </p>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="font-semibold">2) Veja a leitura</p>
            <p className="mt-2 text-sm text-foreground/80">
              Sugestoes, moderacao e o que evitar, com uma dica pratica.
            </p>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="font-semibold">3) Aplique um plano</p>
            <p className="mt-2 text-sm text-foreground/80">
              Plano semanal e PDF para compartilhar e manter consistencia.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Link
            href="/entrar?next=%2Fpremium%2Frecomendador"
            className="inline-flex rounded-md bg-foreground px-5 py-3 font-medium text-background"
          >
            Comecar agora
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-foreground/10 bg-white/70 p-5">
          <p className="font-semibold">Dores reais</p>
          <ul className="mt-3 space-y-2 text-foreground/80">
            <li>Esse desenho e muito acelerado pro meu filho?</li>
            <li>Essa linguagem e adequada pra idade dele?</li>
            <li>Isso pode atrapalhar sono, atencao ou comportamento?</li>
          </ul>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-white/70 p-5">
          <p className="font-semibold">Beneficios</p>
          <ul className="mt-3 space-y-2 text-foreground/80">
            <li>Sugestoes claras por idade</li>
            <li>Analise de ritmo, linguagem e riscos</li>
            <li>Plano saudavel de visualizacao</li>
          </ul>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-white/70 p-5">
          <p className="font-semibold">Credibilidade</p>
          <p className="mt-3 text-foreground/80">
            Conteudo estruturado com base em referencias de neurodesenvolvimento
            infantil e acompanhamento multidisciplinar.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-foreground/10 bg-white/70 p-6 md:p-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-foreground/80">Premium</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Sugestoes personalizadas, catalogo completo e relatorios
            </h2>
            <p className="mt-2 max-w-2xl text-foreground/80">
              Transforme duvida em decisao: uma experiencia dinamica e
              consultiva para aumentar o valor percebido e a retencao.
            </p>
          </div>
          <Link
            href="/premium/upgrade"
            className="w-full rounded-md bg-foreground px-5 py-3 text-center font-medium text-background md:w-auto"
          >
            Ver Premium
          </Link>
        </div>
      </section>
    </div>
  );
}

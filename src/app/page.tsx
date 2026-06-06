import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <section className="rounded-2xl bg-white/70 border border-foreground/10 p-6 md:p-10">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-sm text-foreground/80">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Plataforma consultiva, mobile-first
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Tela nunca é neutra!
          </h1>
          <p className="text-base md:text-lg text-foreground/80 max-w-2xl">
            Descubra quais desenhos são mais adequados por idade e como o ritmo,
            a linguagem e o conteúdo impactam sono, atenção e comportamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/teste"
              className="rounded-md bg-primary text-background px-5 py-3 text-center font-medium"
            >
              Fazer teste gratuito (60s)
            </Link>
            <Link
              href="/guia"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Acessar Guia Completo
            </Link>
            <Link
              href="/entrar?next=%2Fpremium%2Frecomendador"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Entrar e gerar relatório completo
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-white/70 border border-foreground/10 p-6 md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Como funciona (em 60 segundos)
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="font-semibold">1) Conte sua realidade</p>
            <p className="mt-2 text-sm text-foreground/80">
              Idade, preferências, tempo de tela e plataformas que você tem em
              casa.
            </p>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="font-semibold">2) Receba o relatório</p>
            <p className="mt-2 text-sm text-foreground/80">
              Recomendados, com moderação e o que evitar — com o porquê.
            </p>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="font-semibold">3) Aplique um plano</p>
            <p className="mt-2 text-sm text-foreground/80">
              Cronograma semanal + PDF para compartilhar e manter consistência.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Link
            href="/entrar?next=%2Fpremium%2Frecomendador"
            className="inline-flex rounded-md bg-foreground text-background px-5 py-3 font-medium"
          >
            Começar agora
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white/70 border border-foreground/10 p-5">
          <p className="font-semibold">Dores reais</p>
          <ul className="mt-3 space-y-2 text-foreground/80">
            <li>✓ “Esse desenho é muito acelerado pro meu filho?”</li>
            <li>✓ “Essa linguagem é adequada pra idade dele?”</li>
            <li>✓ “Isso pode atrapalhar sono, atenção ou comportamento?”</li>
          </ul>
        </div>
        <div className="rounded-xl bg-white/70 border border-foreground/10 p-5">
          <p className="font-semibold">Benefícios</p>
          <ul className="mt-3 space-y-2 text-foreground/80">
            <li>✓ Recomendações claras por idade</li>
            <li>✓ Análise de ritmo, linguagem e riscos</li>
            <li>✓ Plano saudável de visualização</li>
          </ul>
        </div>
        <div className="rounded-xl bg-white/70 border border-foreground/10 p-5">
          <p className="font-semibold">Credibilidade</p>
          <p className="mt-3 text-foreground/80">
            Conteúdo estruturado com base em referências de neurodesenvolvimento
            infantil e acompanhamento multidisciplinar.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-white/70 border border-foreground/10 p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/80">Premium</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Recomendações personalizadas, catálogo completo e relatórios
            </h2>
            <p className="mt-2 text-foreground/80 max-w-2xl">
              Transforme dúvida em decisão: uma experiência dinâmica e
              consultiva para aumentar o valor percebido e a retenção.
            </p>
          </div>
          <Link
            href="/premium/recomendador"
            className="rounded-md bg-foreground text-background px-5 py-3 text-center font-medium w-full md:w-auto"
          >
            Ver recursos Premium
          </Link>
        </div>
      </section>
    </div>
  );
}

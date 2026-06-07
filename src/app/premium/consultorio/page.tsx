import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { ConsultorioChat } from "@/app/premium/consultorio/ConsultorioChat";

export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "Meu filho tem TDAH, qual o melhor desenho?",
    a: "Prefira ritmo previsivel, episodios curtos e linguagem clara. Evite conteudo muito acelerado e com alto risco de vicio.",
  },
  {
    q: "Como fazer ele desligar da tela?",
    a: "A melhor estrategia costuma ser previsibilidade: combinados antes de ligar, aviso de 5 minutos e transicao para uma atividade curta, como banho, historia ou musica.",
  },
  {
    q: "Qual ritmo e seguro para meu bebe?",
    a: "Para 0-2 anos, a recomendacao e evitar ao maximo. Quando houver exposicao, mantenha estimulo baixo e, preferencialmente, com adulto junto.",
  },
];

export default async function ConsultorioPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Fconsultorio");

  if (viewer.plan !== "premium") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Consultorio virtual (Premium)
        </h1>
        <p className="mt-3 text-foreground/80">
          FAQ completo e chat consultivo estao disponiveis no Premium.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/premium/upgrade"
            className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
          >
            Fazer upgrade
          </Link>
          <Link
            href="/premium/recomendador"
            className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
          >
            Ver sugestoes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Consultorio virtual
        </h1>
        <p className="max-w-3xl text-foreground/80">
          Respostas rapidas e acionaveis para duvidas comuns. Ideal para usar
          junto das sugestoes.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Perguntas frequentes</h2>
          <div className="mt-5 space-y-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-foreground/10 bg-white/60 p-5"
              >
                <p className="font-semibold">{f.q}</p>
                <p className="mt-2 text-sm text-foreground/80">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Chat consultivo</h2>
          <p className="mt-2 text-sm text-foreground/80">
            Assistente para duvidas rapidas sobre tempo de tela, sono,
            transicoes e adequacao de desenhos.
          </p>
          <ConsultorioChat />
        </section>
      </div>
    </div>
  );
}

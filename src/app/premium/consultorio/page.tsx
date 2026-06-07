import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { ConsultorioChat } from "@/app/premium/consultorio/ConsultorioChat";

export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "Meu filho tem TDAH, qual o melhor desenho?",
    a: "Prefira ritmo previsível, episódios curtos e linguagem clara. Evite conteúdo muito acelerado e com alto risco de vício.",
  },
  {
    q: "Como fazer ele desligar da tela?",
    a: "A melhor estratégia costuma ser previsibilidade: combinados antes de ligar, aviso de 5 minutos e transição para uma atividade curta, como banho, história ou música.",
  },
  {
    q: "Qual ritmo é seguro para meu bebê?",
    a: "Para 0-2 anos, a recomendação é evitar ao máximo. Quando houver exposição, mantenha estímulo baixo e, preferencialmente, com adulto junto.",
  },
];

export default async function ConsultorioPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Fconsultorio");

  if (viewer.plan !== "premium") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Consultório virtual (Premium)
        </h1>
        <p className="mt-3 text-foreground/80">
          FAQ completo e chat consultivo estão disponíveis no Premium.
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
          Consultório virtual
        </h1>
        <p className="max-w-3xl text-foreground/80">
          Respostas rápidas e acionáveis para dúvidas comuns. Ideal para usar
          junto das sugestões.
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
            Assistente para dúvidas rápidas sobre tempo de tela, sono,
            transições e adequação de desenhos.
          </p>
          <ConsultorioChat />
        </section>
      </div>
    </div>
  );
}

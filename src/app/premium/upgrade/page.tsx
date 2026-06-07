import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { returnToFree } from "@/app/premium/upgrade/actions";
import { KIWIFY_CHECKOUT_URL } from "@/lib/billing";

export const dynamic = "force-dynamic";

const monthlyFeatures = [
  "Recomendações ilimitadas",
  "Catálogo completo com filtros avançados",
  "Plano semanal saudável",
  "Relatórios em PDF para compartilhar",
  "Biblioteca premium com checklists e scripts",
];

const annualFeatures = [
  "Tudo do mensal",
  "Menor custo total",
  "Melhor para consistência",
  "Ideal para acompanhar evolução ao longo do ano",
];

export default async function UpgradePage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Fupgrade");

  const isPremium = viewer.plan === "premium";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center rounded-full border border-foreground/15 bg-white/60 px-3 py-1 text-xs font-medium text-foreground/75">
            Premium AMMI
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Transforme o teste em uma assinatura com acesso completo
          </h1>
          <p className="max-w-3xl text-foreground/80">
            Comece com recomendações simples e, quando fizer sentido, desbloqueie
            catálogo, plano semanal, PDF e recomendações ilimitadas em um fluxo
            único.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {isPremium ? (
              <Link
                href="/premium/catalogo"
                className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
              >
                Abrir recursos Premium
              </Link>
            ) : (
              <Link
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
              >
                Ativar Premium
              </Link>
            )}
            <Link
              href="/premium/recomendador"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Voltar às sugestões
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-white/80 p-6 shadow-sm">
          <p className="text-sm font-semibold text-foreground/80">
            O que muda no Premium
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wide text-primary">
                Entrega
              </p>
              <p className="mt-1 text-sm text-foreground/80">
                O teste vira histórico, comparativo e plano de ação.
              </p>
            </div>
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wide text-primary">
                Alcance
              </p>
              <p className="mt-1 text-sm text-foreground/80">
                Use o catálogo completo, o plano semanal e o consultório.
              </p>
            </div>
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wide text-primary">
                Conversão
              </p>
              <p className="mt-1 text-sm text-foreground/80">
                Menos dúvida, mais decisão e mais consistência na rotina.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-foreground/10 bg-white/70 p-6 shadow-sm">
          <p className="text-sm font-semibold text-foreground/80">Mensal</p>
          <p className="mt-2 text-3xl font-semibold">R$ 27,90</p>
          <p className="text-sm text-foreground/80">por mês</p>
          <ul className="mt-5 space-y-2 text-sm text-foreground/80">
            {monthlyFeatures.map((item) => (
              <li key={item} className="rounded-lg bg-white/70 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full justify-center rounded-md bg-primary px-5 py-3 font-medium text-background"
          >
            {isPremium ? "Premium ativo" : "Assinar mensal"}
          </Link>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground/80">Anual</p>
              <p className="mt-2 text-3xl font-semibold">R$ 199,90</p>
              <p className="text-sm text-foreground/80">por ano</p>
            </div>
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              Economia de 28%
            </span>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-foreground/80">
            {annualFeatures.map((item) => (
              <li key={item} className="rounded-lg bg-white/70 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full justify-center rounded-md bg-foreground px-5 py-3 font-medium text-background"
          >
            {isPremium ? "Premium ativo" : "Assinar anual"}
          </Link>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-foreground/10 bg-white/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Comparativo rápido</h2>
        <div className="mt-5 grid gap-3">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/80 p-4 text-sm">
            <p className="font-medium">Recomendações por mês</p>
            <p className="text-foreground/80">5</p>
            <p className="font-medium">Ilimitado</p>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/80 p-4 text-sm">
            <p className="font-medium">Catálogo e filtros</p>
            <p className="text-foreground/80">Limitado</p>
            <p className="font-medium">Completo</p>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/80 p-4 text-sm">
            <p className="font-medium">Plano semanal automático</p>
            <p className="text-foreground/80">-</p>
            <p className="font-medium">✓</p>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/80 p-4 text-sm">
            <p className="font-medium">PDF para compartilhar</p>
            <p className="text-foreground/80">-</p>
            <p className="font-medium">✓</p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-foreground/10 bg-white/70 p-6 shadow-sm">
        <p className="font-semibold">Como o acesso premium é liberado</p>
        <p className="mt-2 text-sm text-foreground/80">
          Nesta versão, os botões acima ativam o Premium diretamente no seu
          perfil do Supabase. Quando o pagamento real for conectado, o webhook
          poderá usar a mesma atualização de plano.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/meu-acesso"
            className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
          >
            Meu acesso
          </Link>
          {isPremium ? (
            <form action={returnToFree}>
              <button
                type="submit"
                className="w-full rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
              >
                Voltar para gratuito
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

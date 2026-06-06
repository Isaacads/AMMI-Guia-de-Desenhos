import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { activatePremium, returnToFree } from "@/app/premium/upgrade/actions";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Fupgrade");

  const isPremium = viewer.plan === "premium";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Premium</h1>
        <p className="text-foreground/80 max-w-3xl">
          Escolha desenhos com mais segurança e consistência: recomendador,
          catálogo completo, plano semanal e relatórios exportáveis.
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-white/70 border border-foreground/10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/80">Status do acesso</p>
            <p className="mt-1 text-xl font-semibold">
              {isPremium
                ? "Seu Premium está ativo"
                : "Comece pelo Premium e sinta a diferença no 1º relatório"}
            </p>
            <p className="mt-2 text-sm text-foreground/80 max-w-2xl">
              {isPremium
                ? "Você já pode acessar catálogo completo, plano semanal, relatórios e recomendações ilimitadas."
                : "Menos dúvida, mais decisão: recomendações personalizadas e recursos acionáveis para aumentar adesão às rotinas e reduzir conflitos."}
            </p>
          </div>
          {isPremium ? (
            <Link
              href="/premium/catalogo"
              className="rounded-md bg-primary text-background px-5 py-3 text-center font-medium w-full md:w-auto"
            >
              Abrir recursos Premium
            </Link>
          ) : (
            <form action={activatePremium} className="w-full md:w-auto">
              <button
                type="submit"
                className="rounded-md bg-primary text-background px-5 py-3 text-center font-medium w-full"
              >
                Ativar Premium
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/70 border border-foreground/10 p-6">
          <p className="text-sm text-foreground/80">Mensal</p>
          <p className="mt-2 text-3xl font-semibold">R$ 27,90</p>
          <p className="text-sm text-foreground/80">por mês</p>
          <ul className="mt-5 space-y-2 text-sm text-foreground/80">
            <li>✓ Recomendações ilimitadas</li>
            <li>✓ Catálogo completo com filtros avançados</li>
            <li>✓ Plano semanal saudável</li>
            <li>✓ Relatórios em PDF para compartilhar</li>
            <li>✓ Biblioteca premium com checklists e scripts</li>
          </ul>
          <form action={activatePremium}>
            <button
              type="submit"
              className="mt-6 inline-flex w-full justify-center rounded-md bg-primary text-background px-5 py-3 font-medium"
            >
              {isPremium ? "Premium ativo" : "Assinar mensal"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white/70 border border-foreground/10 p-6">
          <p className="text-sm text-foreground/80">Anual</p>
          <p className="mt-2 text-3xl font-semibold">R$ 199,90</p>
          <p className="text-sm text-foreground/80">
            por ano (economia de 28%)
          </p>
          <ul className="mt-5 space-y-2 text-sm text-foreground/80">
            <li>✓ Tudo do mensal</li>
            <li>✓ Menor custo total</li>
            <li>✓ Melhor para consistência</li>
            <li>✓ Ideal para acompanhar evolução ao longo do ano</li>
          </ul>
          <form action={activatePremium}>
            <button
              type="submit"
              className="mt-6 inline-flex w-full justify-center rounded-md bg-foreground text-background px-5 py-3 font-medium"
            >
              {isPremium ? "Premium ativo" : "Assinar anual"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-white/70 border border-foreground/10 p-6 md:p-8">
        <h2 className="text-xl font-semibold">Comparativo rápido</h2>
        <div className="mt-5 grid gap-3">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/60 p-4 text-sm">
            <p className="font-medium">Recomendações por mês</p>
            <p className="text-foreground/80">5</p>
            <p className="font-medium">Ilimitado</p>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/60 p-4 text-sm">
            <p className="font-medium">Catálogo e filtros</p>
            <p className="text-foreground/80">Limitado</p>
            <p className="font-medium">Completo</p>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/60 p-4 text-sm">
            <p className="font-medium">Plano semanal automático</p>
            <p className="text-foreground/80">-</p>
            <p className="font-medium">✓</p>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-foreground/10 bg-white/60 p-4 text-sm">
            <p className="font-medium">PDF para compartilhar</p>
            <p className="text-foreground/80">-</p>
            <p className="font-medium">✓</p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-white/70 border border-foreground/10 p-6 md:p-8">
        <p className="font-semibold">Como o acesso premium é liberado</p>
        <p className="mt-2 text-sm text-foreground/80">
          Nesta versão, os botões acima ativam o Premium diretamente no seu
          perfil do Supabase. Quando o pagamento real for conectado, o webhook
          poderá usar a mesma atualização de plano.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Link
            href="/premium/recomendador"
            className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
          >
            Voltar ao recomendador
          </Link>
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

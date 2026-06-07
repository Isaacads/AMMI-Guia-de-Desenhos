"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { KIWIFY_CHECKOUT_URL } from "@/lib/billing";

type Report = {
  analysis: {
    age: number;
    recommendedTime: string;
    currentMinutesPerDay: number | null;
    desiredMinutesPerDay: number | null;
    preferences: string[];
    platforms: string[];
    tip: string;
  };
  recommended: Array<{ name: string; whereToWatch: string[]; why: string }>;
  moderation: Array<{ name: string; whereToWatch: string[]; why: string }>;
  notRecommended: Array<{ name: string; whereToWatch: string[]; why: string }>;
};

type Usage = {
  plan: "free" | "premium";
  used: number;
  limit: number | null;
  remaining: number | null;
};

function splitComma(text: string) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function RecomendadorClient({
  initialAge,
  initialUsage,
}: {
  initialAge: number;
  initialUsage: Usage;
}) {
  type Tab = "recommended" | "moderation" | "notRecommended";

  const [age, setAge] = useState<number>(initialAge);
  const [neuroText, setNeuroText] = useState("");
  const [prefText, setPrefText] = useState("");
  const [platformText, setPlatformText] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState<string>("");
  const [desiredMinutes, setDesiredMinutes] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [usage, setUsage] = useState<Usage | null>(initialUsage);
  const [tab, setTab] = useState<Tab>("recommended");

  const neurodivergence = useMemo(() => splitComma(neuroText), [neuroText]);
  const preferences = useMemo(() => splitComma(prefText), [prefText]);
  const platforms = useMemo(() => splitComma(platformText), [platformText]);

  const showStickyUpgrade = usage?.plan === "free" && !!report;

  async function refreshUsage() {
    const res = await fetch("/api/uso/recomendacoes", { method: "GET" });
    if (!res.ok) return;
    const data = (await res.json()) as Usage;
    setUsage(data);
  }

  async function run() {
    setStatus("loading");
    setError(null);
    setReport(null);
    setTab("recommended");

    const res = await fetch("/api/recomendacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age,
        neurodivergence,
        preferences,
        platforms,
        currentMinutesPerDay: currentMinutes ? Number(currentMinutes) : null,
        desiredMinutesPerDay: desiredMinutes ? Number(desiredMinutes) : null,
      }),
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus("idle");
      setError(payload?.error ?? "Não foi possível gerar a recomendação.");
      refreshUsage().catch(() => {});
      return;
    }

    const data = (await res.json()) as Report;
    setReport(data);
    setStatus("idle");
    refreshUsage().catch(() => {});
  }

  async function downloadPdf() {
    if (!report) return;
    const res = await fetch("/api/recomendacao/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(
        res.status === 401
          ? "Entre na sua conta para gerar o PDF."
          : (payload?.error ?? "Não foi possível gerar o PDF."),
      );
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-ammi.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }

  return (
    <div
      className={`grid gap-6 lg:grid-cols-[1fr_1.2fr] ${showStickyUpgrade ? "pb-24" : ""}`}
    >
      <section className="rounded-2xl bg-white/70 border border-foreground/10 p-6">
        <h2 className="text-lg font-semibold">Inputs</h2>
        <p className="mt-2 text-sm text-foreground/80">
          Preencha e gere um relatório consultivo. Se você estiver no plano
          gratuito, há limite de 5 recomendações/mês.
        </p>

        {usage?.plan === "free" && usage.limit !== null ? (
          <div className="mt-4 rounded-xl border border-foreground/10 bg-white/60 p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-foreground/80">
                Uso do mês:{" "}
                <span className="font-medium text-foreground">
                  {usage.used}/{usage.limit}
                </span>
              </p>
              <Link
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-primary text-background px-3 py-1.5 font-medium"
              >
                Virar Premium
              </Link>
            </div>
            <div className="mt-3 h-2 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full bg-secondary"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((usage.used / usage.limit) * 100),
                  )}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-foreground/70">
              Premium libera recomendações ilimitadas + catálogo + plano semanal +
              relatórios.
            </p>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="age">
              Idade (0–12)
            </label>
            <input
              id="age"
              type="range"
              min={0}
              max={12}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-foreground/80">{age} anos</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="neuro">
              Neurodivergência (opcional)
            </label>
            <input
              id="neuro"
              value={neuroText}
              onChange={(e) => setNeuroText(e.target.value)}
              placeholder="Ex.: TDAH, Autismo"
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="pref">
              Preferências atuais (opcional)
            </label>
            <input
              id="pref"
              value={prefText}
              onChange={(e) => setPrefText(e.target.value)}
              placeholder="Ex.: educativo, animais, aventura"
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="currentMinutes">
                Tempo atual (min/dia)
              </label>
              <input
                id="currentMinutes"
                inputMode="numeric"
                value={currentMinutes}
                onChange={(e) => setCurrentMinutes(e.target.value)}
                placeholder="Ex.: 90"
                className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="desiredMinutes">
                Tempo desejado (min/dia)
              </label>
              <input
                id="desiredMinutes"
                inputMode="numeric"
                value={desiredMinutes}
                onChange={(e) => setDesiredMinutes(e.target.value)}
                placeholder="Ex.: 60"
                className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="platforms">
              Plataformas disponíveis (opcional)
            </label>
            <input
              id="platforms"
              value={platformText}
              onChange={(e) => setPlatformText(e.target.value)}
              placeholder="Ex.: Netflix, YouTube, Amazon Prime"
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={run}
            disabled={status === "loading"}
            className="w-full rounded-md bg-primary text-background px-4 py-2.5 font-medium disabled:opacity-60"
          >
            {status === "loading" ? "Gerando..." : "Gerar relatório"}
          </button>

          {error ? (
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
              <p>{error}</p>
              {error.toLowerCase().includes("limite") ? (
                <div className="mt-3">
                  <Link
                    href={KIWIFY_CHECKOUT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-md bg-primary text-background px-4 py-2 font-medium"
                  >
                    Fazer upgrade e liberar
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl bg-white/70 border border-foreground/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Relatório personalizado</h2>
            <p className="mt-2 text-sm text-foreground/80">
              Dinâmico, consultivo e pronto para compartilhar.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={!report}
            className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Exportar PDF
          </button>
        </div>

        {!report ? (
          <div className="mt-6 rounded-xl border border-foreground/10 bg-white/60 p-6 text-sm text-foreground/80">
            Preencha os inputs e clique em Gerar relatório.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
              <p className="font-semibold">📊 Análise</p>
              <p className="mt-2 text-sm text-foreground/80">
                Idade: {report.analysis.age} anos · Tempo recomendado:{" "}
                {report.analysis.recommendedTime}
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                💡 Dica do dia: {report.analysis.tip}
              </p>
            </div>

            {(() => {
              const buttonClass = (key: Tab) =>
                `flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  tab === key
                    ? "bg-background text-foreground"
                    : "text-foreground/80 hover:bg-background/30"
                }`;

              const recommendedBlock = (
                <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
                  <p className="font-semibold">✅ Recomendados</p>
                  <div className="mt-3">
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                      {report.recommended.map((i) => (
                        <div
                          key={i.name}
                          className="min-w-[260px] max-w-[320px] snap-start rounded-xl border border-foreground/10 bg-white/70 p-4 text-sm text-foreground/80"
                        >
                          <p className="font-medium text-foreground">{i.name}</p>
                          <p className="mt-1">
                            Onde assistir:{" "}
                            {i.whereToWatch.length
                              ? i.whereToWatch.join(", ")
                              : "—"}
                          </p>
                          <p className="mt-2">{i.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );

              const moderationBlock = (
                <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
                  <p className="font-semibold">⚠️ Com moderação</p>
                  <ul className="mt-3 space-y-3 text-sm text-foreground/80">
                    {report.moderation.map((i) => (
                      <li key={i.name}>
                        <p className="font-medium text-foreground">{i.name}</p>
                        <p>
                          Onde assistir:{" "}
                          {i.whereToWatch.length
                            ? i.whereToWatch.join(", ")
                            : "—"}
                        </p>
                        <p>{i.why}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );

              const notRecommendedBlock = (
                <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
                  <p className="font-semibold">❌ Não recomendados</p>
                  <ul className="mt-3 space-y-3 text-sm text-foreground/80">
                    {report.notRecommended.map((i) => (
                      <li key={i.name}>
                        <p className="font-medium text-foreground">{i.name}</p>
                        <p>
                          Onde assistir:{" "}
                          {i.whereToWatch.length
                            ? i.whereToWatch.join(", ")
                            : "—"}
                        </p>
                        <p>{i.why}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );

              return (
                <>
                  <div className="md:hidden">
                    <div className="rounded-xl border border-foreground/10 bg-white/60 p-1 flex gap-1">
                      <button
                        type="button"
                        className={buttonClass("recommended")}
                        onClick={() => setTab("recommended")}
                      >
                        Recomendados
                      </button>
                      <button
                        type="button"
                        className={buttonClass("moderation")}
                        onClick={() => setTab("moderation")}
                      >
                        Moderação
                      </button>
                      <button
                        type="button"
                        className={buttonClass("notRecommended")}
                        onClick={() => setTab("notRecommended")}
                      >
                        Evitar
                      </button>
                    </div>
                    <div className="mt-4">
                      {tab === "recommended"
                        ? recommendedBlock
                        : tab === "moderation"
                          ? moderationBlock
                          : notRecommendedBlock}
                    </div>
                  </div>

                  <div className="hidden md:grid gap-4">
                    {recommendedBlock}
                    {moderationBlock}
                    {notRecommendedBlock}
                  </div>
                </>
              );
            })()}

            {usage?.plan === "free" ? (
              <div className="rounded-2xl border border-foreground/10 bg-white/60 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-foreground/80">
                      Desbloqueie o Premium
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      Recomendações ilimitadas + catálogo + plano semanal
                    </p>
                    <p className="mt-2 text-sm text-foreground/80">
                      Use este relatório como ponto de partida e mantenha
                      consistência com cronograma e PDF para compartilhar.
                    </p>
                  </div>
                  <Link
                    href={KIWIFY_CHECKOUT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-primary text-background px-5 py-3 text-center font-medium w-full md:w-auto"
                  >
                    Fazer upgrade
                  </Link>
                </div>
                {usage.limit !== null ? (
                  <p className="mt-3 text-xs text-foreground/70">
                    Restam {usage.remaining ?? 0} recomendações neste mês no plano
                    gratuito.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </section>

      {showStickyUpgrade ? (
        <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
          <div className="mx-auto w-full max-w-6xl px-3 pb-3">
            <div className="rounded-2xl border border-foreground/10 bg-background shadow-lg px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-foreground/80">Plano gratuito</p>
                  <p className="text-sm font-semibold leading-snug">
                    Desbloqueie ilimitado + catálogo + plano
                  </p>
                </div>
                <Link
                  href={KIWIFY_CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-primary text-background px-4 py-2 text-sm font-medium"
                >
                  Upgrade
                </Link>
              </div>
              {usage?.limit !== null ? (
                <p className="mt-2 text-xs text-foreground/70">
                  Restam {usage?.remaining ?? 0} recomendações neste mês.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

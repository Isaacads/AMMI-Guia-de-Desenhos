"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

function splitComma(text: string) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function TesteClient({ initialAge }: { initialAge: number }) {
  const [age, setAge] = useState<number>(initialAge);
  const [prefText, setPrefText] = useState("");
  const [platformText, setPlatformText] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [cardStatus, setCardStatus] = useState<"idle" | "loading">("idle");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  const preferences = useMemo(() => splitComma(prefText), [prefText]);
  const platforms = useMemo(() => splitComma(platformText), [platformText]);

  async function run() {
    setStatus("loading");
    setError(null);
    setReport(null);

    const res = await fetch("/api/teste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age,
        preferences,
        platforms,
        currentMinutesPerDay: currentMinutes ? Number(currentMinutes) : null,
      }),
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus("idle");
      setError(payload?.error ?? "Não foi possível gerar o teste.");
      return;
    }

    const data = (await res.json()) as Report;
    setReport(data);
    setStatus("idle");
  }

  const next = `/premium/recomendador?idade=${encodeURIComponent(String(age))}`;

  async function copySummary() {
    if (!report) return;
    const lines = [
      `AMMI - Teste rápido`,
      `Idade: ${report.analysis.age} anos`,
      `Tempo recomendado: ${report.analysis.recommendedTime}`,
      report.recommended.length
        ? `Recomendados: ${report.recommended.map((x) => x.name).join(", ")}`
        : `Recomendados: -`,
      report.moderation.length
        ? `Com moderação: ${report.moderation.map((x) => x.name).join(", ")}`
        : `Com moderação: -`,
      report.notRecommended.length
        ? `Evitar: ${report.notRecommended.map((x) => x.name).join(", ")}`
        : `Evitar: -`,
      `Dica: ${report.analysis.tip}`,
      `Faça o teste: ${window.location.origin}/teste`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setError("Resumo copiado. Cole no WhatsApp e envie.");
      setTimeout(() => setError(null), 3000);
    } catch {
      setError("Não foi possível copiar. Tente novamente.");
      setTimeout(() => setError(null), 3000);
    }
  }

  async function fetchCardBlob() {
    if (!report) return null;
    const res = await fetch("/api/teste/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    if (!res.ok) return null;
    return await res.blob();
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }

  async function downloadCard() {
    if (!report) return;
    setCardStatus("loading");
    setError(null);
    const blob = await fetchCardBlob();
    setCardStatus("idle");
    if (!blob) {
      setError("Não foi possível gerar o cartão.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    downloadBlob(blob, `ammi-teste-${report.analysis.age}anos.svg`);
  }

  async function downloadPdf() {
    if (!report) return;
    setPdfStatus("loading");
    setError(null);
    const res = await fetch("/api/teste/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    setPdfStatus("idle");
    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(payload?.error ?? "Não foi possível gerar o PDF.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    downloadBlob(await res.blob(), `ammi-teste-${report.analysis.age}anos.pdf`);
  }

  async function shareCard() {
    if (!report) return;
    setCardStatus("loading");
    setError(null);
    const blob = await fetchCardBlob();
    setCardStatus("idle");
    if (!blob) {
      setError("Não foi possível gerar o cartão.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const file = new File([blob], `ammi-teste-${report.analysis.age}anos.svg`, {
      type: blob.type || "image/svg+xml",
    });

    const shareData: ShareData = {
      title: "AMMI - Teste rápido",
      text: "Resultado do teste rápido (AMMI).",
      files: [file],
    };

    try {
      if (!navigator.share || (navigator.canShare && !navigator.canShare(shareData))) {
        downloadBlob(blob, `ammi-teste-${report.analysis.age}anos.svg`);
        return;
      }
      await navigator.share(shareData);
    } catch {
      downloadBlob(blob, `ammi-teste-${report.analysis.age}anos.svg`);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Teste gratuito (60s)</h2>
        <p className="mt-2 text-sm text-foreground/80">
          Sem cadastro. Você recebe um resultado rápido e pode salvar criando a
          conta.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="age">
              Idade (0-12)
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
            <label className="text-sm font-medium" htmlFor="currentMinutes">
              Tempo atual (min/dia) (opcional)
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
            <label className="text-sm font-medium" htmlFor="pref">
              Preferências (opcional)
            </label>
            <input
              id="pref"
              value={prefText}
              onChange={(e) => setPrefText(e.target.value)}
              placeholder="Ex.: educativo, animais"
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="platforms">
              Plataformas (opcional)
            </label>
            <input
              id="platforms"
              value={platformText}
              onChange={(e) => setPlatformText(e.target.value)}
              placeholder="Ex.: Netflix, YouTube"
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={run}
            disabled={status === "loading"}
            className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-background disabled:opacity-60"
          >
            {status === "loading" ? "Gerando..." : "Gerar teste agora"}
          </button>

          {error ? (
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-white/70 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Resultado</h2>
            <p className="mt-2 text-sm text-foreground/80">
              Preview gratuito com leitura imediata. No Premium você salva
              histórico, exporta relatório completo e usa recomendações
              ilimitadas.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={copySummary}
              disabled={!report}
              className="rounded-full border border-foreground/15 bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-white disabled:opacity-50"
            >
              Copiar resumo
            </button>
            <button
              type="button"
              onClick={downloadCard}
              disabled={!report || cardStatus === "loading"}
              className="rounded-full border border-foreground/15 bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-white disabled:opacity-50"
            >
              {cardStatus === "loading" ? "Gerando..." : "Baixar cartão"}
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!report || pdfStatus === "loading"}
              className="rounded-full border border-foreground/15 bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-white disabled:opacity-50"
            >
              {pdfStatus === "loading" ? "Gerando..." : "Baixar PDF"}
            </button>
            <button
              type="button"
              onClick={shareCard}
              disabled={!report || cardStatus === "loading"}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-background shadow-sm transition hover:opacity-95 disabled:opacity-50"
            >
              Compartilhar
            </button>
          </div>
        </div>

        {!report ? (
          <div className="mt-6 rounded-xl border border-foreground/10 bg-white/60 p-6 text-sm text-foreground/80">
            Ajuste a idade e clique em Gerar teste agora.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-primary">
                Sua leitura em 1 minuto
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-200/80 bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">
                    Recomendados
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-700">
                    {report.recommended.length}
                  </p>
                  <p className="mt-1 text-sm text-foreground/70">
                    Conteúdos com melhor encaixe para a faixa etária.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200/80 bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-amber-700">
                    Com moderação
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-amber-700">
                    {report.moderation.length}
                  </p>
                  <p className="mt-1 text-sm text-foreground/70">
                    Valem atenção ao horário, ritmo e companhia.
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-200/80 bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-rose-700">
                    Evitar
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-rose-700">
                    {report.notRecommended.length}
                  </p>
                  <p className="mt-1 text-sm text-foreground/70">
                    Conteúdos com mais risco de conflito ou excesso.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-white/70 p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground/80">Análise</p>
              <p className="mt-2 text-sm text-foreground/80">
                Idade: {report.analysis.age} anos · Tempo recomendado:{" "}
                {report.analysis.recommendedTime}
              </p>
              <div className="mt-4 rounded-xl bg-primary/5 p-4">
                <p className="text-xs uppercase tracking-wide text-primary">
                  Dica rápida
                </p>
                <p className="mt-1 text-sm text-foreground/80">
                  {report.analysis.tip}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-white/70 p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground/80">
                Recomendados
              </p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                {report.recommended.map((i) => (
                  <li
                    key={i.name}
                    className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4"
                  >
                    <p className="font-medium text-foreground">{i.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-foreground/60">
                      Onde assistir
                    </p>
                    <p className="mt-1">
                      {i.whereToWatch.length ? i.whereToWatch.join(", ") : "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-white/70 p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground/80">
                Com moderação
              </p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                {report.moderation.map((i) => (
                  <li
                    key={i.name}
                    className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-4"
                  >
                    <p className="font-medium text-foreground">{i.name}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-white/70 p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground/80">Evitar</p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                {report.notRecommended.map((i) => (
                  <li
                    key={i.name}
                    className="rounded-xl border border-rose-200/70 bg-rose-50/50 p-4"
                  >
                    <p className="font-medium text-foreground">{i.name}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-semibold text-foreground/80">
                Próximo passo
              </p>
              <p className="mt-1 text-lg font-semibold">
                Salvar, comparar e destravar o relatório completo
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Crie sua conta para guardar o histórico, usar o recomendador
                completo, exportar PDF e acessar catálogo e plano semanal.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/cadastro?next=${encodeURIComponent(next)}`}
                  className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
                >
                  Criar conta e salvar
                </Link>
                <Link
                  href="/premium/upgrade"
                  className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
                >
                  Ver Premium
                </Link>
                <Link
                  href="/entrar"
                  className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
                >
                  Já tenho acesso
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

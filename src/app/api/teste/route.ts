import { NextResponse } from "next/server";
import { fallbackShows, type Show } from "@/lib/content/shows";

type TestInput = {
  age: number;
  neurodivergence?: string[];
  preferences?: string[];
  currentMinutesPerDay?: number | null;
  desiredMinutesPerDay?: number | null;
  platforms?: string[];
};

function recommendedTimeByAge(age: number) {
  if (age <= 1) return "Evitar ao máximo";
  if (age <= 4) return "Até 1h/dia";
  if (age <= 7) return "Até 1–2h/dia";
  return "Até 2–3h/dia";
}

function normalizeList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((v) => String(v).trim())
    .filter(Boolean)
    .slice(0, 20);
}

function scoreShow(show: Show, neuro: string[]) {
  let score = show.rating;

  if (show.narrativePace === "lento") score += 1;
  if (show.narrativePace === "acelerado") score -= 2;

  if (show.violence === "sim") score -= 4;
  if (show.violence === "implicito") score -= 1;

  if (show.language === "inapropriada") score -= 4;
  if (show.language === "questionavel") score -= 1;

  if (show.educationalPotential === "alto") score += 2;
  if (show.educationalPotential === "medio") score += 1;

  if (show.addictionRisk === "alto") score -= 3;
  if (show.addictionRisk === "medio") score -= 1;

  if (show.sleepImpact === "alto") score -= 2;
  if (show.sleepImpact === "medio") score -= 1;

  if (show.attentionEffect === "positivo") score += 2;
  if (show.attentionEffect === "negativo") score -= 2;

  const neuroLower = neuro.map((n) => n.toLowerCase());
  const isNeuroSensitive = neuroLower.some((n) =>
    ["tdah", "autismo", "tea", "tnd"].some((k) => n.includes(k)),
  );

  if (isNeuroSensitive) {
    if (show.narrativePace === "acelerado") score -= 2;
    if (show.addictionRisk === "alto") score -= 2;
    if (show.attentionEffect === "negativo") score -= 3;
  }

  return score;
}

function pickTip() {
  const tips = [
    "Assistir junto reduz impacto negativo e melhora compreensão.",
    "Evite telas na última hora antes de dormir.",
    "Prefira episódios curtos com pausas previsíveis.",
    "Troque conteúdo acelerado por ritmo mais previsível em dias difíceis.",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | Partial<TestInput>
    | null;

  if (!body) {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const age = Number(body.age);
  if (!Number.isFinite(age) || age < 0 || age > 12) {
    return NextResponse.json({ error: "Idade inválida" }, { status: 400 });
  }

  const neurodivergence = normalizeList(body.neurodivergence);
  const preferences = normalizeList(body.preferences);
  const platforms = normalizeList(body.platforms);
  const currentMinutesPerDay =
    body.currentMinutesPerDay === null || body.currentMinutesPerDay === undefined
      ? null
      : Number(body.currentMinutesPerDay);
  const desiredMinutesPerDay =
    body.desiredMinutesPerDay === null || body.desiredMinutesPerDay === undefined
      ? null
      : Number(body.desiredMinutesPerDay);

  let shows: Show[] = fallbackShows;
  if (platforms.length > 0) {
    const set = new Set(platforms.map((p) => p.toLowerCase()));
    shows = shows.filter((s) =>
      s.platforms.some((p) => set.has(p.toLowerCase())),
    );
  }

  const ranked = shows
    .map((show) => {
      const ageOk = age >= show.minAge && age <= show.maxAge;
      const score = scoreShow(show, neurodivergence);
      const hardNo =
        !ageOk || show.violence === "sim" || show.language === "inapropriada";
      return { show, score, hardNo };
    })
    .sort((a, b) => b.score - a.score);

  const recommended = ranked
    .filter((r) => !r.hardNo && r.score >= 8)
    .slice(0, 3)
    .map((r) => r.show);

  const moderation = ranked
    .filter((r) => !r.hardNo && r.score >= 5 && r.score < 8)
    .slice(0, 2)
    .map((r) => r.show);

  const notRecommended = ranked
    .filter((r) => r.hardNo || r.score < 5)
    .slice(0, 2)
    .map((r) => r.show);

  return NextResponse.json({
    analysis: {
      age,
      recommendedTime: recommendedTimeByAge(age),
      currentMinutesPerDay,
      desiredMinutesPerDay,
      preferences,
      platforms,
      tip: pickTip(),
    },
    recommended: recommended.map((s) => ({
      name: s.name,
      whereToWatch: s.platforms,
      why: s.analysis,
    })),
    moderation: moderation.map((s) => ({
      name: s.name,
      whereToWatch: s.platforms,
      why: s.analysis,
    })),
    notRecommended: notRecommended.map((s) => ({
      name: s.name,
      whereToWatch: s.platforms,
      why: s.analysis,
    })),
  });
}


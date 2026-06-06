import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackShows, type Show } from "@/lib/content/shows";

const MAX_DB_LIMIT = 200;
const MAX_PAYLOAD_CHARS = 40_000;

type RecommendationInput = {
  age: number;
  neurodivergence?: string[];
  preferences?: string[];
  currentMinutesPerDay?: number | null;
  desiredMinutesPerDay?: number | null;
  platforms?: string[];
};

type ShowRow = {
  id: string;
  name: string;
  year: number | null;
  min_age: number;
  max_age: number;
  episode_minutes: number | null;
  genres: string[] | null;
  platforms: string[] | null;
  rating: number;
  narrative_pace: Show["narrativePace"];
  violence: Show["violence"];
  language: Show["language"];
  educational_potential: Show["educationalPotential"];
  addiction_risk: Show["addictionRisk"];
  sleep_impact: Show["sleepImpact"];
  attention_effect: Show["attentionEffect"];
  analysis: string | null;
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
    | Partial<RecommendationInput>
    | null;

  if (!body) {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  // reject very large payloads early to avoid high memory usage
  try {
    const cl = request.headers.get("content-length");
    if (cl && Number(cl) > MAX_PAYLOAD_CHARS) {
      return NextResponse.json({ error: "Payload muito grande" }, { status: 413 });
    }
    const approx = JSON.stringify(body).length;
    if (approx > MAX_PAYLOAD_CHARS) {
      return NextResponse.json({ error: "Payload muito grande" }, { status: 413 });
    }
  } catch {
    // ignore and continue
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

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let plan: "free" | "premium" = "free";
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", authData.user.id)
      .maybeSingle();
    plan = profile?.plan === "premium" ? "premium" : "free";
  } catch {}

  if (plan !== "premium") {
    try {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("recommendation_runs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", authData.user.id)
        .gte("created_at", start.toISOString());
      if ((count ?? 0) >= 5) {
        return NextResponse.json(
          { error: "Limite de 5 recomendações/mês no plano gratuito." },
          { status: 402 },
        );
      }
    } catch {}
  }

  let shows: Show[] = fallbackShows;
  try {
    const { data, error } = await supabase
      .from("shows")
      .select(
        "id,name,year,min_age,max_age,episode_minutes,genres,platforms,rating,narrative_pace,violence,language,educational_potential,addiction_risk,sleep_impact,attention_effect,analysis",
      )
      .limit(MAX_DB_LIMIT);
    if (!error && data && data.length > 0) {
      shows = (data as ShowRow[]).map((s) => ({
        id: String(s.id),
        name: String(s.name),
        year: s.year === null || s.year === undefined ? null : Number(s.year),
        minAge: Number(s.min_age),
        maxAge: Number(s.max_age),
        episodeMinutes:
          s.episode_minutes === null || s.episode_minutes === undefined
            ? null
            : Number(s.episode_minutes),
        genres: Array.isArray(s.genres) ? s.genres.map(String) : [],
        platforms: Array.isArray(s.platforms) ? s.platforms.map(String) : [],
        rating: Number(s.rating ?? 0),
        narrativePace: s.narrative_pace,
        violence: s.violence,
        language: s.language,
        educationalPotential: s.educational_potential,
        addictionRisk: s.addiction_risk,
        sleepImpact: s.sleep_impact,
        attentionEffect: s.attention_effect,
        analysis: String(s.analysis ?? ""),
      }));
    }
  } catch {}

  // safety: if DB returned unexpectedly large result, trim before heavy ops
  if (shows.length > 300) {
    console.warn("Muito shows retornados, reduzindo antes de ordenar", shows.length);
    shows = shows.slice(0, 300);
  }

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

      return {
        show,
        score,
        ageOk,
        hardNo,
      };
    })
    .sort((a, b) => b.score - a.score);

  const recommended = ranked
    .filter((r) => !r.hardNo && r.score >= 8)
    .slice(0, 12)
    .map((r) => r.show);

  const moderation = ranked
    .filter((r) => !r.hardNo && r.score >= 5 && r.score < 8)
    .slice(0, 5)
    .map((r) => r.show);

  const notRecommended = ranked
    .filter((r) => r.hardNo || r.score < 5)
    .slice(0, 5)
    .map((r) => r.show);

  const output = {
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
  };

  try {
    await supabase.from("recommendation_runs").insert({
      user_id: authData.user.id,
      input: {
        age,
        neurodivergence,
        preferences,
        currentMinutesPerDay,
        desiredMinutesPerDay,
        platforms,
      },
      output,
    });
  } catch {}

  return NextResponse.json(output);
}

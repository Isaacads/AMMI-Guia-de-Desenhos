import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackShows } from "@/lib/content/shows";
import { CatalogoClient } from "@/app/premium/catalogo/CatalogoClient";
import { KIWIFY_CHECKOUT_URL } from "@/lib/billing";

export const dynamic = "force-dynamic";

type ShowCardRow = {
  id: string;
  name: string;
  min_age: number;
  max_age: number;
  episode_minutes: number | null;
  genres: string[] | null;
  platforms: string[] | null;
  rating: number;
  narrative_pace: string;
  educational_potential: string;
  addiction_risk: string;
};

type ShowCard = {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  episodeMinutes: number | null;
  genres: string[];
  platforms: string[];
  rating: number;
  narrativePace: string;
  educationalPotential: string;
  addictionRisk: string;
};

export default async function CatalogoPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/entrar?next=%2Fpremium%2Fcatalogo");

  if (viewer.plan !== "premium") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Catálogo completo (Premium)
        </h1>
        <p className="mt-3 text-foreground/80">
          O catálogo com filtros avançados e análises estruturadas está
          disponível no Premium.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-primary px-5 py-3 text-center font-medium text-background"
          >
            Fazer upgrade
          </Link>
          <Link
            href="/premium/recomendador"
            className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
          >
            Ver recomendador
          </Link>
        </div>
      </div>
    );
  }

  let cards: ShowCard[] = fallbackShows.map((s) => ({
    id: s.id,
    name: s.name,
    minAge: s.minAge,
    maxAge: s.maxAge,
    episodeMinutes: s.episodeMinutes,
    genres: s.genres,
    platforms: s.platforms,
    rating: s.rating,
    narrativePace: String(s.narrativePace),
    educationalPotential: String(s.educationalPotential),
    addictionRisk: String(s.addictionRisk),
  }));

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("shows")
      .select(
        "id,name,min_age,max_age,episode_minutes,genres,platforms,rating,narrative_pace,educational_potential,addiction_risk",
      )
      .limit(500);
    if (!error && data && data.length > 0) {
      cards = (data as ShowCardRow[]).map((s) => ({
        id: String(s.id),
        name: String(s.name),
        minAge: Number(s.min_age),
        maxAge: Number(s.max_age),
        episodeMinutes:
          s.episode_minutes === null || s.episode_minutes === undefined
            ? null
            : Number(s.episode_minutes),
        genres: Array.isArray(s.genres) ? s.genres.map(String) : [],
        platforms: Array.isArray(s.platforms) ? s.platforms.map(String) : [],
        rating: Number(s.rating ?? 0),
        narrativePace: String(s.narrative_pace),
        educationalPotential: String(s.educational_potential),
        addictionRisk: String(s.addiction_risk),
      }));
    }
  } catch {}

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
        <p className="max-w-3xl text-foreground/80">
          Base estruturada de desenhos com filtros e critérios de análise para
          apoiar decisões rápidas.
        </p>
      </div>

      <div className="mt-8">
        <CatalogoClient shows={cards} />
      </div>
    </div>
  );
}

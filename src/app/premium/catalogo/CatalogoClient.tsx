"use client";

import { useMemo, useState } from "react";

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

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export function CatalogoClient({ shows }: { shows: ShowCard[] }) {
  const [age, setAge] = useState(5);
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState<"recomendacao" | "educativo">("recomendacao");

  const filtered = useMemo(() => {
    const p = normalize(platform);
    let result = shows.filter((s) => age >= s.minAge && age <= s.maxAge);
    if (p) {
      result = result.filter((s) =>
        s.platforms.some((x) => normalize(x).includes(p)),
      );
    }
    if (sort === "educativo") {
      result = result.sort((a, b) => {
        const ae = a.educationalPotential === "alto" ? 2 : a.educationalPotential === "medio" ? 1 : 0;
        const be = b.educationalPotential === "alto" ? 2 : b.educationalPotential === "medio" ? 1 : 0;
        return be - ae || b.rating - a.rating;
      });
    } else {
      result = result.sort((a, b) => b.rating - a.rating);
    }
    return result.slice(0, 60);
  }, [shows, age, platform, sort]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-2xl bg-white/70 border border-foreground/10 p-6 h-fit">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="age">
              Idade
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
            <label className="text-sm font-medium" htmlFor="platform">
              Plataforma
            </label>
            <input
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="Ex.: Netflix"
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sort">
              Ordenar por
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "recomendacao" | "educativo")
              }
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            >
              <option value="recomendacao">Recomendação</option>
              <option value="educativo">Mais educativo</option>
            </select>
          </div>
        </div>
      </aside>

      <section className="rounded-2xl bg-white/70 border border-foreground/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Catálogo</h2>
            <p className="mt-2 text-sm text-foreground/80">
              Mostrando até 60 resultados para manter rápido no celular.
            </p>
          </div>
          <div className="text-sm text-foreground/80">
            {filtered.length} resultados
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-foreground/10 bg-white/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold leading-snug">{s.name}</p>
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
                  {s.minAge}–{s.maxAge}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/80">
                Plataformas: {s.platforms.length ? s.platforms.join(", ") : "—"}
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Duração:{" "}
                {s.episodeMinutes ? `${s.episodeMinutes} min` : "—"} · Ritmo:{" "}
                {s.narrativePace}
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Educativo: {s.educationalPotential} · Risco de vício:{" "}
                {s.addictionRisk}
              </p>
              <p className="mt-3 text-sm font-medium">Nota: {s.rating}/10</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


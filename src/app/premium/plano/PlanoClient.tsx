"use client";

import { useMemo, useState } from "react";

type Slot = {
  day: string;
  time: string;
  title: string;
  tag: string;
};

const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function PlanoClient() {
  const [age, setAge] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(1.5);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Segunda",
    "Quarta",
    "Sexta",
  ]);
  const [time, setTime] = useState("18:00");

  const totalMinutes = useMemo(
    () => clamp(Math.round(hoursPerWeek * 60), 0, 600),
    [hoursPerWeek],
  );

  const schedule = useMemo(() => {
    const chosenDays = selectedDays.length ? selectedDays : ["Segunda"];
    const sessionMinutes = 30;
    const sessions = Math.max(1, Math.round(totalMinutes / sessionMinutes));
    const perDay = Math.ceil(sessions / chosenDays.length);

    const ideasByAge =
      age <= 4
        ? [
            { title: "Daniel Tigre", tag: "educativo" },
            { title: "Word Party", tag: "linguagem" },
          ]
        : age <= 7
          ? [
              { title: "Daniel Tigre", tag: "educativo" },
              { title: "Octonautas", tag: "aventura" },
              { title: "Word Party", tag: "educativo" },
            ]
          : [
              { title: "Octonautas", tag: "aventura" },
              { title: "Conteúdo educativo", tag: "educativo" },
              { title: "Filme leve com pausa", tag: "familia" },
            ];

    const slots: Slot[] = [];
    let i = 0;
    for (const day of chosenDays) {
      for (let k = 0; k < perDay && slots.length < sessions; k++) {
        const idea = ideasByAge[i % ideasByAge.length];
        slots.push({ day, time, title: idea.title, tag: idea.tag });
        i++;
      }
    }
    return slots;
  }, [age, selectedDays, time, totalMinutes]);

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <section className="rounded-2xl bg-white/70 border border-foreground/10 p-6">
        <h2 className="text-lg font-semibold">Inputs</h2>
        <div className="mt-5 space-y-4">
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
            <label className="text-sm font-medium" htmlFor="hours">
              Horas/semana (meta)
            </label>
            <input
              id="hours"
              type="number"
              step={0.5}
              min={0}
              max={10}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
            <div className="text-sm text-foreground/80">
              Total semanal: {totalMinutes} min
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="time">
              Horário padrão
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Dias disponíveis</p>
            <div className="flex flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selectedDays.includes(d)
                      ? "bg-secondary/20 border-secondary/30"
                      : "bg-white/60 border-foreground/15"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white/70 border border-foreground/10 p-6">
        <h2 className="text-lg font-semibold">📅 Seu plano personalizado</h2>
        <p className="mt-2 text-sm text-foreground/80">
          Cronograma simples e acionável para manter consistência.
        </p>

        <div className="mt-6 rounded-xl border border-foreground/10 bg-white/60 p-5">
          <div className="space-y-3 text-sm">
            {schedule.map((s, idx) => (
              <div
                key={`${s.day}-${idx}`}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{s.day}</p>
                  <p className="text-foreground/80">
                    {s.time} → {s.title}
                  </p>
                </div>
                <span className="rounded-full bg-highlight/40 px-3 py-1 text-xs">
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-foreground/10 pt-4 text-sm">
            Total semanal: {Math.round((schedule.length * 30) / 6) / 10}h ✅
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-foreground/10 bg-white/60 p-5 text-sm text-foreground/80">
          Dica: mantenha o plano visível e faça transições curtas após a tela
          (banho, história, música).
        </div>
      </section>
    </div>
  );
}


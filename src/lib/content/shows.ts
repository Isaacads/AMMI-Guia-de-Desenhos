export type Show = {
  id: string;
  name: string;
  year: number | null;
  minAge: number;
  maxAge: number;
  episodeMinutes: number | null;
  genres: string[];
  platforms: string[];
  rating: number;
  narrativePace: "lento" | "normal" | "acelerado";
  violence: "nao" | "implicito" | "sim";
  language: "apropriada" | "questionavel" | "inapropriada";
  educationalPotential: "baixo" | "medio" | "alto";
  addictionRisk: "baixo" | "medio" | "alto";
  sleepImpact: "baixo" | "medio" | "alto";
  attentionEffect: "positivo" | "neutro" | "negativo";
  analysis: string;
};

export const fallbackShows: Show[] = [
  {
    id: "daniel-tigre",
    name: "Daniel Tigre",
    year: null,
    minAge: 2,
    maxAge: 6,
    episodeMinutes: 12,
    genres: ["educativo"],
    platforms: ["YouTube", "Netflix"],
    rating: 9,
    narrativePace: "lento",
    violence: "nao",
    language: "apropriada",
    educationalPotential: "alto",
    addictionRisk: "baixo",
    sleepImpact: "baixo",
    attentionEffect: "positivo",
    analysis:
      "Ritmo previsível, linguagem clara e temas de regulação emocional. Bom para co-assistência e conversas sobre rotina.",
  },
  {
    id: "word-party",
    name: "Word Party",
    year: null,
    minAge: 3,
    maxAge: 6,
    episodeMinutes: 12,
    genres: ["educativo", "linguagem"],
    platforms: ["Netflix"],
    rating: 8,
    narrativePace: "normal",
    violence: "nao",
    language: "apropriada",
    educationalPotential: "alto",
    addictionRisk: "baixo",
    sleepImpact: "baixo",
    attentionEffect: "positivo",
    analysis:
      "Foco em vocabulário e repetição positiva. Estímulo moderado e boa estrutura de episódio.",
  },
  {
    id: "octonautas",
    name: "Octonautas",
    year: null,
    minAge: 4,
    maxAge: 8,
    episodeMinutes: 12,
    genres: ["aventura", "educativo"],
    platforms: ["Netflix"],
    rating: 8,
    narrativePace: "normal",
    violence: "implicito",
    language: "apropriada",
    educationalPotential: "medio",
    addictionRisk: "medio",
    sleepImpact: "medio",
    attentionEffect: "neutro",
    analysis:
      "Aventura com aprendizado, mas pode acelerar dependendo do episódio. Bom com moderação e pausas.",
  },
  {
    id: "homem-aranha",
    name: "Homem-Aranha (heróis)",
    year: null,
    minAge: 6,
    maxAge: 12,
    episodeMinutes: 22,
    genres: ["aventura", "herois"],
    platforms: ["Disney+"],
    rating: 6,
    narrativePace: "acelerado",
    violence: "implicito",
    language: "apropriada",
    educationalPotential: "baixo",
    addictionRisk: "medio",
    sleepImpact: "medio",
    attentionEffect: "neutro",
    analysis:
      "Ação e ritmo alto. Pode funcionar com moderação, preferencialmente longe do sono e com co-assistência.",
  },
  {
    id: "rapunzel",
    name: "Rapunzel",
    year: 2010,
    minAge: 6,
    maxAge: 12,
    episodeMinutes: 100,
    genres: ["filme", "fantasia"],
    platforms: ["Disney+"],
    rating: 7,
    narrativePace: "normal",
    violence: "implicito",
    language: "apropriada",
    educationalPotential: "medio",
    addictionRisk: "baixo",
    sleepImpact: "medio",
    attentionEffect: "neutro",
    analysis:
      "Narrativa mais longa e cenas que podem ser intensas para os menores. Melhor com supervisão e pausas.",
  },
  {
    id: "series-muito-aceleradas",
    name: "Séries muito aceleradas",
    year: null,
    minAge: 0,
    maxAge: 12,
    episodeMinutes: null,
    genres: ["curtas", "estimulacao"],
    platforms: ["YouTube"],
    rating: 2,
    narrativePace: "acelerado",
    violence: "nao",
    language: "questionavel",
    educationalPotential: "baixo",
    addictionRisk: "alto",
    sleepImpact: "alto",
    attentionEffect: "negativo",
    analysis:
      "Trocas rápidas e estímulo constante aumentam risco de irritação ao desligar e piora de atenção, especialmente em crianças menores.",
  },
  {
    id: "conteudo-inapropriado",
    name: "Séries com conteúdo inapropriado",
    year: null,
    minAge: 16,
    maxAge: 99,
    episodeMinutes: null,
    genres: ["adulto"],
    platforms: ["Streaming"],
    rating: 0,
    narrativePace: "normal",
    violence: "sim",
    language: "inapropriada",
    educationalPotential: "baixo",
    addictionRisk: "alto",
    sleepImpact: "alto",
    attentionEffect: "negativo",
    analysis: "Conteúdo para adultos não é adequado para crianças.",
  },
];


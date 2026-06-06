"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const quickPrompts = [
  "Meu filho tem TDAH, o que evitar?",
  "Como desligar a tela sem briga?",
  "Qual tempo de tela por idade?",
  "Desenho acelerado atrapalha o sono?",
];

function buildAnswer(question: string) {
  const q = question.toLowerCase();

  if (q.includes("tdah") || q.includes("autismo") || q.includes("tea")) {
    return "Para perfis neurodivergentes, prefira desenhos previsíveis, episódios curtos, linguagem clara e ritmo mais lento. Evite conteúdo muito acelerado, cortes rápidos, sons intensos e personagens com comportamento agressivo repetido. O ideal é testar em blocos curtos e observar sono, atenção e irritabilidade depois.";
  }

  if (q.includes("deslig") || q.includes("briga") || q.includes("tirar")) {
    return "A transição costuma funcionar melhor quando ela começa antes da tela ligar: combine quantos episódios serão vistos, use aviso de 5 minutos e já tenha uma próxima ação simples pronta, como banho, lanche, história ou música. Evite desligar de surpresa, porque isso aumenta disputa.";
  }

  if (q.includes("tempo") || q.includes("idade") || q.includes("horas")) {
    return "Como regra geral: até 2 anos, evite ao máximo; de 2 a 5 anos, mantenha perto de 1h por dia; de 6 a 12 anos, priorize rotina, pausas e conteúdo adequado. O contexto pesa muito: tela antes de dormir, sem adulto por perto ou em maratona tende a impactar mais.";
  }

  if (q.includes("sono") || q.includes("dormir") || q.includes("noite")) {
    return "Para proteger o sono, evite telas na última hora antes de dormir e reduza estímulos fortes no fim do dia. Desenhos acelerados, volume alto e cliffhangers aumentam excitação. Prefira episódios curtos, previsíveis e com fechamento claro.";
  }

  if (q.includes("acelerado") || q.includes("rápido") || q.includes("corte")) {
    return "Desenhos muito acelerados podem dificultar autorregulação em algumas crianças, principalmente quando há cortes rápidos, som intenso e recompensa constante. Não significa proibir tudo, mas usar com moderação, observar comportamento depois e equilibrar com conteúdos mais lentos.";
  }

  if (q.includes("bebê") || q.includes("bebe") || q.includes("0") || q.includes("1 ano")) {
    return "Para bebês, a recomendação mais segura é evitar telas ao máximo. Quando houver exposição, prefira algo curto, calmo e sempre com adulto junto, transformando a tela em interação e não em substituição de vínculo.";
  }

  return "Eu olharia para quatro pontos: idade da criança, ritmo do desenho, linguagem/comportamento dos personagens e momento do dia. Se você me disser idade, desenho ou plataforma, eu consigo orientar com mais precisão. Use esta resposta como apoio educativo, não como orientação médica individual.";
}

export function ConsultorioChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Olá! Sou o assistente consultivo da AMMI. Pergunte sobre idade, tempo de tela, sono, TDAH, autismo, desenhos acelerados ou transições para desligar a tela.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  function ask(text: string) {
    const question = text.trim();
    if (!question) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: buildAnswer(question) },
    ]);
    setInput("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <div className="mt-5 rounded-xl border border-foreground/10 bg-white/60 p-5">
      <div className="space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-xl px-4 py-3 text-sm ${
              message.role === "user"
                ? "ml-8 bg-primary text-background"
                : "mr-8 bg-white/80 text-foreground border border-foreground/10"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => ask(prompt)}
            className="rounded-full border border-foreground/15 bg-white/70 px-3 py-1.5 text-xs hover:bg-white"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="min-w-0 flex-1 rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          type="submit"
          disabled={!canSend}
          className="rounded-md bg-foreground text-background px-4 py-2 font-medium disabled:opacity-60"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

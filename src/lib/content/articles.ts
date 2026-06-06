export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  isPremium: boolean;
};

export const fallbackArticles: Article[] = [
  {
    slug: "impacto-das-telas-no-neurodesenvolvimento",
    title: "Entenda o impacto das telas no neurodesenvolvimento",
    excerpt:
      "Como ritmo, estímulos e contexto (assistir junto vs. sozinho) mudam o efeito da tela no cérebro em desenvolvimento.",
    content:
      "Tela nunca é neutra. Para crianças, o cérebro está em construção e aprende por repetição, previsibilidade e interação. Conteúdos muito acelerados podem aumentar a busca por estímulo e dificultar a transição para atividades mais lentas.\n\nPontos práticos:\n- Priorize conteúdo com linguagem clara, ritmo previsível e mensagens positivas.\n- Evite exposição próxima do horário de dormir.\n- Sempre que possível, assistir junto reduz o impacto negativo e aumenta compreensão e autorregulação.\n\nUse o recomendador para adaptar às características da criança e ao tempo de tela real da família.",
    isPremium: false,
  },
  {
    slug: "5-sinais-de-que-seu-filho-esta-assistindo-muito",
    title: "5 sinais de que seu filho está assistindo muito",
    excerpt:
      "Sinais comuns no sono, irritabilidade e atenção — e o que ajustar antes de virar um problema maior.",
    content:
      "Sinais frequentes:\n1) Dificuldade para dormir ou despertares noturnos.\n2) Irritabilidade ao desligar a tela.\n3) Atenção mais curta em brincadeiras e tarefas.\n4) Necessidade de conteúdos cada vez mais estimulantes.\n5) Queda de interesse por atividades sem tela.\n\nAjustes rápidos:\n- Defina horário de desligar e mantenha previsível.\n- Reduza conteúdos acelerados.\n- Substitua parte do tempo por rotina curta (banho, história, música).",
    isPremium: false,
  },
  {
    slug: "como-estabelecer-limites-saudaveis",
    title: "Como estabelecer limites saudáveis",
    excerpt:
      "Estratégias simples para reduzir conflitos e aumentar a adesão da criança às regras de tela.",
    content:
      "Prévia: limites saudáveis funcionam melhor quando são previsíveis, coerentes e acompanhados de alternativas.\n\n1) O erro mais comum\nTentar “tirar a tela” no improviso, sem rotina, sem aviso e sem plano alternativo. Isso aumenta conflito e torna a tela ainda mais desejada.\n\n2) O método 3P (Previsível, Pequeno, Possível)\n- Previsível: regra clara (quando pode, quanto tempo, onde, com quem).\n- Pequeno: comece reduzindo pouco (ex.: 10–20 min/dia), para ganhar adesão.\n- Possível: ofereça substitutos que a criança aceite (atividade curta e concreta).\n\n3) Script pronto (2–4 anos)\n“Agora é hora do desenho. Quando acabar, a tela desliga e a gente vai brincar com (opção A) ou (opção B). Eu aviso quando faltar 5 minutos.”\n\n4) Script pronto (5–7 anos)\n“Combinado: 2 episódios. Depois: banho/lanche/história. Se você desligar sem briga, amanhã você escolhe o desenho.”\n\n5) Script pronto (8–12 anos)\n“Você pode escolher o conteúdo, mas a regra de tempo é fixa. Se não cumprir, a regra do dia seguinte fica menor. Se cumprir, você ganha autonomia.”\n\n6) Plano de transição (sem choro)\n- Aviso de 5 minutos\n- Contagem regressiva (3…2…1…)\n- Ação física imediata (levantar, beber água, pegar um brinquedo)\n- Atividade de 10 minutos (curta e “fechável”)\n\n7) Checklist anti-vício (conteúdo)\nEvite quando possível:\n- Trocas rápidas e estímulos constantes\n- Recompensas visuais exageradas\n- Episódios infinitos/auto-play\nPrefira:\n- Episódios curtos\n- Linguagem clara\n- Ritmo previsível\n\n8) Plano Premium (use junto)\n- Gere um cronograma semanal no Gerador de Plano\n- Use o Recomendador para reduzir conteúdo acelerado\n- Registre sinais (sono/atenção/irritabilidade) para ajustar",
    isPremium: true,
  },
  {
    slug: "telas-e-sono-o-que-muda",
    title: "Telas e sono: o que muda na prática",
    excerpt:
      "Por que o horário e o tipo de conteúdo importam mais do que parece — e como ajustar sem cortar tudo.",
    content:
      "Prévia: o sono é sensível a excitação emocional, luz e previsibilidade. A soma desses fatores muda com o tipo de conteúdo e o horário.\n\n1) Por que a tela atrapalha o sono\n- Aumenta excitação (emoção/ritmo)\n- Reduz “desaceleração” antes de dormir\n- Estimula o cérebro quando ele deveria estar indo para o modo de descanso\n\n2) Regra de ouro (simples)\nSe estiver difícil de dormir, trate a última hora do dia como “zona de calma”: menos estímulo, mais previsibilidade.\n\n3) Checklist (use hoje)\n- [ ] Tela fora do quarto\n- [ ] Desligar 60 min antes de dormir (ou reduzir gradualmente)\n- [ ] Trocar conteúdo acelerado por ritmo previsível\n- [ ] Auto-play desligado\n- [ ] Rotina repetível (banho → pijama → história → luz baixa)\n\n4) Conteúdo que tende a piorar\n- Ação rápida (heróis, perseguições, cortes rápidos)\n- Humor muito barulhento/caótico\n- Medo/suspense (mesmo “infantil”)\n\n5) Conteúdo que tende a ser melhor\n- Narrativa linear e simples\n- Episódios curtos\n- Linguagem clara\n- Temas de rotina, amizade, emoções\n\n6) Plano de ajuste em 7 dias\nDia 1–2: desligar auto-play + reduzir 10 min\nDia 3–4: trocar conteúdo acelerado no fim do dia\nDia 5–7: criar rotina fixa e manter horário de desligar\n\n7) Quando procurar ajuda\nSe houver roncos, pausas respiratórias, ansiedade intensa ou insônia persistente, considere avaliação com profissional.\n\nFerramentas Premium:\n- Use o Recomendador para escolher conteúdo com menor impacto no sono\n- Use o Gerador de Plano para encaixar horários seguros na rotina",
    isPremium: true,
  },
  {
    slug: "assistir-junto-reduz-impacto",
    title: "Assistir junto reduz impacto negativo?",
    excerpt:
      "Entenda como a co-regulação do adulto muda a experiência de tela e melhora a compreensão.",
    content:
      "Prévia: quando o adulto assiste junto, ele organiza a narrativa, nomeia emoções e ajuda a criança a fazer pausas. Isso reduz impulsividade e melhora o aprendizado.\n\n1) O que é co-assistência\nNão é só “estar na sala”. É participar: comentar, nomear emoções, fazer perguntas simples e organizar o começo/fim.\n\n2) O que muda no cérebro da criança\n- Mais compreensão (menos estímulo “solto”)\n- Mais autorregulação (adulto empresta calma)\n- Menos efeito de “hiperfoco” no estímulo\n\n3) Perguntas prontas (2–4 anos)\n- “Quem é esse?”\n- “Ele está feliz ou triste?”\n- “O que vem depois?”\n\n4) Perguntas prontas (5–7 anos)\n- “Qual foi o problema?”\n- “O que ele fez para resolver?”\n- “O que você faria?”\n\n5) Perguntas prontas (8–12 anos)\n- “Qual foi a mensagem?”\n- “O que esse personagem fez de bom/ruim?”\n- “Isso acontece na vida real?”\n\n6) Pausas inteligentes\n- Pausa a cada 1 episódio\n- Pausa quando houver cena intensa\n- Pausa para repetir regra (“só mais um episódio”) e reduzir conflitos\n\n7) Frases que ajudam a desligar\n- “Mais um e acabou. Depois a gente escolhe outra coisa.”\n- “Eu aviso quando faltar 5 minutos.”\n- “Quando a gente desliga bem, amanhã fica mais fácil.”\n\nFerramentas Premium:\n- Use o Recomendador para achar conteúdo que favorece co-assistência\n- Use o Plano semanal para manter consistência",
    isPremium: true,
  },
  {
    slug: "checklist-para-escolher-um-desenho",
    title: "Checklist para escolher um desenho (em 60 segundos)",
    excerpt:
      "Uma lista objetiva para você decidir rápido: ritmo, linguagem, violência, potencial educativo e risco de vício.",
    content:
      "Prévia: você não precisa “acertar perfeito”, mas precisa reduzir riscos previsíveis.\n\nChecklist (marque mentalmente)\n1) Ritmo\n- Lento/normal? ✅\n- Muito acelerado, cortes rápidos? ⚠️\n\n2) Linguagem\n- Adequada e clara? ✅\n- Duplo sentido, palavrões, ironia agressiva? ⚠️\n\n3) Violência\n- Sem violência ou implícita leve? ✅\n- Violência explícita/normalizada? ❌\n\n4) Vício/auto-play\n- Episódios curtos, começo/meio/fim? ✅\n- Conteúdo infinito com recompensas rápidas? ⚠️\n\n5) Efeito no pós-tela\n- A criança desliga sem grande crise? ✅\n- Fica irritada, chora, perde interesse por outras atividades? ⚠️\n\nDecisão rápida\n- 0–1 alerta: ok\n- 2–3 alertas: moderação e co-assistência\n- 4+ alertas: evite\n\nUse o Catálogo Premium para filtrar por idade, plataforma e critérios estruturados.",
    isPremium: true,
  },
  {
    slug: "tdah-e-telas-como-ajustar",
    title: "TDAH e telas: como ajustar sem guerra diária",
    excerpt:
      "Estratégias práticas para reduzir hiperestimulação e aumentar adesão aos limites em crianças com TDAH.",
    content:
      "Prévia: para algumas crianças, telas aceleradas funcionam como um “superestímulo” e tornam a transição mais difícil.\n\n1) O objetivo real\nNão é “zero tela”, é: previsibilidade + ritmo adequado + transição sem crise.\n\n2) Ajuste de conteúdo\n- Prefira ritmo previsível\n- Evite cortes rápidos e humor caótico\n- Prefira episódios curtos\n\n3) Ajuste de tempo\n- Metas pequenas (redução de 10–15 min)\n- Divida em 2 blocos curtos ao invés de 1 longo\n\n4) Rotina de desligar (passo a passo)\n- Aviso de 5 minutos\n- Timer visível\n- Regra: “termina episódio e desliga”\n- Transição física (água, banheiro, lanche)\n\n5) Recompensa de autonomia\nSe desligar sem briga: escolhe o próximo conteúdo amanhã.\n\nUse o Recomendador Premium marcando neurodivergência para priorizar ritmo e risco de vício.",
    isPremium: true,
  },
  {
    slug: "autismo-tea-e-telas-o-que-observar",
    title: "Autismo (TEA) e telas: o que observar e como escolher melhor",
    excerpt:
      "Sinais de sobrecarga, hiperfoco e repetição — e como usar a tela a favor da rotina.",
    content:
      "Prévia: em TEA, previsibilidade ajuda, mas conteúdos acelerados e infinitos podem aumentar rigidez e crise de transição.\n\n1) O que observar\n- Aumenta irritação ao desligar?\n- Aumenta estereotipias?\n- Aumenta isolamento?\n\n2) Como escolher\n- Ritmo previsível\n- Linguagem clara\n- Sem violência\n- Episódios curtos\n\n3) Como usar a favor\n- Tela como “ponte” para atividade (ex.: 1 episódio → brinquedo temático)\n- Co-assistência com nomeação de emoções\n\nFerramentas Premium:\n- Recomendador com perfil\n- Plano semanal para reduzir rigidez e aumentar previsibilidade",
    isPremium: true,
  },
  {
    slug: "como-reduzir-tela-sem-cortar-tudo",
    title: "Como reduzir tela sem cortar tudo (plano de 14 dias)",
    excerpt:
      "Um roteiro progressivo para diminuir tempo e trocar conteúdo acelerado por alternativas mais saudáveis.",
    content:
      "Prévia: reduzir tela funciona melhor quando você troca “quantidade” por “qualidade” e cria previsibilidade.\n\nSemana 1 (dias 1–7)\n- Desligue auto-play\n- Defina 1 horário fixo\n- Troque o conteúdo do fim do dia por ritmo previsível\n\nSemana 2 (dias 8–14)\n- Reduza 10–20 min por dia\n- Inclua 1 atividade substituta curta\n- Reforce o desligar sem briga (elogio + escolha no dia seguinte)\n\nDica prática\nFaça o plano caber na rotina real. Consistência ganha de intensidade.\n\nFerramenta Premium: Gerador de Plano para montar cronograma por dias e horários.",
    isPremium: true,
  },
];

export function findFallbackArticle(slug: string) {
  return fallbackArticles.find((a) => a.slug === slug) ?? null;
}

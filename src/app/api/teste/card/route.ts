export const runtime = "nodejs";

type Report = {
  analysis: {
    age: number;
    recommendedTime: string;
    tip: string;
  };
  recommended: Array<{ name: string }>;
  moderation: Array<{ name: string }>;
  notRecommended: Array<{ name: string }>;
};

function escapeXml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clampText(text: string, max: number) {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1))}…`;
}

function listRows(items: string[], empty: string, yStart: number) {
  if (items.length === 0) {
    return `<text x="82" y="${yStart}" class="muted small">${escapeXml(empty)}</text>`;
  }

  return items
    .slice(0, 3)
    .map((name, index) => {
      const y = yStart + index * 48;
      return `
        <rect x="70" y="${y - 28}" width="560" height="38" rx="12" fill="#f2f2f2" />
        <text x="88" y="${y - 4}" class="item">${escapeXml(clampText(name, 42))}</text>
      `;
    })
    .join("");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Report | null;
  if (!body?.analysis) {
    return new Response("Relatório inválido", { status: 400 });
  }

  const age = Number(body.analysis.age);
  const recommendedTime = clampText(String(body.analysis.recommendedTime ?? ""), 40);
  const tip = clampText(String(body.analysis.tip ?? ""), 120);
  const recommended = (body.recommended ?? []).slice(0, 3).map((x) => x.name);
  const moderation = (body.moderation ?? []).slice(0, 2).map((x) => x.name);
  const avoid = (body.notRecommended ?? []).slice(0, 2).map((x) => x.name);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>
    .brand { font: 700 24px Arial, Helvetica, sans-serif; fill: #213635; }
    .title { font: 700 18px Arial, Helvetica, sans-serif; fill: #213635; }
    .body { font: 400 18px Arial, Helvetica, sans-serif; fill: #1c5052; }
    .item { font: 700 18px Arial, Helvetica, sans-serif; fill: #213635; }
    .small { font: 400 15px Arial, Helvetica, sans-serif; }
    .muted { fill: #1c5052; opacity: .82; }
  </style>
  <rect width="1200" height="630" fill="#348e91" />
  <rect x="56" y="56" width="1088" height="518" rx="28" fill="#f2f2f2" />
  <text x="100" y="116" class="brand">AMMI · Teste rápido</text>
  <text x="100" y="150" class="body">Idade: ${escapeXml(age)} anos · Tempo recomendado: ${escapeXml(recommendedTime)}</text>
  <rect x="890" y="88" width="210" height="42" rx="21" fill="#348e91" />
  <text x="915" y="115" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#f2f2f2">Tela nunca é neutra</text>

  <rect x="86" y="190" width="580" height="230" rx="18" fill="#e2f0ec" />
  <text x="120" y="232" class="title">Recomendados</text>
  ${listRows(recommended, "Sem resultados para os filtros escolhidos.", 282)}

  <rect x="700" y="190" width="414" height="104" rx="18" fill="#e5eceb" />
  <text x="730" y="232" class="title">Com moderação</text>
  <text x="730" y="266" class="body">${escapeXml(moderation.length ? moderation.map((n) => clampText(n, 28)).join(" · ") : "-")}</text>

  <rect x="700" y="316" width="414" height="104" rx="18" fill="#e7e9e9" />
  <text x="730" y="358" class="title">Evitar</text>
  <text x="730" y="392" class="body">${escapeXml(avoid.length ? avoid.map((n) => clampText(n, 28)).join(" · ") : "-")}</text>

  <rect x="86" y="444" width="1028" height="76" rx="18" fill="#d8ecd9" />
  <text x="120" y="476" class="title">Dica do dia</text>
  <text x="120" y="504" class="small muted">${escapeXml(tip)}</text>

  <text x="100" y="548" class="small muted">Faça o teste em /teste e gere o relatório completo no Premium.</text>
  <text x="914" y="548" class="small" font-weight="700" fill="#213635">ammi · guia de desenhos por idade</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": "attachment; filename=ammi-teste.svg",
      "Cache-Control": "no-store",
    },
  });
}

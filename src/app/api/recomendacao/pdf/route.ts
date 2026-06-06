import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Report = {
  analysis: {
    age: number;
    recommendedTime: string;
    currentMinutesPerDay: number | null;
    desiredMinutesPerDay: number | null;
    tip: string;
  };
  recommended: Array<{ name: string; whereToWatch: string[]; why: string }>;
  moderation: Array<{ name: string; whereToWatch: string[]; why: string }>;
  notRecommended: Array<{ name: string; whereToWatch: string[]; why: string }>;
};

const MAX_PAYLOAD_CHARS = 60_000;
const MAX_SECTION_ITEMS = 50;
const MAX_STRING_LENGTH = 2000;

function pdfText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[•·]/g, "-")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(value: unknown) {
  const text = pdfText(value);
  return text.length > MAX_STRING_LENGTH
    ? `${text.slice(0, MAX_STRING_LENGTH - 3)}...`
    : text;
}

function enforceLimits(report: Report) {
  try {
    const approx = JSON.stringify(report ?? "").length;
    if (approx > MAX_PAYLOAD_CHARS) {
      return { ok: false, reason: "Payload muito grande" };
    }

    report.recommended = (report.recommended || []).slice(0, MAX_SECTION_ITEMS).map((it) => ({
      name: clampText(it.name),
      whereToWatch: (it.whereToWatch || []).slice(0, 10).map(clampText),
      why: clampText(it.why),
    }));
    report.moderation = (report.moderation || []).slice(0, MAX_SECTION_ITEMS).map((it) => ({
      name: clampText(it.name),
      whereToWatch: (it.whereToWatch || []).slice(0, 10).map(clampText),
      why: clampText(it.why),
    }));
    report.notRecommended = (report.notRecommended || [])
      .slice(0, MAX_SECTION_ITEMS)
      .map((it) => ({
        name: clampText(it.name),
        whereToWatch: (it.whereToWatch || []).slice(0, 10).map(clampText),
        why: clampText(it.why),
      }));

    if (report.analysis) {
      report.analysis.tip = clampText(report.analysis.tip);
      report.analysis.recommendedTime = clampText(report.analysis.recommendedTime);
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "Erro ao validar payload" };
  }
}

function wrap(text: string, max: number) {
  const words = pdfText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Report | null;
  if (!body?.analysis) {
    return NextResponse.json({ error: "Relatório inválido" }, { status: 400 });
  }

  const validation = enforceLimits(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.reason ?? "Payload inválido" },
      { status: 413 },
    );
  }

  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const left = 48;
  const lineHeight = 16;

  const newPage = () => {
    page = pdf.addPage([595.28, 841.89]);
    y = 800;
  };

  const drawLine = (text: string, bold = false, size = 12) => {
    if (y < 80) newPage();
    page.drawText(pdfText(text), {
      x: left,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0.17, 0.24, 0.31),
    });
    y -= lineHeight;
  };

  drawLine("AMMI - Relatorio Personalizado", true, 16);
  y -= 6;
  drawLine(`Idade: ${body.analysis.age} anos`, true);
  drawLine(`Tempo recomendado: ${body.analysis.recommendedTime}`);
  if (body.analysis.currentMinutesPerDay !== null) {
    drawLine(`Tempo atual: ${body.analysis.currentMinutesPerDay} min/dia`);
  }
  if (body.analysis.desiredMinutesPerDay !== null) {
    drawLine(`Tempo desejado: ${body.analysis.desiredMinutesPerDay} min/dia`);
  }
  y -= 10;

  const section = (
    title: string,
    items: Array<{ name: string; whereToWatch: string[]; why: string }>,
  ) => {
    drawLine(title, true, 13);
    if (items.length === 0) {
      drawLine("-");
      y -= 6;
      return;
    }

    for (const item of items) {
      drawLine(`- ${item.name}`, true);
      if (item.whereToWatch?.length) {
        for (const line of wrap(`Onde assistir: ${item.whereToWatch.join(", ")}`, 78)) {
          drawLine(line);
        }
      }
      for (const line of wrap(item.why, 78)) drawLine(line);
      y -= 6;
    }
  };

  section("Recomendados", body.recommended);
  section("Com moderacao", body.moderation);
  section("Nao recomendados", body.notRecommended);

  y -= 6;
  drawLine("Dica do dia", true, 13);
  for (const line of wrap(body.analysis.tip, 78)) drawLine(line);

  try {
    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=relatorio-ammi.pdf",
      },
    });
  } catch (error) {
    console.error("Erro salvando PDF:", error);
    return NextResponse.json({ error: "Erro gerando PDF" }, { status: 500 });
  }
}

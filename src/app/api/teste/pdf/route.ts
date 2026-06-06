import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

type Report = {
  analysis: {
    age: number;
    recommendedTime: string;
    currentMinutesPerDay: number | null;
    tip: string;
  };
  recommended: Array<{ name: string; whereToWatch: string[]; why?: string }>;
  moderation: Array<{ name: string; whereToWatch?: string[]; why?: string }>;
  notRecommended: Array<{ name: string; whereToWatch?: string[]; why?: string }>;
};

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
  const body = (await request.json().catch(() => null)) as Report | null;
  if (!body?.analysis) {
    return NextResponse.json({ error: "Relatório inválido" }, { status: 400 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const left = 48;

  const drawLine = (text: string, bold = false, size = 12) => {
    page.drawText(pdfText(text), {
      x: left,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0.17, 0.24, 0.31),
    });
    y -= 16;
  };

  const section = (title: string, items: Array<{ name: string; whereToWatch?: string[] }>) => {
    y -= 8;
    drawLine(title, true, 13);
    if (!items.length) {
      drawLine("-");
      return;
    }
    for (const item of items.slice(0, 8)) {
      drawLine(`- ${item.name}`, true);
      if (item.whereToWatch?.length) {
        for (const line of wrap(`Onde assistir: ${item.whereToWatch.join(", ")}`, 78)) {
          drawLine(line);
        }
      }
    }
  };

  drawLine("AMMI - Teste rapido", true, 16);
  y -= 6;
  drawLine(`Idade: ${body.analysis.age} anos`, true);
  drawLine(`Tempo recomendado: ${body.analysis.recommendedTime}`);
  if (body.analysis.currentMinutesPerDay !== null) {
    drawLine(`Tempo atual: ${body.analysis.currentMinutesPerDay} min/dia`);
  }

  section("Recomendados", body.recommended ?? []);
  section("Com moderacao", body.moderation ?? []);
  section("Evitar", body.notRecommended ?? []);

  y -= 8;
  drawLine("Dica", true, 13);
  for (const line of wrap(body.analysis.tip, 78)) drawLine(line);

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=ammi-teste.pdf",
    },
  });
}

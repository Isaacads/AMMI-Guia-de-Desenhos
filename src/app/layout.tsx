import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "AMMI · Guia de Desenhos por Idade",
  description:
    "Plataforma consultiva para ajudar pais a escolher desenhos adequados por idade, com foco no impacto das telas no neurodesenvolvimento infantil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1 px-3 sm:px-4 py-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="rounded-3xl bg-background border border-foreground/10 shadow-sm overflow-hidden">
              {children}
            </div>
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

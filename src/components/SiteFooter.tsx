import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-background/20 text-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-background/90">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/guia" className="text-background hover:underline">
            Guia
          </Link>
          <Link href="/blog" className="text-background hover:underline">
            Artigos
          </Link>
          <Link
            href="/premium/recomendador"
            className="text-background hover:underline"
          >
            Sugestões
          </Link>
          <Link
            href="/premium/catalogo"
            className="text-background hover:underline"
          >
            Catálogo
          </Link>
          <Link href="/premium/plano" className="text-background hover:underline">
            Plano semanal
          </Link>
          <Link
            href="/premium/consultorio"
            className="text-background hover:underline"
          >
            Consultório
          </Link>
        </div>
        <p>
          Conteúdo educativo e consultivo. Não substitui orientação médica
          individual.
        </p>
      </div>
    </footer>
  );
}

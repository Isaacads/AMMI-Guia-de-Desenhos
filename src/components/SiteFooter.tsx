import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10 mt-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 text-sm text-foreground/80 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/guia" className="hover:underline">
            Guia
          </Link>
          <Link href="/blog" className="hover:underline">
            Artigos
          </Link>
          <Link href="/premium/recomendador" className="hover:underline">
            Recomendador
          </Link>
          <Link href="/premium/catalogo" className="hover:underline">
            Catálogo
          </Link>
          <Link href="/premium/plano" className="hover:underline">
            Plano
          </Link>
          <Link href="/premium/consultorio" className="hover:underline">
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

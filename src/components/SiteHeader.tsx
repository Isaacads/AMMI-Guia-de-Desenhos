import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { MobileNav } from "@/components/MobileNav";

export async function SiteHeader() {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user: { id: string } | null = null;
  if (hasSupabaseEnv) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.auth.getUser();
      user = data.user ? { id: data.user.id } : null;
    } catch {}
  }

  return (
    <header className="bg-[var(--app-bg)] text-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-background">
          AMMI · Guia de Desenhos
        </Link>
        <nav className="hidden items-center gap-3 text-sm md:flex">
          <Link href="/teste" className="text-background/95 hover:underline">
            Teste
          </Link>
          <Link href="/guia" className="text-background/95 hover:underline">
            Guia
          </Link>
          <Link href="/blog" className="text-background/95 hover:underline">
            Artigos
          </Link>
          <Link
            href="/premium/recomendador"
            className="text-background/95 hover:underline"
          >
            Sugestões
          </Link>
          <Link
            href="/premium/catalogo"
            className="text-background/95 hover:underline"
          >
            Catálogo
          </Link>
          <Link href="/premium/plano" className="text-background/95 hover:underline">
            Plano semanal
          </Link>
          <Link
            href="/premium/consultorio"
            className="text-background/95 hover:underline"
          >
            Consultório
          </Link>
          {user ? (
            <>
              <Link href="/meu-acesso" className="text-background/95 hover:underline">
                Meu acesso
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md bg-background px-3 py-1.5 text-foreground"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/premium/upgrade"
                className="rounded-md border border-background/30 px-3 py-1.5 text-background hover:bg-background/10"
              >
                Assinar
              </Link>
              <Link
                href="/entrar"
                className="rounded-md bg-background px-3 py-1.5 text-foreground"
              >
                Entrar
              </Link>
            </div>
          )}
        </nav>
        <MobileNav isAuthed={!!user} />
      </div>
    </header>
  );
}

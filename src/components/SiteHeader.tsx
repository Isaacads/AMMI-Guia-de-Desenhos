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
      <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight text-background">
          AMMI · Guia de Desenhos
        </Link>
        <nav className="hidden md:flex items-center gap-3 text-sm">
          <Link href="/teste" className="hover:underline text-background/95">
            Teste
          </Link>
          <Link href="/guia" className="hover:underline text-background/95">
            Guia
          </Link>
          <Link href="/blog" className="hover:underline text-background/95">
            Artigos
          </Link>
          <Link
            href="/premium/recomendador"
            className="hover:underline text-background/95"
          >
            Recomendador
          </Link>
          <Link
            href="/premium/catalogo"
            className="hover:underline text-background/95"
          >
            Catálogo
          </Link>
          <Link
            href="/premium/plano"
            className="hover:underline text-background/95"
          >
            Plano
          </Link>
          <Link
            href="/premium/consultorio"
            className="hover:underline text-background/95"
          >
            Consultório
          </Link>
          {user ? (
            <>
              <Link href="/meu-acesso" className="hover:underline text-background/95">
                Meu acesso
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md bg-background text-foreground px-3 py-1.5"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/entrar"
              className="rounded-md bg-background text-foreground px-3 py-1.5"
            >
              Entrar
            </Link>
          )}
        </nav>
        <MobileNav isAuthed={!!user} />
      </div>
    </header>
  );
}

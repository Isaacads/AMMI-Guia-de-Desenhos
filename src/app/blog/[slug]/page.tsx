import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { findFallbackArticle } from "@/lib/content/articles";
import { getViewer } from "@/lib/viewer";

type Row = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  is_premium: boolean;
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await getViewer();

  let article:
    | {
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        isPremium: boolean;
      }
    | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("slug,title,excerpt,content,is_premium")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      const row = data as Row;
      article = {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        isPremium: row.is_premium,
      };
    }
  } catch {}

  if (!article) {
    const fallback = findFallbackArticle(slug);
    if (!fallback) notFound();
    article = {
      slug: fallback.slug,
      title: fallback.title,
      excerpt: fallback.excerpt,
      content: fallback.content,
      isPremium: fallback.isPremium,
    };
  }

  const canViewFull = !article.isPremium || viewer?.plan === "premium";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <Link href="/blog" className="text-sm hover:underline">
          ← Voltar
        </Link>
        {article.isPremium ? (
          <span className="rounded-full bg-primary text-background px-3 py-1 text-xs">
            Premium
          </span>
        ) : (
          <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
            Gratuito
          </span>
        )}
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {article.title}
      </h1>
      <p className="mt-3 text-foreground/80">{article.excerpt}</p>

      <div className="mt-8 whitespace-pre-wrap leading-7 text-sm md:text-base">
        {canViewFull ? article.content : article.content.split("\n\n")[0]}
      </div>

      {canViewFull && article.isPremium ? (
        <div className="mt-10 rounded-2xl bg-white/70 border border-foreground/10 p-6 flex flex-col gap-3">
          <p className="font-semibold">Recursos Premium</p>
          <p className="text-foreground/80 text-sm">
            Transforme o conteúdo em ação usando as ferramentas do app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/premium/recomendador"
              className="rounded-md bg-primary text-background px-5 py-3 text-center font-medium"
            >
              Abrir recomendador
            </Link>
            <Link
              href="/premium/plano"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Gerar plano semanal
            </Link>
            <Link
              href="/premium/catalogo"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      ) : null}

      {!canViewFull ? (
        <div className="mt-10 rounded-2xl bg-white/70 border border-foreground/10 p-6 flex flex-col gap-3">
          <p className="font-semibold">Continue no Premium</p>
          <p className="text-foreground/80">
            A versão completa libera biblioteca total, recomendador inteligente,
            catálogo e ferramentas de plano e acompanhamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="https://pay.kiwify.com.br/yDSNQfj"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-primary text-background px-5 py-3 text-center font-medium"
            >
              Fazer upgrade
            </Link>
            <Link
              href="/premium/recomendador"
              className="rounded-md border border-foreground/20 px-5 py-3 text-center font-medium"
            >
              Ver recomendador
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

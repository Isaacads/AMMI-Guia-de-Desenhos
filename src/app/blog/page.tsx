import Link from "next/link";
import { fallbackArticles } from "@/lib/content/articles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Row = {
  slug: string;
  title: string;
  excerpt: string;
  is_premium: boolean;
};

const BLOG_QUERY_TIMEOUT_MS = 900;

function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number,
): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutMs);
    }),
  ]);
}

export default async function BlogPage() {
  let articles: Array<{
    slug: string;
    title: string;
    excerpt: string;
    isPremium: boolean;
  }> = fallbackArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    isPremium: a.isPremium,
  }));

  try {
    const supabase = await createSupabaseServerClient();
    const result = await withTimeout(
      supabase
        .from("articles")
        .select("slug,title,excerpt,is_premium")
        .order("published_at", { ascending: false })
        .limit(20),
      BLOG_QUERY_TIMEOUT_MS,
    );

    const data = result?.data;
    const error = result?.error;

    if (!error && data && data.length > 0) {
      articles = (data as Row[]).map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        isPremium: a.is_premium,
      }));
    }
  } catch {}

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Artigos</h1>
        <p className="text-foreground/80 max-w-2xl">
          Conteúdo educativo sobre telas, desenvolvimento infantil e escolhas de
          desenhos. Alguns artigos são completos no Premium.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {articles.map((a) => (
          <article
            key={a.slug}
            className="rounded-2xl bg-white/70 border border-foreground/10 p-6 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold leading-snug">{a.title}</h2>
              {a.isPremium ? (
                <span className="rounded-full bg-primary text-background px-3 py-1 text-xs">
                  Premium
                </span>
              ) : (
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
                  Gratuito
                </span>
              )}
            </div>
            <p className="text-sm text-foreground/80">{a.excerpt}</p>
            <div className="mt-2">
              <Link
                href={`/blog/${a.slug}`}
                className="text-sm font-medium hover:underline"
              >
                Ler artigo →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

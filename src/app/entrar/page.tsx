import Link from "next/link";
import { signInWithEmail } from "@/app/(auth)/actions";
import { KIWIFY_CHECKOUT_URL } from "@/lib/billing";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams?: Promise<{ erro?: string; next?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const errorMessage = sp?.erro ? decodeURIComponent(sp.erro) : null;
  const next = sp?.next ? decodeURIComponent(sp.next) : null;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-2 text-foreground/80">
        Acesse com o e-mail e a senha liberados após a compra.
      </p>

      {errorMessage ? (
        <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          {errorMessage}
        </div>
      ) : null}

      <form action={signInWithEmail} className="mt-6 space-y-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            inputMode="email"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-background"
        >
          Entrar
        </button>
      </form>

      <Link
        href={KIWIFY_CHECKOUT_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-foreground/20 px-4 py-2.5 font-medium hover:bg-white/20"
      >
        Assinar agora
      </Link>

      <p className="mt-6 text-sm text-foreground/80">
        Esqueceu sua senha?{" "}
        <Link href="/recuperar-senha" className="font-medium hover:underline">
          Alterar senha
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import { signUpWithEmail } from "@/app/(auth)/actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams?: Promise<{ erro?: string; next?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const errorMessage = sp?.erro ? decodeURIComponent(sp.erro) : null;
  const next = sp?.next ? decodeURIComponent(sp.next) : null;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Criar conta</h1>
      <p className="mt-2 text-foreground/80">
        Salve preferências, receba newsletter e acompanhe recomendações.
      </p>

      {errorMessage ? (
        <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          {errorMessage}
        </div>
      ) : null}

      <form action={signUpWithEmail} className="mt-6 space-y-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Nome
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
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
            autoComplete="new-password"
            minLength={8}
          />
          <p className="text-xs text-foreground/70">
            Use no mínimo 8 caracteres.
          </p>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary text-background px-4 py-2.5 font-medium"
        >
          Criar conta
        </button>
      </form>

      <p className="mt-6 text-sm text-foreground/80">
        Já tem conta?{" "}
        <Link
          href={next ? `/entrar?next=${encodeURIComponent(next)}` : "/entrar"}
          className="font-medium hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}

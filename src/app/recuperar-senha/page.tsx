import Link from "next/link";
import { sendPasswordResetEmail } from "@/app/(auth)/actions";

export default async function RecuperarSenhaPage({
  searchParams,
}: {
  searchParams?: Promise<{ erro?: string; sucesso?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const errorMessage = sp?.erro ? decodeURIComponent(sp.erro) : null;
  const successMessage = sp?.sucesso ? decodeURIComponent(sp.sucesso) : null;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Alterar senha</h1>
      <p className="mt-2 text-foreground/80">
        Informe o email usado na compra para receber o link de alteração.
      </p>

      {errorMessage ? (
        <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm">
          {successMessage}
        </div>
      ) : null}

      <form action={sendPasswordResetEmail} className="mt-6 space-y-4">
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
        <button
          type="submit"
          className="w-full rounded-md bg-primary text-background px-4 py-2.5 font-medium"
        >
          Enviar link de alteração
        </button>
      </form>

      <p className="mt-6 text-sm text-foreground/80">
        Lembrou sua senha?{" "}
        <Link href="/entrar" className="font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}

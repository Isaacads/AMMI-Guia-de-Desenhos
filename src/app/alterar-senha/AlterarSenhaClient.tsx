"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AlterarSenhaClient() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    if (password.length < 8) {
      setStatus("error");
      setMessage("Use no mínimo 8 caracteres.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Senha alterada com sucesso. Você já pode entrar.");
    setPassword("");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Nova senha</h1>
      <p className="mt-2 text-foreground/80">
        Defina uma nova senha para acessar sua conta.
      </p>

      {message ? (
        <div
          className={`mt-6 rounded-xl border p-4 text-sm ${
            status === "success"
              ? "border-primary/30 bg-primary/10"
              : "border-warning/30 bg-warning/10"
          }`}
        >
          {message}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Nova senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-foreground/20 bg-white/70 px-3 py-2"
            autoComplete="new-password"
          />
          <p className="text-xs text-foreground/70">Use no mínimo 8 caracteres.</p>
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-md bg-primary text-background px-4 py-2.5 font-medium disabled:opacity-60"
        >
          {status === "loading" ? "Alterando..." : "Alterar senha"}
        </button>
      </form>

      <p className="mt-6 text-sm text-foreground/80">
        <Link href="/entrar" className="font-medium hover:underline">
          Voltar para entrar
        </Link>
      </p>
    </div>
  );
}

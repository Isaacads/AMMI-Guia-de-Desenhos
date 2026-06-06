"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { signOut } from "@/app/(auth)/actions";

type Props = {
  isAuthed: boolean;
};

export function MobileNav({ isAuthed }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const linkClass = "block px-3 py-2 rounded-md hover:bg-background/10";

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md bg-background/10 px-3 py-2"
      >
        <span className="sr-only">Abrir menu</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/20"
          />
          <div
            id={panelId}
            className="absolute right-0 mt-2 w-[min(92vw,320px)] z-50 rounded-xl bg-[var(--app-bg)] text-background shadow-lg border border-background/20 p-2"
          >
            <Link href="/teste" onClick={() => setOpen(false)} className={linkClass}>
              Teste
            </Link>
            <Link href="/guia" onClick={() => setOpen(false)} className={linkClass}>
              Guia
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)} className={linkClass}>
              Artigos
            </Link>
            <Link
              href="/premium/recomendador"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Recomendador
            </Link>
            <Link
              href="/premium/catalogo"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Catálogo
            </Link>
            <Link
              href="/premium/plano"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Plano
            </Link>
            <Link
              href="/premium/consultorio"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Consultório
            </Link>
            {isAuthed ? (
              <>
                <Link
                  href="/meu-acesso"
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  Meu acesso
                </Link>
                <form action={signOut} className="mt-1">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-background text-foreground px-3 py-2 text-left font-medium"
                  >
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/entrar"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-md bg-background text-foreground px-3 py-2 font-medium"
              >
                Entrar
              </Link>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

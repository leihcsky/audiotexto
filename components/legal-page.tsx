import type { ReactNode } from "react";
import { LEGAL_UPDATED_AT } from "@/lib/legal";

export function LegalPage({
  title,
  updatedAt = LEGAL_UPDATED_AT,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12">
      <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">Última actualización: {updatedAt}</p>
      <div className="mt-8 space-y-4 text-base leading-7 text-ink [&_h2]:pt-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_h3]:pt-2 [&_h3]:font-serif [&_h3]:text-xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4">
        {children}
      </div>
    </main>
  );
}

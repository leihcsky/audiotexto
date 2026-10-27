import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="VozTexto, inicio" className="w-fit">
          <BrandLogo size="md" />
        </Link>
        <nav className="flex gap-4 text-sm text-muted" aria-label="Secciones">
          <Link href="/#como-funciona" className="hover:text-ink">
            Cómo hacerlo
          </Link>
          <Link href="/#preguntas" className="hover:text-ink">
            Preguntas
          </Link>
        </nav>
      </div>
    </header>
  );
}

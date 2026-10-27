import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <BrandLogo size="sm" />
          <p>Transcribe audio a texto online, desde el navegador.</p>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Información">
          <Link href="/privacidad" className="hover:text-ink">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-ink">
            Términos
          </Link>
          <Link href="/contacto" className="hover:text-ink">
            Contacto
          </Link>
        </nav>
      </div>
    </footer>
  );
}

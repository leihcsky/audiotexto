import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SITE_DOMAIN } from "@/lib/legal";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 py-8 text-sm text-muted sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <BrandLogo size="sm" />
          <p>Transcribe audio a texto online, desde el navegador.</p>
          <p className="text-xs">{SITE_DOMAIN}</p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Información legal">
          <Link href="/privacidad" className="hover:text-ink">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-ink">
            Términos
          </Link>
          <Link href="/cookies" className="hover:text-ink">
            Cookies
          </Link>
          <Link href="/aviso-legal" className="hover:text-ink">
            Aviso legal
          </Link>
          <Link href="/contacto" className="hover:text-ink">
            Contacto
          </Link>
        </nav>
      </div>
    </footer>
  );
}

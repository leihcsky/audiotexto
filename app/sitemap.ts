import type { MetadataRoute } from "next";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = getConfig();
  const lastModified = new Date();
  return ["/", "/privacidad", "/terminos", "/cookies", "/aviso-legal", "/contacto"].map(
    (path) => ({
      url: path === "/" ? siteUrl : `${siteUrl}${path}`,
      lastModified,
    }),
  );
}

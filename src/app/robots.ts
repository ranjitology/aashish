import type { MetadataRoute } from "next";
import { sitemapUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: sitemapUrl("/sitemap.xml"),
  };
}
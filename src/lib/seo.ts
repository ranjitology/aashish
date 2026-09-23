export function sitemapUrl(path = "") {
  const raw = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    ""
  ).trim();

  let base = raw.replace(/\/$/, "");
  if (base && !/^https?:\/\//i.test(base)) base = `https://${base}`;
  if (!base) base = "http://localhost:3000";

  try {
    base = new URL(base).origin.replace(/\/$/, "");
  } catch {
    base = "http://localhost:3000";
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
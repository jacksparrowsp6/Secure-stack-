import { SITE_NAME, SITE_ORIGIN } from "@/components/SiteLayout";

type SeoInput = { title: string; description: string; path: string; type?: "website" | "article"; publishedAt?: string; modifiedAt?: string; locale?: "en" | "de" };

function upsert(selector: string, attrs: Record<string, string>, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) { el = document.createElement(selector.startsWith("link") ? "link" : "meta") as HTMLMetaElement | HTMLLinkElement; document.head.appendChild(el); }
  Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
  if (selector.startsWith("meta")) (el as HTMLMetaElement).content = content;
  else (el as HTMLLinkElement).href = content;
}

function remove(selector: string) { document.head.querySelector(selector)?.remove(); }

export function setSeo(input: SeoInput) {
  if (typeof document === "undefined") return;
  document.title = input.title;
  const canonical = `${SITE_ORIGIN}${input.path}`;
  const locale = input.locale || "en";
  upsert('meta[name="description"]', { name: "description" }, input.description);
  upsert('meta[name="author"]', { name: "author" }, "SecureStack Editorial");
  upsert('link[rel="canonical"]', { rel: "canonical" }, canonical);
  upsert('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
  upsert('meta[property="og:locale"]', { property: "og:locale" }, locale === "de" ? "de_DE" : "en_US");
  if (input.publishedAt) upsert('meta[property="article:published_time"]', { property: "article:published_time" }, input.publishedAt);
  if (input.modifiedAt) upsert('meta[property="article:modified_time"]', { property: "article:modified_time" }, input.modifiedAt);
  if (locale === "de") upsert('link[rel="alternate"][hreflang="de"]', { rel: "alternate", hreflang: "de" }, canonical);
  else remove('link[rel="alternate"][hreflang="de"]');
}

import { SITE_NAME, SITE_ORIGIN } from "@/components/SiteLayout";

type SeoInput = { title: string; description: string; path: string; type?: "website" | "article"; publishedAt?: string; modifiedAt?: string };

function upsert(selector: string, attrs: Record<string, string>, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) { el = document.createElement(selector.startsWith("link") ? "link" : "meta") as HTMLMetaElement | HTMLLinkElement; document.head.appendChild(el); }
  Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
  if (selector.startsWith("meta")) (el as HTMLMetaElement).content = content;
  else (el as HTMLLinkElement).href = content;
}

export function setSeo(input: SeoInput) {
  if (typeof document === "undefined") return;
  document.title = input.title;
  const canonical = `${SITE_ORIGIN}${input.path}`;
  upsert('meta[name="description"]', { name: "description" }, input.description);
  upsert('meta[name="author"]', { name: "author" }, "SecureStack Editorial");
  upsert('link[rel="canonical"]', { rel: "canonical" }, canonical);
  if (input.publishedAt) upsert('meta[property="article:published_time"]', { property: "article:published_time" }, input.publishedAt);
  if (input.modifiedAt) upsert('meta[property="article:modified_time"]', { property: "article:modified_time" }, input.modifiedAt);
}

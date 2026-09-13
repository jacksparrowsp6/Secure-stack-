import type { QueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { trpc } from "@/lib/trpc";
import type { PublicArticle } from "../../../server/db";

export type HeadMeta = { title: string; description: string; canonicalPath: string; ogType?: "website" | "article"; publishedTime?: string; modifiedTime?: string; noindex?: boolean; notFound?: boolean };
export type SsrPrefetch = { contentList: () => Promise<PublicArticle[]>; contentBySlug: (slug: string) => Promise<PublicArticle | null> };
const SITE = "SecureStack Hub";
const DEFAULT_DESCRIPTION = "Evidence-led VPN troubleshooting, streaming access, device fixes, and practical online privacy guides for everyday users.";
const cleanPath = (url: string) => url.split("?")[0] || "/";

export async function prefetchForPath(url: string, qc: QueryClient, p: SsrPrefetch): Promise<HeadMeta> {
  const path = cleanPath(url);
  if (path === "/" || path === "/category/vpn-troubleshooting") {
    const list = await p.contentList();
    qc.setQueryData(getQueryKey(trpc.content.list, undefined, "query"), list);
    return { title: "VPN Troubleshooting & Online Privacy Guides | SecureStack Hub", description: DEFAULT_DESCRIPTION, canonicalPath: path, ogType: "website" };
  }
  if (path === "/about") return { title: "About & Editorial Standards | SecureStack Hub", description: "Learn how SecureStack Hub researches troubleshooting and online privacy guides, handles affiliate relationships, and updates articles.", canonicalPath: path, ogType: "website" };
  if (path === "/editor") return { title: "Publisher Editor | SecureStack Hub", description: "Private publishing area for SecureStack Hub.", canonicalPath: path, noindex: true };
  const match = path.match(/^\/article\/([^/]+)$/);
  if (match) {
    const slug = decodeURIComponent(match[1]);
    const [article, list] = await Promise.all([p.contentBySlug(slug), p.contentList()]);
    qc.setQueryData(getQueryKey(trpc.content.bySlug, { slug }, "query"), article);
    qc.setQueryData(getQueryKey(trpc.content.list, undefined, "query"), list);
    if (!article) return { title: "Guide not found | SecureStack Hub", description: DEFAULT_DESCRIPTION, canonicalPath: path, notFound: true };
    return { title: `${article.title} | SecureStack Hub`, description: article.description, canonicalPath: path, ogType: "article", publishedTime: article.publishedAt || undefined, modifiedTime: article.updatedAt };
  }
  return { title: `Page not found | ${SITE}`, description: DEFAULT_DESCRIPTION, canonicalPath: path, notFound: true };
}

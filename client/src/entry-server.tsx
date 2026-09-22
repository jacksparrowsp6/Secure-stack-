import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
import { articles } from "@/lib/articles";

const origin = "https://securestack-hub.pages.dev";
const escape = (x: string) => x.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const articlePath = (article: typeof articles[number]) => `${article.pathPrefix}/${article.slug}/`;
const languageForPath = (path: string) => path.startsWith("/de/") ? "de" : "en";

export function getRoutes() { return ["/", "/category/vpn-troubleshooting/", "/de/", "/about/", "/feedback/", ...articles.map(articlePath)]; }
export function getRedirects() { return [...articles.filter((a) => a.locale === "en").map((a) => `${new URL(a.canonicalUrl).pathname} /article/${a.slug}/ 301`), "/article/blog-post /article/can-school-see-vpn-use/ 301", "/article/blog-post_09 /article/vpn-not-working-galaxy-s24/ 301", "/article/blog-post_504 /article/vpn-kills-wifi-connection/ 301", "/article/vpn-not-working-galaxy-s24-fix /article/vpn-not-working-galaxy-s24/ 301", "/2026/09/vpn-not-working-galaxy-s24-fix.html /article/vpn-not-working-galaxy-s24/ 301"]; }

export function getHead(path: string) {
  const article = articles.find((a) => articlePath(a) === path);
  const german = languageForPath(path) === "de";
  const category = path === "/category/vpn-troubleshooting/";
  const feedback = path === "/feedback/";
  const known = path === "/" || path === "/de/" || category || path === "/about/" || feedback || Boolean(article);
  const title = article ? `${article.title} | SecureStack Hub` : path === "/de/" ? "VPN-Hilfe auf Deutsch | SecureStack Hub" : category ? "VPN Troubleshooting Guides | SecureStack Hub" : path === "/about/" ? "About SecureStack Hub | Editorial Standards" : feedback ? "Corrections & Feedback | SecureStack Hub" : known ? "VPN Troubleshooting & Privacy Guides | SecureStack Hub" : "Page Not Found | SecureStack Hub";
  const description = article?.description || (path === "/de/" ? "Deutsche Anleitungen zu VPN-, DNS-, Windows-, Router- und Netzwerkproblemen für Deutschland, Österreich und die Schweiz." : category ? "Straightforward VPN troubleshooting guides for Wi-Fi, DNS, devices, and local networks." : feedback ? "Send SecureStack Hub a correction or website feedback through our public feedback page." : known ? "Straightforward VPN troubleshooting and online privacy guides with clear steps, practical limits, and no hype." : "The requested SecureStack Hub page could not be found.");
  return { title, description, canonical: `${origin}${path}`, article, locale: german ? "de" : "en", notFound: !known };
}
export function getLastModified(path: string) { const article = articles.find((a) => articlePath(a) === path); return article?.updatedAt || "2026-09-18"; }

export function render(url: string) {
  const path = url.split("?")[0].replace(/([^/])$/, "$1/") || "/";
  const head = getHead(path);
  const html = renderToString(<Router ssrPath={path}><App /></Router>);
  const breadcrumb = head.article ? { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: head.locale === "de" ? "Startseite" : "Home", item: `${origin}${head.locale === "de" ? "/de/" : "/"}` }, { "@type": "ListItem", position: 2, name: head.locale === "de" ? "Deutsche VPN-Anleitungen" : "VPN Troubleshooting", item: `${origin}${head.locale === "de" ? "/de/" : "/category/vpn-troubleshooting/"}` }, { "@type": "ListItem", position: 3, name: head.article.title, item: head.canonical }] } : null;
  const articleSchema = head.article ? { "@context": "https://schema.org", "@type": "Article", inLanguage: head.locale, headline: head.article.title, description: head.article.description, datePublished: head.article.publishedAt, dateModified: head.article.updatedAt, author: { "@type": "Organization", name: head.locale === "de" ? "SecureStack Hub Redaktion" : "SecureStack Editorial", url: `${origin}/about/` }, publisher: { "@type": "Organization", name: "SecureStack Hub", url: origin }, mainEntityOfPage: head.canonical } : null;
  const faqSchema = head.article?.faq?.length ? { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: head.locale, mainEntity: head.article.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
  const jsonLd = head.article ? `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : ""}${breadcrumb ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...breadcrumb })}</script>` : ""}` : `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "SecureStack Hub", url: origin, inLanguage: head.locale })}</script>`;
  const alternates = head.locale === "de" ? `<link rel="alternate" hreflang="de" href="${head.canonical}">` : "";
  const meta = `<title>${escape(head.title)}</title><meta name="description" content="${escape(head.description)}"><meta name="author" content="SecureStack Editorial"><meta name="robots" content="${head.notFound ? "noindex,nofollow" : "index,follow"}"><meta name="google-site-verification" content="dlCrSiMy1rU3QRhcMeH4FkiKGV_rt-N4SJB_1P8HJXI"><meta property="og:locale" content="${head.locale === "de" ? "de_DE" : "en_US"}><link rel="icon" href="/favicon.svg" type="image/svg+xml">${head.notFound ? "" : `<link rel="canonical" href="${head.canonical}">${alternates}`}${jsonLd}`;
  return { html, head: meta, title: head.title, notFound: head.notFound, locale: head.locale };
}

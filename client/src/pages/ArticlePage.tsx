import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { articles } from "@/lib/articles";
import { SiteLayout, RelatedGrid, articlePath } from "@/components/SiteLayout";
import { setSeo } from "@/lib/seo";
import { useEffect } from "react";

export default function ArticlePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [location] = useLocation();
  const locale = location.startsWith("/de/") ? "de" : "en";
  const article = articles.find((a) => a.slug === slug && a.locale === locale);
  const homePath = locale === "de" ? "/de/" : "/";
  useEffect(() => { if (article) setSeo({ title: `${article.title} | SecureStack Hub`, description: article.description, path: articlePath(article.slug, article.locale), type: "article", publishedAt: article.publishedAt, modifiedAt: article.updatedAt, locale }); }, [article, locale]);
  if (!article) return <SiteLayout><main className="container page-state" lang={locale}><p className="eyebrow">404 · {locale === "de" ? "Anleitung nicht gefunden" : "Guide not found"}</p><h1>{locale === "de" ? "Diese Anleitung ist nicht verfügbar." : "This guide is not available."}</h1><Link href={homePath} className="button button-primary">{locale === "de" ? "Zur Startseite" : "Return home"} <ArrowRight size={15} /></Link></main></SiteLayout>;
  return <SiteLayout><main className="article-page" lang={locale}><div className="container"><Link href={homePath} className="back-link"><ArrowLeft size={15} /> {locale === "de" ? "Alle deutschen Anleitungen" : "All guides"}</Link><article className="article-main"><div className="article-kicker"><span>{article.category}</span></div><h1>{article.title}</h1><p className="article-dek">{article.description}</p><div className="article-byline"><span className="author-avatar"><ShieldCheck size={16} /></span><strong>{locale === "de" ? "SecureStack Hub Redaktion" : "SecureStack Editorial"}</strong></div><div className="article-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} /><p className="article-note"><strong>{locale === "de" ? "Hinweis zur Genauigkeit:" : "Accuracy note:"}</strong> {locale === "de" ? "VPN-Funktionen, Geräteeinstellungen und Netzwerkregeln können sich ändern. Prüfe die aktuelle offizielle Dokumentation deines Geräts, VPN-Anbieters oder Netzwerks." : "VPN features, prices, device settings, and network policies can change. Check the relevant official documentation for your device, provider, bank, or network before relying on a recommendation."}</p><RelatedGrid currentSlug={article.slug} locale={article.locale} /></article></div></main></SiteLayout>;
}

import { Link, useLocation } from "wouter";
import { ShieldCheck, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { articles } from "@/lib/articles";

export const SITE_ORIGIN = import.meta.env.VITE_CANONICAL_ORIGIN || "https://securestack-hub.pages.dev";
export const SITE_NAME = "SecureStack Hub";
export const articlePath = (slug: string, locale = "en") => locale === "de" ? `/de/artikel/${slug}/` : `/article/${slug}/`;
export const languageHomePath = (locale: string) => locale === "de" ? "/de/" : "/";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isGerman = location.startsWith("/de/") || location === "/de";
  return <div className="site-shell">
    <header className="site-header">
      <div className="container header-inner">
        <Link href={languageHomePath(isGerman ? "de" : "en")} className="brand"><span className="brand-mark"><ShieldCheck size={19} /></span><span>SecureStack <em>Hub</em></span></Link>
        <nav className="main-nav" aria-label={isGerman ? "Hauptnavigation" : "Primary navigation"}>
          <Link href={languageHomePath(isGerman ? "de" : "en")}>{isGerman ? "Startseite" : "Home"}</Link>
          <Link href={isGerman ? "/de/" : "/category/vpn-troubleshooting/"}>{isGerman ? "Deutsch" : "VPN troubleshooting"}</Link>
          <Link href={isGerman ? "/about/" : "/about/"}>{isGerman ? "Über uns" : "About"}</Link>
          <Link href={isGerman ? "/feedback/" : "/feedback/"}>{isGerman ? "Korrekturen" : "Corrections"}</Link>
        </nav>
        <div className="language-switcher" aria-label="Language selector">
          {isGerman ? <Link href="/" lang="en">English</Link> : <Link href="/de/" lang="de">Deutsch</Link>}
        </div>
      </div>
    </header>
    {children}
    <footer className="site-footer"><div className="container footer-inner"><div><div className="brand footer-brand"><span className="brand-mark"><ShieldCheck size={17} /></span><span>SecureStack <em>Hub</em></span></div><p>{isGerman ? "Klare, praktische Hilfe bei VPN-, DNS- und Netzwerkproblemen." : "Clear, practical guidance for VPN troubleshooting and everyday digital privacy."}</p></div><div className="footer-links"><Link href={languageHomePath(isGerman ? "de" : "en")}>{isGerman ? "Deutsche Anleitungen" : "Latest guides"}</Link><Link href="/about/">{isGerman ? "Redaktionelle Standards" : "Editorial standards"}</Link><Link href="/feedback/">{isGerman ? "Korrekturen und Feedback" : "Corrections & feedback"}</Link></div></div><div className="container footer-bottom"><span>© 2026 SecureStack Hub</span><span>{isGerman ? "Affiliate-Hinweis: Kommerzielle Beziehungen werden neben der jeweiligen Empfehlung offengelegt." : "Affiliate disclosure: Some links may be affiliate links; any commercial relationship is disclosed beside the recommendation."}</span></div></footer>
  </div>;
}

export function RelatedGrid({ currentSlug, locale = "en", heading }: { currentSlug: string; locale?: string; heading?: string }) {
  const current = articles.find((a) => a.slug === currentSlug && a.locale === locale);
  const related = articles.filter((a) => a.locale === locale && a.slug !== currentSlug).sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category)).slice(0, 4);
  const title = heading || (locale === "de" ? "Weitere deutsche Anleitungen" : "Related guides");
  return <section className="related-section"><div className="section-heading"><div><p className="eyebrow">{locale === "de" ? "Weiterlesen" : "Keep reading"}</p><h2>{title}</h2></div></div><div className="related-grid">{related.map((a) => <Link href={articlePath(a.slug, a.locale)} className="related-card" key={`${a.locale}-${a.slug}`}><span className="card-category">{a.category}</span><h3>{a.title}</h3><p>{a.description}</p><span className="read-more">{locale === "de" ? "Anleitung öffnen" : "Read guide"} <ArrowRight size={14} /></span></Link>)}</div></section>;
}

export function languageAlternate(slug: string, locale: string) {
  return articles.find((a) => a.slug === slug && a.locale === locale);
}

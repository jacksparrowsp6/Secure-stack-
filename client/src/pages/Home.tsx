import { Link, useLocation } from "wouter";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { articles } from "@/lib/articles";
import { SiteLayout, articlePath } from "@/components/SiteLayout";
import { setSeo } from "@/lib/seo";
import { useEffect } from "react";

export default function Home() {
  const [location] = useLocation();
  const isGerman = location === "/de/" || location === "/de";
  const category = location.startsWith("/category/");
  const visible = isGerman ? articles.filter((a) => a.locale === "de") : category ? articles.filter((a) => a.locale === "en" && a.category === "VPN Troubleshooting") : articles.filter((a) => a.locale === "en");
  useEffect(() => setSeo({ title: isGerman ? "VPN-Hilfe auf Deutsch | SecureStack Hub" : category ? "VPN Troubleshooting Guides | SecureStack Hub" : "VPN Troubleshooting & Privacy Guides | SecureStack Hub", description: isGerman ? "Deutsche Anleitungen zu VPN-, DNS-, Windows-, Router- und Netzwerkproblemen für Deutschland, Österreich und die Schweiz." : "Straightforward VPN troubleshooting and online privacy guides with clear steps, practical limits, and no hype.", path: isGerman ? "/de/" : category ? "/category/vpn-troubleshooting/" : "/", locale: isGerman ? "de" : "en" }), [category, isGerman]);
  return <SiteLayout><main lang={isGerman ? "de" : "en"}><section className="simple-hero"><div className="container"><p className="eyebrow"><ShieldCheck size={14} /> {isGerman ? "Deutsche technische Hilfe" : "Practical security guidance"}</p><h1>{isGerman ? "VPN-Probleme verständlich lösen." : category ? "VPN troubleshooting guides" : "Clear answers when your connection gets complicated."}</h1><p>{isGerman ? "Native deutsche Anleitungen für VPN, DNS, Windows, FRITZ!Box, WLAN und lokale Netzwerke — mit sicheren Tests statt pauschalen Versprechen." : category ? "Work through the most common VPN, Wi-Fi, DNS, and local-network problems." : "Straightforward guides for VPN problems, device setup, and safer browsing—written to be useful, not intimidating."}</p></div></section><section className="container article-index"><div className="section-heading"><div><p className="eyebrow">{isGerman ? "Deutsch" : category ? "All guides" : "Start here"}</p><h2>{isGerman ? "Deutsche VPN- und Netzwerk-Anleitungen" : category ? "VPN fixes, in plain language" : "Latest practical guides"}</h2></div></div><div className="article-list">{visible.map((a) => <Link href={articlePath(a.slug, a.locale)} className="list-row" key={`${a.locale}-${a.slug}`}><div><span className="card-category">{a.category}</span><h3>{a.title}</h3><p>{a.description}</p></div><ArrowRight size={17} /></Link>)}</div></section></main></SiteLayout>;
}

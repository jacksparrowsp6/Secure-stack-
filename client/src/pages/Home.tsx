import { Link } from "wouter";
import { ArrowRight, ChevronRight, Shield, Zap, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SiteLayout, AdSlot, RelatedGrid, articlePath } from "@/components/SiteLayout";
import { setSeo } from "@/lib/seo";
import { useEffect } from "react";

export default function Home() {
  const { data: articles = [], isLoading } = trpc.content.list.useQuery();
  useEffect(() => { setSeo({ title: "VPN Troubleshooting & Online Privacy Guides | SecureStack Hub", description: "Evidence-led VPN troubleshooting, streaming access, device fixes, and practical online privacy guides for everyday users.", path: "/" }); }, []);
  const featured = articles.slice(0, 3);
  const rest = articles.slice(3, 9);
  return <SiteLayout articles={articles}>
    <main>
      <section className="hero-section"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow"><span className="pulse" /> Security guidance without the jargon</p><h1>Fix the connection.<br /><span>Keep your privacy.</span></h1><p className="hero-lede">Practical, step-by-step guides for VPN problems, streaming access, device setup, and safer everyday browsing.</p><div className="hero-actions"><Link href="/category/vpn-troubleshooting" className="button button-primary">Browse VPN fixes <ArrowRight size={17} /></Link><Link href="/about" className="text-link">How we research <ChevronRight size={16} /></Link></div><div className="trust-row"><span><Shield size={16} /> Independent guides</span><span><Zap size={16} /> Actionable steps</span></div></div><div className="hero-panel"><div className="panel-grid" /><div className="signal-card"><div className="signal-top"><span className="live-dot" /> Current focus</div><strong>VPN troubleshooting</strong><p>Fast paths through DNS, routing, kill switch, and local-network problems.</p><div className="signal-bar"><i /><i /><i /><i /><i /></div><span className="signal-caption">15 imported guides · New editor ready</span></div><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /></div></div></section>
      <div className="container"><AdSlot label="Ad space — connect AdSense after approval" /></div>
      <section className="container content-section"><div className="section-heading"><div><p className="eyebrow">Start here</p><h2>Popular troubleshooting paths</h2></div><Link href="/category/vpn-troubleshooting" className="section-link">View all <ArrowRight size={15} /></Link></div><div className="feature-grid">{isLoading ? <div className="loading-card">Loading guides…</div> : featured.map((a, i) => <Link href={articlePath(a.slug)} className={i === 0 ? "feature-card feature-card-main" : "feature-card"} key={a.slug}><div className="feature-index">0{i + 1}</div><span className="card-category">{a.category}</span><h3>{a.title}</h3><p>{a.description}</p><span className="read-more">Read the guide <ArrowRight size={15} /></span></Link>)}</div></section>
      <section className="category-band"><div className="container category-band-inner"><div><p className="eyebrow">A focused publication</p><h2>Built around the questions people ask when something breaks.</h2></div><div className="category-list"><Link href="/category/vpn-troubleshooting"><span>01</span> VPN troubleshooting <ArrowRight size={16} /></Link><Link href="/about"><span>02</span> Privacy explainers <ArrowRight size={16} /></Link><Link href="/about"><span>03</span> Editorial standards <ArrowRight size={16} /></Link></div></div></section>
      <section className="container content-section"><div className="section-heading"><div><p className="eyebrow">More from the hub</p><h2>Fresh guides to bookmark</h2></div><Search size={20} className="heading-icon" /></div><div className="article-list">{rest.map((a) => <Link href={articlePath(a.slug)} className="list-row" key={a.slug}><div><span className="card-category">{a.category}</span><h3>{a.title}</h3><p>{a.description}</p></div><ArrowRight size={18} /></Link>)}</div></section>
      <section className="container"><RelatedGrid articles={articles.slice(9)} heading="Explore the back catalogue" /></section>
    </main>
  </SiteLayout>;
}

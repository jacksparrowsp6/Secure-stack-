import { Link } from "wouter";
import { ShieldCheck, Search, Menu, X, ArrowRight, Mail, LockKeyhole } from "lucide-react";
import { useState } from "react";
import type { PublicArticle } from "../../../server/db";

export const SITE_ORIGIN = import.meta.env.VITE_CANONICAL_ORIGIN || "https://securestack-hub.pages.dev";
export const SITE_NAME = "SecureStack Hub";

export function articlePath(slug: string) { return `/article/${slug}`; }

export function SiteLayout({ children, articles = [] }: { children: React.ReactNode; articles?: PublicArticle[] }) {
  const [open, setOpen] = useState(false);
  return <div className="site-shell">
    <div className="topline"><div className="container topline-inner"><span><LockKeyhole size={13} /> Practical privacy and security guidance</span><span>Independent editorial coverage · Affiliate links will be disclosed</span></div></div>
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><ShieldCheck size={21} /></span><span>SecureStack <em>Hub</em></span></Link>
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        <nav className={open ? "main-nav open" : "main-nav"}>
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/category/vpn-troubleshooting" onClick={() => setOpen(false)}>VPN troubleshooting</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About & standards</Link>
          <Link href="/editor" className="nav-cta" onClick={() => setOpen(false)}>Write / edit <ArrowRight size={15} /></Link>
        </nav>
      </div>
    </header>
    {children}
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><div className="brand footer-brand"><span className="brand-mark"><ShieldCheck size={19} /></span><span>SecureStack <em>Hub</em></span></div><p>Clear, testable guidance for safer browsing, VPN troubleshooting, and everyday digital privacy.</p></div>
        <div><h3>Explore</h3><Link href="/">Latest guides</Link><Link href="/category/vpn-troubleshooting">VPN troubleshooting</Link><Link href="/about">Editorial standards</Link></div>
        <div><h3>Stay informed</h3><p className="small-copy">A future newsletter can live here once the audience is established.</p><a href="mailto:hello@securestackhub.example"><Mail size={15} /> Contact editorial</a></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 SecureStack Hub</span><span>Affiliate disclosure: links may earn a commission after approved partnerships are added.</span></div>
    </footer>
  </div>;
}

export function AdSlot({ label = "Advertisement" }: { label?: string }) { return <div className="ad-slot" aria-label={label}><span>{label}</span></div>; }

export function RelatedGrid({ articles, heading = "Keep reading" }: { articles: PublicArticle[]; heading?: string }) {
  return <section className="related-section"><div className="section-heading"><div><p className="eyebrow">Recommended next</p><h2>{heading}</h2></div><Search size={20} /></div><div className="related-grid">{articles.slice(0,4).map((a) => <Link href={articlePath(a.slug)} key={a.slug} className="related-card"><span className="card-category">{a.category}</span><h3>{a.title}</h3><p>{a.description}</p><span className="read-more">Read guide <ArrowRight size={15} /></span></Link>)}</div></section>;
}

import { Link } from "wouter";
import { ShieldCheck, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { articles } from "@/lib/articles";

export const SITE_ORIGIN = import.meta.env.VITE_CANONICAL_ORIGIN || "https://securestack-hub.pages.dev";
export const SITE_NAME = "SecureStack Hub";
export const articlePath = (slug: string) => `/article/${slug}`;

export function SiteLayout({ children }: { children: ReactNode }) { return <div className="site-shell"><header className="site-header"><div className="container header-inner"><Link href="/" className="brand"><span className="brand-mark"><ShieldCheck size={19} /></span><span>SecureStack <em>Hub</em></span></Link><nav className="main-nav"><Link href="/">Home</Link><Link href="/category/vpn-troubleshooting">VPN troubleshooting</Link><Link href="/about">About</Link></nav></div></header>{children}<footer className="site-footer"><div className="container footer-inner"><div><div className="brand footer-brand"><span className="brand-mark"><ShieldCheck size={17} /></span><span>SecureStack <em>Hub</em></span></div><p>Clear, practical guidance for VPN troubleshooting and everyday digital privacy.</p></div><div className="footer-links"><Link href="/">Latest guides</Link><Link href="/about">Editorial standards</Link><a href="mailto:hello@securestackhub.example">Contact</a></div></div><div className="container footer-bottom"><span>© 2026 SecureStack Hub</span><span>Affiliate links, when added, will be clearly disclosed.</span></div></footer></div>; }

export function RelatedGrid({ currentSlug, heading = "Related guides" }: { currentSlug: string; heading?: string }) { const current = articles.find((a) => a.slug === currentSlug); const related = articles.filter((a) => a.slug !== currentSlug).sort((a,b) => Number(b.category === current?.category)-Number(a.category === current?.category)).slice(0,4); return <section className="related-section"><div className="section-heading"><div><p className="eyebrow">Keep reading</p><h2>{heading}</h2></div></div><div className="related-grid">{related.map((a) => <Link href={articlePath(a.slug)} className="related-card" key={a.slug}><span className="card-category">{a.category}</span><h3>{a.title}</h3><p>{a.description}</p><span className="read-more">Read guide <ArrowRight size={14} /></span></Link>)}</div></section>; }

import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, ExternalLink, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SiteLayout, AdSlot, RelatedGrid, articlePath } from "@/components/SiteLayout";
import { setSeo } from "@/lib/seo";
import { useEffect, useMemo } from "react";

function pickRelated(all: any[], current: any) {
  const others = all.filter((x) => x.slug !== current.slug);
  const words = new Set(current.title.toLowerCase().split(/[^a-z0-9]+/).filter((w: string) => w.length > 3));
  return others.map((x) => ({ x, score: (x.category === current.category ? 3 : 0) + x.title.toLowerCase().split(/[^a-z0-9]+/).filter((w: string) => words.has(w)).length })).sort((a,b) => b.score-a.score).map((r) => r.x).slice(0,4);
}

export default function ArticlePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: article, isLoading } = trpc.content.bySlug.useQuery({ slug });
  const { data: all = [] } = trpc.content.list.useQuery();
  const related = useMemo(() => article ? pickRelated(all, article) : [], [all, article]);
  useEffect(() => { if (article) setSeo({ title: `${article.title} | SecureStack Hub`, description: article.description, path: articlePath(article.slug), type: "article", publishedAt: article.publishedAt || undefined, modifiedAt: article.updatedAt }); }, [article]);
  if (isLoading) return <SiteLayout><main className="container page-state">Loading guide…</main></SiteLayout>;
  if (!article) return <SiteLayout><main className="container page-state"><p className="eyebrow">404 · Guide not found</p><h1>This guide is not available.</h1><Link href="/" className="button button-primary">Return home <ArrowRight size={16} /></Link></main></SiteLayout>;
  return <SiteLayout articles={all}><main className="article-page"><div className="container"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to SecureStack Hub</Link><div className="article-layout"><article className="article-main"><div className="article-kicker"><span>{article.category}</span><span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span></div><h1>{article.title}</h1><p className="article-dek">{article.description}</p><div className="article-byline"><div className="author-avatar"><ShieldCheck size={18} /></div><div><strong>{article.authorName}</strong><span>Independent editorial guide</span></div><span className="byline-divider" /><span><CalendarDays size={15} /> {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Updated guide"}</span><span><Clock3 size={15} /> 5 min read</span></div><AdSlot label="Ad space — place after AdSense approval" /><div className="article-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} /><div className="article-note"><ShieldCheck size={20} /><div><strong>Editorial note</strong><p>This guide is maintained as practical troubleshooting information. Verify provider-specific settings against current official documentation before making security or payment decisions.</p></div></div><AdSlot label="Ad space — place after AdSense approval" /><RelatedGrid articles={related} heading="Read this next" /></article><aside className="article-aside"><div className="aside-card"><p className="eyebrow">On this page</p><p>Use the numbered fixes in order. Start with the least disruptive change, then retest before moving on.</p><div className="aside-rule" /><Link href="/about">How SecureStack researches <ExternalLink size={14} /></Link></div><div className="aside-sticky"><AdSlot label="Ad space" /></div></aside></div></div></main></SiteLayout>;
}

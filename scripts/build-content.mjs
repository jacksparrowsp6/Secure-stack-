import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
const contentDir = path.resolve('content/articles');
const files = (await fs.readdir(contentDir)).filter((f) => f.endsWith('.md')).sort();
const articles = [];
for (const file of files) {
  const raw = await fs.readFile(path.join(contentDir, file), 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  const meta = {};
  for (const line of match[1].split('\n')) { const i = line.indexOf(':'); if (i > 0) { let value = line.slice(i + 1).trim(); if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1); meta[line.slice(0, i).trim()] = value; } }
  const contentHtml = await marked.parse(match[2]);
  const faqSection = contentHtml.split(/<h2>FAQ<\/h2>/i)[1] || '';
  const strip = (value) => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const faq = [
    ...[...faqSection.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi)].map((m) => ({ question: strip(m[1]), answer: strip(m[2]) })),
    ...[...faqSection.matchAll(/<ol(?:\s[^>]*)?>\s*<li>\s*([^<]*?)\s*<\/li>\s*<\/ol>\s*<ul>\s*<li>([\s\S]*?)<\/li>/gi)].map((m) => ({ question: strip(m[1]), answer: strip(m[2]) })),
    ...[...faqSection.matchAll(/<ol(?:\s[^>]*)?>\s*<li>\s*([^<]*?)\s*<\/li>\s*<\/ol>\s*<p>([\s\S]*?)<\/p>/gi)].map((m) => ({ question: strip(m[1]), answer: strip(m[2]) })),
    ...[...faqSection.matchAll(/<ol(?:\s[^>]*)?>\s*<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/gi)].map((m) => { const parts = strip(m[1]).split(/\s*Antwort:\s*/i); return { question: parts[0], answer: parts.slice(1).join(' Antwort: ') || parts[0] }; }),
    ...[...faqSection.matchAll(/<p>\s*(?:\d+[.)]|[-–])\s*([^<]+)<\/p>\s*<p>([\s\S]*?)<\/p>/gi)].map((m) => ({ question: strip(m[1]), answer: strip(m[2]) })),
  ];
  const locale = meta.locale || 'en';
  const pathPrefix = locale === 'de' ? '/de/artikel' : '/article';
  articles.push({ slug: meta.slug || file.replace(/\.md$/, ''), locale, pathPrefix, canonicalUrl: `https://securestackhub.blogspot.com${meta.legacyPath || `/${file.replace(/\.md$/, '')}`}`, title: meta.title, description: meta.description, contentHtml, faq, category: meta.category || 'VPN Troubleshooting', publishedAt: meta.publishedAt || '', updatedAt: meta.updatedAt || '', wordCount: match[2].split(/\s+/).filter(Boolean).length });
}
const output = `export type StaticArticle = { slug: string; locale: string; pathPrefix: string; canonicalUrl: string; title: string; description: string; contentHtml: string; faq: { question: string; answer: string }[]; category: string; publishedAt: string; updatedAt: string; wordCount: number };\n\nexport const articles = ${JSON.stringify(articles, null, 2)} as const;\n`;
await fs.writeFile(path.resolve('client/src/lib/articles.ts'), output);
console.log(`Built ${articles.length} articles from content/articles`);

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
  const faqSection = match[2].split(/<h2>FAQ<\/h2>/i)[1] || '';
  const faq = [...faqSection.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi)].map((m) => ({ question: m[1].replace(/<[^>]+>/g, '').trim(), answer: m[2].replace(/<[^>]+>/g, '').trim() }));
  articles.push({ slug: meta.slug || file.replace(/\.md$/, ''), canonicalUrl: `https://securestackhub.blogspot.com${meta.legacyPath || `/${file.replace(/\.md$/, '')}`}`, title: meta.title, description: meta.description, contentHtml, faq, category: meta.category || 'VPN Troubleshooting', publishedAt: meta.publishedAt || '', updatedAt: meta.updatedAt || '', wordCount: match[2].split(/\s+/).filter(Boolean).length });
}
const output = `export type StaticArticle = { slug: string; canonicalUrl: string; title: string; description: string; contentHtml: string; faq: { question: string; answer: string }[]; category: string; publishedAt: string; updatedAt: string; wordCount: number };\n\nexport const articles = ${JSON.stringify(articles, null, 2)} as const;\n`;
await fs.writeFile(path.resolve('client/src/lib/articles.ts'), output);
console.log(`Built ${articles.length} articles from content/articles`);

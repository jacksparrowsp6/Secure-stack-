import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const MODEL = process.env.LOCALIZATION_MODEL || 'gpt-5-mini';
const API_BASE = (process.env.OPENAI_API_BASE || '').replace(/\/$/, '');
const API_KEY = process.env.OPENAI_API_KEY;
const ROOT = process.cwd();
const LOCALES = {
  es: { language: 'Spanish', region: 'international Spanish; prefer broadly understood terms and note regional differences', dir: 'ltr', prefix: 'es', articleWord: 'articulo', categoryWord: 'categoria' },
  'pt-br': { language: 'Brazilian Portuguese', region: 'Brazil', dir: 'ltr', prefix: 'pt-br', articleWord: 'artigo', categoryWord: 'categoria' },
  de: { language: 'German', region: 'Germany/Austria/Switzerland where terminology differs, avoid awkward literal calques', dir: 'ltr', prefix: 'de', articleWord: 'artikel', categoryWord: 'kategorie' },
  fr: { language: 'French', region: 'France and francophone readers; use natural technical French', dir: 'ltr', prefix: 'fr', articleWord: 'article', categoryWord: 'categorie' },
  it: { language: 'Italian', region: 'Italy', dir: 'ltr', prefix: 'it', articleWord: 'articolo', categoryWord: 'categoria' },
  nl: { language: 'Dutch', region: 'Netherlands and Belgium; use natural Dutch', dir: 'ltr', prefix: 'nl', articleWord: 'artikel', categoryWord: 'categorie' },
};

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function fail(message) { console.error(`\nError: ${message}`); process.exit(1); }
function stripFrontmatter(text) { return text.replace(/^---[\s\S]*?---\s*/m, '').trim(); }
function parseFrontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) fail('Source article has no YAML frontmatter.');
  const fields = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (m) fields[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return fields;
}
function jsonSchema(name, schema) {
  return { type: 'json_schema', json_schema: { name, strict: true, schema } };
}
async function callLLM(messages, schema, maxCompletionTokens = 18000) {
  if (!API_KEY || !API_BASE) fail('OPENAI_API_KEY and OPENAI_API_BASE are required.');
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, max_completion_tokens: maxCompletionTokens, response_format: jsonSchema(schema.name, schema.schema) }),
  });
  const body = await response.json();
  if (!response.ok) fail(`LLM request failed (${response.status}): ${JSON.stringify(body).slice(0, 800)}`);
  const content = body.choices?.[0]?.message?.content;
  if (!content) fail('LLM returned no structured content.');
  try { return JSON.parse(content); } catch { fail('LLM returned invalid JSON.'); }
}
function briefSchema() {
  return { name: 'localized_seo_brief', schema: { type: 'object', additionalProperties: false, properties: {
    search_intent: { type: 'string' }, primary_query: { type: 'string' }, secondary_queries: { type: 'array', items: { type: 'string' } },
    title: { type: 'string' }, description: { type: 'string' }, slug: { type: 'string' }, audience_note: { type: 'string' },
    terminology: { type: 'array', items: { type: 'string' } }, local_context: { type: 'array', items: { type: 'string' } }, outline: { type: 'array', items: { type: 'string' } }
  }, required: ['search_intent','primary_query','secondary_queries','title','description','slug','audience_note','terminology','local_context','outline'] } };
}
function articleSchema() {
  return { name: 'localized_article', schema: { type: 'object', additionalProperties: false, properties: {
    title: { type: 'string' }, description: { type: 'string' }, slug: { type: 'string' }, category: { type: 'string' },
    body_html: { type: 'string' }, faq: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { question: { type: 'string' }, answer: { type: 'string' } }, required: ['question','answer'] } },
    primary_query: { type: 'string' }, secondary_queries: { type: 'array', items: { type: 'string' } }, editorial_notes: { type: 'array', items: { type: 'string' } }
  }, required: ['title','description','slug','category','body_html','faq','primary_query','secondary_queries','editorial_notes'] } };
}
function reviewSchema() {
  return { name: 'localization_review', schema: { type: 'object', additionalProperties: false, properties: {
    approved: { type: 'boolean' }, score: { type: 'integer' }, issues: { type: 'array', items: { type: 'string' } }, fixes: { type: 'array', items: { type: 'string' } },
    corrected_title: { type: 'string' }, corrected_description: { type: 'string' }, corrected_body_html: { type: 'string' }, corrected_faq: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { question: { type: 'string' }, answer: { type: 'string' } }, required: ['question','answer'] } }
  }, required: ['approved','score','issues','fixes','corrected_title','corrected_description','corrected_body_html','corrected_faq'] } };
}
function yaml(value) { return JSON.stringify(value); }
function validate(article, locale) {
  const problems = [];
  if (!article.title || article.title.length < 25 || article.title.length > 90) problems.push('Title length outside 25–90 characters.');
  if (!article.description || article.description.length < 100 || article.description.length > 190) problems.push('Description length outside 100–190 characters.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) problems.push('Slug must be lowercase ASCII hyphenated text.');
  if (!article.body_html.includes('<h2>')) problems.push('Body needs H2 headings.');
  if (!article.body_html.includes('<p>')) problems.push('Body needs paragraphs.');
  if (!Array.isArray(article.faq) || article.faq.length < 3) problems.push('At least three localized FAQs are required.');
  if (article.body_html.includes('Lorem ipsum')) problems.push('Placeholder text detected.');
  if (!LOCALES[locale]) problems.push(`Unsupported locale: ${locale}`);
  return problems;
}
function frontmatter(article, source, locale, brief) {
  const date = new Date().toISOString().slice(0, 10);
  return `---\ntitle: ${yaml(article.title)}\ndescription: ${yaml(article.description)}\nslug: ${article.slug}\nlocale: ${locale}\nsourceSlug: ${source.slug}\ncategory: ${yaml(article.category)}\nprimaryQuery: ${yaml(article.primary_query)}\nsecondaryQueries: ${yaml(article.secondary_queries.join(' | '))}\npublishedAt: ${date}\nupdatedAt: ${date}\ntranslationMode: native-localization\n---\n${article.body_html.trim()}\n\n<h2>FAQ</h2>\n${article.faq.map(x => `<h3>${x.question}</h3>\n<p>${x.answer}</p>`).join('\n')}\n\n<!-- Editorial notes: ${article.editorial_notes.join(' | ')} -->\n<!-- Local SEO brief: ${brief.audience_note} -->\n`;
}
async function main() {
  const sourcePath = arg('source');
  const locale = arg('locale');
  const out = arg('out', `/home/ubuntu/seo-audit/localized-articles/${locale}`);
  if (!sourcePath || !locale) fail('Usage: node scripts/localize-article.mjs --source content/articles/file.md --locale es [--out DIR]');
  if (!LOCALES[locale]) fail(`Unsupported locale ${locale}. Supported: ${Object.keys(LOCALES).join(', ')}`);
  const sourceText = await fs.readFile(path.resolve(ROOT, sourcePath), 'utf8');
  const source = parseFrontmatter(sourceText);
  const sourceBody = stripFrontmatter(sourceText);
  const lang = LOCALES[locale];
  const context = `SOURCE TITLE: ${source.title}\nSOURCE DESCRIPTION: ${source.description}\nSOURCE SLUG: ${source.slug}\nSOURCE BODY HTML:\n${sourceBody}`;
  const brief = await callLLM([
    { role: 'system', content: `You are a native ${lang.language} SEO editor for a trustworthy VPN troubleshooting publication. Create a localization brief, not a translation. Understand how people in ${lang.region} naturally search for this problem. Do not invent search-volume numbers. Use native phrasing, local device-menu wording where appropriate, and explain regional terminology choices.` },
    { role: 'user', content: `${context}\n\nCreate a localized SEO brief for ${lang.language}. The article must satisfy the same user problem but may change the angle, title, slug, FAQ questions, examples, and outline. Avoid keyword stuffing and literal English syntax.` }
  ], briefSchema());
  const draft = await callLLM([
    { role: 'system', content: `You are a professional native ${lang.language} technical writer and SEO editor serving readers in ${lang.region}. Write an original localized article from the brief. This is NOT machine translation. Preserve factual caution, do not invent carrier policies, and do not claim tests you did not perform. Return clean body HTML only (h2, h3, p, ul, ol, li, strong, a). Use natural ${lang.language} syntax, local terminology, and genuinely useful examples. Keep source links where relevant. No markdown, no HTML document wrapper, no scripts.` },
    { role: 'user', content: `${context}\n\nLOCALIZED SEO BRIEF:\n${JSON.stringify(brief, null, 2)}\n\nWrite a publication-ready article in ${lang.language}. Include a direct answer near the beginning, a diagnostic sequence, safety/limitations where relevant, 3–5 localized FAQ items, and related-article links using root-relative English paths only when a localized equivalent is not available.` }
  ], articleSchema(), 26000);
  const review = await callLLM([
    { role: 'system', content: `You are the final native-language quality reviewer for ${lang.language}. Reject literal machine translation, unnatural calques, mixed-language text, unsupported claims, keyword stuffing, and culturally wrong terminology. Check that the article answers the search intent, is technically cautious, readable, and useful. If needed, rewrite the complete affected fields. Score 0–100.` },
    { role: 'user', content: `SOURCE CONTEXT:\n${context}\n\nBRIEF:\n${JSON.stringify(brief)}\n\nDRAFT:\n${JSON.stringify(draft)}\n\nReview and return corrected content if needed. Approval requires score >= 90, natural native language, and no critical factual or SEO issue.` }
  ], reviewSchema(), 28000);
  const final = { ...draft, title: review.corrected_title || draft.title, description: review.corrected_description || draft.description, body_html: review.corrected_body_html || draft.body_html, faq: review.corrected_faq?.length ? review.corrected_faq : draft.faq };
  const problems = validate(final, locale);
  if (!review.approved || review.score < 90 || problems.length) {
    fail(`Localization quality gate failed (score ${review.score}). ${[...review.issues, ...problems].join(' ')}`);
  }
  await fs.mkdir(path.resolve(ROOT, out), { recursive: true });
  const target = path.join(path.resolve(ROOT, out), `${final.slug}.md`);
  await fs.writeFile(target, frontmatter(final, source, locale, brief));
  const report = { source: source.slug, locale, language: lang.language, output: target, score: review.score, primaryQuery: final.primary_query, secondaryQueries: final.secondary_queries, issues: review.issues, generatedAt: new Date().toISOString() };
  await fs.writeFile(path.join(path.dirname(target), `${final.slug}.review.json`), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
}
main().catch(error => { console.error(error.stack || error); process.exit(1); });
EOF


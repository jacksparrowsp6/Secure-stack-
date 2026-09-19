# Native localization workflow

`localize-article.mjs` creates a localized article from an English source without treating localization as literal translation.

## Usage

```bash
node scripts/localize-article.mjs \
  --source content/articles/vpn-not-working-galaxy-s24.md \
  --locale es \
  --out /home/ubuntu/seo-audit/localized-articles/es
```

Supported locales: `es`, `pt-br`, `de`, `fr`, `it`, and `nl`.

## Quality design

The script uses three stages:

1. **Native SEO brief:** identifies local search intent, natural primary and secondary queries, terminology, local context, title, description, slug, and outline. It does not fabricate search-volume statistics.
2. **Original localized draft:** writes a new article in the target language with local phrasing, localized FAQs, device terminology, and culturally appropriate explanations.
3. **Native-language review:** checks for literal translation, calques, mixed language, unsupported claims, keyword stuffing, and readability. It only writes an article when the reviewer gives a score of at least 90 and the deterministic checks pass.

The output is staged outside `content/articles/` by default so it cannot be published accidentally. Review the article with a native speaker or trusted editor, then move approved files into the production content pipeline after multilingual route, canonical, `hreflang`, and sitemap support has been implemented.

The script uses the built-in OpenAI-compatible proxy through `OPENAI_API_BASE` and `OPENAI_API_KEY`. The default model is `gpt-5-mini`; override with `LOCALIZATION_MODEL` when a higher-capability editorial pass is justified.

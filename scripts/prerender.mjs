import fs from 'node:fs/promises';
import path from 'node:path';
import { render, getRoutes, getRedirects, getLastModified } from '../dist/server/entry-server.js';

const root = path.resolve('dist/public');
const origin = 'https://securestack-hub.pages.dev';
const template = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const routes = getRoutes();
for (const route of routes) {
  const page = render(route);
  const speculationRules = '<script type="speculationrules">{"prefetch":[{"where":{"href_matches":"/article/*"},"eagerness":"moderate"},{"where":{"href_matches":"/category/*"},"eagerness":"moderate"},{"where":{"href_matches":"/about/"},"eagerness":"moderate"},{"where":{"href_matches":"/feedback/"},"eagerness":"moderate"}]}</script>';
  const html = template.replace('<!--app-head-->', `${page.head}${speculationRules}`).replace('<!--app-html-->', page.html).replace(/<script(?! type="application\/ld\+json"| type="speculationrules")[\s\S]*?<\/script>/g, '');
  const output = route === '/' ? path.join(root, 'index.html') : path.join(root, route.replace(/^\//, ''), 'index.html');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, html);
}
const robots = `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`;
await fs.writeFile(path.join(root, 'robots.txt'), robots);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${origin}${route}</loc><lastmod>${getLastModified(route)}</lastmod></url>`).join('')}</urlset>`;
await fs.writeFile(path.join(root, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(root, '_redirects'), getRedirects().join('\n') + '\n');
const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/
  Cache-Control: public, max-age=900, s-maxage=86400, stale-while-revalidate=604800

/article/*
  Cache-Control: public, max-age=900, s-maxage=86400, stale-while-revalidate=604800

/category/*
  Cache-Control: public, max-age=900, s-maxage=86400, stale-while-revalidate=604800

/about/
  Cache-Control: public, max-age=900, s-maxage=86400, stale-while-revalidate=604800

/feedback/
  Cache-Control: public, max-age=900, s-maxage=86400, stale-while-revalidate=604800

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/favicon.svg
  Cache-Control: public, max-age=31536000, immutable

/robots.txt
  Cache-Control: public, max-age=86400, s-maxage=86400

/sitemap.xml
  Cache-Control: public, max-age=86400, s-maxage=86400
`;
await fs.writeFile(path.join(root, '_headers'), headers);
for (const asset of await fs.readdir(path.join(root, 'assets'))) if (asset.endsWith('.js')) await fs.rm(path.join(root, 'assets', asset));
await fs.rm(path.join(root, '__manus__', 'debug-collector.js'), { force: true });
console.log(`Prerendered ${routes.length} static routes to ${root}`);

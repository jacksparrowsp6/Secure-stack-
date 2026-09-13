import fs from 'node:fs/promises';
import path from 'node:path';
import { render, getRoutes, getRedirects } from '../dist/server/entry-server.js';

const root = path.resolve('dist/public');
const origin = 'https://securestack-hub.pages.dev';
const template = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const routes = getRoutes();
for (const route of routes) {
  const page = render(route);
  const html = template.replace('<!--app-head-->', page.head).replace('<!--app-html-->', page.html);
  const output = route === '/' ? path.join(root, 'index.html') : path.join(root, route.replace(/^\//, ''), 'index.html');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, html);
}
const robots = `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`;
await fs.writeFile(path.join(root, 'robots.txt'), robots);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>`;
await fs.writeFile(path.join(root, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(root, '_redirects'), getRedirects().join('\n') + '\n');
console.log(`Prerendered ${routes.length} static routes to ${root}`);

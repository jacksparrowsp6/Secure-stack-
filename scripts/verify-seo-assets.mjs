import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist/public');
const sitemapPath = path.join(root, 'sitemap.xml');
const robotsPath = path.join(root, 'robots.txt');

const [sitemap, robots] = await Promise.all([
  fs.readFile(sitemapPath, 'utf8'),
  fs.readFile(robotsPath, 'utf8'),
]);

if (!sitemap.startsWith('<?xml') || !sitemap.includes('<urlset') || !sitemap.includes('</urlset>')) {
  throw new Error('Invalid or missing sitemap.xml in dist/public');
}

const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length === 0 || urls.some((url) => !url.startsWith('https://securestack-hub.pages.dev/'))) {
  throw new Error('sitemap.xml has no URLs or contains a non-canonical host');
}

if (!robots.includes('User-agent: *') || !robots.includes('Sitemap: https://securestack-hub.pages.dev/sitemap.xml')) {
  throw new Error('robots.txt is missing the sitemap directive');
}

console.log(`Verified SEO assets: ${urls.length} sitemap URLs, robots.txt sitemap directive present`);

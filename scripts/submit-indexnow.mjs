const key = '3cb496796d62884a28f8ad369ce55556';
const host = 'securestack-hub.pages.dev';
const urls = process.argv.slice(2);
if (!urls.length) throw new Error('Pass one or more canonical URLs to submit.');
const normalized = urls.map((url) => new URL(url).toString());
if (normalized.some((url) => new URL(url).hostname !== host)) throw new Error(`All URLs must use ${host}.`);
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: normalized }),
});
const body = await response.text();
console.log(JSON.stringify({ status: response.status, body, submitted: normalized }, null, 2));
if (!response.ok && response.status !== 202) process.exitCode = 1;

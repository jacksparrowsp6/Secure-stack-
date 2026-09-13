import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { buildSsrPrefetch } from "./ssrCaller";

const ORIGIN = process.env.CANONICAL_ORIGIN || process.env.VITE_CANONICAL_ORIGIN || "https://securestack-hub.pages.dev";
const SITE_NAME = process.env.SITE_NAME || "SecureStack Hub";
const esc = (value: string) => value.replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c] as string));
const headTags = (head: any) => {
  const canonical = `${ORIGIN}${head.canonicalPath || "/"}`;
  const robots = head.noindex || head.notFound ? "noindex,follow" : "index,follow";
  const tags = [
    `<title>${esc(head.title)}</title>`,
    `<meta name="description" content="${esc(head.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    `<meta property="og:type" content="${head.ogType || "website"}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(head.title)}" />`,
    `<meta name="twitter:description" content="${esc(head.description)}" />`,
  ];
  if (head.publishedTime) tags.push(`<meta property="article:published_time" content="${esc(head.publishedTime)}" />`);
  if (head.modifiedTime) tags.push(`<meta property="article:modified_time" content="${esc(head.modifiedTime)}" />`);
  return tags.join("\n    ");
};

async function renderRequest(req: any, res: any, template: string, render: any) {
  const rendered = await render(req.originalUrl);
  const page = template.replace("<!--app-head-->", rendered.head).replace("<!--app-html-->", rendered.html);
  res.status(rendered.notFound ? 404 : 200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(page);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({ ...viteConfig, configFile: false, server: { middlewareMode: true, hmr: { server }, allowedHosts: true as const }, appType: "custom" });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    try {
      const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/entry-client.tsx"`, `src="/src/entry-client.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(req.originalUrl, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      await renderRequest(req, res, page, render);
    } catch (e) { vite.ssrFixStacktrace(e as Error); next(e); }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "../..", "dist", "public");
  if (!fs.existsSync(distPath)) console.error(`Could not find the build directory: ${distPath}`);
  app.use(express.static(distPath, { index: false, redirect: false }));
  app.use("*", async (req, res, next) => {
    try {
      const template = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      const ssrModule = await import(path.resolve(import.meta.dirname, "../..", "dist", "server", "entry-server.js"));
      await renderRequest(req, res, template, ssrModule.render);
    } catch (error) { next(error); }
  });
}

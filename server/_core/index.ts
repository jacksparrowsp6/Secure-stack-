import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { listPublicArticles } from "../db";
import { legacyArticles } from "../../shared/legacyArticles";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.get("/robots.txt", (_req, res) => {
    const origin = process.env.CANONICAL_ORIGIN || process.env.VITE_CANONICAL_ORIGIN || "https://securestack-hub.pages.dev";
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /editor\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
  });
  app.get("/sitemap.xml", async (_req, res, next) => {
    try {
      const origin = process.env.CANONICAL_ORIGIN || process.env.VITE_CANONICAL_ORIGIN || "https://securestack-hub.pages.dev";
      const articles = await listPublicArticles();
      const urls = ["/", "/about/", "/category/vpn-troubleshooting/", ...articles.map((article) => `/article/${article.slug}/`)];
      const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${origin}${url}</loc></url>`).join("")}</urlset>`;
      res.type("application/xml").send(xml);
    } catch (error) { next(error); }
  });
  app.get("/2026/:month/:legacySlug.html", (req, res) => {
    const oldPath = `/2026/${req.params.month}/${req.params.legacySlug}.html`;
    const match = legacyArticles.find((article) => new URL(article.canonicalUrl).pathname === oldPath);
    if (match) {
      const target = match.slug === "vpn-not-working-galaxy-s24-fix" ? "blog-post_09" : match.slug;
      return res.redirect(301, `/article/${target}`);
    }
    return res.status(404).send("Not found");
  });
  app.get("/2026/:month/:legacySlug.html", (req, res) => {
    const oldPath = `/2026/${req.params.month}/${req.params.legacySlug}.html`;
    const match = legacyArticles.find((article) => new URL(article.canonicalUrl).pathname === oldPath);
    if (match) return res.redirect(301, `/article/${match.slug}`);
    return res.status(404).send("Not found");
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

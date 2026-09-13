import { describe, expect, it } from "vitest";
import { getPublicArticle, listPublicArticles } from "./db";

describe("content catalog", () => {
  it("exposes the imported Blogspot catalogue when the database is unavailable", async () => {
    const articles = await listPublicArticles();
    expect(articles.length).toBeGreaterThanOrEqual(15);
    expect(articles.every((article) => article.status === "published")).toBe(true);
  });

  it("resolves an imported article by its stable slug", async () => {
    const article = await getPublicArticle("vpn-error-633-windows-fix");
    expect(article?.title).toContain("VPN Error 633");
    expect(article?.description.length).toBeGreaterThan(40);
  });
});

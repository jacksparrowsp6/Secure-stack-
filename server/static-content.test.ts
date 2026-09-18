import { describe, expect, it } from "vitest";
import { articles } from "../client/src/lib/articles";

describe("static article catalogue", () => {
  it("contains imported guides with SEO fields", () => {
    expect(articles.length).toBe(18);
    expect(articles.every((article) => article.title.length > 20 && article.description.length > 50)).toBe(true);
    expect(new Set(articles.map((article) => article.slug)).size).toBe(articles.length);
  });
});

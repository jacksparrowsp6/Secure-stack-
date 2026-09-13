import { and, desc, eq, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertArticle, User, Article, articles, users } from "../drizzle/schema";
import { legacyArticles } from "../shared/legacyArticles";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ??= new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type PublicArticle = {
  id: number | string; slug: string; title: string; description: string; contentHtml: string;
  category: string; status: "draft" | "published"; authorName: string; publishedAt: string | null; updatedAt: string;
};

function legacyToPublic(row: typeof legacyArticles[number]): PublicArticle {
  return { id: `legacy-${row.slug}`, slug: row.slug, title: row.title, description: row.description, contentHtml: row.contentHtml, category: row.category, status: "published", authorName: "SecureStack Editorial", publishedAt: row.publishedAt, updatedAt: row.updatedAt };
}
function dbToPublic(row: Article): PublicArticle {
  return { id: row.id, slug: row.slug, title: row.title, description: row.description, contentHtml: row.contentHtml, category: row.category, status: row.status, authorName: row.authorName, publishedAt: row.publishedAt?.toISOString() ?? null, updatedAt: row.updatedAt.toISOString() };
}

export async function listPublicArticles(): Promise<PublicArticle[]> {
  const db = await getDb();
  const uniqueLegacy = legacyArticles.filter((row, index, all) => all.findIndex((candidate) => candidate.contentHtml === row.contentHtml) === index);
  const legacy = uniqueLegacy.map(legacyToPublic);
  if (!db) return legacy;
  const rows = await db.select().from(articles).where(eq(articles.status, "published")).orderBy(desc(articles.publishedAt), desc(articles.updatedAt));
  const bySlug = new Map(legacy.map((r) => [r.slug, r]));
  for (const row of rows) bySlug.set(row.slug, dbToPublic(row));
  return Array.from(bySlug.values()).sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

export async function getPublicArticle(slug: string): Promise<PublicArticle | null> {
  const db = await getDb();
  if (db) {
    const row = await db.select().from(articles).where(and(eq(articles.slug, slug), eq(articles.status, "published"))).limit(1);
    if (row[0]) return dbToPublic(row[0]);
  }
  const normalizedSlug = slug === "vpn-not-working-galaxy-s24-fix" ? "blog-post_09" : slug;
  const legacy = legacyArticles.find((r) => r.slug === normalizedSlug);
  return legacy ? legacyToPublic(legacy) : null;
}

export async function listEditorArticles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles).orderBy(desc(articles.updatedAt));
}

export async function createArticle(input: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.insert(articles).values(input);
  const row = await db.select().from(articles).where(eq(articles.slug, input.slug)).limit(1);
  return row[0];
}

export async function updateArticle(id: number, input: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(articles).set(input).where(eq(articles.id, id));
  const row = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return row[0];
}

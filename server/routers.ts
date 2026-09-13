import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createArticle, getPublicArticle, listEditorArticles, listPublicArticles, updateArticle } from "./db";

const articleInput = z.object({
  slug: z.string().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(10).max(255),
  description: z.string().min(50).max(320),
  contentHtml: z.string().min(100),
  category: z.string().min(2).max(100).default("VPN Troubleshooting"),
  status: z.enum(["draft", "published"]).default("draft"),
  authorName: z.string().min(2).max(120).default("SecureStack Editorial"),
  publishedAt: z.string().nullable().optional(),
});

const adminOnly = adminProcedure;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: router({
    list: publicProcedure.query(() => listPublicArticles()),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getPublicArticle(input.slug)),
  }),
  editor: router({
    list: adminOnly.query(() => listEditorArticles()),
    create: adminOnly.input(articleInput).mutation(({ input }) => createArticle({ ...input, publishedAt: input.publishedAt ? new Date(input.publishedAt) : input.status === "published" ? new Date() : null })),
    update: adminOnly.input(z.object({ id: z.number(), data: articleInput.partial() })).mutation(({ input }) => updateArticle(input.id, { ...input.data, publishedAt: input.data.publishedAt ? new Date(input.data.publishedAt) : input.data.publishedAt === null ? null : undefined })),
  }),
});

export type AppRouter = typeof appRouter;

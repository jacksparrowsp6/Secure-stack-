import type { Request, Response } from "express";
import { appRouter } from "../routers";
import { createContext } from "./context";

export async function buildSsrPrefetch(req: Request, res: Response) {
  const ctx = await createContext({ req: req as any, res: res as any, info: {} as any });
  const caller = appRouter.createCaller(ctx);
  return { contentList: () => caller.content.list(), contentBySlug: (slug: string) => caller.content.bySlug({ slug }) };
}

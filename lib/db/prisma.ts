/**
 * Prisma Client Singleton
 * 
 * Prevents multiple instances of PrismaClient in development
 * (Next.js hot reload can create multiple instances)
 * 
 * Usage:
 *   import { prisma } from "@/lib/db/prisma";
 *   const invoice = await prisma.invoice.findUnique({ where: { id } });
 */
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export { prisma };


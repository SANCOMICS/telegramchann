// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` in TS
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances in dev / hot reload on Vercel
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

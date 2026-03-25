import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const datasourceUrl = process.env.DATABASE_URL ?? "file:./dev.db";
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasources: { db: { url: datasourceUrl } } });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const config: Record<string, string | number> = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER ?? "root",
    database: process.env.DB_NAME ?? "eparduotuve",
  };
  if (process.env.DB_PASSWORD) {
    config.password = process.env.DB_PASSWORD;
  }
  const adapter = new PrismaMariaDb(config);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

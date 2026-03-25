#!/bin/sh
set -e
mkdir -p /data
export DATABASE_URL="${DATABASE_URL:-file:/data/database.db}"
echo "Prisma: db push -> ${DATABASE_URL}"
npx prisma db push --skip-generate
echo "Starting Next.js on 0.0.0.0:${PORT:-3000}..."
exec npx next start

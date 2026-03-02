/**
 * Imports products and categories from DummyJSON API into the database.
 * Run: npm run db:import-dummyjson
 *
 * Fetches tech categories: laptops, smartphones, tablets, mobile-accessories
 * and adds them with real images from DummyJSON.
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const dbUrl = process.env.DATABASE_URL ?? "mysql://root@localhost:3306/eparduotuve";
const adapter = new PrismaMariaDb(dbUrl);
const prisma = new PrismaClient({ adapter });

const DUMMYJSON_API = "https://dummyjson.com";

// DummyJSON categories we want (tech products)
const TECH_CATEGORIES = ["laptops", "smartphones", "tablets", "mobile-accessories"];

// Map DummyJSON category slug -> display name (LT)
const CATEGORY_NAMES: Record<string, string> = {
  laptops: "Laptopai",
  smartphones: "Smartphone'ai",
  tablets: "Planšetės",
  "mobile-accessories": "Mobilūs priedai",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  thumbnail: string;
  images: string[];
}

interface DummyResponse {
  products: DummyProduct[];
  total: number;
}

async function fetchProducts(): Promise<DummyProduct[]> {
  const all: DummyProduct[] = [];

  for (const cat of TECH_CATEGORIES) {
    const res = await fetch(`${DUMMYJSON_API}/products/category/${cat}?limit=100`);
    if (!res.ok) throw new Error(`Failed to fetch ${cat}: ${res.status}`);
    const data = await res.json();
    all.push(...data.products);
  }

  return all;
}

async function main() {
  console.log("Fetching products from DummyJSON...");
  const products = await fetchProducts();
  console.log(`Fetched ${products.length} products`);

  const categoryMap = new Map<string, { id: number; slug: string }>();

  // Create categories
  for (const cat of TECH_CATEGORIES) {
    const name = CATEGORY_NAMES[cat] ?? cat;
    const slug = slugify(cat);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      categoryMap.set(cat, { id: existing.id, slug: existing.slug });
      console.log(`  Category exists: ${name}`);
    } else {
      const created = await prisma.category.create({
        data: {
          name,
          slug,
          description: `Produktai iš kategorijos: ${name}`,
          image: products.find((p) => p.category === cat)?.thumbnail ?? null,
        },
      });
      categoryMap.set(cat, { id: created.id, slug: created.slug });
      console.log(`  Created category: ${name}`);
    }
  }

  // Create products
  let created = 0;
  let skipped = 0;

  for (const p of products) {
    const baseSlug = slugify(p.title);
    let slug = baseSlug;
    let counter = 0;

    while (await prisma.product.findUnique({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const category = categoryMap.get(p.category);
    if (!category) continue;

    const imageUrls = [
      ...(Array.isArray(p.images) && p.images.length ? p.images : []),
      ...(p.thumbnail ? [p.thumbnail] : []),
    ].filter(Boolean);

    await prisma.product.create({
      data: {
        name: p.title,
        slug,
        description: p.description || null,
        price: p.price,
        stock: p.stock ?? Math.floor(Math.random() * 50) + 5,
        brand: p.brand || null,
        featured: Math.random() < 0.3,
        categoryId: category.id,
        ...(imageUrls.length > 0 && {
          images: {
            create: imageUrls.slice(0, 3).map((url) => ({ url })),
          },
        }),
      },
    });

    created++;
    if (created % 10 === 0) process.stdout.write(".");
  }

  console.log(`\nDone! Created ${created} products from DummyJSON.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Imports products from multiple free APIs with unique images.
 * Creates parent catalogs → subcategories → products hierarchy.
 * Sources: DummyJSON (all 24 categories), FakeStoreAPI (20 products)
 * Run: npm run db:import-dummyjson
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DUMMYJSON_API = "https://dummyjson.com";
const FAKESTORE_API = "https://fakestoreapi.com";

// ── Parent catalogs with their subcategory keys ──

interface CatalogDef {
  name: string;
  slug: string;
  description: string;
  children: string[];
}

const CATALOGS: CatalogDef[] = [
  {
    name: "Elektronika",
    slug: "elektronika",
    description: "Kompiuteriai, telefonai, planšetės ir priedai.",
    children: ["laptops", "smartphones", "tablets", "mobile-accessories", "electronics"],
  },
  {
    name: "Drabužiai",
    slug: "drabuziai",
    description: "Vyriški ir moteriški drabužiai, batai, rankinės.",
    children: [
      "mens-shirts", "mens-shoes", "mens-clothing",
      "womens-clothing", "womens-dresses", "womens-shoes", "womens-bags", "tops",
    ],
  },
  {
    name: "Grožis ir higiena",
    slug: "grozis-ir-higiena",
    description: "Grožio priemonės, kvepalai ir odos priežiūra.",
    children: ["beauty", "fragrances", "skin-care"],
  },
  {
    name: "Papuošalai ir aksesuarai",
    slug: "papuosalai-ir-aksesuarai",
    description: "Laikrodžiai, papuošalai, akiniai nuo saulės.",
    children: ["jewelery", "womens-jewellery", "womens-watches", "mens-watches", "sunglasses"],
  },
  {
    name: "Namai ir virtuvė",
    slug: "namai-ir-virtuve",
    description: "Baldai, dekoracijos ir virtuvės reikmenys.",
    children: ["furniture", "home-decoration", "kitchen-accessories"],
  },
  {
    name: "Maistas",
    slug: "maistas",
    description: "Kasdienės maisto prekės ir produktai.",
    children: ["groceries"],
  },
  {
    name: "Sportas ir laisvalaikis",
    slug: "sportas-ir-laisvalaikis",
    description: "Sporto reikmenys ir aktyvaus laisvalaikio prekės.",
    children: ["sports-accessories"],
  },
  {
    name: "Transportas",
    slug: "transportas",
    description: "Automobiliai, motociklai ir jų priedai.",
    children: ["vehicle", "motorcycle"],
  },
];

// ── Subcategory Lithuanian names ──

const SUBCATEGORY_LT: Record<string, { name: string; description: string }> = {
  beauty: { name: "Grožio priemonės", description: "Makiažo ir grožio priemonės." },
  fragrances: { name: "Kvepalai", description: "Kvepalai vyrams ir moterims." },
  furniture: { name: "Baldai", description: "Baldai namams ir biurui." },
  groceries: { name: "Maisto prekės", description: "Kasdienės maisto prekės." },
  "home-decoration": { name: "Namų dekoracijos", description: "Dekoracijos jūsų namams." },
  "kitchen-accessories": { name: "Virtuvės reikmenys", description: "Reikmenys virtuvei ir maisto ruošimui." },
  laptops: { name: "Nešiojamieji kompiuteriai", description: "Nešiojamieji kompiuteriai darbui ir pramogoms." },
  "mens-shirts": { name: "Vyriški marškiniai", description: "Vyriški marškiniai ir marškinėliai." },
  "mens-shoes": { name: "Vyriški batai", description: "Vyriški batai kiekvienai progai." },
  "mens-watches": { name: "Vyriški laikrodžiai", description: "Vyriški laikrodžiai nuo klasikinių iki sportinių." },
  "mobile-accessories": { name: "Mobiliųjų priedai", description: "Ausinės, dėklai, įkrovikliai ir kiti priedai." },
  motorcycle: { name: "Motociklai", description: "Motociklai ir motociklų priedai." },
  "skin-care": { name: "Odos priežiūra", description: "Odos priežiūros priemonės." },
  smartphones: { name: "Išmanieji telefonai", description: "Išmanieji telefonai iš populiarių gamintojų." },
  "sports-accessories": { name: "Sporto reikmenys", description: "Sporto ir aktyvaus laisvalaikio reikmenys." },
  sunglasses: { name: "Akiniai nuo saulės", description: "Stilingi akiniai nuo saulės." },
  tablets: { name: "Planšetės", description: "Planšetiniai kompiuteriai darbui ir pramogoms." },
  tops: { name: "Viršutiniai drabužiai", description: "Moteriški viršutiniai drabužiai." },
  vehicle: { name: "Transporto priemonės", description: "Automobiliai ir transporto priemonės." },
  "womens-bags": { name: "Moteriškos rankinės", description: "Rankinės ir krepšiai moterims." },
  "womens-dresses": { name: "Moteriškos suknelės", description: "Suknelės kiekvienai progai." },
  "womens-jewellery": { name: "Moteriški papuošalai", description: "Papuošalai ir aksesuarai moterims." },
  "womens-shoes": { name: "Moteriški batai", description: "Moteriški batai visoms sezonams." },
  "womens-watches": { name: "Moteriški laikrodžiai", description: "Elegantiški moteriški laikrodžiai." },
  electronics: { name: "Kompiuterių komponentai", description: "Monitoriai, SSD diskai ir kiti elektronikos gaminiai." },
  jewelery: { name: "Juvelyrika", description: "Žiedai, apyrankės ir kiti juvelyriniai dirbiniai." },
  "mens-clothing": { name: "Vyriški drabužiai", description: "Vyriški drabužiai ir aksesuarai." },
  "womens-clothing": { name: "Moteriški drabužiai", description: "Moteriški drabužiai ir aksesuarai." },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface UnifiedProduct {
  title: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  source: string;
}

// ── DummyJSON ──

async function fetchDummyJSON(): Promise<UnifiedProduct[]> {
  const res = await fetch(`${DUMMYJSON_API}/products?limit=0`);
  if (!res.ok) throw new Error(`DummyJSON failed: ${res.status}`);
  const data = await res.json();
  const products: UnifiedProduct[] = [];

  for (const p of data.products ?? []) {
    const imgs: string[] = [];
    if (Array.isArray(p.images)) {
      for (const img of p.images) {
        if (typeof img === "string" && img.startsWith("http")) imgs.push(img);
      }
    }
    if (p.thumbnail && typeof p.thumbnail === "string" && p.thumbnail.startsWith("http")) {
      if (!imgs.includes(p.thumbnail)) imgs.push(p.thumbnail);
    }
    if (imgs.length === 0) continue;

    const specs: Record<string, unknown> = {};
    if (p.sku) specs.sku = p.sku;
    if (p.weight != null) specs.svoris_kg = p.weight;
    if (p.dimensions) specs.matmenys_cm = `${p.dimensions.width} × ${p.dimensions.height} × ${p.dimensions.depth}`;
    if (p.warrantyInformation) specs.garantija = p.warrantyInformation;
    if (p.shippingInformation) specs.pristatymas = p.shippingInformation;
    if (p.tags?.length) specs.zymos = p.tags.join(", ");
    if (p.brand) specs.gamintojas = p.brand;

    products.push({
      title: p.title,
      description: p.description || "",
      price: p.price,
      category: p.category,
      brand: p.brand || undefined,
      stock: p.stock ?? Math.floor(Math.random() * 50) + 5,
      images: imgs,
      specs,
      source: "dummyjson",
    });
  }

  return products;
}

// ── FakeStoreAPI ──

const FAKESTORE_CAT_MAP: Record<string, string> = {
  electronics: "electronics",
  jewelery: "jewelery",
  "men's clothing": "mens-clothing",
  "women's clothing": "womens-clothing",
};

async function fetchFakeStore(): Promise<UnifiedProduct[]> {
  let res: Response;
  try {
    res = await fetch(`${FAKESTORE_API}/products`);
  } catch (e) {
    console.warn(`  ⚠ FakeStoreAPI: ryšio klaida — praleidžiama (${e instanceof Error ? e.message : e})`);
    return [];
  }
  if (!res.ok) {
    console.warn(`  ⚠ FakeStoreAPI: HTTP ${res.status} — praleidžiama, lieka tik DummyJSON`);
    return [];
  }
  const data = await res.json();
  const products: UnifiedProduct[] = [];

  for (const p of data) {
    if (!p.image || typeof p.image !== "string" || !p.image.startsWith("http")) continue;
    const catKey = FAKESTORE_CAT_MAP[p.category] ?? slugify(p.category);

    products.push({
      title: p.title,
      description: p.description || "",
      price: p.price,
      category: catKey,
      brand: undefined,
      stock: Math.floor(Math.random() * 80) + 10,
      images: [p.image],
      specs: p.rating ? { reitingas: `${p.rating.rate}/5 (${p.rating.count} atsiliepimai)` } : {},
      source: "fakestore",
    });
  }

  return products;
}

// ── Main ──

async function main() {
  console.log("=== Produktų importas su katalogais ===\n");

  console.log("Trinami seni duomenys...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Kuriami vartotojai...");
  const adminPw = await bcrypt.hash("admin", 10);
  const userPw = await bcrypt.hash("user123", 10);
  await prisma.user.create({ data: { email: "admin@gmail.com", password: adminPw, name: "Administratorius", role: "ADMIN" } });
  await prisma.user.create({ data: { email: "jonas@gmail.com", password: userPw, name: "Jonas Jonaitis", role: "USER" } });

  // Fetch products from APIs
  console.log("Gaunami produktai iš DummyJSON...");
  const dummyProducts = await fetchDummyJSON();
  console.log(`  → ${dummyProducts.length} produktai`);

  console.log("Gaunami produktai iš FakeStoreAPI...");
  const fakeProducts = await fetchFakeStore();
  console.log(`  → ${fakeProducts.length} produktai`);

  const allProducts = [...dummyProducts, ...fakeProducts];
  console.log(`\nViso: ${allProducts.length} produktai\n`);

  // Build reverse map: subcategory key → catalog slug
  const subToCatalog = new Map<string, string>();
  for (const catalog of CATALOGS) {
    for (const childKey of catalog.children) {
      subToCatalog.set(childKey, catalog.slug);
    }
  }

  // Create parent catalogs
  console.log("Kuriami katalogai (parent kategorijos)...");
  const catalogIdMap = new Map<string, number>();
  for (const catalog of CATALOGS) {
    const cat = await prisma.category.create({
      data: {
        name: catalog.name,
        slug: catalog.slug,
        description: catalog.description,
        image: null,
        parentId: null,
      },
    });
    catalogIdMap.set(catalog.slug, cat.id);
    console.log(`  📁 ${catalog.name}`);
  }

  // Create subcategories linked to parent catalogs
  console.log("\nKuriamos subkategorijos...");
  const neededSubs = new Set<string>();
  for (const p of allProducts) neededSubs.add(p.category);

  const subcategoryMap = new Map<string, number>();
  for (const subKey of neededSubs) {
    const config = SUBCATEGORY_LT[subKey];
    if (!config) {
      console.log(`  ⚠ Nežinoma subkategorija: "${subKey}"`);
      continue;
    }

    const catalogSlug = subToCatalog.get(subKey);
    const parentId = catalogSlug ? catalogIdMap.get(catalogSlug) ?? null : null;
    const slug = slugify(config.name);

    const sub = await prisma.category.create({
      data: {
        name: config.name,
        slug,
        description: config.description,
        image: null,
        parentId,
      },
    });
    subcategoryMap.set(subKey, sub.id);
    const parentName = CATALOGS.find((c) => c.slug === catalogSlug)?.name ?? "—";
    console.log(`    📄 ${config.name} → ${parentName}`);
  }

  console.log(`\nSukurta ${catalogIdMap.size} katalogų, ${subcategoryMap.size} subkategorijų\n`);

  // Import products with unique images
  const usedImageUrls = new Set<string>();
  const globalSlugs = new Set<string>();
  let created = 0;
  let skippedDuplicateImage = 0;

  for (const p of allProducts) {
    const categoryId = subcategoryMap.get(p.category);
    if (!categoryId) continue;

    const uniqueImages = p.images.filter((url) => !usedImageUrls.has(url));
    if (uniqueImages.length === 0) {
      skippedDuplicateImage++;
      continue;
    }

    for (const url of uniqueImages) usedImageUrls.add(url);

    const baseSlug = slugify(p.title);
    let slug = baseSlug;
    let counter = 0;
    while (globalSlugs.has(slug)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
    globalSlugs.add(slug);

    await prisma.product.create({
      data: {
        name: p.title,
        slug,
        description: p.description || null,
        price: p.price,
        stock: p.stock,
        brand: p.brand || null,
        featured: Math.random() < 0.15,
        categoryId,
        specs: Object.keys(p.specs).length > 0 ? (p.specs as object) : undefined,
        images: {
          create: uniqueImages.slice(0, 4).map((url) => ({ url })),
        },
      },
    });

    created++;
    if (created % 20 === 0) console.log(`  ... sukurta ${created} produktų`);
  }

  // Update subcategory images from first product
  for (const [, catId] of subcategoryMap.entries()) {
    const firstProduct = await prisma.product.findFirst({
      where: { categoryId: catId },
      include: { images: { take: 1 } },
    });
    if (firstProduct?.images[0]) {
      await prisma.category.update({
        where: { id: catId },
        data: { image: firstProduct.images[0].url },
      });
    }
  }

  // Update catalog images from first child's image
  for (const catalog of CATALOGS) {
    const parentId = catalogIdMap.get(catalog.slug);
    if (!parentId) continue;
    const firstChild = await prisma.category.findFirst({
      where: { parentId, image: { not: null } },
    });
    if (firstChild?.image) {
      await prisma.category.update({
        where: { id: parentId },
        data: { image: firstChild.image },
      });
    }
  }

  console.log(`\n=== Rezultatas ===`);
  console.log(`Katalogai: ${catalogIdMap.size}`);
  console.log(`Subkategorijos: ${subcategoryMap.size}`);
  console.log(`Produktai: ${created}`);
  console.log(`Praleista (dublikuota nuotrauka): ${skippedDuplicateImage}`);
  console.log(`Unikalių nuotraukų: ${usedImageUrls.size}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

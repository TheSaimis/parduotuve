import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/** Neprivaloma: lietuviškas PC demo katalogas. Numatytasis `npm run db:seed` = DummyJSON/FakeStore (tikros prekių nuotraukos). */
const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: adminPassword,
      name: "Administratorius",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "jonas@gmail.com",
      password: userPassword,
      name: "Jonas Jonaitis",
      role: "USER",
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Procesoriai",
        slug: "procesoriai",
        description: "Intel ir AMD procesoriai kompiuteriams",
        image: "/images/categories/cpu.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Vaizdo plokštės",
        slug: "vaizdo-plokstes",
        description: "NVIDIA ir AMD vaizdo plokštės žaidimams ir darbui",
        image: "/images/categories/gpu.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Operatyvioji atmintis",
        slug: "operatyvioji-atmintis",
        description: "DDR4 ir DDR5 RAM moduliai",
        image: "/images/categories/ram.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Pagrindinės plokštės",
        slug: "pagrindines-plokstes",
        description: "Pagrindinės plokštės Intel ir AMD platformoms",
        image: "/images/categories/motherboard.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Maitinimo blokai",
        slug: "maitinimo-blokai",
        description: "PSU maitinimo blokai kompiuteriams",
        image: "/images/categories/psu.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Korpusai",
        slug: "korpusai",
        description: "Kompiuterių korpusai įvairių dydžių",
        image: "/images/categories/case.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Aušinimas",
        slug: "ausinimas",
        description: "Procesoriaus aušintuvai ir vandens aušinimo sistemos",
        image: "/images/categories/cooling.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Periferiniai įrenginiai",
        slug: "periferiniai-irenginiai",
        description: "Pelės, klaviatūros, ausinės ir kiti priedai",
        image: "/images/categories/peripherals.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Monitoriai",
        slug: "monitoriai",
        description: "Gaming ir profesionalūs monitoriai",
        image: "/images/categories/monitor.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Atminties kaupikliai",
        slug: "atminties-kaupikliai",
        description: "SSD ir HDD diskai duomenų saugojimui",
        image: "/images/categories/storage.jpg",
      },
    }),
  ]);

  const [cpu, gpu, ram, mobo, psu, pcCase, cooling, peripherals, monitors, storage] = categories;

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "AMD Ryzen 7 7800X3D",
        slug: "amd-ryzen-7-7800x3d",
        description: "8 branduolių / 16 gijų procesorius su 3D V-Cache technologija. Geriausias pasirinkimas žaidimams.",
        price: 389.99,
        stock: 25,
        brand: "AMD",
        featured: true,
        categoryId: cpu.id,
        specs: { cores: 8, threads: 16, base_clock: "4.2 GHz", boost_clock: "5.0 GHz", cache: "104MB", tdp: "120W" },
        images: { create: [{ url: "/images/products/ryzen-7800x3d.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "Intel Core i9-14900K",
        slug: "intel-core-i9-14900k",
        description: "24 branduolių / 32 gijų procesorius. Aukščiausia klasė darbalaukiams.",
        price: 549.99,
        stock: 15,
        brand: "Intel",
        featured: true,
        categoryId: cpu.id,
        specs: { cores: 24, threads: 32, base_clock: "3.2 GHz", boost_clock: "6.0 GHz", cache: "36MB", tdp: "253W" },
        images: { create: [{ url: "/images/products/i9-14900k.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "NVIDIA GeForce RTX 4080 Super",
        slug: "nvidia-rtx-4080-super",
        description: "16GB GDDR6X vaizdo plokštė. Puikus našumas 4K žaidimams.",
        price: 1049.99,
        stock: 10,
        brand: "NVIDIA",
        featured: true,
        categoryId: gpu.id,
        specs: { memory: "16GB GDDR6X", cuda_cores: 10240, boost_clock: "2550 MHz", tdp: "320W" },
        images: { create: [{ url: "/images/products/rtx-4080-super.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "AMD Radeon RX 7900 XTX",
        slug: "amd-radeon-rx-7900-xtx",
        description: "24GB GDDR6 vaizdo plokštė su RDNA 3 architektūra.",
        price: 899.99,
        stock: 12,
        brand: "AMD",
        featured: true,
        categoryId: gpu.id,
        specs: { memory: "24GB GDDR6", stream_processors: 6144, boost_clock: "2500 MHz", tdp: "355W" },
        images: { create: [{ url: "/images/products/rx-7900-xtx.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "G.Skill Trident Z5 RGB 32GB DDR5-6000",
        slug: "gskill-trident-z5-rgb-32gb",
        description: "32GB (2x16GB) DDR5-6000 MHz CL30 operatyvioji atmintis su RGB apšvietimu.",
        price: 129.99,
        stock: 40,
        brand: "G.Skill",
        featured: false,
        categoryId: ram.id,
        specs: { capacity: "32GB (2x16GB)", speed: "DDR5-6000", latency: "CL30", voltage: "1.35V" },
        images: { create: [{ url: "/images/products/trident-z5.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "Kingston Fury Beast 16GB DDR4-3200",
        slug: "kingston-fury-beast-16gb",
        description: "16GB (2x8GB) DDR4-3200 MHz operatyvioji atmintis.",
        price: 42.99,
        stock: 60,
        brand: "Kingston",
        featured: false,
        categoryId: ram.id,
        specs: { capacity: "16GB (2x8GB)", speed: "DDR4-3200", latency: "CL16", voltage: "1.35V" },
        images: { create: [{ url: "/images/products/fury-beast.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "ASUS ROG Strix B650E-F Gaming WiFi",
        slug: "asus-rog-strix-b650e-f",
        description: "AM5 pagrindinė plokštė su WiFi 6E, PCIe 5.0, DDR5 palaikymu.",
        price: 279.99,
        stock: 18,
        brand: "ASUS",
        featured: true,
        categoryId: mobo.id,
        specs: { socket: "AM5", chipset: "B650E", form_factor: "ATX", memory: "DDR5", wifi: "WiFi 6E" },
        images: { create: [{ url: "/images/products/rog-strix-b650e.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "Corsair RM850x 850W",
        slug: "corsair-rm850x-850w",
        description: "850W 80+ Gold modulinis maitinimo blokas. Tylus ir efektyvus.",
        price: 139.99,
        stock: 30,
        brand: "Corsair",
        featured: false,
        categoryId: psu.id,
        specs: { wattage: "850W", efficiency: "80+ Gold", modular: "Fully Modular", fan: "135mm" },
        images: { create: [{ url: "/images/products/rm850x.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "NZXT H7 Flow",
        slug: "nzxt-h7-flow",
        description: "Mid-Tower ATX korpusas su puikiu oro srautu ir temperuoto stiklo šoniniu paneliu.",
        price: 129.99,
        stock: 20,
        brand: "NZXT",
        featured: false,
        categoryId: pcCase.id,
        specs: { form_factor: "Mid-Tower ATX", fans_included: 2, max_gpu_length: "400mm", max_cooler_height: "185mm" },
        images: { create: [{ url: "/images/products/nzxt-h7-flow.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "Noctua NH-D15",
        slug: "noctua-nh-d15",
        description: "Premium dviejų bokštų procesoriaus aušintuvas. Legendinis tylumas ir našumas.",
        price: 99.99,
        stock: 22,
        brand: "Noctua",
        featured: false,
        categoryId: cooling.id,
        specs: { type: "Air Cooler", fans: 2, height: "165mm", tdp: "250W+" },
        images: { create: [{ url: "/images/products/nh-d15.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "Logitech G Pro X Superlight 2",
        slug: "logitech-g-pro-x-superlight-2",
        description: "Ultra lengva belaidė žaidimų pelė. 60g, HERO 2 sensorius.",
        price: 149.99,
        stock: 35,
        brand: "Logitech",
        featured: true,
        categoryId: peripherals.id,
        specs: { type: "Wireless Mouse", weight: "60g", sensor: "HERO 2", dpi: "32000", battery: "95h" },
        images: { create: [{ url: "/images/products/gpro-superlight2.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung Odyssey G7 27\" 240Hz",
        slug: "samsung-odyssey-g7-27",
        description: "27 colių 1440p 240Hz lenktas žaidimų monitorius su 1ms atsako laiku.",
        price: 549.99,
        stock: 8,
        brand: "Samsung",
        featured: true,
        categoryId: monitors.id,
        specs: { size: "27\"", resolution: "2560x1440", refresh_rate: "240Hz", panel: "VA", response_time: "1ms" },
        images: { create: [{ url: "/images/products/odyssey-g7.jpg" }] },
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung 990 Pro 2TB NVMe SSD",
        slug: "samsung-990-pro-2tb",
        description: "2TB PCIe 4.0 NVMe M.2 SSD. Iki 7450 MB/s skaitymo greitis.",
        price: 179.99,
        stock: 45,
        brand: "Samsung",
        featured: false,
        categoryId: storage.id,
        specs: { capacity: "2TB", interface: "PCIe 4.0 NVMe", read_speed: "7450 MB/s", write_speed: "6900 MB/s" },
        images: { create: [{ url: "/images/products/990-pro.jpg" }] },
      },
    }),
  ]);

  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      status: "DELIVERED",
      total: 1439.98,
      address: "Vilniaus g. 10, Vilnius, LT-01100",
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: 389.99 },
          { productId: products[2].id, quantity: 1, price: 1049.99 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PROCESSING",
      total: 279.99,
      address: "Kauno g. 5, Kaunas, LT-44001",
      items: {
        create: [
          { productId: products[6].id, quantity: 1, price: 279.99 },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: admin.id,
      status: "PENDING",
      total: 699.98,
      address: "Gedimino pr. 1, Vilnius, LT-01103",
      items: {
        create: [
          { productId: products[11].id, quantity: 1, price: 549.99 },
          { productId: products[10].id, quantity: 1, price: 149.99 },
        ],
      },
    },
  });

  console.log("Seed data created successfully!");
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${products.length} products`);
  console.log(`Created 3 orders`);
  console.log(`Created 2 users (admin + user)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# Vitrina

Elektroninės parduotuvės projektas: **Next.js** (App Router), **React**, **Prisma** (SQLite), **Tailwind CSS**. Yra vieša parduotuvė ir **administravimo skydelis** (`/admin`).

## Reikalavimai

- [Node.js](https://nodejs.org/) 20.x ar naujesnė
- [npm](https://www.npmjs.com/) (kartu su Node)

Neprivaloma: [Docker Desktop](https://www.docker.com/products/docker-desktop/) — jei norite paleisti per „Docker Compose“.

## Greitas startas (lokaliai)

1. Nukopijuokite aplinkos kintamuosius ir nustatykite duomenų bazę:

   ```bash
   cp .env.example .env
   ```

   `.env` faile naudokite SQLite (pagal `prisma/schema.prisma`), pvz.:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

2. Įdiekite priklausomybes ir paruoškite DB:

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   ```

   (Neprivaloma) pradiniai duomenys:

   ```bash
   npm run db:seed
   ```

3. Paleiskite kūrimo serverį:

   ```bash
   npm run dev
   ```

4. Naršyklėje: [http://localhost:3000](http://localhost:3000)  
   Administravimas: [http://localhost:3000/admin](http://localhost:3000/admin)

## Docker

Konteineryje naudojama ta pati SQLite schema; duomenys saugomi tomu (`/data/database.db`).

```bash
docker compose up --build
```

Arba:

```bash
npm run docker:up
```

Tada atidarykite [http://localhost:3000](http://localhost:3000).

Sustabdyti:

```bash
npm run docker:down
# arba: docker compose down
```

**Pastaba:** jei reikia pradinės duomenų užpildos, po pirmo paleidimo galite įvykdyti seed konteineryje (reikės laikinai įdiegti `tsx`), arba seed paleisti lokaliai prieš eksportą, priklausomai nuo jūsų darbo eigos.

## Naudingos komandos

| Komanda | Aprašymas |
|--------|-----------|
| `npm run dev` | Kūrimo režimas (Turbopack) |
| `npm run build` | Produkcinis build |
| `npm run start` | Produkcinis serveris (po `build`) |
| `npm run lint` | ESLint |
| `npm run db:push` | Prisma schemos sinchronizavimas su DB |
| `npm run db:generate` | Prisma kliento generavimas |
| `npm run db:seed` | Užpildymas pradiniais duomenimis |
| `npm run db:studio` | Prisma Studio (DB peržiūra) |

## Struktūra (trumpai)

- `src/app/(store)/` — parduotuvės puslapiai
- `src/app/admin/` — administravimas
- `src/app/api/` — API maršrutai
- `src/components/` — React komponentai
- `prisma/schema.prisma` — duomenų modelis

## Licencija ir technologijos

Projektas sukurtas naudojant [Next.js](https://nextjs.org). Šriftas: [Geist](https://vercel.com/font) per `next/font`.

Išdėstymas [Vercel](https://vercel.com) ar kitame hostinge — žr. [Next.js diegimo dokumentaciją](https://nextjs.org/docs/app/building-your-application/deploying).

# ReviewWorld

**Yelp for Food Products** — discover, rate, and review packaged foods organized by brand and product line.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth v5 (Google OAuth) |
| Database | PostgreSQL |
| ORM | Prisma |
| Styling | Tailwind CSS + shadcn/ui |

---

## Getting Started

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Required variables:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run migrations and seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Data Model

### Core models

| Model | Description |
|---|---|
| `User` | Auth user; `role` field (`USER` \| `ADMIN`) — P0.5 |
| `Brand` | e.g. "Oreo"; has `status` (`PENDING` \| `APPROVED` \| `REJECTED`) — P0.5 |
| `ProductLine` | e.g. "Oreo Original"; belongs to Brand; has `status` — P0.5 |
| `Variation` | e.g. "Family Pack 500 g"; belongs to ProductLine; has `status` — P0.5 |
| `Review` | Star rating + text; belongs to Variation + User |
| `Suggestion` | User-submitted new Brand/ProductLine/Variation pending admin review |

### P0.5 additions

- `User.role` — differentiates regular users from admins
- `status` on `Brand`, `ProductLine`, `Variation` — controls visibility (only `APPROVED` records shown publicly)

---

## URL Structure

### Public pages

| Route | Page |
|---|---|
| `/` | Home — featured brands / search |
| `/brands` | Brand directory |
| `/brands/[brandSlug]` | Brand detail — product lines |
| `/brands/[brandSlug]/[lineSlug]` | Product line detail — variations + reviews |
| `/brands/[brandSlug]/[lineSlug]/[variationSlug]` | Variation detail — reviews |
| `/brands/[brandSlug]/[lineSlug]/[variationSlug]/review` | Submit a review |

### User pages

| Route | Page |
|---|---|
| `/profile` | Public profile |
| `/account` | Account settings |

### Suggestion pages (P0.5)

| Route | Page |
|---|---|
| `/suggest/brand` | Suggest a new brand |
| `/suggest/product-line` | Suggest a new product line |
| `/suggest/variation` | Suggest a new variation |

### Admin portal (P0.5)

| Route | Page |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/submissions` | Review pending suggestions |
| `/admin/submissions/brands` | Approve / reject brand suggestions |
| `/admin/submissions/product-lines` | Approve / reject product line suggestions |
| `/admin/submissions/variations` | Approve / reject variation suggestions |

### API routes

| Method + Path | Description |
|---|---|
| `GET /api/brands` | List approved brands |
| `GET /api/brands/[brandSlug]` | Brand + product lines |
| `GET /api/reviews` | Reviews (filterable) |
| `POST /api/reviews` | Submit a review (auth required) |
| `POST /api/suggest/brand` | Submit brand suggestion |
| `POST /api/suggest/product-line` | Submit product line suggestion |
| `POST /api/suggest/variation` | Submit variation suggestion |
| `GET /api/admin/submissions/[type]` | List pending submissions (admin) |
| `POST /api/admin/submissions/[type]` | Approve / reject submission (admin) |
| `POST /api/auth/[...nextauth]` | NextAuth handler |

---

## Implementation Status

### Done

- [x] Next.js 14 scaffold + Tailwind + shadcn/ui
- [x] Prisma schema + seed
- [x] NextAuth Google OAuth
- [x] UX specs for all P0 + P0.5 pages (`docs/ux/`)
- [x] PRD + backlog (`docs/pm/`)

### TODO

- [ ] Schema migration: `User.role`, `status` on `Brand` / `ProductLine` / `Variation`
- [ ] API routes (with `status = APPROVED` filter on public endpoints)
- [ ] Suggestion API routes
- [ ] Page components
  - [ ] Home
  - [ ] Brand directory
  - [ ] Brand detail
  - [ ] Product line detail
  - [ ] Variation detail
  - [ ] Review form
  - [ ] Profile
  - [ ] Account settings
  - [ ] Navigation / layout
  - [ ] Suggest forms (brand, product line, variation)
  - [ ] Admin portal (dashboard + submission review)

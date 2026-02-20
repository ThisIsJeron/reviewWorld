# ReviewWorld — P0 Ticket Backlog

**Created:** 2026-02-19
**Status:** P0 tickets created in task list and assigned to UX → FS pipeline

---

## Ticket Lifecycle
```
PM creates ticket → PM marks complete → UX picks up → UX marks complete → FS picks up → FS marks complete
```

---

## P0 Tickets (MVP — Must Ship)

| Task # | Title | Owner Flow | Notes |
|--------|-------|-----------|-------|
| #9  | Home page — hero, trending, search | UX → FS | Core discovery surface |
| #10 | Brand directory page (/brands) | UX → FS | Brand browsing index |
| #11 | Brand detail page (/brands/[brandSlug]) | UX → FS | Brand identity + lines |
| #12 | Product line page (/brands/[brandSlug]/[lineSlug]) | UX → FS | Line + variation grid |
| #13 | Variation/product page with reviews | UX → FS | Core review display page |
| #14 | Write review form (/review/new) | UX → FS | Auth-gated review submission |
| #15 | User profile page (/profile/[userId]) | UX → FS | Public review history |
| #16 | Account settings page (/account) | UX → FS | Auth-gated settings |
| #17 | Navigation / header component | UX → FS | Global search + auth UI |
| #18 | API routes — all core endpoints | FS only | No UX step needed |

---

## Ticket Details Summary

### #9 — Home Page
- Hero with search bar
- Trending products (top-rated by recent review volume)
- Recently reviewed products
- Unauthenticated CTA to sign in

### #10 — Brand Directory
- Paginated brand card grid
- Filter by name, sort by alpha or review count

### #11 — Brand Detail
- Brand header (logo, name, description, aggregate rating)
- Product line cards grid
- Breadcrumb navigation

### #12 — Product Line Page
- Line header (image, name, description)
- Variation cards grid with tags, rating, review count
- Breadcrumb navigation

### #13 — Variation / Product Page
- Variation header + aggregate rating block
- Write Review CTA (auth-gated)
- Review list with report button per review
- Pagination

### #14 — Write Review Form
- Auth guard with return URL
- Product context panel (read-only)
- Star rating, title, body, would-buy-again fields
- Edit mode for existing reviews

### #15 — User Profile
- Public profile with avatar, name, member-since
- All reviews by user with links to variation pages
- Pagination

### #16 — Account Settings
- Display name edit
- Sign out
- Delete account with confirmation modal

### #17 — Navigation / Header
- Logo, search bar, auth state (sign in button vs. avatar + dropdown)
- Mobile responsive

### #18 — API Routes (FS only)
- GET /api/brands (list + search)
- GET /api/brands/[brandSlug]
- GET /api/brands/[brandSlug]/[lineSlug]
- GET /api/brands/[brandSlug]/[lineSlug]/[varSlug] (with paginated reviews)
- POST /api/reviews
- PUT /api/reviews/[reviewId]
- POST /api/reports
- GET /api/search?q=
- GET /api/trending

---

## P0.5 Tickets (MVP Blocker — Add Product / Suggestion Flow)

These tickets are required before MVP is considered shippable. Without them the catalog cannot be populated in production.

**Design decisions:**
- Any authenticated user can suggest a Brand, ProductLine, or Variation
- Suggestions land in `PENDING` state; an admin must approve before content is publicly visible
- `User.role` enum: `USER | ADMIN`
- `Brand/ProductLine/Variation.status` enum: `PENDING | APPROVED | REJECTED`
- Entry points are contextual at each level of the hierarchy + admin portal at `/admin/submissions`

| Task # | Title | Owner Flow | Notes |
|--------|-------|-----------|-------|
| #20 | Schema migration — role + status fields | FS only | Blocker for all other P0.5 tickets |
| #21 | Suggestion API routes (POST brand/line/variation + admin PATCH) | FS only | Blocker for form tickets |
| #22 | Suggest a Brand form (/suggest/brand) | UX → FS | Entry point on /brands |
| #23 | Suggest a Product Line form (/suggest/line?brandSlug=) | UX → FS | Entry point on brand detail page |
| #24 | Suggest a Variation form (/suggest/variation?brandSlug=&lineSlug=) | UX → FS | Entry point on product line page |
| #25 | Admin submissions portal (/admin/submissions) | UX → FS | Admin-only, no public link |

**New URL routes:**
```
/suggest/brand                                  Suggest a new brand
/suggest/line?brandSlug=                        Suggest a product line
/suggest/variation?brandSlug=&lineSlug=         Suggest a variation
/admin/submissions                              Admin approval queue (ADMIN role only)
```

**Dependency order:** #20 → #21 → #22, #23, #24, #25

---

## P1 Tickets (Post-MVP — Planned)

These will be created after P0 ships:

- Search results page (dedicated `/search?q=` route with full results UI)
- Review editing flow improvements (edit from profile page)
- Report moderation dashboard (admin-only)
- Brand page aggregate stats enhancements
- SEO: sitemap.xml and robots.txt generation
- Error boundary and global 404/500 pages polish
- Seed data script for demo content

## P2 Tickets (Future Consideration)

- Brand claim / admin portal
- Photo uploads on reviews
- "Helpful" vote on reviews
- Following users
- Email notifications
- Algolia / Meilisearch integration for full-text search
- Mobile app (React Native)

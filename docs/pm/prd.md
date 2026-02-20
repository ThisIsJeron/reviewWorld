# ReviewWorld — Product Requirements Document

**Version:** 1.0
**Date:** 2026-02-19
**Status:** Approved for MVP

---

## 1. Product Overview

### 1.1 Vision
ReviewWorld is a community-driven review platform for food products — think "Yelp, but for packaged and branded food." Consumers can discover brands, browse product lines and specific variations, and read or write honest reviews.

### 1.2 Problem Statement
Food shoppers face an overwhelming number of product choices with little trustworthy peer guidance. Existing platforms (Amazon, grocery apps) bury food reviews in general commerce noise. ReviewWorld provides a dedicated, clean space focused entirely on food product discovery and evaluation.

### 1.3 Target Users
- **Primary:** Health-conscious and curious food shoppers who actively research products before buying
- **Secondary:** Food enthusiasts and brand followers who enjoy documenting and sharing opinions
- **Tertiary:** Brands seeking organic feedback and product visibility

---

## 2. MVP Scope

### 2.1 In Scope (MVP / P0)
The MVP delivers a fully functional read-write platform with the following capabilities:

1. **Discovery** — Home page with trending products and global search
2. **Brand browsing** — Directory of all brands, individual brand pages
3. **Product navigation** — Product line pages nested under brands; variation pages with full review display
4. **Review system** — Authenticated users can write, view, and flag reviews (1–5 star rating, title, body, would-buy-again)
5. **User accounts** — Google OAuth sign-in, user profile pages, account settings
6. **Navigation** — Persistent header with search and auth state

### 2.2 Out of Scope (Post-MVP)
- Brand-claimed pages / brand admin portal
- Social features (following users, liking reviews)
- Photo uploads on reviews
- Email notifications
- Mobile native apps
- Advanced analytics / reporting dashboards
- Moderation admin panel (manual; reports are stored but no UI built in MVP)
- Paid tiers or advertising

---

## 3. Data Model Summary

```
User          — id, email, name, image, createdAt
Brand         — id, name, slug, description, logoUrl
ProductLine   — id, brandId, name, slug, description, imageUrl
Variation     — id, productLineId, name, slug, description, imageUrl, tags[]
Review        — id, userId, variationId, rating(1-5), title, body, wouldBuyAgain, createdAt, updatedAt
Report        — id, reviewId, userId, reason, createdAt
```

Relationships:
- Brand → many ProductLines
- ProductLine → many Variations
- Variation → many Reviews
- Review → many Reports (flagging)
- User → many Reviews, many Reports

---

## 4. URL Structure

```
/                                           Home (trending, search)
/brands                                     Brand directory
/brands/[brandSlug]                         Brand page
/brands/[brandSlug]/[lineSlug]              Product Line page
/brands/[brandSlug]/[lineSlug]/[varSlug]    Variation page (reviews here)
/review/new?variationId=...                 Write review
/profile/[userId]                           User profile
/account                                    Account settings
```

---

## 5. Feature Requirements

### 5.1 Home Page (`/`)
- Display a hero section with tagline and search bar
- Show "Trending" products section (top-rated variations by recent review volume)
- Show "Recently Reviewed" section
- Search bar navigates to results or filters inline
- Unauthenticated users can browse; authentication required only to write reviews

### 5.2 Brand Directory (`/brands`)
- Paginated/scrollable list of all brands
- Each brand card: logo, name, short description, product line count
- Search/filter by brand name
- Alphabetical sort by default; option to sort by review count

### 5.3 Brand Page (`/brands/[brandSlug]`)
- Brand header: logo, name, full description
- List of product lines under this brand (cards with image, name, variation count)
- Aggregate star rating across all brand reviews (displayed prominently)
- Empty state if no product lines yet

### 5.4 Product Line Page (`/brands/[brandSlug]/[lineSlug]`)
- Product line header: image, name, description
- Grid/list of variation cards (image, name, avg rating, review count)
- Breadcrumb: Home > Brands > [Brand] > [Line]
- Empty state if no variations

### 5.5 Variation Page (`/brands/[brandSlug]/[lineSlug]/[varSlug]`)
- Variation header: image, name, tags, description
- Aggregate rating display (stars + numeric + review count)
- "Write a Review" CTA (auth-gated — prompts sign-in if not authenticated)
- Review list: sorted by newest first; each review shows rating, title, body, author, date, would-buy-again badge
- Report review button per review (auth-gated)
- Empty state with CTA to be first reviewer
- Pagination or infinite scroll for reviews

### 5.6 Write Review (`/review/new?variationId=...`)
- Authentication required — redirect to sign-in if not
- Pre-populated product context (name, image) at top
- Form fields: star rating (1–5, required), title (required, max 120 chars), body (required, max 2000 chars), would-buy-again (yes/no toggle)
- Validation with clear error messages
- On submit: save and redirect to variation page
- Prevent duplicate reviews (one per user per variation — show edit option if review already exists)

### 5.7 User Profile (`/profile/[userId]`)
- User avatar, name, member since date
- List of all reviews written by this user (variation name, rating, excerpt, date)
- Empty state if no reviews yet
- Public page — visible to anyone

### 5.8 Account Settings (`/account`)
- Authentication required
- Display current name and email (from Google)
- Option to update display name
- Sign out button
- Delete account option (with confirmation)

### 5.9 Navigation / Header
- Logo linking to home
- Search bar (visible on all pages)
- If unauthenticated: "Sign In" button
- If authenticated: user avatar + dropdown (Profile, Account Settings, Sign Out)
- Mobile-responsive (hamburger menu or collapsed state)

### 5.10 API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/brands` | Paginated brand list |
| GET | `/api/brands/[brandSlug]` | Brand detail + product lines |
| GET | `/api/brands/[brandSlug]/[lineSlug]` | Product line + variations |
| GET | `/api/brands/[brandSlug]/[lineSlug]/[varSlug]` | Variation detail + paginated reviews |
| POST | `/api/reviews` | Submit a new review (auth required) |
| PUT | `/api/reviews/[reviewId]` | Edit existing review (auth, owner only) |
| POST | `/api/reports` | Report a review (auth required) |
| GET | `/api/search?q=` | Search brands, product lines, variations |

---

## 6. Auth Requirements

- Google OAuth via NextAuth.js v5
- Session stored server-side
- Protected routes: `/review/new`, `/account`
- Soft-gate: `/profile/[userId]` is public but review submission requires auth
- No role system in MVP (all authenticated users have equal privileges)

---

## 7. Non-Functional Requirements

- **Performance:** Core pages should target < 2s LCP on a standard connection; use Next.js server components and ISR where appropriate
- **SEO:** Brand, product line, and variation pages must have proper `<title>`, meta description, and Open Graph tags
- **Accessibility:** WCAG 2.1 AA compliance target; semantic HTML, keyboard navigability, sufficient color contrast
- **Responsiveness:** Full mobile and desktop support (min 320px to 1440px+)
- **Error handling:** All pages must handle 404 (not found) and 500 (server error) gracefully

---

## 8. Success Metrics (Post-Launch)

- Reviews submitted per week
- Monthly active users (MAU)
- Variation pages with at least one review
- Return visitor rate
- Average session duration

---

## 9. Tech Stack

- **Frontend / Backend:** Next.js 14 (App Router)
- **Auth:** NextAuth.js v5 (Google OAuth)
- **Database:** PostgreSQL (Docker)
- **ORM:** Prisma
- **UI:** Tailwind CSS + shadcn/ui
- **Deployment:** TBD (Vercel recommended)

---

## 10. Open Questions

1. Should the search be full-text database search or integrate an external search service (Algolia, Meilisearch)?
2. What is the seed data strategy for launch — will brands/products be hand-curated or user-submitted?
3. Is there a moderation workflow needed at launch, or is reporting sufficient?
4. Should variation tags be a fixed taxonomy or free-form?

*These are non-blocking for MVP but should be resolved before P1.*

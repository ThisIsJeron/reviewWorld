# UX Spec: User Profile Page (`/profile/[userId]`)

> Ticket: #15 — UX+FS: User profile page (/profile/[userId])
> Status: UX Complete
> File: `docs/ux/user-profile.md`

---

## 1. Page Purpose

Public-facing page showing a user's review history. Builds community trust by giving reviewers a persistent identity. Publicly viewable — no auth required.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  Home > Profile         │  ← Breadcrumb
├─────────────────────────┤
│  [Avatar 72×72]         │  ← centered
│  Jane Doe               │  ← display name, h1 centered
│  Member since Jan 2025  │  ← text-sm muted, centered
│  42 reviews             │  ← text-sm, centered
├─────────────────────────┤
│  Reviews (42)           │  ← h2
│                         │
│  [ProfileReviewCard]    │
│  [ProfileReviewCard]    │
│  [ProfileReviewCard]    │
│  ...                    │
│  [Pagination]           │
├─────────────────────────┤
│       AppFooter         │
└─────────────────────────┘
```

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search ...]                    [avatar ▾]  │
├─────────────────────────────────────────────────────────────────┤
│  Home > Profile > Jane Doe                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Avatar 96×96]  Jane Doe                                │  │
│  │                  Member since January 2025               │  │
│  │                  42 reviews written                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Reviews (42)                                                   │
│                                                                 │
│  [ProfileReviewCard — full width]                               │
│  [ProfileReviewCard — full width]                               │
│  [ProfileReviewCard — full width]                               │
│  ...                                                            │
│                                                                 │
│               [< Prev]  Page 1 of 5  [Next >]                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Breadcrumb

```
Home > Profile > Jane Doe
```

- "Profile" is not a standalone page (no `/profile` directory listing) — non-linked label
- "Jane Doe" is current page
- Mobile: `< Home`

### 3.2 Profile Header

**Layout:** Horizontal card on desktop; centered stacked on mobile.

**Avatar:**
- `<Image src={user.image} width={96} height={96} className="rounded-full object-cover ring-2 ring-border">`
- Fallback: colored circle with user initials, same color derivation as BrandCard initial
- Mobile: centered, 72×72

**Display Name:** `<h1 className="text-2xl font-bold">`

**Member Since:** "Member since {month} {year}" — format `createdAt` as "January 2025"
- `text-sm text-muted-foreground`

**Review Count:** "{N} reviews written" — use singular "1 review written" if N=1
- `text-sm text-muted-foreground`

**"Own profile" indicator (optional, not MVP):** If viewing your own profile, show an "Edit profile" link → `/account`. For MVP, just show the data read-only.

**Container:** `bg-muted/40 rounded-2xl p-6`

### 3.3 Reviews List

**Header:** `<h2>` "Reviews ({count})" — `text-xl font-semibold mb-4`

**Pagination:** 10 per page, URL param `?page=N`

**ProfileReviewCard:**

```
┌──────────────────────────────────────────────────────────────┐
│  ★★★★★                               Jan 15, 2026            │
│                                                              │
│  "Best plain yogurt I've tried"    ← review title, font-semi │
│                                                              │
│  The texture is incredibly smooth and it's not too sour...   │
│  [Read more]                       ← if truncated            │
│                                                              │
│  [Yes, would buy again]                                      │
│                                                              │
│  Plain (32oz) · Greek Yogurt · Chobani                       │
│                ↑ all three linked to variation page          │
└──────────────────────────────────────────────────────────────┘
```

- `<Card className="p-5">` with `hover:shadow-sm transition-shadow`
- Stars: `StarRating` display-only, `size="sm"`
- Date: `text-sm text-muted-foreground` right-aligned on desktop, below stars on mobile
- Title: `font-semibold text-base`
- Body: truncated at 300 chars, expandable with `[Read more]` toggle
- Would Buy Again badge: same green/red badge as ReviewCard
- Product link line: `text-sm` — "Plain (32oz)" links to variation page, "Greek Yogurt" links to line page, "Chobani" links to brand page
- No avatar in this card (this is the user's own profile — no need to repeat it)

---

## 4. Component States

### Loading State

**Header skeleton:**
```
┌───────────────────────────────────────────────────┐
│  ████████  ████████████████████                   │
│  (circle)  ████████████                           │
│            █████████                              │
└───────────────────────────────────────────────────┘
```

**Review card skeletons × 3:**
```
┌────────────────────────────────────────────────┐
│  ██████████                    ████████         │
│                                                 │
│  ████████████████████                           │
│                                                 │
│  ████████████████████████████████████           │
│  ████████████████████                           │
│                                                 │
│  ██████████████                                 │
└────────────────────────────────────────────────┘
```

### Empty State — No Reviews

```
┌────────────────────────────────────────┐
│                                        │
│         [Star icon, 48px, gray]        │
│                                        │
│         No reviews yet                 │
│         Jane hasn't reviewed any       │
│         products yet.                  │
│                                        │
│         [Browse products]              │
│                                        │
└────────────────────────────────────────┘
```

- Use first name if available ("Jane"), otherwise "This user"
- "Browse products" links to `/`

### 404 State — User Not Found

- `notFound()` in server component
- "User not found" message
- "Go home" button → `/`

### Error State

- `ErrorBanner`: "Could not load this profile. Try refreshing."

---

## 5. Responsive Breakpoints

| Element | Mobile (<640) | Desktop (≥640) |
|---------|--------------|----------------|
| Profile header | Centered, stacked | Horizontal card |
| Avatar | 72×72, centered | 96×96, left-aligned |
| Review card date | Below stars | Right-aligned |
| Product link | Wraps naturally | Single line |

---

## 6. SEO / Meta

```tsx
export async function generateMetadata({ params }) {
  const user = await getUser(params.userId)
  return {
    title: `${user.name}'s Reviews | ReviewWorld`,
    description: `Read ${user.name}'s food product reviews on ReviewWorld. ${user._count.reviews} reviews written.`,
    // Public profile — indexable
  }
}
```

---

## 7. shadcn/ui Components Used

- `Card` — profile header + review cards
- `Badge` — would-buy-again
- `Button` — empty state CTA
- `Skeleton` — loading states
- `Pagination` and sub-components
- `Breadcrumb` and sub-components

---

## 8. Implementation Notes for FS

- Page: `app/profile/[userId]/page.tsx` — Server Component, publicly accessible (no auth check)
- `notFound()` when user query returns null
- Reviews query: `include: { variation: { include: { productLine: { include: { brand: true } } } } }` to get full breadcrumb links
- Slugs needed for links: `brandSlug`, `lineSlug`, `varSlug` — must be included in the joined query
- `generateMetadata` + page share user fetch via `cache()`
- Review body expansion: `'use client'` `ReviewBodyExpander` component (same as variation page)
- "Own profile" detection for MVP: not required, but FS can note `session?.user?.id === params.userId` for future "Edit profile" link

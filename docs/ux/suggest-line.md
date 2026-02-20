# UX Spec: Suggest a Product Line (`/suggest/line?brandSlug=`)

> Ticket: #23 — UX+FS: Suggest a Product Line form (/suggest/line?brandSlug=)
> Status: UX Complete
> File: `docs/ux/suggest-line.md`

---

## 1. Page Purpose

Allows authenticated users to suggest a new product line under a specific brand. The `brandSlug` query param provides context — the form shows which brand the suggestion will belong to. Submissions enter a pending queue; an admin must approve before the line appears publicly.

Entry point: "Suggest a Product Line" button on the brand detail page (`/brands/[brandSlug]`), near the Product Lines section heading.

---

## 2. Entry Point

On `/brands/[brandSlug]`, near the "Product Lines" section heading:

```
  Product Lines                          [+ Suggest a Product Line]
  ──────────────────────────────────────────────────────────────────
```

- Button: `<Button variant="outline" size="sm">+ Suggest a Product Line</Button>`
- Shown to all users (auth-check happens on the destination page)
- Links to `/suggest/line?brandSlug={brandSlug}`
- If user is unauthenticated: clicking redirects to sign-in with `callbackUrl=/suggest/line?brandSlug={brandSlug}`

---

## 3. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  Home > Brands >        │
│  Chobani >              │
│  Suggest a Product Line │  ← Breadcrumb
├─────────────────────────┤
│  Suggest a Product Line │  ← h1
│  for Chobani            │  ← brand name interpolated, text-muted-foreground
│                         │
│  ┌─────────────────────┐│
│  │ [Logo]  Chobani     ││  ← BrandContextPanel (read-only)
│  └─────────────────────┘│
│                         │
│  Product Line Name *    │
│  [________________________]│
│                         │
│  Description            │
│  [                      ]│
│  [                      ]│
│  [                      ]│
│                         │
│  Image URL              │
│  (optional)             │
│  [________________________]│
│                         │
│  [Submit Suggestion]    │  ← full width
│  [Cancel]               │
└─────────────────────────┘
```

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search products, brands...]    [avatar ▾]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Home > Brands > Chobani > Suggest a Product Line               │
│                                                                 │
│  Suggest a Product Line for Chobani                             │
│  Help grow ReviewWorld by adding a missing product line.        │
│  We'll review it before it goes live.                           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │  [Logo 40×40]  Chobani                         │    │    │  ← BrandContextPanel
│  │  └────────────────────────────────────────────────┘    │    │
│  │                                                        │    │
│  │  Product Line Name *                          0/100    │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                                                  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                        │    │
│  │  Description                                  0/500    │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                                                  │  │    │
│  │  │                                                  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                        │    │
│  │  Image URL  (optional)                                 │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                                                  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │  Link to a publicly accessible image (jpg, png, webp)  │    │
│  │                                                        │    │
│  │                  [Cancel]  [Submit Suggestion]         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Form constrained to `max-w-2xl` centered.

---

## 4. Section Specs

### 4.1 Auth Guard

- Page is a Server Component; checks session server-side.
- If unauthenticated: `redirect('/api/auth/signin?callbackUrl=/suggest/line?brandSlug={slug}')`

### 4.2 brandSlug Validation

- If `brandSlug` is missing or resolves to no brand: render an error state (not a redirect).

```
┌────────────────────────────────────────┐
│                                        │
│  [AlertCircle icon, 48px]              │
│                                        │
│  Brand not found                       │
│  We couldn't find the brand you're     │
│  trying to add a product line to.      │
│                                        │
│  [Browse all brands]                   │
│                                        │
└────────────────────────────────────────┘
```

### 4.3 Breadcrumb

- `Home > Brands > {Brand Name} > Suggest a Product Line`
- "Home" → `/`
- "Brands" → `/brands`
- "{Brand Name}" → `/brands/{brandSlug}`
- "Suggest a Product Line" — current page, `aria-current="page"`, non-linked

### 4.4 Page Heading + Subtext

- `<h1>` "Suggest a Product Line" — `text-3xl font-bold`
- Subheading inline: "for {Brand Name}" — `text-xl text-muted-foreground font-normal` (same line on desktop, next line on mobile)
- Body text below: "Help grow ReviewWorld by adding a missing product line. We'll review it before it goes live."
  - `text-sm text-muted-foreground mt-1 mb-4`

### 4.5 BrandContextPanel

Read-only panel confirming which brand this line will belong to. Mirrors the `ProductContextPanel` pattern from write-review.

```
┌────────────────────────────────────────────────────┐
│  [Logo 40×40  Chobani                              │
│   rounded-lg] text-sm text-muted-foreground:       │
│               This product line will be added      │
│               under Chobani                        │
└────────────────────────────────────────────────────┘
```

- `bg-muted rounded-xl p-4 flex items-center gap-4`
- Logo: `<Image width={40} height={40} className="rounded-lg object-contain bg-white border border-border p-0.5">`
- Brand name: `font-semibold text-sm`
- Helper text: `text-xs text-muted-foreground`
- Not clickable (read-only)

### 4.6 Product Line Name Field

- `<Label>` "Product Line Name" with required asterisk
- `<Input placeholder="e.g. Greek Yogurt">`
- Max: 100 characters
- Character counter: `"{count}/100"`, warn at 80
- Validation: required, 2–100 chars; error shown on blur or submit

### 4.7 Description Field

- `<Label>` "Description" — no asterisk (optional)
- `<Textarea placeholder="Brief description of this product line..." rows={4}>`
- Max: 500 characters
- Character counter: `"{count}/500"`, warn at 450
- Validation: optional; max 500 chars

### 4.8 Image URL Field

- `<Label>` "Image URL" with `(optional)` muted inline
- `<Input placeholder="https://example.com/image.png">`
- Hint: `text-xs text-muted-foreground` — "Link to a publicly accessible image (jpg, png, webp)"
- Validation: optional; if provided, must be a valid `https://` URL

### 4.9 Submit / Cancel

**Submit button:**
- Label: "Submit Suggestion"
- `<Button size="lg" className="bg-orange-500 hover:bg-orange-600">`
- Full width on mobile; auto width (right-aligned) on desktop
- Loading state: spinner + "Submitting...", button disabled

**Cancel:**
- `<Button variant="ghost">Cancel</Button>` → navigates to `/brands/{brandSlug}`
- On desktop: left of submit; on mobile: below submit, centered

### 4.10 Validation

| Field | Rules |
|-------|-------|
| Product Line Name | Required, 2–100 chars |
| Description | Optional, max 500 chars |
| Image URL | Optional; if present, valid `https://` URL |

Error display: `text-sm text-red-500` below each field, `aria-describedby`.

Server returns 400 with `{ errors: { fieldName: "message" } }`.

---

## 5. Post-Submit: Confirmation State

On successful `POST /api/suggestions/lines` (201 response), replace the form with a confirmation panel:

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   [CheckCircle icon, 48px, text-green-500]         │
│                                                    │
│   Thanks for your suggestion!                      │
│                                                    │
│   "Greek Yogurt" has been submitted for review.    │  ← submitted line name
│   We'll notify you once it's approved.             │
│                                                    │
│   [Suggest Another Line]   [Back to Chobani]       │
│                                                    │
└────────────────────────────────────────────────────┘
```

- "Suggest Another Line" → reset form to empty (no navigation; retain `brandSlug` context)
- "Back to {Brand Name}" → `router.push('/brands/{brandSlug}')`
- Uses the same `ConfirmationPanel` component as suggest-brand, with configurable copy props

---

## 6. Component States

### Submitting

- Submit button: disabled, spinner + "Submitting..."
- Form fields: `pointer-events-none opacity-70`

### API Error (non-field)

- Button re-enables
- `ErrorBanner` above the button: "Something went wrong. Please try again."

### Duplicate Detection (409)

- Server returns 409 if a product line with the same name already exists under this brand.
- Field-level error on Product Line Name: "A product line with this name already exists under {Brand Name}."

---

## 7. Responsive Breakpoints

| Element | Mobile (<640) | Desktop (≥640) |
|---------|--------------|----------------|
| Page max-width | 100% px-4 | max-w-2xl centered |
| Heading "for {Brand}" | Second line | Same line, lighter weight |
| Submit/Cancel | Stacked | Inline |
| Textarea rows | 4 | 5 |

---

## 8. SEO / Meta

```tsx
export const metadata = {
  title: 'Suggest a Product Line | ReviewWorld',
  robots: { index: false },
}
```

---

## 9. shadcn/ui Components Used

- `Input` — name, image URL
- `Textarea` — description
- `Button` — submit, cancel
- `Label` — all form labels
- `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`
- `Skeleton` — BrandContextPanel loading state (if brand fetched client-side, unlikely for SSR)

Custom (shared):
- `BrandContextPanel` — new; shows brand context (logo + name + helper text)
- `ConfirmationPanel` — shared with suggest-brand; configurable props
- `CharCounter` — character count (reuse)
- `ErrorBanner` — reuse

---

## 10. Implementation Notes for FS

- Page: `app/suggest/line/page.tsx` — Server Component for auth check + brand lookup
- Read `searchParams.brandSlug` server-side, fetch brand from DB
- If brand not found: render `<InvalidBrandState>` (not `notFound()` — keep page structure)
- Auth check before brand check (redirect to sign-in first if not authed)
- Form: `'use client'` `SuggestLineForm` receives `brand` as a prop (passed down from Server Component)
- Submit: `POST /api/suggestions/lines` with `{ brandId, name, description?, imageUrl? }`
- `brandId` is resolved server-side and passed as a hidden value / prop — do not expose raw DB ids in form; use `brandSlug` and resolve on the server in the API route
- On 201: swap to `<ConfirmationPanel>`
- On 409: `setError('name', { message: '...' })`

# UX Spec: Suggest a Variation (`/suggest/variation?brandSlug=&lineSlug=`)

> Ticket: #24 — UX+FS: Suggest a Variation form (/suggest/variation?brandSlug=&lineSlug=)
> Status: UX Complete
> File: `docs/ux/suggest-variation.md`

---

## 1. Page Purpose

Allows authenticated users to suggest a new variation (flavor, size, format) under a specific product line. Both `brandSlug` and `lineSlug` query params are required for context. The form shows which brand and product line the suggestion belongs to. Submissions enter a pending queue; an admin must approve before the variation appears publicly.

Entry point: "Suggest a Variation" button on the product line page (`/brands/[brandSlug]/[lineSlug]`), near the Variations section heading.

---

## 2. Entry Point

On `/brands/[brandSlug]/[lineSlug]`, near the "Variations" section heading:

```
  Variations                              [+ Suggest a Variation]
  ────────────────────────────────────────────────────────────────
```

- Button: `<Button variant="outline" size="sm">+ Suggest a Variation</Button>`
- Shown to all users (auth-check happens on destination page)
- Links to `/suggest/variation?brandSlug={brandSlug}&lineSlug={lineSlug}`
- If unauthenticated: redirects to sign-in with full `callbackUrl`

---

## 3. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  Home > Brands >        │
│  Chobani > Greek Yogurt │
│  > Suggest a Variation  │  ← Breadcrumb
├─────────────────────────┤
│  Suggest a Variation    │  ← h1
│  for Greek Yogurt       │  ← product line name, text-muted-foreground
│                         │
│  ┌─────────────────────┐│
│  │ [Logo]  Greek Yogurt││  ← ProductLineContextPanel
│  │         by Chobani  ││
│  └─────────────────────┘│
│                         │
│  Variation Name *       │
│  [________________________]│
│  e.g. Plain (32oz)      │
│                         │
│  Description            │
│  [                      ]│
│  [                      ]│
│  [                      ]│
│                         │
│  Image URL  (optional)  │
│  [________________________]│
│                         │
│  Tags  (optional)       │
│  [________________________]│
│  Separate with commas   │
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
│  Home > Brands > Chobani > Greek Yogurt > Suggest a Variation   │
│                                                                 │
│  Suggest a Variation for Greek Yogurt                           │
│  Help grow ReviewWorld by adding a missing variation.           │
│  We'll review it before it goes live.                           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │  [LineImg 40×40]  Greek Yogurt                 │    │    │
│  │  │                   by Chobani                   │    │    │  ← ProductLineContextPanel
│  │  └────────────────────────────────────────────────┘    │    │
│  │                                                        │    │
│  │  Variation Name *                             0/120    │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                                                  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │  e.g. Plain (32oz), Strawberry (5.3oz)                 │    │
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
│  │  Tags  (optional)                                      │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                                                  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │  Separate with commas, e.g. "Low-Fat, Strawberry"      │    │
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
- If unauthenticated: `redirect('/api/auth/signin?callbackUrl=/suggest/variation?brandSlug={slug}&lineSlug={slug}')`

### 4.2 Param Validation

Both `brandSlug` and `lineSlug` must be present and resolve to real records.

- If either is missing or invalid: render an error state (not a redirect):

```
┌────────────────────────────────────────┐
│                                        │
│  [AlertCircle icon, 48px]              │
│                                        │
│  Product line not found                │
│  We couldn't find the product line     │
│  you're trying to add a variation to.  │
│                                        │
│  [Browse all brands]                   │
│                                        │
└────────────────────────────────────────┘
```

### 4.3 Breadcrumb

- `Home > Brands > {Brand Name} > {Line Name} > Suggest a Variation`
- "Home" → `/`
- "Brands" → `/brands`
- "{Brand Name}" → `/brands/{brandSlug}`
- "{Line Name}" → `/brands/{brandSlug}/{lineSlug}`
- "Suggest a Variation" — current page, `aria-current="page"`, non-linked
- Mobile: collapses to `< {Line Name}` (back link to parent line page)

### 4.4 Page Heading + Subtext

- `<h1>` "Suggest a Variation" — `text-3xl font-bold`
- Subheading: "for {Line Name}" — `text-xl text-muted-foreground font-normal`
- Body text: "Help grow ReviewWorld by adding a missing variation. We'll review it before it goes live."
  - `text-sm text-muted-foreground mt-1 mb-4`

### 4.5 ProductLineContextPanel

Read-only panel confirming which product line this variation will belong to. Extends the pattern from suggest-line's `BrandContextPanel`.

```
┌────────────────────────────────────────────────────┐
│  [LineImg  Greek Yogurt                            │
│   40×40    by Chobani                              │
│   rounded] This variation will be added under      │
│            Greek Yogurt                            │
└────────────────────────────────────────────────────┘
```

- `bg-muted rounded-xl p-4 flex items-center gap-4`
- Line image or placeholder: `<Image width={40} height={40} className="rounded-lg object-cover">`
  - Placeholder: `bg-gradient-to-br from-orange-50 to-orange-200` with `ShoppingBasket` icon
- Line name: `font-semibold text-sm`
- "by {Brand Name}": `text-xs text-muted-foreground`
- Helper text: `text-xs text-muted-foreground` "This variation will be added under {Line Name}"
- Not clickable (read-only context)

### 4.6 Variation Name Field

- `<Label>` "Variation Name" with required asterisk
- `<Input placeholder="e.g. Plain (32oz)">`
- Hint below input: `text-xs text-muted-foreground` — "e.g. Plain (32oz), Strawberry (5.3oz)"
- Max: 120 characters
- Character counter: `"{count}/120"`, warn at 100
- Validation: required, 2–120 chars; error on blur or submit

### 4.7 Description Field

- `<Label>` "Description" — no asterisk (optional)
- `<Textarea placeholder="Brief description of this variation..." rows={4}>`
- Max: 500 characters
- Character counter: `"{count}/500"`, warn at 450
- Validation: optional; max 500 chars

### 4.8 Image URL Field

- `<Label>` "Image URL" with `(optional)` muted inline
- `<Input placeholder="https://example.com/image.png">`
- Hint: "Link to a publicly accessible image (jpg, png, webp)"
- Validation: optional; valid `https://` URL if provided

### 4.9 Tags Field

- `<Label>` "Tags" with `(optional)` muted inline
- `<Input placeholder="e.g. Low-Fat, Strawberry, Plain">`
- Hint: `text-xs text-muted-foreground` — "Separate with commas, e.g. "Low-Fat, Strawberry""
- Validation: optional; each tag max 30 chars, max 10 tags total
  - Error: "Too many tags (max 10)" or "Tag '{name}' is too long (max 30 characters)"
- Stored as `String[]` — split on comma, trim whitespace from each tag

### 4.10 Submit / Cancel

**Submit button:**
- Label: "Submit Suggestion"
- `<Button size="lg" className="bg-orange-500 hover:bg-orange-600">`
- Full width on mobile; auto width (right-aligned) on desktop
- Loading state: spinner + "Submitting...", disabled

**Cancel:**
- `<Button variant="ghost">Cancel</Button>` → navigates to `/brands/{brandSlug}/{lineSlug}`
- Desktop: left of submit; mobile: below submit, centered

### 4.11 Validation Summary

| Field | Rules |
|-------|-------|
| Variation Name | Required, 2–120 chars |
| Description | Optional, max 500 chars |
| Image URL | Optional; valid `https://` URL if provided |
| Tags | Optional; each tag ≤ 30 chars, max 10 tags |

Error display: `text-sm text-red-500` below each field, `aria-describedby`.

---

## 5. Post-Submit: Confirmation State

On successful `POST /api/suggestions/variations` (201 response), replace the form with a confirmation panel:

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   [CheckCircle icon, 48px, text-green-500]         │
│                                                    │
│   Thanks for your suggestion!                      │
│                                                    │
│   "Plain (32oz)" has been submitted for review.    │  ← submitted variation name
│   We'll notify you once it's approved.             │
│                                                    │
│   [Suggest Another Variation]  [Back to Greek      │
│                                 Yogurt]            │
│                                                    │
└────────────────────────────────────────────────────┘
```

- "Suggest Another Variation" → reset form to empty, retain `brandSlug` and `lineSlug` context
- "Back to {Line Name}" → `router.push('/brands/{brandSlug}/{lineSlug}')`
- Same `ConfirmationPanel` component, configured with variation-specific copy

---

## 6. Component States

### Submitting

- Submit button: disabled, spinner + "Submitting..."
- Form fields: `pointer-events-none opacity-70`

### API Error (non-field)

- Button re-enables
- `ErrorBanner` above the button: "Something went wrong. Please try again."

### Duplicate Detection (409)

- Server returns 409 if a variation with the same name already exists under this product line.
- Field-level error: "A variation with this name already exists under {Line Name}."

---

## 7. Responsive Breakpoints

| Element | Mobile (<640) | Desktop (≥640) |
|---------|--------------|----------------|
| Page max-width | 100% px-4 | max-w-2xl centered |
| Heading "for {Line}" | Second line | Same line, lighter weight |
| Submit/Cancel | Stacked | Inline |
| Textarea rows | 4 | 5 |

---

## 8. SEO / Meta

```tsx
export const metadata = {
  title: 'Suggest a Variation | ReviewWorld',
  robots: { index: false },
}
```

---

## 9. shadcn/ui Components Used

- `Input` — name, image URL, tags
- `Textarea` — description
- `Button` — submit, cancel
- `Label` — all form labels
- `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`

Custom (shared):
- `ProductLineContextPanel` — new; shows line + brand context (extends BrandContextPanel pattern)
- `ConfirmationPanel` — shared across all three suggest forms
- `CharCounter` — reuse
- `ErrorBanner` — reuse

---

## 10. Implementation Notes for FS

- Page: `app/suggest/variation/page.tsx` — Server Component for auth check + brand/line lookup
- Read `searchParams.brandSlug` and `searchParams.lineSlug` server-side, resolve both from DB
- If either not found: render `<InvalidLineState>` error panel
- Auth check happens before DB lookups (unauthenticated redirect first)
- Form: `'use client'` `SuggestVariationForm` receives `brand` and `line` as props
- Tags: split `tagsInput` string on comma in the form; trim and deduplicate before submit
- Submit: `POST /api/suggestions/variations` with `{ lineId, name, description?, imageUrl?, tags? }`
  - `lineId` resolved server-side; pass via prop, not exposed in form fields
- On 201: swap to `<ConfirmationPanel>`
- On 409: `setError('name', { message: '...' })`
- `lineId` determines brand via DB relation — no need to pass `brandId` separately to API

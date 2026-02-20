# UX Spec: Suggest a Brand (`/suggest/brand`)

> Ticket: #22 — UX+FS: Suggest a Brand form (/suggest/brand)
> Status: UX Complete
> File: `docs/ux/suggest-brand.md`

---

## 1. Page Purpose

Allows authenticated users to suggest a new brand for inclusion in the ReviewWorld catalog. Submissions enter a pending queue; an admin must approve before the brand appears publicly. The form is intentionally lightweight — no file uploads, no complex fields.

Entry point: "Suggest a Brand" button on the `/brands` page (bottom of brand grid, or near the page heading).

---

## 2. Entry Point

On `/brands` page, below the brand grid (or inline near the heading on desktop):

```
  ┌─────────────────────────────────────────────────────────┐
  │  Don't see a brand?  [+ Suggest a Brand]                │
  └─────────────────────────────────────────────────────────┘
```

- Text: `text-sm text-muted-foreground` + `<Button variant="outline" size="sm">+ Suggest a Brand</Button>`
- Button links to `/suggest/brand`
- If user is not authenticated: clicking the button redirects to sign-in with `callbackUrl=/suggest/brand`

---

## 3. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  Home > Brands >        │
│  Suggest a Brand        │  ← Breadcrumb
├─────────────────────────┤
│  Suggest a Brand        │  ← h1
│  text-muted-foreground  │
│  Help grow ReviewWorld  │
│  by adding a missing    │
│  brand. We'll review it │
│  before it goes live.   │
├─────────────────────────┤
│  Brand Name *           │
│  [________________________]│
│                         │
│  Description            │
│  [                      ]│
│  [                      ]│
│  [                      ]│
│                         │
│  Logo URL               │
│  (optional)             │
│  [________________________]│
│  text-xs hint           │
│                         │
│  [Submit Suggestion]    │  ← full width
│  [Cancel]               │  ← text link below
└─────────────────────────┘
```

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search products, brands...]    [avatar ▾]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Home > Brands > Suggest a Brand                                │
│                                                                 │
│  Suggest a Brand                                                │
│  Help grow ReviewWorld by adding a missing brand. We'll         │
│  review it before it goes live.                                 │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Brand Name *                                  0/100   │    │
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
│  │  Logo URL  (optional)                                  │    │
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

Form is constrained to `max-w-2xl` centered, matching the write-review page.

---

## 4. Section Specs

### 4.1 Auth Guard

- Page is a Server Component; checks session server-side.
- If unauthenticated: `redirect('/api/auth/signin?callbackUrl=/suggest/brand')`
- Authenticated user proceeds directly to the form.

### 4.2 Breadcrumb

- `Home > Brands > Suggest a Brand`
- "Home" → `/`
- "Brands" → `/brands`
- "Suggest a Brand" — current page, `aria-current="page"`, non-linked

### 4.3 Page Heading + Subtext

- `<h1>` "Suggest a Brand" — `text-3xl font-bold`
- Subtext below (not a label): "Help grow ReviewWorld by adding a missing brand. We'll review it before it goes live."
  - `text-sm text-muted-foreground mt-1 mb-6`

### 4.4 Brand Name Field

- `<Label>` "Brand Name" with required asterisk
- `<Input placeholder="e.g. Chobani">`
- Max: 100 characters
- Character counter: `"{count}/100"` right-aligned, `text-xs text-muted-foreground`
- Counter turns `text-red-500` when count > 80
- Validation: required, 2–100 chars; error shown on blur or submit attempt

### 4.5 Description Field

- `<Label>` "Description" — no asterisk (optional)
- `<Textarea placeholder="Brief description of the brand and what they make..." rows={4}>`
- Max: 500 characters
- Character counter: `"{count}/500"`, warn (red) at 450
- Validation: optional; if provided, max 500 chars

### 4.6 Logo URL Field

- `<Label>` "Logo URL" with `(optional)` in muted text inline
- `<Input placeholder="https://example.com/logo.png">`
- Hint below: `text-xs text-muted-foreground` — "Link to a publicly accessible image (jpg, png, webp)"
- Validation: optional; if provided, must be a valid URL (`https://` prefix). Show error "Please enter a valid URL" if invalid.
- No image preview for MVP.

### 4.7 Submit / Cancel

**Submit button:**
- Label: "Submit Suggestion"
- `<Button size="lg" className="bg-orange-500 hover:bg-orange-600">`
- Full width on mobile; auto width (right-aligned) on desktop
- Loading state: spinner icon + "Submitting..." text, button disabled
- All fields become `pointer-events-none opacity-70` while submitting

**Cancel:**
- `<Button variant="ghost">Cancel</Button>` — navigates to `/brands`
- On desktop: left of submit button
- On mobile: below submit button, centered, `text-sm`

### 4.8 Validation Summary

Client-side validation runs on field blur and on submit attempt.

| Field | Rules |
|-------|-------|
| Brand Name | Required, 2–100 chars |
| Description | Optional, max 500 chars |
| Logo URL | Optional; if present, must start with `https://` and be a valid URL |

Error display: `text-sm text-red-500` below each field, associated via `aria-describedby`.

Server returns 400 with `{ errors: { fieldName: "message" } }` — display inline same as client errors.

---

## 5. Post-Submit: Confirmation State

On successful `POST /api/suggestions/brands` (201 response), **replace the form** with a confirmation panel (do not navigate away):

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   [CheckCircle icon, 48px, text-green-500]         │
│                                                    │
│   Thanks for your suggestion!                      │  ← text-xl font-semibold
│                                                    │
│   "Chobani" has been submitted for review.         │  ← uses submitted brand name
│   We'll notify you once it's approved.             │
│                                                    │
│   [Suggest Another Brand]   [Back to Brands]       │
│                                                    │
└────────────────────────────────────────────────────┘
```

- "Suggest Another Brand" → resets form to empty state (no navigation)
- "Back to Brands" → `router.push('/brands')`
- Confirmation replaces the `<form>` in the DOM — not a modal, not a toast

---

## 6. Component States

### Submitting

- Submit button: disabled, spinner + "Submitting..."
- Form fields: `pointer-events-none opacity-70`

### API Error (non-field)

- Button re-enables
- `ErrorBanner` above the button: "Something went wrong. Please try again."
  - `bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700`

### Duplicate Detection (409 from server)

- Server returns 409 if brand name already exists (exact match, case-insensitive) in live catalog.
- Display field-level error on Brand Name: "A brand with this name already exists. [View it →](/brands/{slug})"
  - Link to existing brand page

---

## 7. Responsive Breakpoints

| Element | Mobile (<640) | Desktop (≥640) |
|---------|--------------|----------------|
| Page max-width | 100% px-4 | max-w-2xl centered |
| Submit/Cancel | Stacked | Inline (cancel left, submit right) |
| Textarea rows | 4 | 5 |

---

## 8. SEO / Meta

```tsx
export const metadata = {
  title: 'Suggest a Brand | ReviewWorld',
  robots: { index: false },
}
```

---

## 9. shadcn/ui Components Used

- `Input` — brand name, logo URL
- `Textarea` — description
- `Button` — submit, cancel
- `Label` — all form labels
- `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`

Custom:
- `CharCounter` — character count display (reuse from write-review)
- `ConfirmationPanel` — success state (new; shared across all three suggest forms)
- `ErrorBanner` — API error display (reuse from write-review)

---

## 10. Implementation Notes for FS

- Page: `app/suggest/brand/page.tsx` — Server Component for auth check
- Auth check: `const session = await getServerSession(); if (!session) redirect(...)`
- Form: `'use client'` `SuggestBrandForm` component
- Form state: `react-hook-form` + `zod` schema
- Submit: `POST /api/suggestions/brands` with `{ name, description?, logoUrl? }`
- On 201: swap form for `<ConfirmationPanel>` (local state, no navigation)
- On 409: `setError('name', { message: 'A brand with this name already exists.' })`
- On 4xx/5xx: show `ErrorBanner`
- `Breadcrumb` is a Server Component; form is client

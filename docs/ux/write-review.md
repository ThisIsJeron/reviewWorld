# UX Spec: Write Review Page (`/review/new`)

> Ticket: #14 — UX+FS: Write review form (/review/new)
> Status: UX Complete
> File: `docs/ux/write-review.md`

---

## 1. Page Purpose

Dedicated full-page form for authenticated users to submit or edit a review. Full-page (not modal) for best mobile UX and accessibility. Product context shown at top so users can confirm they're reviewing the right product.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  ← Back to product      │  ← back link (text-sm)
├─────────────────────────┤
│  Write a Review         │  ← h1 (or "Edit Your Review")
├─────────────────────────┤
│  ┌─────────────────────┐│
│  │ [Img] Plain (32oz)  ││  ← ProductContextPanel
│  │       Greek Yogurt  ││
│  │       Chobani       ││
│  └─────────────────────┘│
├─────────────────────────┤
│  Your Rating *          │  ← label
│  ☆ ☆ ☆ ☆ ☆             │  ← StarPicker (large tap targets)
│                         │
│  Review Title *         │
│  [________________________]│ ← Input, 0/120
│                         │
│  Your Review *          │
│  [                      ]│
│  [                      ]│
│  [                      ]│  ← Textarea, 0/2000
│                         │
│  Would you buy again? * │
│  [Yes ✓]  [ No ]        │  ← toggle pills
│                         │
│  [Post Review]          │  ← Button, full width
│  [Cancel]               │  ← text link
└─────────────────────────┘
```

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search ...]                    [avatar ▾]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ← Back to product                                              │
│                                                                 │
│  Write a Review                                                 │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  [Img 64×64]  Plain (32oz)                             │    │
│  │               Greek Yogurt · Chobani                   │    │  ← ProductContextPanel
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Your Rating *                                                  │
│  ★ ★ ★ ★ ☆   (hover to select)                                  │
│                                                                 │
│  Review Title *                                         0/120   │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                                                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Your Review *                                       0/2000    │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                                                      │      │
│  │                                                      │      │
│  │                                                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Would you buy this product again? *                            │
│  ┌───────────────┐  ┌────────────────┐                         │
│  │  ✓  Yes       │  │     No         │                         │
│  └───────────────┘  └────────────────┘                         │
│                                                                 │
│                    [Cancel]  [Post Review]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Auth Guard

- Page checks session server-side
- If unauthenticated: `redirect('/api/auth/signin?callbackUrl=/review/new?variationId={id}')`
- If `variationId` is missing or invalid: render error state (not redirect)

### 3.2 Back Link

- `← Back to [Variation Name]` — links to the variation page
- Positioned above the `<h1>`
- `text-sm text-muted-foreground hover:text-foreground`
- On mobile: "← Back to product" (truncated if name is long)

### 3.3 Page Heading

- New review: `<h1>` "Write a Review"
- Edit mode (reviewId param present): `<h1>` "Edit Your Review"

### 3.4 ProductContextPanel

Read-only panel showing what product is being reviewed.

```
┌──────────────────────────────────────────────────┐
│  [Image 64×64  Plain (32oz)                      │
│   rounded-lg]  Greek Yogurt                      │
│                Chobani                           │
└──────────────────────────────────────────────────┘
```

- `bg-muted rounded-xl p-4 flex items-center gap-4`
- Image: `<Image width={64} height={64} className="rounded-lg object-cover">`
- Variation name: `font-semibold text-base`
- Line + Brand: `text-sm text-muted-foreground`
- Not clickable (read-only context)
- Loading skeleton if variation data hasn't loaded yet

### 3.5 StarPicker Component

Interactive star rating selector, 1–5 stars.

**Visual states:**
- Empty (no selection): 5 outlined stars, `text-gray-300`
- Hover: fills stars up to cursor position, `text-yellow-400`
- Selected: fills stars up to selection, `text-yellow-400`
- Selected + hover left of selection: previews lower rating (unfills)

**Specs:**
- Star size: 40×40px on mobile, 36×36px on desktop (large tap targets)
- `role="radiogroup"` with `aria-label="Star rating"`
- Each star: `role="radio"` with `aria-label="{N} stars"`, keyboard: arrow keys to change value
- Validation error (not selected on submit): red outline + "Please select a rating" below
- Label above: "Your Rating *" — required indicator

### 3.6 Review Title Input

- `<label>` "Review Title" with required asterisk
- `<Input placeholder="Summarize your experience in one line...">`
- Max: 120 characters
- Character counter: `"{count}/120"` right-aligned below input, `text-xs text-muted-foreground`
- Counter turns `text-red-500` when count > 100 (approaching limit)
- Validation: required; shown on blur or submit attempt

### 3.7 Review Body Textarea

- `<label>` "Your Review" with required asterisk
- `<Textarea placeholder="Share the details of your experience..." rows={6}>`
- Max: 2000 characters
- Character counter: `"{count}/2000"` right-aligned below, same color logic (warn at 1800)
- Validation: required, min 10 characters; shown on blur or submit attempt

### 3.8 Would Buy Again Toggle

- `<label>` "Would you buy this product again?" with required asterisk
- Two pill buttons side by side:

```
┌──────────────────┐  ┌──────────────────┐
│   ✓  Yes         │  │      No          │
└──────────────────┘  └──────────────────┘
```

- Unselected: `variant="outline"`
- Selected Yes: `bg-green-100 text-green-700 border-green-400`
- Selected No: `bg-red-100 text-red-700 border-red-400`
- Keyboard: Tab to focus group, Space/Enter to select
- `role="radiogroup"` with two `role="radio"` items
- Validation: required; error shown on submit attempt

### 3.9 Submit / Cancel

**Submit button:**
- New: "Post Review" | Edit: "Update Review"
- `<Button size="lg" className="bg-orange-500 hover:bg-orange-600">`
- Full width on mobile; auto width on desktop (right-aligned with Cancel)
- Loading state: spinner + "Posting..." text, button disabled

**Cancel link:**
- `<Button variant="ghost">Cancel</Button>` — navigates back to variation page
- On desktop: left of submit button
- On mobile: below submit button, centered

### 3.10 Validation Summary

Client-side validation runs on:
1. Field blur (individual field)
2. Submit attempt (all fields)

Error display: below each field, `text-sm text-red-500`, associated via `aria-describedby`

| Field | Rules |
|-------|-------|
| Star rating | Required (≥ 1 star) |
| Title | Required, 1–120 chars |
| Body | Required, 10–2000 chars |
| Would Buy Again | Required (Yes or No) |

Server-side validation returns 400 with field errors; display inline same as client errors.

---

## 4. Edit Mode

When `?reviewId=` param is present:
- Page heading changes to "Edit Your Review"
- Submit button label: "Update Review"
- Form pre-populated with existing review values
- API call: `PUT /api/reviews/{reviewId}` instead of `POST /api/reviews`
- If `reviewId` doesn't belong to current user: 403 → redirect to variation page with toast "You can only edit your own reviews."

---

## 5. Component States

### Loading — ProductContextPanel

Skeleton while variation fetch resolves:
```
┌──────────────────────────────────────────────────┐
│  ████████  ████████████████                      │
│            ██████████                            │
└──────────────────────────────────────────────────┘
```

### Submitting State

- Submit button: disabled, shows `<Loader2 className="animate-spin">` + "Posting..."
- All form fields: `pointer-events-none opacity-70`

### Success

- `router.push('/brands/{brandSlug}/{lineSlug}/{varSlug}')`
- Toast appears on variation page: "Review posted!" (green, `variant="default"`)
- For edit: "Review updated!"

### Error — API Failure

- Button re-enables
- `ErrorBanner` appears above submit button: "Something went wrong. Please try again."
- Field-specific errors rendered inline

### Error — Invalid variationId

```
┌────────────────────────────────────────┐
│                                        │
│  [AlertCircle icon]                    │
│  Product not found                     │
│  The product you're trying to review   │
│  couldn't be found.                    │
│                                        │
│  [Browse all brands]                   │
└────────────────────────────────────────┘
```

---

## 6. Responsive Breakpoints

| Element | Mobile (<640) | Desktop (≥640) |
|---------|--------------|----------------|
| Page max-width | 100% px-4 | max-w-2xl centered |
| Star size | 40×40px | 36×36px |
| Submit/Cancel | Stacked (submit top, cancel below) | Inline (cancel left, submit right) |
| Textarea rows | 5 | 7 |

---

## 7. SEO / Meta

```tsx
export const metadata = {
  title: 'Write a Review | ReviewWorld',
  robots: { index: false }, // don't index the form page
}
```

---

## 8. shadcn/ui Components Used

- `Input` — title field
- `Textarea` — body field
- `Button` — submit, cancel, would-buy-again pills
- `Label` — all form labels
- `Skeleton` — product context loading
- `Toast` / `useToast` — success/error feedback

Custom components:
- `StarPicker` — interactive star selector (`'use client'`)
- `WouldBuyToggle` — pill pair radio group (`'use client'`)
- `CharCounter` — character count display

---

## 9. Implementation Notes for FS

- Page: `app/review/new/page.tsx` — Server Component for initial render + auth check
- Auth check: `const session = await getServerSession(); if (!session) redirect(...)`
- `variationId` from `searchParams` — validate it resolves to a real variation
- Form: `'use client'` component (`ReviewForm`) receives `variation` and optional `existingReview` as props
- Form state management: `react-hook-form` + `zod` schema validation
- Submit: `fetch('/api/reviews', { method: 'POST', body: JSON.stringify(data) })`
- On 200: `router.push(variationUrl)` + trigger toast via URL param or `sessionStorage`
- On 4xx: parse field errors from response body, `setError()` per field via react-hook-form
- `StarPicker` keyboard: use `onKeyDown` with ArrowLeft/ArrowRight to change value

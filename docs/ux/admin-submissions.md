# UX Spec: Admin Submissions Portal (`/admin/submissions`)

> Ticket: #25 — UX+FS: Admin submissions portal (/admin/submissions)
> Status: UX Complete
> File: `docs/ux/admin-submissions.md`

---

## 1. Page Purpose

Internal admin-only utility page for reviewing and acting on user-submitted suggestions (Brands, Product Lines, Variations). Admins can approve a submission (making it live) or reject it (optionally with a reason). The page is functional-first — clean table/list layout, not styled for public consumption.

Access: No public navigation link. Direct URL only. ADMIN role gated — non-admin authenticated users and unauthenticated users both get a 403/redirect.

---

## 2. Access Control

- Page checks session server-side.
- If unauthenticated: `redirect('/api/auth/signin?callbackUrl=/admin/submissions')`
- If authenticated but `session.user.role !== 'ADMIN'`: render `<AccessDenied>` state (do NOT redirect, to avoid leaking that the route exists to non-admins):

```
┌────────────────────────────────────────┐
│                                        │
│  [ShieldX icon, 48px]                  │
│                                        │
│  Access denied                         │
│  You don't have permission to view     │
│  this page.                            │
│                                        │
│  [Go to home]                          │
│                                        │
└────────────────────────────────────────┘
```

- `ShieldX` from lucide-react, `text-red-400`
- "Go to home" → `/`

---

## 3. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  Admin                  │  ← h1
│  Submissions Portal     │
├─────────────────────────┤
│  [All] [Brands]         │
│  [Lines] [Variations]   │  ← Tab filter (2×2 on small)
├─────────────────────────┤
│  SubmissionRow          │
│  ─────────────────────  │
│  SubmissionRow          │
│  ─────────────────────  │
│  SubmissionRow          │
│  ...                    │
├─────────────────────────┤
│  [< Prev] 1 / 3 [Next >]│ ← Pagination
└─────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search ...]                    [avatar ▾]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Admin — Submissions Portal                                     │
│  Pending suggestions awaiting review                            │
│                                                                 │
│  [All]  [Brands]  [Product Lines]  [Variations]                 │  ← Tabs
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Name              Type      Suggested By   Date         │  │  ← Table header
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Oatly             Brand     jane@g.com     Feb 18, 2026  │  │
│  │  Oat Milk          Product   john@g.com     Feb 17, 2026  │  │  ← SubmissionRow
│  │  Barista (1L)      Variation jane@g.com     Feb 16, 2026  │  │
│  │  ...                                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│                  [< Prev]  Page 1 of 3  [Next >]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Page constrained to `max-w-5xl` centered (wider than forms — table needs horizontal room).

---

## 4. Section Specs

### 4.1 Page Header

- No breadcrumb (admin tool — not part of public nav hierarchy)
- `<h1>` "Admin — Submissions Portal" — `text-3xl font-bold`
- Subtext: "Pending suggestions awaiting review" — `text-sm text-muted-foreground mt-1`
- Pending count badge next to the heading: `<Badge variant="secondary">{count} pending</Badge>`

```
Admin — Submissions Portal   [42 pending]
Pending suggestions awaiting review
```

### 4.2 Tab Filter

Filter tabs control which submission type is shown. Active tab underline style (not filled pill — cleaner for data tables).

```
[All]  [Brands]  [Product Lines]  [Variations]
```

- Implemented as URL param `?type=all|brand|line|variation` (default: `all`)
- Each tab shows a count badge: `[Brands (12)]`
- Changing tab resets to page 1
- Uses shadcn `<Tabs>` component styled as an underline tab bar

**Tab spec:**
- `<Tabs value={type} onValueChange={(v) => router.push(...)}>`
- `<TabsList variant="underline">` (custom class override — not filled pill)
- `TabsContent` is not used — tabs control URL param only, table renders below

### 4.3 Submission Table — Desktop

Table layout on `≥ 768px`. Columns:

| Column | Width | Notes |
|--------|-------|-------|
| Name | flex-1 | Suggestion name. Truncated at 40 chars with tooltip |
| Context | auto | For Lines: "under {Brand}". For Variations: "under {Line} · {Brand}". For Brands: "—" |
| Type | 80px | Badge: `Brand` / `Product Line` / `Variation` |
| Suggested By | 160px | User's display name + email (tooltip on hover) |
| Date | 110px | Relative date: "2 days ago" (title tooltip: full date) |
| Actions | 180px | Approve / Reject buttons |

**Table component:**
```
┌──────────────────────────────────────────────────────────────────────┐
│  Name          Context         Type       Suggested By   Date   Actn │
├──────────────────────────────────────────────────────────────────────┤
│  Oatly         —               [Brand]    Jane Doe       2d ago  [✓][✗]│
│  Oat Milk      under Oatly     [Line]     John Smith     3d ago  [✓][✗]│
│  Barista (1L)  under Oat Milk  [Variation]Jane Doe      4d ago  [✓][✗]│
└──────────────────────────────────────────────────────────────────────┘
```

- `<table className="w-full text-sm">` with `<thead>` and `<tbody>`
- Header: `text-xs text-muted-foreground uppercase tracking-wide border-b border-border`
- Row: `border-b border-border hover:bg-muted/40 transition-colors`
- Type badges:
  - Brand: `<Badge className="bg-blue-100 text-blue-700">Brand</Badge>`
  - Product Line: `<Badge className="bg-purple-100 text-purple-700">Product Line</Badge>`
  - Variation: `<Badge className="bg-orange-100 text-orange-700">Variation</Badge>`

### 4.4 Submission List — Mobile

Card-style stacked list on `< 768px` (table collapses to cards):

```
┌─────────────────────────────────────┐
│  Oatly                  [Brand]     │  ← name + type badge
│  Suggested by Jane Doe  · 2 days ago│  ← user + date, text-xs muted
│                                     │
│  [✓ Approve]          [✗ Reject]   │  ← action buttons, full row
└─────────────────────────────────────┘
```

- `<Card className="p-4">` per submission
- Approve: `<Button size="sm" variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">`
- Reject: `<Button size="sm" variant="outline" className="border-red-400 text-red-600 hover:bg-red-50">`

### 4.5 Approve Action

Clicking "Approve" on a row:

1. Button enters loading state (spinner, disabled — both action buttons on that row disabled)
2. `POST /api/admin/submissions/{id}/approve`
3. On success:
   - Row fades out and is removed from the list (animated: `opacity-0 transition-opacity duration-300` then `height-0`)
   - Pending count decrements
   - Toast: "{Name} has been approved and is now live." (green)
4. On error:
   - Buttons re-enable
   - Inline row error: `text-xs text-red-500` "Failed to approve. Try again."

No confirmation dialog for Approve — it's reversible (admin can always remove content via future admin tools).

### 4.6 Reject Action

Clicking "Reject" opens an inline rejection panel **within the row** (not a modal):

**Desktop — inline expand below row:**
```
┌──────────────────────────────────────────────────────────────────────┐
│  Oatly         —               [Brand]    Jane Doe       2d ago  [✓][✗]│
├──────────────────────────────────────────────────────────────────────┤
│  Rejection reason (optional)                                         │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │ This brand already exists under a different name...          │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                [Cancel]  [Confirm Rejection]         │
└──────────────────────────────────────────────────────────────────────┘
```

**Mobile — expands within the card:**
```
┌─────────────────────────────────────┐
│  Oatly                  [Brand]     │
│  Suggested by Jane Doe  · 2 days ago│
│                                     │
│  Rejection reason (optional)        │
│  [                                 ]│
│  [Confirm Rejection]   [Cancel]     │
└─────────────────────────────────────┘
```

**Rejection panel spec:**
- `<Textarea placeholder="Optional reason for rejection..." rows={2}>` — max 300 chars
- `<Button variant="destructive" size="sm">Confirm Rejection</Button>`
- `<Button variant="ghost" size="sm">Cancel</Button>` — collapses panel back to normal row
- On submit:
  1. Button: spinner + "Rejecting...", disabled
  2. `POST /api/admin/submissions/{id}/reject` with `{ reason?: string }`
  3. On success: row fades out + removed; toast: "{Name} has been rejected." (neutral/gray)
  4. On error: `text-xs text-red-500` within panel "Failed to reject. Try again."

Reason is stored but not currently shown to the user who submitted — future enhancement.

### 4.7 Pagination

- shadcn `<Pagination>` component
- 25 submissions per page
- URL param: `?page=2`
- Shows: Previous / page numbers (max 5) / Next
- Current page highlighted

### 4.8 Empty State

When no pending submissions match the current filter:

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   [CheckCircle icon, 48px, text-green-500]         │
│                                                    │
│   No pending submissions                           │  ← text-lg font-semibold
│   All caught up! There's nothing to review         │
│   right now.                                       │  ← text-sm muted
│                                                    │
└────────────────────────────────────────────────────┘
```

- Centered, `py-16`
- If filtered (e.g., "Brands" tab is empty but others have items): "No pending Brand submissions."

---

## 5. Component States

### Loading — Initial Page

Server-rendered. During client navigation (tab/page change): show skeleton rows.

**Skeleton row (desktop):**
```
│  ████████████   ███████   [████]   ██████████   █████   [ ][ ] │
```
- 8 skeleton rows
- `<Skeleton className="h-4 w-full">` per cell area
- `animate-pulse`

**Skeleton card (mobile):**
```
┌─────────────────────────────────────┐
│  ████████████████        [████]     │
│  ████████████████████████           │
│                                     │
│  [████████████]  [████████████]     │
└─────────────────────────────────────┘
```

### Row — Action In Progress

- Both Approve and Reject buttons on the row disabled (`opacity-50 pointer-events-none`)
- Active button shows spinner
- Other rows remain fully interactive

### Error State — Page Load Failure

```
┌────────────────────────────────────────────────────┐
│  Could not load submissions.                       │
│  Please try refreshing the page.     [Refresh]     │
└────────────────────────────────────────────────────┘
```

- `ErrorBanner` below the tabs

---

## 6. Expandable Detail Panel (Desktop)

On desktop, each submission row has an expand toggle (chevron or click on name):

```
┌──────────────────────────────────────────────────────────────────────┐
│  ▶ Oatly    —    [Brand]    Jane Doe    2d ago    [✓ Approve][✗ Reject]│
└──────────────────────────────────────────────────────────────────────┘
```

Clicking the row (not the buttons) toggles a detail panel:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ▼ Oatly    —    [Brand]    Jane Doe    2d ago    [✓ Approve][✗ Reject]│
├──────────────────────────────────────────────────────────────────────┤
│  Description:  Oatly is a Swedish food company...                    │
│  Logo URL:     https://oatly.com/logo.png                            │
│  Submitted:    Feb 18, 2026 at 3:42 PM                               │
│  User email:   jane@gmail.com                                        │
└──────────────────────────────────────────────────────────────────────┘
```

- Animated expand: `max-h-0` → `max-h-40` transition on open
- `bg-muted/30 p-4 text-sm`
- Shows all fields the user submitted (description, URL, tags for variations)
- For Lines: shows parent brand name + link
- For Variations: shows parent line + brand names + links + any tags submitted

On mobile, card always shows description truncated to 2 lines (no expand toggle — full detail shown in card).

---

## 7. URL State

All filter/pagination state in URL params for bookmarkability:

| Param | Values | Default |
|-------|--------|---------|
| `?type=` | `all` \| `brand` \| `line` \| `variation` | `all` |
| `?page=` | integer ≥ 1 | `1` |

---

## 8. SEO / Meta

```tsx
export const metadata = {
  title: 'Submissions | ReviewWorld Admin',
  robots: { index: false, follow: false },
}
```

---

## 9. shadcn/ui Components Used

- `Tabs`, `TabsList`, `TabsTrigger` — type filter
- `Badge` — type labels (Brand/Line/Variation), pending count
- `Button` — Approve, Reject, Confirm Rejection, Cancel
- `Textarea` — rejection reason
- `Skeleton` — loading rows/cards
- `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`
- `Toast` / `useToast` — approve/reject feedback
- `Card` — mobile submission cards

Custom:
- `SubmissionRow` — desktop table row with inline reject panel (`'use client'`)
- `SubmissionCard` — mobile card variant (`'use client'`)
- `ErrorBanner` — reuse

---

## 10. Implementation Notes for FS

- Page: `app/admin/submissions/page.tsx` — Server Component
- Auth: `const session = await getServerSession(); if (!session) redirect('/api/auth/signin?...')`
- Role check: `if (session.user.role !== 'ADMIN') return <AccessDenied />`
- Read `searchParams.type` and `searchParams.page` on the server
- Query: fetch `Suggestion` records where `status = 'PENDING'`, filtered by type if specified
  - Include: `submittedBy { name, email }`, related `brand` / `line` for context
- Pagination: 25 per page, offset-based
- Pending count badge: separate count query (or included in initial fetch)
- `SubmissionRow` and `SubmissionCard` are client components (handle expand/collapse + action button state)
- Approve API: `POST /api/admin/submissions/[id]/approve`
  - Creates the actual Brand/ProductLine/Variation record from suggestion data
  - Sets `suggestion.status = 'APPROVED'`
  - Returns 200; row removed client-side
- Reject API: `POST /api/admin/submissions/[id]/reject` with `{ reason?: string }`
  - Sets `suggestion.status = 'REJECTED'`, stores `suggestion.rejectionReason`
  - Returns 200; row removed client-side
- Both APIs: ADMIN role check server-side (do not rely solely on page-level check)
- After approve/reject: revalidate page data via `router.refresh()` OR optimistic UI (remove row from local state immediately)
- Prefer optimistic removal for snappier UX — if API call fails, re-add the row and show error

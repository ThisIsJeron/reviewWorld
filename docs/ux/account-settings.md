# UX Spec: Account Settings Page (`/account`)

> Ticket: #16 — UX+FS: Account settings page (/account)
> Status: UX Complete
> File: `docs/ux/account-settings.md`

---

## 1. Page Purpose

Private settings page for authenticated users to manage their profile display name and account lifecycle (sign out, delete account). Minimal surface — only what's actionable given Google OAuth constraints.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  Home > Account         │  ← Breadcrumb
├─────────────────────────┤
│  Account Settings       │  ← h1
├─────────────────────────┤
│  Profile                │  ← section heading
│  ─────────────────────  │
│  [Avatar 72×72]         │  ← read-only, from Google
│  Photo from Google      │  ← caption, text-xs muted
│                         │
│  Display Name           │
│  [____________________] │  ← Input, editable
│                         │
│  Email                  │
│  jane@gmail.com         │  ← text-sm, read-only, muted
│  (Managed by Google)    │  ← caption
│                         │
│  [Save Changes]         │
├─────────────────────────┤
│  Account Actions        │  ← section heading
│  ─────────────────────  │
│  [Sign Out]             │
│  [Delete Account]       │  ← danger button
└─────────────────────────┘
```

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search ...]                    [avatar ▾]  │
├─────────────────────────────────────────────────────────────────┤
│  Home > Account                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Account Settings                                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Profile                                                 │  │
│  │  ─────────────────────────────────────────────────────  │  │
│  │                                                          │  │
│  │  [Avatar 80×80]    Photo synced from Google              │  │
│  │                                                          │  │
│  │  Display Name                                            │  │
│  │  ┌──────────────────────────────────────────┐           │  │
│  │  │  Jane Doe                                │           │  │
│  │  └──────────────────────────────────────────┘           │  │
│  │                                                          │  │
│  │  Email (read-only)                                       │  │
│  │  jane@gmail.com · Managed by Google                      │  │
│  │                                                          │  │
│  │                              [Save Changes]              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Account Actions                                         │  │
│  │  ─────────────────────────────────────────────────────  │  │
│  │  [Sign Out]                                              │  │
│  │                                                          │  │
│  │  Danger Zone                                             │  │
│  │  ─────────────────────────────────────────────────────  │  │
│  │  Permanently delete your account and all your reviews.   │  │
│  │  [Delete Account]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Auth Guard

- Page checks session server-side
- If unauthenticated: `redirect('/api/auth/signin?callbackUrl=/account')`

### 3.2 Breadcrumb

```
Home > Account
```

- "Home" → `/`
- "Account" is current page

### 3.3 Profile Section

Contained in a `<Card className="p-6">`.

**Avatar:**
- `<Image src={session.user.image} width={80} height={80} className="rounded-full ring-2 ring-border">`
- Caption: "Photo synced from Google" — `text-xs text-muted-foreground mt-1`
- Read-only — no upload button (Google OAuth manages the avatar)

**Display Name Field:**
- `<Label htmlFor="name">Display Name</Label>`
- `<Input id="name" defaultValue={session.user.name} maxLength={60}>`
- Editable
- Character limit: 60 chars (enforced via `maxLength` + server validation)
- Help text below: "This is how your name appears on your reviews." — `text-xs text-muted-foreground`

**Email Field:**
- `<Label>Email</Label>`
- `<p className="text-sm text-muted-foreground">{session.user.email}</p>`
- Caption: "Managed by Google · Can't be changed here" — `text-xs text-muted-foreground`
- NOT an input element — purely display

**Save Changes Button:**
- `<Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>`
- Right-aligned on desktop, full-width on mobile
- Loading state: spinner + "Saving..." text, disabled during request
- Success: toast "Settings saved" (green)
- Error: toast "Failed to save. Please try again." (red) + button re-enables

### 3.4 Account Actions Section

Contained in a second `<Card className="p-6">`.

**Sign Out:**
- `<Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</Button>`
- Calls NextAuth `signOut()` which clears session cookie and redirects to `/`
- No confirmation needed (reversible — user can sign back in)

**Danger Zone:**
- Subsection with heading "Danger Zone" in `text-red-600 font-semibold text-sm`
- Separator line: `<Separator className="bg-red-200">`
- Description text: "Permanently delete your account and all reviews you've written. This cannot be undone."
  - `text-sm text-muted-foreground`
- Button: `<Button variant="destructive">Delete Account</Button>`
  - Opens `DeleteAccountDialog` on click

### 3.5 DeleteAccountDialog

```
┌──────────────────────────────────────────────┐
│  Delete your account?                    [×] │
│                                              │
│  This action is permanent and cannot be      │
│  undone. The following will be deleted:      │
│                                              │
│   • Your account and profile                 │
│   • All 42 reviews you've written            │
│   • All reports you've filed                 │
│                                              │
│  Type "DELETE" to confirm:                   │
│  [____________________________________]      │
│                                              │
│          [Cancel]  [Delete my account]       │
└──────────────────────────────────────────────┘
```

- shadcn `<Dialog>`
- Review count shown dynamically (fetched when page loads)
- Confirmation input: user must type "DELETE" (case-insensitive) to enable the final button
- "Delete my account" button: `variant="destructive"`, disabled until input matches
- On confirm:
  1. Button → "Deleting..." + spinner, disabled
  2. `DELETE /api/user` (cascades: reviews, reports)
  3. On success: `signOut({ callbackUrl: '/?deleted=1' })` — home page can optionally show a toast from query param
  4. On error: Dialog closes, `ErrorBanner` on page: "Could not delete account. Please try again."

---

## 4. Component States

### Loading — Page Data

Page is SSR with session data — no significant loading state. The name and email are available immediately from the session.

### Save — In Progress

- "Save Changes" button: disabled, shows `<Loader2 className="animate-spin mr-2">` + "Saving..."
- Input field: `pointer-events-none opacity-60`

### Save — Success

- Toast: "Settings saved" — `variant="default"` (green-tinted)
- Input returns to normal
- `session.user.name` is updated (may require session refresh)

### Save — Error

- Toast: "Failed to save settings. Please try again."
- Button re-enables, input editable

### Delete — In Progress (inside Dialog)

- "Delete my account" button: spinner + "Deleting...", disabled
- Cancel button also disabled
- Confirmation input disabled

### Delete — Error

- Dialog closes
- `ErrorBanner` appears on page below the Account Actions card
- "Could not delete your account. Please contact support."

---

## 5. Form Validation

| Field | Rule |
|-------|------|
| Display Name | Required, 1–60 chars, trimmed |

Server returns 400 with `{ field: 'name', message: 'Name is required' }` if invalid; display inline below input.

---

## 6. Responsive Breakpoints

| Element | Mobile (<640) | Desktop (≥640) |
|---------|--------------|----------------|
| Avatar | 72×72, left-aligned | 80×80, left-aligned |
| Save button | Full width | Right-aligned |
| Cards | Full width, no padding margin | max-w-2xl centered |
| Delete dialog | Full screen bottom sheet (Sheet) | Centered dialog |

Note: On mobile, consider replacing the `<Dialog>` with a `<Sheet>` (bottom drawer) for the delete confirmation — more ergonomic for destructive actions.

---

## 7. SEO / Meta

```tsx
export const metadata = {
  title: 'Account Settings | ReviewWorld',
  robots: { index: false }, // private page — don't index
}
```

---

## 8. shadcn/ui Components Used

- `Card` — profile section + actions section
- `Input` — display name field
- `Label` — form labels
- `Button` — save, sign out, delete
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogDescription` — delete confirmation
- `Separator` — danger zone divider
- `Toast` / `useToast` — save success/error feedback
- `Sheet` — optional mobile bottom drawer for delete confirm

---

## 9. Implementation Notes for FS

- Page: `app/account/page.tsx` — Server Component, auth-guarded
- Session: `const session = await getServerSession(); if (!session) redirect(...)`
- `AccountForm` sub-component: `'use client'` — handles name input, save button state
- `DeleteAccountDialog`: `'use client'`, lazy-imported (`dynamic(() => import(...), { ssr: false })`)
- `PUT /api/user`: update `user.name` in DB + update NextAuth session via `update()` callback
- `DELETE /api/user`: cascade delete via Prisma `onDelete: Cascade` on Review and Report models
- After delete + signOut: client lands on `/?deleted=1` — home page reads this param to show a "Your account has been deleted" toast (optional enhancement)
- Type "DELETE" confirmation: simple `value === 'DELETE'` check, case-insensitive (`value.toUpperCase() === 'DELETE'`)

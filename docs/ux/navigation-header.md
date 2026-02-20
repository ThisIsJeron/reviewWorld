# UX Spec: Navigation / Header Component

> Ticket: #17 — UX+FS: Navigation / header component
> Status: UX Complete
> File: `docs/ux/navigation-header.md`

---

## 1. Component Purpose

Persistent, site-wide header rendered on every page. Controls global search and auth state. Must not cause layout shift. Single source of truth for primary navigation.

---

## 2. Layout Variants

### Desktop Header (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld    [🔍 Search products or brands...      ]  [auth] │
│                                                                 │
│  Home · Brands · Trending                                       │
└─────────────────────────────────────────────────────────────────┘
```

- Two rows: top bar (logo + search + auth) + nav link bar
- Top bar: `flex items-center gap-4 px-6 py-3 border-b border-border`
- Nav bar: `flex gap-6 px-6 py-2 text-sm border-b border-border bg-muted/30`
- Full sticky header: `sticky top-0 z-50 bg-background/95 backdrop-blur-sm`

### Tablet Header (640–1023px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld    [🔍 Search...           ]               [auth]  │
│  Home · Brands · Trending                                       │
└─────────────────────────────────────────────────────────────────┘
```

Same two-row structure; search bar is shorter.

### Mobile Header (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld       [auth] [≡]│  ← top row: logo + auth avatar + hamburger
│  [🔍 Search products...] │  ← second row: full-width search bar
└─────────────────────────┘
```

- No nav link bar on mobile (collapsed into Sheet)
- Search always visible (not collapsed behind icon)
- `py-2 px-4`

---

## 3. Logo

- Text "ReviewWorld" in `font-bold text-xl text-orange-500`
- `<Link href="/" aria-label="ReviewWorld home">`
- No separate image logo in MVP (text-only wordmark)
- Hover: `hover:text-orange-600`

---

## 4. Search Bar (Header Variant)

Uses the shared `SearchBar` component in "header" variant (see home-page.md §3.2 for full spec).

**Header-specific:**
- Width: `flex-1 max-w-[480px]` (desktop), `flex-1` (tablet), `w-full` (mobile, own row)
- Height: `h-10`
- Shape: `rounded-lg`
- Background: `bg-muted`
- Placeholder: "Search products or brands..."

**Behavior:**
- Debounced live search dropdown (see home-page.md §3.2 for dropdown spec)
- On submit (Enter): navigate to home page with `?q={query}` param, which triggers the home page to show filtered results (MVP approach — no separate `/search` page)
- On mobile: tapping the search bar does not navigate away; dropdown appears in place

---

## 5. Auth State

### Unauthenticated

```
[Sign In]
```

- `<Button variant="default" size="sm" onClick={() => signIn('google')}>`
- `bg-orange-500 hover:bg-orange-600 text-white`

### Authenticated

```
[Avatar ▾]
```

- `<Avatar>` (shadcn) — circular, 36×36px — user's Google profile photo
- Fallback: initials circle with muted background
- Clicking opens a `<DropdownMenu>`:

```
┌──────────────────────────────┐
│  Jane Doe                    │  ← user name (non-clickable header)
│  jane@gmail.com              │  ← email, text-xs muted
│  ──────────────────────────  │
│  My Reviews (Profile)        │  → /profile/[userId]
│  Account Settings            │  → /account
│  ──────────────────────────  │
│  Sign Out                    │  → signOut()
└──────────────────────────────┘
```

- "My Reviews": icon `User` + label
- "Account Settings": icon `Settings` + label
- "Sign Out": icon `LogOut` + label, `text-red-500 hover:text-red-600`
- `<DropdownMenuSeparator>` between sections

### Auth Loading State

While the session is being resolved client-side:
- Show a `<Skeleton className="w-20 h-9 rounded-md">` in place of the auth button/avatar
- Prevents layout shift (same width as "Sign In" button approximately)

---

## 6. Mobile Navigation (Sheet)

Hamburger button `[≡]` opens a `<Sheet side="right">` drawer.

```
┌────────────────────────────────┐
│  ReviewWorld               [×] │
│  ─────────────────────────── │
│  Home                          │  → /
│  Brands                        │  → /brands
│  Trending                      │  → / (with scroll to trending)
│  ─────────────────────────── │
│  [If authenticated:]           │
│  My Reviews                    │  → /profile/[userId]
│  Account Settings              │  → /account
│  ─────────────────────────── │
│  [If authenticated:]           │
│  Sign Out                      │
│  [If not:]                     │
│  Sign In with Google           │
└────────────────────────────────┘
```

- Sheet width: full on xs, 320px on sm+
- Close on navigation (Sheet auto-closes on link click via `onOpenChange`)
- Close on Escape key
- Body scroll lock when Sheet is open
- Hamburger icon: `<Menu>` from lucide-react
- Close icon: `<X>` from lucide-react

---

## 7. Desktop Nav Links

```
Home · Brands · Trending
```

- `<nav aria-label="Main navigation">`
- Links: `text-sm font-medium text-muted-foreground hover:text-foreground transition-colors`
- Active link (current route): `text-foreground font-semibold` — detected via `usePathname()`
- "Trending" links to `/#trending` (home page, scroll to trending section) — future can be a `/trending` page

---

## 8. Skip Navigation Link

For keyboard and screen reader users:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
>
  Skip to content
</a>
```

- Placed as the very first element inside `<body>` (or at top of `AppHeader`)
- Visible only on focus (keyboard Tab)

---

## 9. Component States

### Loading — Auth

- Skeleton pill `w-20 h-9` in auth slot
- Avoids content-layout-shift when session resolves

### Scrolled State

- Header background: `bg-background/95 backdrop-blur-sm` (semi-transparent with blur when scrolled)
- Subtle `shadow-sm` appears after scrolling 10px
- Implemented via CSS `sticky` — no JS scroll listener needed for basic behavior

### Search — Active / Focused

- Input: `ring-2 ring-orange-500` (focus ring)
- Dropdown appears below input
- Click outside closes dropdown

### Search — Loading Results

- Small spinner inside the dropdown while debounced fetch is in-flight
- 300ms debounce before fetch fires

---

## 10. Keyboard Accessibility

| Key | Behavior |
|-----|---------|
| Tab | Move through header elements in order: skip link → logo → search → auth button/avatar → nav links |
| Enter (on Sign In) | Trigger Google OAuth |
| Enter (on Avatar) | Open dropdown |
| Arrow Down (in dropdown) | Move to next item |
| Arrow Up (in dropdown) | Move to previous item |
| Escape (in dropdown) | Close dropdown, return focus to avatar |
| Escape (Sheet open) | Close Sheet |

---

## 11. shadcn/ui Components Used

- `Avatar`, `AvatarImage`, `AvatarFallback` — user avatar
- `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuTrigger` — auth dropdown
- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` — mobile nav drawer
- `Button` — Sign In button, hamburger button
- `Skeleton` — auth loading state
- `Input` — search bar base (via SearchBar component)

---

## 12. Implementation Notes for FS

- Component: `components/layout/AppHeader.tsx`
- Split into Server + Client parts:
  - `AppHeader` (Server Component): renders logo, nav links, passes `session` prop to client parts
  - `AuthButton` (Client Component, `'use client'`): handles sign in/out, dropdown — receives `session` as prop
  - `SearchBar` (Client Component, `'use client'`): handles debounced search state
  - `MobileNav` (Client Component, `'use client'`): handles Sheet open/close state
- Session: use `getServerSession()` in the Server Component; pass to `AuthButton` as prop — avoids waterfall
- Active nav link detection: `usePathname()` in a thin `'use client'` `NavLinks` component
- Skip link: placed above the header in `app/layout.tsx`
- Backdrop blur requires `bg-background/95` (Tailwind opacity modifier) + `backdrop-blur-sm`
- Hamburger button: `aria-label="Open navigation menu"`, `aria-expanded={isOpen}`
- Sheet: `aria-label="Navigation menu"`
- Search dropdown: use `role="listbox"` with `role="option"` items; manage `aria-activedescendant`

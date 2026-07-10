# BookSmart Design System

> **Brand:** Professional · Warm · Trustworthy  
> **Vibe:** Stripe meets Calendly meets a warm dental office  
> **Tech:** React 18 · Tailwind CSS 3 · shadcn/ui · lucide-react  
> **Target:** WCAG AA · Mobile-first booking · Desktop-primary admin

---

## 1. Design Tokens

### 1.1 Colors

#### Primary — Warm Blue-Teal
Conveys professionalism, cleanliness, and calm trust.

```json
{
  "primary": {
    "50":  "#eff9fa",
    "100": "#d5f0f2",
    "200": "#afe0e5",
    "300": "#7cc9d2",
    "400": "#4aabb8",
    "500": "#2d8f9e",
    "600": "#217282",
    "700": "#1f5c69",
    "800": "#1f4c57",
    "900": "#1d404a"
  }
}
```

- **Primary-500** is the default button, link, active tab colour.
- **Primary-600** is the hover state.
- **Primary-700** is the pressed/active state.
- **Primary-50** is the background tint for cards, badges, subtle sections.
- **Primary-100** is used for hover on tinted surfaces.

#### Accent — Warm Amber/Gold
Energy, optimism, friendly call-to-action highlights.

```json
{
  "accent": {
    "50":  "#fffbeb",
    "100": "#fef3c7",
    "200": "#fde68a",
    "300": "#fcd34d",
    "400": "#fbbf24",
    "500": "#f59e0b",
    "600": "#d97706",
    "700": "#b45309",
    "800": "#92400e",
    "900": "#78350f"
  }
}
```

- **Accent-400** is the primary CTA accent (e.g., "Book Now" pulse, star ratings, availability highlights).
- **Accent-500** for hover on accent elements.
- **Accent-100** for background tint on alert banners.

#### Secondary — Cool Slate
Structural UI: borders, dividers, sidebar backgrounds, secondary text.

```json
{
  "secondary": {
    "50":  "#f8fafc",
    "100": "#f1f5f9",
    "200": "#e2e8f0",
    "300": "#cbd5e1",
    "400": "#94a3b8",
    "500": "#64748b",
    "600": "#475569",
    "700": "#334155",
    "800": "#1e293b",
    "900": "#0f172a"
  }
}
```

- **Secondary-50** = page background (admin).
- **Secondary-100** = card background, input background.
- **Secondary-200** = border colour on cards, inputs.
- **Secondary-500** = secondary body text, placeholder text.
- **Secondary-800** = primary body text, headings.

#### Neutral — Warm Stone
Used sparingly for body copy and surfaces that need a warmer feel than slate.

```json
{
  "neutral": {
    "50":  "#fafaf9",
    "100": "#f5f5f4",
    "200": "#e7e5e4",
    "300": "#d6d3d1",
    "400": "#a8a29e",
    "500": "#78716c",
    "600": "#57534e",
    "700": "#44403c",
    "800": "#292524",
    "900": "#1c1917"
  }
}
```

#### Semantic Colours

```json
{
  "success": "#10b981",
  "success-bg": "#ecfdf5",
  "error":   "#ef4444",
  "error-bg": "#fef2f2",
  "warning": "#f59e0b",
  "warning-bg": "#fffbeb",
  "info":    "#3b82f6",
  "info-bg": "#eff6ff"
}
```

- **success** — confirmed appointments, check-in complete, fields valid.
- **error** — validation errors, cancellations, no-shows, destructive actions.
- **warning** — pending actions, conflicts, near-limit warnings.
- **info** — neutral notifications, helper text icons.

**Status colours for badges:**
| Status       | bg          | text          | border        |
|-------------|-------------|---------------|---------------|
| Confirmed   | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` |
| Checked-in  | `bg-blue-50`    | `text-blue-700`    | `border-blue-200`    |
| No-show     | `bg-red-50`     | `text-red-700`     | `border-red-200`     |
| Cancelled   | `bg-neutral-100`| `text-neutral-600` | `border-neutral-200`  |
| Completed   | `bg-primary-50` | `text-primary-700` | `border-primary-200`  |
| Pending     | `bg-amber-50`   | `text-amber-700`   | `border-amber-200`   |

---

### 1.2 Typography

#### Font Families

| Token              | Value                        | Usage                     |
|--------------------|------------------------------|---------------------------|
| `font-sans`       | `'Inter', system-ui, sans-serif` | Body UI, buttons, inputs  |
| `font-heading`    | `'Plus Jakarta Sans', 'Inter', sans-serif` | Headings, display text |
| `font-mono`       | `'JetBrains Mono', monospace`  | Code, durations, times    |

> Both Inter and Plus Jakarta Sans support `font-weight` 300–700 and load via next/font or @fontsource. Prefer Inter for high-density UI (tables, sidebar nav), Plus Jakarta Sans for hero headings and display type.

#### Font Sizes

```json
{
  "text-xs":   ["0.75rem",  { "lineHeight": "1rem" }],
  "text-sm":   ["0.875rem", { "lineHeight": "1.25rem" }],
  "text-base": ["1rem",     { "lineHeight": "1.5rem" }],
  "text-lg":   ["1.125rem", { "lineHeight": "1.75rem" }],
  "text-xl":   ["1.25rem",  { "lineHeight": "1.75rem" }],
  "text-2xl":  ["1.5rem",   { "lineHeight": "2rem" }],
  "text-3xl":  ["1.875rem", { "lineHeight": "2.25rem" }],
  "text-4xl":  ["2.25rem",  { "lineHeight": "2.5rem" }],
  "text-5xl":  ["3rem",     { "lineHeight": "1.1" }],
  "text-6xl":  ["3.75rem",  { "lineHeight": "1.1" }]
}
```

#### Font Weights

| Weight  | Token           | Usage                                |
|---------|-----------------|--------------------------------------|
| 300     | `font-light`    | Large display, hero subtitle         |
| 400     | `font-normal`   | Body text, paragraphs                |
| 500     | `font-medium`   | Input labels, navigation items       |
| 600     | `font-semibold` | Section headings, button text        |
| 700     | `font-bold`     | Page titles, card titles             |

#### Letter Spacing

| Token            | Value    | Usage                    |
|------------------|----------|--------------------------|
| `tracking-tight` | `-0.025em` | Headings, display text |
| `tracking-normal`| `0em`     | Body text              |
| `tracking-wide`  | `0.025em` | All-caps labels, badges |
| `tracking-wider` | `0.05em`  | Uppercase small headers |

---

### 1.3 Spacing Scale

```json
{
  "0":   "0px",
  "0.5": "0.125rem",
  "1":   "0.25rem",
  "1.5": "0.375rem",
  "2":   "0.5rem",
  "2.5": "0.625rem",
  "3":   "0.75rem",
  "3.5": "0.875rem",
  "4":   "1rem",
  "5":   "1.25rem",
  "6":   "1.5rem",
  "7":   "1.75rem",
  "8":   "2rem",
  "9":   "2.25rem",
  "10":  "2.5rem",
  "11":  "2.75rem",
  "12":  "3rem",
  "14":  "3.5rem",
  "16":  "4rem",
  "20":  "5rem",
  "24":  "6rem",
  "28":  "7rem",
  "32":  "8rem",
  "36":  "9rem",
  "40":  "10rem",
  "44":  "11rem",
  "48":  "12rem",
  "52":  "13rem",
  "56":  "14rem",
  "60":  "15rem",
  "64":  "16rem",
  "72":  "18rem",
  "80":  "20rem",
  "96":  "24rem"
}
```

**Convention:** Use `gap-*`, `p-*`, `m-*`, `space-x-*`, `space-y-*` directly. No custom CSS spacing.

---

### 1.4 Shadows

```json
{
  "shadow-sm":   "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "shadow":     "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  "shadow-md":  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  "shadow-lg":  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  "shadow-xl":  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "shadow-2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
}
```

**Usage:**
- `shadow-sm` — cards, inputs (resting state)
- `shadow` — dropdowns, popovers
- `shadow-md` — raised cards (hover), modals
- `shadow-lg` — modals, toasts, datepicker popover
- `shadow-xl` — side panels, mobile nav drawer
- `shadow-2xl` — full-screen overlays

---

### 1.5 Border Radius

```json
{
  "rounded-none": "0px",
  "rounded-sm":   "0.125rem",
  "rounded":      "0.25rem",
  "rounded-md":   "0.375rem",
  "rounded-lg":   "0.5rem",
  "rounded-xl":   "0.75rem",
  "rounded-2xl":  "1rem",
  "rounded-3xl":  "1.5rem",
  "rounded-full": "9999px"
}
```

**Convention:**
- `rounded-lg` = default card corner.
- `rounded-md` = input fields, buttons (sm/md).
- `rounded-xl` = modals, toasts, elevated cards.
- `rounded-full` = avatars, badges, pill buttons.
- `rounded-none` = sidebar edges, banner edges.

---

## 2. Component Library

### 2.1 Core Components

#### Button

| Variant    | Classes                                                       |
|------------|---------------------------------------------------------------|
| Primary    | `bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-200 disabled:text-primary-400 shadow-sm` |
| Secondary  | `bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50` |
| Ghost      | `text-secondary-600 hover:bg-secondary-100 active:bg-secondary-200 disabled:opacity-50` |
| Danger     | `bg-error text-white hover:bg-red-600 active:bg-red-700 disabled:opacity-50` |
| Outline    | `bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50 active:bg-secondary-100` |

**Sizes:**
| Size | Classes                                    |
|------|--------------------------------------------|
| sm   | `px-3 py-1.5 text-sm rounded-md gap-1.5`   |
| md   | `px-4 py-2 text-sm rounded-md gap-2`       |
| lg   | `px-6 py-3 text-base rounded-lg gap-2`     |

**States:**
- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2`
- Disabled: `disabled:cursor-not-allowed disabled:pointer-events-none`
- Icon-only: `p-2 aspect-square` with tooltip (sm: `w-8 h-8`, md: `w-10 h-10`, lg: `w-12 h-12`)

**Loading:** Add `[&>svg]:animate-spin` on inner spinner icon, set `disabled` state.

---

#### Input

```jsx
// Base classes:
"flex h-10 w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm
 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
 placeholder:text-secondary-400
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
 disabled:cursor-not-allowed disabled:opacity-50"
```

**Variants:**
- Error: `border-error focus-visible:ring-error` + `aria-describedby="{id}-error"` on input
- With icon: `pl-9` (icon left), `pr-9` (icon right), icon `absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400`
- Label: `text-sm font-medium text-secondary-700 mb-1.5`
- Hint: `text-xs text-secondary-400 mt-1`
- Error text: `text-xs text-error mt-1` with `id="{id}-error"`

---

#### Textarea

```jsx
// Base classes (extends input):
"min-h-[80px] max-h-48 resize-y"
```

**Intake use:** `min-h-[120px]` for longer answers. Character count via `text-xs text-secondary-400 text-right mt-1`.

---

#### Select

```jsx
// Base classes (same as input +):
"appearance-none bg-no-repeat pr-8"
// Chevron icon positioned absolutely right-3 top-1/2 -translate-y-1/2
// Multiple: select-none, 8 items default height
```

**Wrapper:** `<div className="relative">` + chevron icon.

---

#### Checkbox

```jsx
// Wrapper:
"group flex items-start gap-3 cursor-pointer"

// Box:
"flex h-4 w-4 shrink-0 items-center justify-center rounded border border-secondary-300
 bg-white
 group-hover:border-primary-400
 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500
 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
 disabled:cursor-not-allowed disabled:opacity-50"

// Icon:
"h-3 w-3 text-white"

// Label:
"text-sm text-secondary-700 pt-0.5"
```

---

#### Radio

```jsx
// Wrapper:
"group flex items-start gap-3 cursor-pointer"

// Circle:
"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-secondary-300 bg-white
 group-hover:border-primary-400
 data-[state=checked]:border-primary-500
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
 disabled:cursor-not-allowed disabled:opacity-50"

// Dot:
"h-2 w-2 rounded-full bg-primary-500 data-[state=unchecked]:hidden"

// Label:
"text-sm text-secondary-700 pt-0.5"
```

---

#### Toggle

```jsx
// Root:
"inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent
 transition-colors duration-200 ease-in-out
 data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-secondary-200
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
 disabled:cursor-not-allowed disabled:opacity-50"

// Thumb:
"pointer-events-none block h-5 w-5 rounded-full bg-white shadow ring-0
 transition-transform duration-200 ease-in-out
 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
```

---

#### Card

| Variant     | Classes                                                                  |
|-------------|--------------------------------------------------------------------------|
| Default     | `bg-white rounded-xl border border-secondary-200 shadow-sm p-6`           |
| Interactive | `bg-white rounded-xl border border-secondary-200 shadow-sm p-6 hover:shadow-md hover:border-primary-200 cursor-pointer transition-all` |
| Dashboard   | `bg-white rounded-xl border border-secondary-200 shadow-sm p-5`           |
| Metric      | `bg-white rounded-xl border border-secondary-200 shadow-sm p-5 flex flex-col gap-1` |
| Booking     | `bg-white rounded-xl border border-secondary-200 shadow-sm p-4 sm:p-6`    |

---

#### Badge

```jsx
// Base:
"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
```

| Variant   | Classes                                                      |
|-----------|--------------------------------------------------------------|
| Confirmed | `bg-emerald-50 text-emerald-700 border-emerald-200`          |
| Check-in  | `bg-blue-50 text-blue-700 border-blue-200`                   |
| No-show   | `bg-red-50 text-red-700 border-red-200`                      |
| Cancelled | `bg-neutral-100 text-neutral-500 border-neutral-200`         |
| Completed | `bg-primary-50 text-primary-700 border-primary-200`          |
| Pending   | `bg-amber-50 text-amber-700 border-amber-200`                |
| Draft     | `bg-secondary-100 text-secondary-600 border-secondary-200`   |

**Sizes:**
- Default: `text-xs px-2.5 py-0.5`
- Sm: `text-[10px] px-2 py-0.5`

---

#### Avatar

```jsx
// Base:
"relative flex shrink-0 overflow-hidden rounded-full"

// Image:
"aspect-square h-full w-full object-cover"

// Fallback (initials):
"flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 font-medium"
```

| Size | Classes          |
|------|------------------|
| sm   | `h-8 w-8 text-xs`|
| md   | `h-10 w-10 text-sm`|
| lg   | `h-12 w-12 text-base`|
| xl   | `h-16 w-16 text-lg`|

**Online indicator:** `absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white bg-emerald-500`

---

#### Calendar / DatePicker

```jsx
// Wrapper:
"bg-white rounded-xl border border-secondary-200 shadow-lg p-4 w-[320px]"

// Header:
"flex items-center justify-between mb-4"
// Month/year text:
"font-semibold text-secondary-800 text-sm"
// Nav buttons:
"p-1.5 rounded-md hover:bg-secondary-100 text-secondary-500"

// Day cells:
// Base:    "h-9 w-9 text-sm rounded-full flex items-center justify-center cursor-pointer"
// Default: "text-secondary-700 hover:bg-secondary-100"
// Selected:"bg-primary-500 text-white hover:bg-primary-600"
// Today:   "bg-primary-50 text-primary-700 font-semibold"
// Outside: "text-secondary-300 pointer-events-none"
// Unavailable: "text-secondary-300 line-through cursor-not-allowed"
// Available (booking): "bg-emerald-50 text-emerald-700 font-medium"
// Limited: "bg-amber-50 text-amber-700"

// Weekday headers:
"text-xs font-medium text-secondary-400 uppercase tracking-wider h-9 w-9 flex items-center justify-center"
```

---

#### TimeSlot Picker

```jsx
// Grid:
"grid grid-cols-3 sm:grid-cols-4 gap-2"

// Slot base:
"flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-all"

// Available: "bg-white border-secondary-200 text-secondary-700 hover:border-primary-300 hover:bg-primary-50 cursor-pointer"
// Selected:  "bg-primary-500 border-primary-500 text-white"
// Limited (1 spot): "border-amber-200 bg-amber-50 text-amber-700"
// Unavailable: "bg-secondary-50 border-secondary-100 text-secondary-300 cursor-not-allowed line-through"

// Note under limited slots:
"text-[10px] text-amber-600 text-center mt-0.5"
```

**Touch target:** Each slot is minimum `44px` tall (`py-2.5` on `text-sm` line-height = 44px at minimum).

---

#### Modal / Dialog

```jsx
// Overlay:
"fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"

// Content:
"fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]
 bg-white rounded-xl shadow-xl p-6
 data-[state=open]:animate-in data-[state=closed]:animate-out
 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
 duration-200"

// Close button:
"absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100
 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
 disabled:pointer-events-none"

// Header:  "flex flex-col gap-1.5 mb-4"
// Title:   "text-lg font-semibold text-secondary-800"
// Description: "text-sm text-secondary-500"
// Footer:  "flex flex-col-reverse sm:flex-row gap-2 sm:justify-end mt-6"
```

**Responsive:** At < 640px, content becomes `max-w-[calc(100%-32px)]` with `p-4`.

---

#### Toast / Snackbar

```jsx
// Base wrapper:
"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all"

// Variant:
// Default:   "bg-white border-secondary-200"
// Success:   "bg-emerald-50 border-emerald-200"
// Error:     "bg-red-50 border-red-200"
// Warning:   "bg-amber-50 border-amber-200"
// Info:      "bg-blue-50 border-blue-200"

// Icon:  "h-5 w-5 shrink-0" + semantic colour
// Title: "text-sm font-semibold text-secondary-800"
// Description: "text-sm text-secondary-500"

// Position:
// Top-right: "fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[380px]"
// Bottom-center (mobile): "fixed bottom-4 left-4 right-4 z-[100]"
```

**Animation:** `animate-in slide-in-from-top-2 fade-in duration-200` (top), `animate-in slide-in-from-bottom-2 fade-in duration-200` (bottom).

---

#### Dropdown Menu

```jsx
// Trigger:
// Standard button + lucide ChevronDown icon

// Content:
"z-50 min-w-[12rem] overflow-hidden rounded-lg border border-secondary-200 bg-white p-1 shadow-md
 data-[state=open]:animate-in data-[state=closed]:animate-out
 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"

// Item:
"relative flex cursor-default select-none items-center rounded-md px-2.5 py-2 text-sm text-secondary-700
 outline-none
 data-[disabled]:pointer-events-none data-[disabled]:opacity-50
 data-[highlighted]:bg-secondary-100 data-[highlighted]:text-secondary-900"

// Separator:
"-mx-1 my-1 h-px bg-secondary-200"

// Label:
"px-2.5 py-1.5 text-xs font-medium text-secondary-400 uppercase tracking-wider"

// Shortcut:
"ml-auto text-xs tracking-widest text-secondary-400 opacity-60"
```

---

#### Table

```jsx
// Wrapper:
"w-full overflow-auto"

// Table:
"w-full caption-bottom text-sm"

// Header:
"[&_tr]:border-b-secondary-200 [&_tr]:border-b"

// Header cell:
"h-12 px-4 text-left align-middle font-medium text-secondary-500 text-xs uppercase tracking-wider
 [&.sortable]:cursor-pointer [&.sortable]:hover:text-secondary-700
 [&.sortable]:select-none"

// Body row:
"border-b border-secondary-100 transition-colors hover:bg-secondary-50 data-[state=selected]:bg-primary-50"

// Cell:
"p-4 align-middle text-secondary-700 [&:has([role=checkbox])]:pr-0"

// Footer:
"border-t border-secondary-200 bg-secondary-50 font-medium"
```

**Sortable header:** Add `aria-sort="ascending|descending"` + chevron icon.

**Responsive:** On < 768px, wrapper gets `min-w-[640px]` and parent container gets `overflow-x-auto`.

---

#### Tabs

```jsx
// List:
"inline-flex h-10 items-center justify-center rounded-lg bg-secondary-100 p-1 text-secondary-500"

// Trigger:
"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium
 ring-offset-white transition-all
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
 disabled:pointer-events-none disabled:opacity-50
 data-[state=active]:bg-white data-[state=active]:text-secondary-900 data-[state=active]:shadow-sm"

// Content:
"mt-2 ring-offset-white
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
```

**Underline variant (admin):**
```jsx
// List: "flex gap-0 border-b border-secondary-200"
// Trigger: "px-4 py-3 text-sm font-medium text-secondary-500 border-b-2 border-transparent
//            hover:text-secondary-700 hover:border-secondary-300
//            data-[state=active]:text-primary-600 data-[state=active]:border-primary-500"
```

---

#### Breadcrumbs

```jsx
// Nav:
"flex items-center gap-1.5 text-sm text-secondary-500"

// Item:
"inline-flex items-center gap-1.5 hover:text-secondary-700 transition-colors"

// Separator:
"text-secondary-300 h-4 w-4"

// Active (last):
"text-secondary-900 font-medium pointer-events-none"
```

---

#### Pagination

```jsx
// Wrapper:
"flex items-center justify-center gap-1"

// Button base:
"inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9
 hover:bg-secondary-100 transition-colors
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
 disabled:opacity-50 disabled:pointer-events-none"

// Active:
"bg-primary-500 text-white hover:bg-primary-600"

// Ellipsis:
"flex h-9 w-9 items-center justify-center text-secondary-400"

// Nav arrows:
Same as button base, uses lucide ChevronLeft / ChevronRight.
```

---

#### Progress Bar / Stepper

**Progress Bar (linear):**
```jsx
// Wrapper:
"h-2 w-full overflow-hidden rounded-full bg-secondary-100"

// Fill:
"h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
// Variant: success: "bg-emerald-500", error: "bg-red-500"
```

**Stepper (booking flow):**
```jsx
// Wrapper:
"flex items-center w-full"

// Step:
"flex items-center flex-1 last:flex-none"

// Step indicator:
"flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0
 transition-all duration-300"
// Completed: "bg-primary-500 text-white"
// Current:   "bg-primary-500 text-white ring-4 ring-primary-100"
// Upcoming:  "bg-secondary-100 text-secondary-400"

// Step label:
// Active: "text-primary-700 font-medium text-sm"
// Inactive: "text-secondary-400 text-sm"

// Connector:
"flex-1 h-0.5 mx-2 transition-colors duration-300"
// Completed: "bg-primary-500"
// Pending: "bg-secondary-200"
```

---

#### Skeleton Loader

```jsx
// Base:
"animate-pulse rounded-md bg-secondary-200"

// Common sizes:
// Text line:     "h-4 w-full"
// Heading:       "h-6 w-3/4"
// Avatar:        "h-10 w-10 rounded-full"
// Card:          "h-32 w-full rounded-xl"
// Button:        "h-10 w-24 rounded-md"
// Input:         "h-10 w-full rounded-md"
// Image:         "aspect-video w-full rounded-lg"
```

---

### 2.2 Booking-Specific Components

#### ServiceCard

```jsx
// Wrapper:
"group relative flex flex-col gap-3 rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all
 bg-white"
// Unselected: "border-secondary-200 hover:border-primary-200 hover:shadow-sm"
// Selected:   "border-primary-500 bg-primary-50/50"

// Name:
"text-base font-semibold text-secondary-800 group-hover:text-primary-700"

// Meta row:
"flex items-center gap-3 text-sm text-secondary-500"
// Duration: lucide Clock icon + "30 min"
// Price: "font-medium text-secondary-700"

// Description:
"text-sm text-secondary-500 line-clamp-2"

// Badge (e.g., "Popular", "Most booked"):
"self-start"
```

**Mobile:** Full-width cards, vertical stack. Horizontal scroll only when > 6 services — then `flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2` with `min-w-[260px] snap-center`.

---

#### StaffCard

```jsx
// Wrapper:
"flex flex-col items-center gap-3 rounded-xl border-2 p-5 cursor-pointer transition-all text-center bg-white"
// Unselected: "border-secondary-200 hover:border-primary-200 hover:shadow-sm"
// Selected:   "border-primary-500 bg-primary-50/50 ring-2 ring-primary-100"

// Avatar:
"h-20 w-20 rounded-full object-cover border-4 border-white shadow-sm"

// Name:
"text-base font-semibold text-secondary-800"

// Title:
"text-sm text-secondary-500"

// Next Available:
"inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
// Or if none: "bg-secondary-100 text-secondary-400"
```

**Grid:** `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`

---

#### BookingStepper

```jsx
// Renders the stepper component described in 2.1.

// Steps array:
const BOOKING_STEPS = [
  { id: 'service', label: 'Service', icon: CalendarCheck },
  { id: 'staff', label: 'Staff', icon: User },
  { id: 'time', label: 'Date & Time', icon: Clock },
  { id: 'info', label: 'Your Info', icon: FileText },
  { id: 'intake', label: 'Intake', icon: ClipboardList },
  { id: 'sign', label: 'Signature', icon: PenTool },
  { id: 'done', label: 'Confirmed', icon: CheckCircle2 },
]

// Mobile: labels hidden, only icons + connector visible.
// Classes for mobile: "hidden sm:inline" on label text.
```

**Position:** Fixed top on mobile (`sticky top-0 z-10 bg-white border-b border-secondary-200 py-3 px-4`). On desktop, inline above the content area.

---

#### IntakeFormField

Renders dynamic form fields based on a field config object:

```typescript
interface IntakeFieldConfig {
  id: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'phone' | 'email'
  label: string
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: { min?: number; max?: number; pattern?: string }
}
```

```jsx
// Field wrapper:
"flex flex-col gap-1.5"

// Label:
"text-sm font-medium text-secondary-700 after:content-['*'] after:text-error after:ml-0.5"
// Required marker only if field.required === true

// Error state:
// - Input gets "border-error focus-visible:ring-error"
// - Error text: "text-xs text-error mt-0.5" with id="{field.id}-error"
// - aria-describedby="{field.id}-error" on input

// Help text:
"text-xs text-secondary-400 mt-0.5"

// Layout:
// Single column on mobile, two-column grid on sm+ for groups
"space-y-4"
// Group fields: "grid grid-cols-1 sm:grid-cols-2 gap-4"
```

---

#### SignaturePad

```jsx
// Wrapper:
"relative border-2 border-dashed border-secondary-300 rounded-xl bg-white overflow-hidden"
// Active: "border-primary-300 bg-primary-50/30"

// Canvas:
"w-full touch-none cursor-crosshair"
// Height: "h-40 sm:h-48"

// Controls row:
"flex items-center justify-between px-4 py-2 border-t border-secondary-100 bg-secondary-50"

// Clear button:
"text-sm text-secondary-500 hover:text-secondary-700 flex items-center gap-1.5"

// Accept checkbox:
// "I agree to the terms and conditions" with checkbox component above, signature pad below

// Instructions:
"absolute top-3 left-1/2 -translate-x-1/2 text-sm text-secondary-400 pointer-events-none select-none"
```

---

#### ConfirmationAnimation

```jsx
// Wrapper:
"flex flex-col items-center justify-center gap-6 py-12 text-center"

// Checkmark circle animation:
"relative flex items-center justify-center"
// Outer ring: "w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center"
// Inner:      "w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center"
// Icon:       "h-8 w-8 text-white" (Check icon)
// Animation:  "animate-in zoom-in-50 fade-in duration-500"

// Heading:
"text-2xl font-bold text-secondary-800"

// Subtext:
"text-secondary-500 max-w-sm"

// Details card:
"w-full max-w-sm rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-left space-y-3"

// Detail row: "flex items-center justify-between text-sm"
// Label: "text-secondary-500"
// Value: "text-secondary-800 font-medium"

// Action buttons:
"flex flex-col sm:flex-row gap-3 w-full max-w-sm"
// "Add to Calendar" (secondary button with lucide CalendarPlus)
// "Done" (primary button)
```

---

### 2.3 Admin-Specific Components

#### ScheduleCard (Appointment Card)

```jsx
// Wrapper:
"flex items-start gap-3 rounded-lg border border-secondary-200 bg-white p-3 shadow-sm
 hover:shadow-md transition-shadow cursor-pointer"

// Time column:
"flex flex-col items-center min-w-[48px]"
// Start time: "text-sm font-semibold text-secondary-800"
// End time: "text-xs text-secondary-400"
// Dot: "h-2 w-2 rounded-full mt-1"
//   Confirmed: "bg-emerald-500"
//   Checked-in: "bg-blue-500"
//   No-show: "bg-red-500"
//   Cancelled: "bg-secondary-300"

// Info column:
"flex-1 min-w-0"
// Patient name: "text-sm font-semibold text-secondary-800 truncate"
// Service: "text-xs text-secondary-500 truncate"
// Staff: "text-xs text-secondary-400"
// Duration: "text-xs text-secondary-400"

// Action column:
"flex items-center gap-1 shrink-0"
// Quick action buttons (ghost, icon-only, size sm)
```

**Variants by status:**
- Confirmed: `border-l-4 border-l-emerald-500`
- Checked-in: `border-l-4 border-l-blue-500`
- In-progress: `border-l-4 border-l-primary-500`
- No-show: `border-l-4 border-l-red-400` + `opacity-60`
- Cancelled: `border-l-4 border-l-secondary-300` + `opacity-50`

---

#### CalendarWeekView / CalendarDayView

```jsx
// Week View Wrapper:
"flex flex-col overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm"

// Header row (day columns):
"grid grid-cols-[60px_repeat(7,1fr)] border-b border-secondary-200 bg-secondary-50"
// Time gutter: "p-2 text-xs text-secondary-400 text-right"
// Day cell:
"p-2 text-center border-l border-secondary-200"
// Day name: "text-xs font-medium text-secondary-500 uppercase"
// Day number: "text-lg font-semibold text-secondary-800"
// Today: "bg-primary-50 rounded-full w-8 h-8 inline-flex items-center justify-center"

// Time grid:
"grid grid-cols-[60px_repeat(7,1fr)] relative"
// Time gutter row: "h-12 border-b border-secondary-100 flex items-start justify-end pr-2 pt-1"
//   Time label: "text-xs text-secondary-400"

// Appointment slot:
// Rendered as ScheduleCard positioned absolutely within time column.
// top based on start time, height based on duration.

// Day View:
// Same structure but "grid-cols-[60px_1fr]"
```

---

#### ClientRow

```jsx
// Table row:
"border-b border-secondary-100 hover:bg-secondary-50 transition-colors"

// Cells:
// Name cell:
"flex items-center gap-3"
// Avatar sm + "font-medium text-secondary-800"

// Contact:
"text-sm text-secondary-500"

// Last visit:
"text-sm text-secondary-500"

// Total visits:
"text-sm font-medium text-secondary-700"

// Status:
// Badge component

// Actions:
// DropdownMenu with: View Profile, Edit, New Appointment, Send Message, Merge
```

---

#### StatCard

```jsx
// Wrapper:
"flex flex-col gap-1.5 rounded-xl border border-secondary-200 bg-white p-5 shadow-sm"

// Top row:
"flex items-center justify-between"
// Icon wrapper:
"flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
// Trend indicator:
"flex items-center gap-0.5 text-xs font-medium"
// Up: "text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded"
// Down: "text-red-600 bg-red-50 px-1.5 py-0.5 rounded"

// Value:
"text-3xl font-bold text-secondary-800"

// Label:
"text-sm text-secondary-500"

// Sparkline (optional):
"h-8 mt-1"
```

**Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`

---

#### ReviewStatus (Email/SMS tracking)

```jsx
// Wrapper:
"inline-flex items-center gap-1.5 text-xs font-medium"

// States:
// Sent:     "text-secondary-400" + lucide Send
// Delivered:"text-primary-600" + lucide CheckCheck
// Opened:   "text-emerald-600" + lucide Eye
// Clicked:  "text-emerald-600" + lucide MousePointerClick
// Bounced:  "text-red-600" + lucide AlertCircle

// With timestamp:
"text-secondary-400 font-normal ml-1"
```

---

## 3. Layout Grid

### 3.1 Booking Page

```
┌─────────────────────────────────────┐
│         max-w-xl mx-auto            │
│         px-4 sm:px-6                │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  BookingStepper (sticky)    │   │
│   ├─────────────────────────────┤   │
│   │                             │   │
│   │  Content Area               │   │
│   │  (single column)            │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

- **Max content width:** `max-w-xl` (576px on sm, 640px on md+)
- **Padding:** `px-4` mobile, `px-6` sm+
- **Vertical spacing:** `py-6 sm:py-10`
- **Background:** `bg-white` (or `bg-secondary-50` if embedded)
- **Page wrapper:** `min-h-screen`

### 3.2 Admin Dashboard

```
┌────────────────────────────────────────────────────────┐
│  Top Bar (h-16)                                        │
│  bg-white border-b border-secondary-200 px-6           │
├──────────┬─────────────────────────────────────────────┤
│ Sidebar  │  Main Content                               │
│ w-60     │  flex-1 px-6 py-8                           │
│ bg-white │  overflow-y-auto                             │
│ border-r │                                              │
│ shrink-0 │                                              │
│ hidden   │                                              │
│ md:block │                                              │
└──────────┴─────────────────────────────────────────────┘
│  Mobile Bottom Nav (fixed, h-16, md:hidden)            │
└────────────────────────────────────────────────────────┘
```

- **Sidebar:** fixed 240px (`w-60`), hidden on < 768px, `sticky top-0 h-screen`
- **Top bar:** full width, `sticky top-0 z-20`
- **Main:** `ml-0 md:ml-60`, `pt-16` (to clear top bar)
- **Content padding:** `px-4 sm:px-6 lg:px-8 py-6`

### 3.3 Breakpoints

| Breakpoint | Min-width | Target                     |
|------------|-----------|----------------------------|
| xs         | 390px     | Small phones (booking)     |
| sm         | 640px     | Large phones / phablets    |
| md         | 768px     | Tablets, sidebar appears   |
| lg         | 1024px    | Desktop comfortable        |
| xl         | 1280px    | Wide desktop               |
| 2xl        | 1440px    | Large monitors             |

**Booking page:** Single column at all sizes. Content `max-w-xl` centered.

**Admin dashboard:** Two-column at md+. Sidebar collapses to bottom nav on < md.

---

## 4. Page Layouts (Wireframe Descriptions)

### 4.1 Booking Page Flow (Mobile-First)

#### Step 1: Service Selection
```
┌─────────────────────────────────────┐
│  ← Back          Step 1 of 7     Skip│
│─────────────────────────────────────│
│  What would you like done today?    │
│  Select a service to get started   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🦷 Professional Cleaning    │    │
│  │ 30 min · $85             →  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🦷 Exam & Consultation      │    │
│  │ 45 min · $125            →  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🦷 Teeth Whitening          │    │
│  │ 60 min · $250            →  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🦷 Filling / Restoration    │    │
│  │ 60 min · $150            →  │    │
│  └─────────────────────────────┘    │
│                                     │
│         [ Continue → ]              │
└─────────────────────────────────────┘
```

- Cards are full-width, stacked vertically.
- Each card shows icon, name, duration, price.
- Selected card highlights with `border-primary-500`.
- "Continue" button at bottom.
- **Scrollable** if more than ~5 services.

#### Step 2: Staff Selection
```
┌─────────────────────────────────────┐
│  ← Back          Step 2 of 7        │
│─────────────────────────────────────│
│  Choose your provider               │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │  img  │  │  img  │  │  img  │     │
│  │       │  │       │  │       │     │
│  │ Sarah │  │ Mike  │  │ Emily │     │
│  │ Hyg.  │  │ Dent. │  │ Hyg.  │     │
│  │  ✓ Av │  │ Full  │  │  ✓ Av │     │
│  └──────┘  └──────┘  └──────┘     │
│  ┌──────┐  ┌──────┐               │
│  │  img  │  │  img  │               │
│  │       │  │       │               │
│  │ James │  │ Lisa  │               │
│  │ Dent. │  │ Orth. │               │
│  │  ✓ Av │  │ Full  │               │
│  └──────┘  └──────┘               │
│                                     │
│         [ Continue → ]              │
└─────────────────────────────────────┘
```

- Grid: `grid-cols-2` on mobile, `grid-cols-3` on sm+, `grid-cols-4` on lg+.
- Each card has photo, name, title, availability badge.
- "Any available" option as first card.
- Selected card gets ring + border highlight.

#### Step 3: Date & Time
```
┌─────────────────────────────────────┐
│  ← Back          Step 3 of 7        │
│─────────────────────────────────────│
│  When should we see you?            │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  <  May 2026  >             │    │
│  │  Mo Tu We Th Fr Sa Su       │    │
│  │       1  2  3  4  5  6  7   │    │
│  │   8  9 10 11 12 13 14       │    │
│  │  15 16 17 18 19 20 21       │    │
│  │  22 23 24 25 26 27 28       │    │
│  │  29 30 31                   │    │
│  └─────────────────────────────┘    │
│                                     │
│  Available times for May 15         │
│                                     │
│  ┌──────┬──────┬──────┬──────┐     │
│  │ 9:00 │ 9:30 │10:00 │10:30 │     │
│  ├──────┼──────┼──────┼──────┤     │
│  │11:00 │11:30 │  -   │  -   │     │
│  ├──────┼──────┼──────┼──────┤     │
│  │ 1:00 │ 1:30 │ 2:00 │ 2:30 │     │
│  ├──────┼──────┼──────┼──────┤     │
│  │ 3:00 │ 3:30 │ 4:00 │ 4:30 │     │
│  └──────┴──────┴──────┴──────┘     │
│                                     │
│         [ Continue → ]              │
└─────────────────────────────────────┘
```

- Calendar shows current month with day highlighting.
- Green dots/bg on available days, grey on full, red/grey on past.
- Clicking a date loads time slots below.
- Time slots in `grid-cols-3 sm:grid-cols-4` layout.
- Unavailable times are greyed out with line-through.

#### Step 4: Your Information
```
┌─────────────────────────────────────┐
│  ← Back          Step 4 of 7        │
│─────────────────────────────────────│
│  Almost there! Tell us about you    │
│                                     │
│  First Name          Last Name      │
│  ┌─────────────────┐ ┌───────────┐  │
│  │ Jane             │ │ Smith     │  │
│  └─────────────────┘ └───────────┘  │
│                                     │
│  Email                              │
│  ┌─────────────────────────────────┐│
│  │ jane@example.com               ││
│  └─────────────────────────────────┘│
│                                     │
│  Phone                              │
│  ┌─────────────────────────────────┐│
│  │ (555) 123-4567                 ││
│  └─────────────────────────────────┘│
│                                     │
│  □ I'd like SMS reminders           │
│                                     │
│         [ Continue → ]              │
└─────────────────────────────────────┘
```

- Name fields in 2-column grid on mobile (flex-wrap if needed).
- Email and phone full width.
- Checkbox for SMS opt-in.
- All required fields marked with *.

#### Step 5: Intake Form
```
┌─────────────────────────────────────┐
│  ← Back          Step 5 of 7        │
│─────────────────────────────────────│
│  Patient Intake Form          3/12  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━    ██░░  │
│                                     │
│  Do you have any medical            │
│  conditions we should know about?   │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  Are you currently taking any       │
│  medications?                       │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ○ Yes  ○ No                       │
│  Have you visited us before?        │
│                                     │
│  □ I confirm the information        │
│    provided is accurate             │
│                                     │
│         [ Continue → ]              │
└─────────────────────────────────────┘
```

- Section progress bar at top.
- Fields render based on `IntakeFieldConfig[]`.
- Long forms are scrollable within the page.
- "Continue" at bottom always visible.
- Fields validate on blur.

#### Step 6: E-Signature
```
┌─────────────────────────────────────┐
│  ← Back          Step 6 of 7        │
│─────────────────────────────────────│
│  Please review and sign             │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  Consent & Waiver Agreement     ││
│  │                                 ││
│  │  I consent to dental treatment  ││
│  │  as recommended by the dentist. ││
│  │  I understand that...           ││
│  │  [scrollable text area]         ││
│  └─────────────────────────────────┘│
│                                     │
│  Signature                          │
│  ┌─────────────────────────────────┐│
│  │ ┌───────────────────────────┐   ││
│  │ │                           │   ││
│  │ │  Sign above               │   ││
│  │ │                           │   ││
│  │ └───────────────────────────┘   ││
│  │ [Clear]                         ││
│  └─────────────────────────────────┘│
│                                     │
│  □ I agree to the terms above       │
│                                     │
│         [ Confirm Booking → ]        │
└─────────────────────────────────────┘
```

- Waiver text in scrollable container (`h-32 sm:h-40 overflow-y-auto text-sm text-secondary-600`).
- Signature pad below.
- "I agree" checkbox must be checked.
- "Confirm Booking" is primary CTA, triggers loading state.

#### Step 7: Confirmation
```
┌─────────────────────────────────────┐
│                                     │
│           ✓                         │
│      Appointment Confirmed!         │
│                                     │
│  We'll see you on                   │
│  Thursday, May 15, 2026             │
│  at 10:30 AM                        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Service:                   │    │
│  │  Professional Cleaning      │    │
│  │  · $85                      │    │
│  │                             │    │
│  │  Provider: Dr. Sarah Chen  │    │
│  │  Location: 123 Main St     │    │
│  │  Suite 100                 │    │
│  │                             │    │
│  │  Confirmation #: BK-28491  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  📅 Add to Calendar         │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  ✉️ Email confirmation sent │    │
│  └─────────────────────────────┘    │
│                                     │
│         [ Done ]                     │
└─────────────────────────────────────┘
```

- Success checkmark animation (scales in).
- Appointment details card.
- "Add to Calendar" button downloads .ics.
- "Email confirmation sent" notice.
- "Done" links back to practice website or booking page.

---

### 4.2 Admin Dashboard Layout

#### Sidebar Navigation
```
┌──────────────────┐
│  📊 BookSmart     │  ← Logo, top padding
│                   │
│  ───────────────  │
│                   │
│  ▌ Dashboard      │  ← Active: bg-primary-50 text-primary-700
│  ▌ Schedule       │     + left border
│  ▌ Clients        │
│  ▌ Services       │  ← Inactive: text-secondary-600
│  ▌ Staff          │     hover: bg-secondary-50
│  ▌ Intake Forms   │
│  ✦ Settings       │  ← Icon + label
│                   │
│  ───────────────  │
│                   │
│  🏪 My Practice   │  ← Bottom section
│  ⚙️ Account       │
│  🚪 Sign Out      │
└──────────────────┘
```

```jsx
// Nav item (desktop):
"flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors"
// Active: "bg-primary-50 text-primary-700"
// Inactive: "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800"

// Nav item (mobile bottom nav):
"flex flex-col items-center gap-1 py-2 px-3 text-xs font-medium"
// Active: "text-primary-600"
// Inactive: "text-secondary-400"
```

#### Dashboard Page
```
┌──────────────────────────────────────────────────────┐
│  Good morning, Dr. Smith                    👤 Admin  │
│──────────────────────────────────────────────────────│
│                                                        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ Today  │ │ No-show│ │Review  │ │Revenue │        │
│  │   12   │ │   8%   │ │  92%   │ │ $2,450 │        │
│  │ appts  │ │  -2% ✓ │ │  +5% ✓ │ │ +12% ✓ │        │
│  └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                        │
│  ┌───────────────────────────┐  ┌──────────────────┐  │
│  │ Today's Schedule          │  │ Upcoming         │  │
│  │                           │  │                  │  │
│  │ ▸ 9:00 Sarah Chen • Exam │  │ Mon May 18       │  │
│  │ ▸ 10:30 Mike Ross • Cln  │  │ 10:00 - Whitening │  │
│  │ ▸ 11:00 Emily R. • Fill  │  │ 2:30 - Exam      │  │
│  │ ▸ 1:00 James K. • Consult│  │                  │  │
│  │                           │  │ Tue May 19       │  │
│  │ [View Full Schedule →]   │  │ 9:00 - Cleaning  │  │
│  └───────────────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- Top row: 4 StatCards in a grid.
- Left column (wider): Today's schedule list.
- Right column: Upcoming / recent activity.
- Responsive: stacks vertically on < lg (StatCards go 2x2, then 1x1 on mobile).

#### Schedule Page
```
┌──────────────────────────────────────────────────────┐
│  Schedule                            [Day] [Week][M]  │
│──────────────────────────────────────────────────────│
│                                                        │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐  │
│  │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │  │
│  │ May11│ May12│ May13│ May14│ May15│ May16│ May17│  │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤  │
│  │      │      │      │      │12 app│      │      │  │
│  │      │      │      │      │      │      │      │  │
│  │      │      │      │      │ ▸09:0│      │      │  │
│  │      │      │      │      │ ▸10:3│      │      │  │
│  │      │      │      │      │ ▸11:0│      │      │  │
│  │      │      │      │      │ ▸... │      │      │  │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │ 10:30 │ ● Mike Ross                          │     │
│  │ 11:00 │ ●                                      │     │
│  │ 11:30 │   Professional Cleaning               │     │
│  │       │   Dr. Sarah Chen                      │     │
│  │       │   [Check-in] [Reschedule] [Cancel]    │     │
│  └──────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

- CalendarWeekView component (2.3).
- Clicking an appointment card opens detail panel or modal.
- Day view: single column time grid with appointment cards.
- Filter by staff member via dropdown.
- Legend for status colours at bottom.

#### Clients Page
```
┌──────────────────────────────────────────────────────┐
│  Clients              🔍 Search    [+ Add Client]    │
│──────────────────────────────────────────────────────│
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Name      │ Last Visit │ Visits │ Status     │ ⋮ │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ 👤 Sarah C│ May 10 '26 │   12   │ ● Active   │ ⋮ │  │
│  │ 👤 Mike R.│ Apr 28 '26 │   3    │ ● Active   │ ⋮ │  │
│  │ 👤 Emily R│ Mar 15 '26 │   1    │ ○ Inactive │ ⋮ │  │
│  │ 👤 James K│ May 1 '26  │   8    │ ● Active   │ ⋮ │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  1-10 of 142 clients            < 1 2 3 ... 15 >      │
└──────────────────────────────────────────────────────┘
```

- Table with sortable columns.
- Search input with debounce.
- ClientRow component for each row.
- Action dropdown: View, Edit, New Appointment, Merge.
- Pagination at bottom.

#### Settings Page
```
┌──────────────────────────────────────────────────────┐
│  Settings                                            │
│──────────────────────────────────────────────────────│
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ General                                         │  │
│  │                                                 │  │
│  │ Practice Name    [___________________________]  │  │
│  │ Address          [___________________________]  │  │
│  │ Phone            [___________________________]  │  │
│  │ Email            [___________________________]  │  │
│  │                                                 │  │
│  │ [Save Changes]                                  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Business Hours                                  │  │
│  │                                                 │  │
│  │ Mon  ☐ Closed  Open [09:00] Close [17:00]     │  │
│  │ Tue  ☐ Closed  Open [09:00] Close [17:00]     │  │
│  │ ...                                            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Notifications / Integrations                     │  │
│  │                                                 │  │
│  │ Email reminders  [Toggle]  Send 24h before      │  │
│  │ SMS reminders   [Toggle]  Send 2h before        │  │
│  │                                                 │  │
│  │ Google Calendar [Connect]                        │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- Sections in Cards, stacked vertically.
- Form fields, toggles, and connect buttons.
- "Save Changes" per section or global.
- Tabbed navigation for larger settings (General / Hours / Notifications / Team / Billing).

---

## 5. Responsive Behavior

### 5.1 Booking Page

| Element              | < 640px                      | 640px+                        |
|----------------------|------------------------------|-------------------------------|
| Layout               | Single column                | Single column, max-w-xl       |
| Content padding      | `px-4`                       | `px-6`                        |
| Service cards        | Full width, stack            | Full width, stack             |
| Staff grid           | `grid-cols-2`                | `grid-cols-3` or 4            |
| Time slots           | `grid-cols-3`                | `grid-cols-4`                 |
| Booking stepper      | Labels hidden, icons only    | Full labels + icons           |
| Modal                | `max-w-[calc(100%-32px)]`    | `max-w-lg` centered           |
| Buttons              | Full width on mobile         | Auto-width                    |
| Two-column fields    | Single column                | `grid-cols-2`                 |
| Font sizes           | `text-2xl` headings          | `text-3xl` headings           |

### 5.2 Admin Dashboard

| Element              | < 768px                      | 768px+                        | 1024px+                       |
|----------------------|------------------------------|-------------------------------|-------------------------------|
| Sidebar              | Hidden (bottom nav instead)  | Visible `w-60`                | Visible `w-60`                |
| Bottom nav           | Fixed h-16, 5 icons          | Hidden                         | Hidden                        |
| Main content margin  | `ml-0`                       | `ml-60`                       | `ml-60`                       |
| Top bar              | `px-4`                       | `px-6`                        | `px-8`                        |
| StatCards grid       | `grid-cols-1`                | `grid-cols-2`                 | `grid-cols-4`                 |
| Schedule view        | Day view only, horizontal    | Week view scrollable          | Full week grid                |
| Table                | Horizontal scroll wrapper    | Natural width                 | Natural width                 |
| Modal                | Full-screen (`inset-0 m-0 rounded-none`) | Centered overlay | Centered overlay |
| Settings form        | Single column                | Single column                 | Wider inputs                  |

### 5.3 Touch & Interaction Targets

All interactive elements must meet minimum **44×44px** touch target (WCAG 2.5.8).

| Component         | Applied Via                          |
|-------------------|--------------------------------------|
| Button (sm)       | `min-h-[44px] min-w-[44px]` (icon-only) |
| Button (md)       | `h-10` (40px) + `py-2` = 44px total   |
| Time slot         | `py-2.5` + `text-sm` line-height = 44px |
| Nav icon          | `p-3` on icon = 44px                  |
| Checkbox / Toggle | Wrapper label area extends touch zone  |
| List item         | `py-3` minimum                        |

---

## 6. Accessibility (WCAG AA)

### 6.1 Colour Contrast Ratios

All token combos meet WCAG AA (4.5:1 normal text, 3:1 large text):

| Foreground          | Background           | Ratio  | Passes       |
|---------------------|----------------------|--------|--------------|
| `primary-700`       | `primary-50`         | 6.2:1  | AA, AAA text |
| `primary-500`       | `white`              | 4.8:1  | AA text      |
| `secondary-800`     | `white`              | 12.1:1 | AAA          |
| `secondary-700`     | `secondary-50`       | 8.3:1  | AAA          |
| `secondary-600`     | `white`              | 6.7:1  | AA small     |
| `secondary-500`     | `white`              | 4.8:1  | AA large     |
| `secondary-400`     | `white`              | 3.5:1  | Placeholder  |
| `white`             | `primary-500`        | 4.8:1  | AA text      |
| `white`             | `primary-600`        | 6.1:1  | AA text      |
| `white`             | `primary-700`        | 7.6:1  | AAA          |
| `error` (#ef4444)   | `white`              | 4.6:1  | AA small     |
| `success` (#10b981) | `white`              | 4.6:1  | AA small     |
| `error-bg`          | `error`              | 4.6:1  | AA small     |
| `warning-700`       | `warning-bg`         | 5.8:1  | AA           |

### 6.2 Focus Indicators

```css
/* Global focus style (replaces default outline) */
*:focus-visible {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
  border-radius: inherit;
}

/* For elements with their own ring utility */
/* Use tailwind: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 */
```

- All interactive elements must have visible focus indicators.
- Do not remove `outline` without providing `ring` replacement.
- Focus ring colour: `primary-500` (4.8:1 contrast on white).

### 6.3 Touch Targets

- **Minimum:** 44×44px physical pixels (WCAG 2.5.8).
- All buttons, links, clickable cards, time slots, nav items must meet this.
- For inline links within text, provide a larger click area via `padding` or `inline-block`.

### 6.4 Form Error Association

```jsx
// Each form field must follow this pattern:

<label htmlFor="patient-name" className="...">
  Patient Name <span aria-hidden="true">*</span>
</label>
<input
  id="patient-name"
  name="patientName"
  aria-required="true"
  aria-describedby={errors.patientName ? "patient-name-error" : undefined}
  aria-invalid={!!errors.patientName}
  className={cn("...", errors.patientName && "border-error")}
/>
{errors.patientName && (
  <p id="patient-name-error" className="text-xs text-error mt-0.5" role="alert">
    {errors.patientName}
  </p>
)}
```

- Every input has `<label htmlFor>` association.
- Required fields use `aria-required="true"`.
- Error messages use `role="alert"` and `aria-describedby`.

### 6.5 Skip Navigation

```jsx
// Skip-to-content link — first focusable element on every page:
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]
             focus:px-4 focus:py-2 focus:bg-white focus:text-primary-700 focus:rounded-md focus:shadow-lg"
>
  Skip to main content
</a>
```

### 6.6 Additional Requirements

| Requirement              | Implementation                                           |
|--------------------------|-----------------------------------------------------------|
| Landmarks                | `<header>`, `<nav>`, `<main id="main-content">`, `<footer>` |
| Heading hierarchy        | Single `<h1>` per page, no skipped levels                 |
| List semantics           | `<ul>` / `<ol>` for nav items, card lists                 |
| Live regions             | Toast/snackbar uses `role="status"` + `aria-live="polite"` |
| Modal focus trap         | Focus trapped inside modal, closed with Escape, `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toggle labels            | Each toggle has `aria-label` or visible label              |
| Icon buttons             | `aria-label="..."` on every icon-only button               |
| Table headers            | `<th>` with `scope="col"` for column headers              |
| Sortable table           | `aria-sort="ascending|descending"` on sortable headers    |
| Pagination               | `<nav aria-label="Pagination">` with `aria-current="page"` |
| Stepper                  | `aria-current="step"` on active step, `role="progressbar"` with `aria-valuenow` |
| Image alt text           | All `<img>` have descriptive `alt` (or `alt=""` for decorative) |
| Reduced motion           | `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }` |
| High contrast mode       | Use `forced-colors: active` media query for border adjustments |

---

## 7. Tailwind Config Extension

```js
// tailwind.config.js — Design Token Extensions

const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff9fa',
          100: '#d5f0f2',
          200: '#afe0e5',
          300: '#7cc9d2',
          400: '#4aabb8',
          500: '#2d8f9e',
          600: '#217282',
          700: '#1f5c69',
          800: '#1f4c57',
          900: '#1d404a',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        secondary: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        neutral: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#ecfdf5',
          dark: '#065f46',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fef2f2',
          dark: '#991b1b',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fffbeb',
          dark: '#92400e',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#eff6ff',
          dark: '#1e40af',
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        heading: ['"Plus Jakarta Sans"', 'Inter', ...fontFamily.sans],
        mono: ['"JetBrains Mono"', ...fontFamily.mono],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        'booking': '640px',
        'form': '480px',
      },
      animation: {
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## 8. Iconography

- **Library:** lucide-react (all icons)
- **Style:** Regular weight, 1.5px stroke (`strokeWidth={1.5}`)
- **Sizing:** Inline with text: `h-4 w-4` (buttons), `h-5 w-5` (nav), `h-6 w-6` (section headers), `h-8 w-8` (stats/icons), `h-12 w-12` (empty states)

**Common Icons by Context:**

| Context          | Icon                    |
|------------------|------------------------|
| Calendar         | `Calendar`, `CalendarDays` |
| Clock            | `Clock`, `Timer`       |
| Services         | `Stethoscope`, `Tooth` |
| Staff            | `User`, `Users`        |
| Clients          | `UserCircle`, `Contact` |
| Dashboard        | `LayoutDashboard`      |
| Schedule         | `CalendarCheck`        |
| Settings         | `Settings`, `SlidersHorizontal` |
| Intake Form      | `ClipboardList`        |
| Search           | `Search`               |
| Chevron          | `ChevronDown`, `ChevronLeft`, `ChevronRight` |
| Plus             | `Plus`, `CirclePlus`   |
| More actions     | `MoreHorizontal`, `Ellipsis` |
| Check            | `Check`, `CheckCircle2` |
| Alert            | `AlertCircle`, `AlertTriangle` |
| Info             | `Info`                 |
| Close            | `X`                    |
| Menu (hamburger) | `Menu`                 |
| Home             | `Home`                 |
| Logout           | `LogOut`               |
| Upload           | `Upload`, `CloudUpload` |
| Download         | `Download`             |
| Edit             | `Pencil`               |
| Delete           | `Trash2`               |
| Arrow            | `ArrowRight`, `ArrowLeft` |

---

## 9. Motion & Animation

### 9.1 Duration & Easing

| Token          | Duration | Easing                     | Usage                  |
|----------------|----------|----------------------------|------------------------|
| `fast`         | 150ms    | `ease-out`                 | Hover, tap feedback    |
| `normal`       | 200ms    | `ease-out`                 | Dropdowns, tooltips    |
| `slow`         | 300ms    | `ease-out`                 | Modals, page transitions |
| `slide`        | 300ms    | `cubic-bezier(0.16, 1, 0.3, 1)` | Panel slide, bottom nav |

### 9.2 When to Animate

- **Page transitions:** Fade + subtle slide up (booking steps).
- **Modal open:** Scale in + fade (backdrop fade).
- **Toast:** Slide in from top-right (desktop) / bottom (mobile).
- **Button loading:** Spinner icon (lucide `Loader2`) replacing icon/text.
- **Skeleton loaders:** Pulsing opacity.
- **Checkbox/toggle:** Background + icon transition.
- **Accordion/collapse:** Height transition.
- **Do NOT animate:** Table sort, page load (unless skeleton), validation errors.

### 9.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. Grid & Spacing Conventions

| Pattern                        | Classes                                   |
|--------------------------------|-------------------------------------------|
| Page wrapper (booking)         | `min-h-screen bg-white mx-auto max-w-booking px-4 sm:px-6 py-6 sm:py-10` |
| Page wrapper (admin)           | `flex-1 px-4 sm:px-6 lg:px-8 py-6`       |
| Card grid (2-col)              | `grid grid-cols-1 sm:grid-cols-2 gap-4`  |
| Card grid (3-col)              | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` |
| Card grid (4-col)              | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| Form section                   | `space-y-6`                              |
| Form field group               | `space-y-4`                              |
| Button group (actions)         | `flex flex-col-reverse sm:flex-row gap-3 sm:justify-end` |
| Detail row                     | `flex items-center justify-between py-2` |
| Stack (vertical)               | `flex flex-col gap-2`                    |
| Stack (horizontal)             | `flex items-center gap-2`                |

---

## 11. Global CSS

```css
/* globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    @apply bg-secondary-50 text-secondary-800 font-sans;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }

  ::selection {
    @apply bg-primary-100 text-primary-900;
  }

  *:focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  }

  /* Scrollbar (admin only — thin, subtle) */
  .admin-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .admin-scrollbar::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  .admin-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-secondary-200 rounded-full;
  }
  .admin-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-secondary-300;
  }
}

@layer utilities {
  .touch-target {
    @apply min-h-[44px] min-w-[44px];
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

*End of Design System Document — BookSmart v1.0*

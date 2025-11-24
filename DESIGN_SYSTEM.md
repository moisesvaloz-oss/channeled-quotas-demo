# FeverZone Demo Design System

This document outlines the design system used in the FeverZone demo application, based on the implementations of **Quota Management**, **Schedule & Tickets**, **Businesses**, and **Reservations Overview** screens.

Use this as the **source of truth** for all future UI implementations to ensure consistency.

## 1. Color Palette

Colors are defined in `src/index.css` as CSS variables.

### Brand Colors
- **Primary Blue**: `text-primary-active` / `bg-primary-active` (`#0079ca`) - Used for active text links, primary outlines.
- **Action Blue**: `bg-action-primary` (`#0089e3`) - Used for **Primary Buttons**.
  - Hover: `bg-action-primary-hover` (`#0079ca`).

### Backgrounds
- **App Background**: `bg-neutral-50` (`#fafbfb`) or `bg-background-main` (`#ffffff`).
- **Dark Contrast (Hero/Sidebar)**: `bg-background-contrast` (`#06232c`).
- **Subtle Grey**: `bg-neutral-75` (`#f6f7f7`) - Used for **Table Headers**.
- **Light Grey**: `bg-neutral-100` (`#f2f3f3`) - Used for **Filter Inputs** and **Secondary Buttons**.

### Text
- **Main**: `text-text-main` (`#031419`) - Primary headings and body text.
- **Subtle**: `text-text-subtle` (`#536b75`) - Labels, table headers, secondary info.
- **Contrast**: `text-white` - Text on dark backgrounds (Hero, Sidebar).

### Borders
- **Main**: `border-border-main` (`#ccd2d8`) - Standard input borders, dividers.

---

## 2. Typography

**Font Family**: `'Montserrat', sans-serif`

### Headings
- **Hero Title**: `text-2xl font-bold`. White.
  - Example: "Reservations", "Schedule & tickets".
- **Card/Section Title**: `text-xl` or `text-2xl` `font-bold text-text-main`.
  - Example: "Reservations Overview".

### Body
- **Standard**: `text-base` (16px).
- **Compact**: `text-sm` (14px) - Used in tables, buttons.
- **Labels**: `text-xs font-semibold text-text-subtle` - Used in floating labels, table headers.

---

## 3. Components

### Buttons

**1. Primary Action (Pill)**
- **Style**: `rounded-full bg-action-primary text-white font-semibold`.
- **Height**: `h-10` (Compact) or `h-14` (Large/Hero).
- **Hover**: `hover:bg-action-primary-hover`.
- **Example**: "Make a reservation", "Add new business".

**2. Secondary / Show Button (Hero)**
- **Style**: `rounded-full bg-neutral-100 text-text-subtle font-semibold`.
- **Context**: Next to inputs in Hero or Content.
- **Alternate (Dark Background)**: `bg-transparent border-2 border-white text-white rounded-full`.

**3. Text Link**
- **Style**: `text-primary-active font-semibold hover:underline`.
- **Example**: "+ Add quota", "Back to Capacity view".

### Inputs & Dropdowns

**1. Hero Inputs (The "Schedule & Tickets" Style)**
- **Container**: `bg-white border border-border-main rounded-sm h-14 relative`.
- **Label**: Floating, `absolute top-0 left-3 text-xs font-semibold text-text-subtle`.
- **Value/Input**: `pt-4 px-3 text-base text-text-main`.
- **Usage**: Top dark banners (City, Venue, Search).

**2. Content Filters (The "Businesses" / "Overview" Style)**
- **Style**: `rounded-lg`.
- **Background**: `bg-neutral-100` (Grey) or `bg-white` (White with border).
- **Height**: `h-10` (Compact) or `h-14` (Large).
- **Placeholder**: Simple text placeholder (no floating label for empty states in some contexts).

### Tables

- **Container**: `rounded-lg overflow-hidden border border-border-main`.
- **Header**:
  - Background: `bg-neutral-75`.
  - Text: `text-sm font-semibold text-text-subtle`.
  - Padding: `px-4 py-3`.
- **Rows**:
  - Background: `bg-white`.
  - Border: `border-b border-border-main`.
  - Hover: `hover:bg-neutral-50`.
  - Text: `text-sm` or `text-base text-text-main`.

### Cards

- **Container**: `bg-white rounded-lg`.
- **Shadow**:
  - Standard: `shadow-sm`.
  - Elevated: `shadow-[0px_6px_6px_0px_rgba(0,70,121,0.2)]`.
- **Padding**: `p-6` internal padding.

---

## 4. Layout Patterns

### Page Structure
```tsx
<div className="h-screen flex flex-col bg-neutral-50">
  <Header /> {/* Fixed 72px height */}
  <div className="flex flex-1 overflow-hidden">
    <Sidebar /> {/* Fixed 256px width */}
    <main className="flex-1 overflow-auto flex flex-col">
      {/* Content */}
    </main>
  </div>
</div>
```

### Hero Section (Banner)
- **Container**: `bg-background-contrast p-6`.
- **Content**: Title + Row of Global Filters (`h-14` inputs).

### Content Wrapper
- **Padding**: `p-4` (Quota Management style) or `p-8` (Businesses style).
- **Inner**: White Card containing headers, filters, and table/list.

---

## 5. Icons

Located in `/public/icons/`. Use as `img` tags.

- **Navigation**: `back-arrow.svg`, `close.svg`.
- **Actions**: `add.svg`, `edit.svg`, `trash-can.svg`, `copy.svg`.
- **Data**: `calendar.svg`, `clock.svg`, `search.svg`.
- **UI Elements**:
  - `chevron-down.svg` (Light/Thin - Used in Dropdowns).
  - `angle-down.svg` (Bold - Used in Section Headers).
  - `check.svg`, `info.svg`.

---

## 6. Specific Component Implementations

### Hero Input (Code Snippet)
```tsx
<div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1">
  <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Label</label>
  <div className="pt-4 text-text-main text-base">Value</div>
  {/* Chevron SVG */}
</div>
```

### Status Badge (Businesses)
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-green-500 bg-white text-green-700 text-sm font-medium">
  <svg>...</svg> Enabled
</span>
```

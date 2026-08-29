# howtoselfhost.com Design System & Styling Guide

This document captures the visual identity, Tailwind CSS patterns, and UI philosophies used in `howtoselfhost.com`. You can use this as a reference guide when building `vps.howtoselfhost.com` or any related projects to ensure a unified brand experience.

## 1. Core Typography
We use two main fonts from Google Fonts:
- **Sans-serif (Main)**: `Inter`
- **Monospace (Code & Accents)**: `JetBrains Mono`

```css
/* Tailwind config */
theme: {
  fontFamily: {
    sans: ['var(--font-inter)', 'sans-serif'],
    mono: ['var(--font-jetbrains-mono)', 'monospace'],
  }
}
```

## 2. Color Palette & Theming
The site relies heavily on a high-contrast Dark Mode and a soft, comfortable Light Mode.

### Light Mode (Comfortable Slate)
- **Background**: `bg-slate-50` (Very soft off-white to prevent eye strain)
- **Cards/Surfaces**: `bg-white` or `bg-slate-50/50`
- **Text (Primary)**: `text-slate-900`
- **Text (Secondary/Muted)**: `text-slate-500` to `text-slate-600`
- **Borders**: `border-slate-200`
- **Prose (Markdown text)**: `prose-slate`

### Dark Mode (Deep Gray/Black)
- **Background**: `bg-gray-950` (near black)
- **Cards/Surfaces**: `bg-gray-900`
- **Text (Primary)**: `text-white` or `text-gray-100`
- **Text (Secondary/Muted)**: `text-gray-400`
- **Borders**: `border-gray-800`

### Brand Accents (The "Hacker" Vibe)
- **Primary Brand Color**: `green-500`
- **Hover States**: `hover:text-green-400` (Dark Mode) or `hover:text-green-600` (Light Mode)
- **Glow Effects**: `shadow-lg shadow-green-500/20`
- **Badges/Pills**: `bg-green-500/10 text-green-400 border border-green-500/30`

## 3. UI Components & Patterns

### The "Glassmorphism" Header
Used for sticky navigation bars to keep the interface feeling premium and layered.
```tsx
<header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-gray-800 bg-white/70 dark:bg-gray-950/80 backdrop-blur-md">
```

### Interactive Cards (PostCards, Service Cards)
Cards should feel tactile. They scale slightly on hover and feature interactive borders.
```tsx
<article className="group flex flex-col rounded-2xl border border-slate-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-300 dark:hover:border-green-500/40 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none">
```

### Buttons
All buttons and interactive links have standard transition utilities to make them feel responsive:
```tsx
// Primary CTA
<button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-green-500/20">
  Action
</button>

// Secondary/Outline
<button className="bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
  Action
</button>
```

## 4. Setup Recommendations for the Next Project
When initializing `vps.howtoselfhost.com`:
1. Use `next-themes` with `ThemeProvider` initialized to `attribute="class"`.
2. Extract the `globals.css` base styles (scrollbar styling, `scroll-behavior: smooth`) directly from this repository.
3. Install `lucide-react` for consistent iconography.
4. Keep the same Tailwind transition speed baseline (`duration-200` to `duration-300` for UI elements).

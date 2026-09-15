---
name: Portfolio Builder
description: Universal developer portfolio, README, and CV generator
colors:
  primary: "#F1F3F4"
  primary-foreground: "#202124"
  neutral-bg: "#202124"
  surface: "#292A2D"
  surface-elevated: "#303134"
  text: "#F1F3F4"
  text-secondary: "#BDC1C6"
  text-muted: "#9AA0A6"
  border: "#3C4043"
  border-strong: "#5F6368"
  border-lava: "#4A2D12"
  border-terminal: "#285D31"
  border-light: "#E2E2DF"
  input-bg: "#303134"
  accent-lava: "#FFB020"
  accent-terminal: "#6CFF75"
  accent-ocean: "#3478D4"
typography:
  display:
    fontFamily: "Spline Sans, Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Spline Sans, Inter, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Spline Sans, Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.input-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

# Design System: Portfolio Builder

## Overview

**Creative North Star: "The Studio Console"**

Portfolio Builder treats the portfolio creation workflow as a high-precision, focused command center for developers. The visual language is dark-first, crisp, and architectural, emphasizing high-density utility, typographic structure, and refined surfaces.

The interface balances technical clarity with aesthetic polish. Subtle 1px structural borders partition zones without sensory overload, while fluid transitions and semantic tokens provide complete theme adaptability across mobile and desktop devices.

**Key Characteristics:**
- Obsidian & Slate baseline with high-contrast monochrome primary typography.
- Architectural lines and subtle borders (`border-border`) establishing hierarchy without heavy drop shadows.
- Multi-theme adaptability (`dark`, `light`, `lava`, `terminal`, `ocean`, `amoled`) anchored on semantic CSS variables.
- Fluid responsiveness with universal component parity across Web, iOS, and Android.

## Colors

The palette is built strictly on semantic tokens mapped to CSS custom variables, preventing raw hex leaks across multiple themes.

### Primary
- **High-Contrast Monolith** (`#F1F3F4` in Dark / `#111111` in Light): Reserved for primary calls to action, active indicators, and high-priority emphasis.

### Secondary
- **Slate Accent** (`#BDC1C6` in Dark / `#686868` in Light): Contextual secondary elements, secondary buttons, and structured chips.

### Neutral
- **Deep Slate Canvas** (`#202124` in Dark / `#F7F7F5` in Light / `#000000` in AMOLED): The base background color for screens and deep layouts.
- **Surface Elevation** (`#292A2D` in Dark / `#FFFFFF` in Light): Cards, navigation panels, and interactive containers.
- **Surface Elevated** (`#303134` in Dark / `#FAFAF8` in Light): Modals, dropdowns, input backgrounds, and floating toolbars.
- **Structural Border** (`#3C4043` in Dark / `#E2E2DF` in Light): Defines boundaries and partitions.

### Named Rules
**The Semantic Token Rule.** Direct hex colors, raw RGB values, or literal Tailwind colors (`bg-white`, `text-black`, `#FFF`) are strictly banned in component code. All surfaces, borders, and text must use semantic classes (`bg-surface`, `border-border`, `text-text`, `text-text-muted`).

## Typography

**Display Font:** Spline Sans (with Inter, system-ui fallback)  
**Body Font:** Inter (with ui-sans-serif, system-ui fallback)  
**Label/Mono Font:** ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace  

**Character:** Technical, crisp, and modernist. Clean geometric grotesque display paired with highly legible humanist body text and proportional monospace data.

### Hierarchy
- **Display** (700, `clamp(2rem, 5vw, 3.5rem)`, 1.1): Hero headlines and landing showcases.
- **Headline** (600, `1.75rem`, 1.25): Page titles, step titles in the wizard.
- **Title** (600, `1.25rem`, 1.3): Section headers, card titles, modal headings.
- **Body** (400, `1rem`, 1.5): Standard paragraphs, project descriptions, form labels (max line length ~70ch).
- **Label** (500, `0.875rem`, 1.4): Form field helper labels, button text, badges, status chips.
- **Code** (400, `0.875rem`, 1.4): Code snippets, commit hashes, repository stats, terminal previews.

### Named Rules
**The Typographic Hierarchy Rule.** Headings must use display font tokens with negative letter-spacing for tight architectural rhythm, while body text preserves neutral tracking and comfortable leading.

## Layout

The spatial grid is based on an 8px rhythm (4, 8, 16, 24, 32, 48px). On desktop, content aligns to a max-width container (default `max-w-6xl` or `max-w-7xl` with 24px margins). On mobile devices, layouts adapt to single-column vertical stacks with 16px lateral padding and safe area insets.

## Elevation & Depth

Depth is achieved primarily through tonal layering and subtle 1px structural borders rather than heavy drop shadows. Surfaces elevate by lightening (or tinting) the background token (`surface` -> `surface-elevated`).

### Shadow Vocabulary
- **Subtle Ambient** (`0 4px 20px rgba(0, 0, 0, 0.25)`): Modals and dropdown popovers.
- **Focus Glow** (`0 0 0 2px var(--primary)`): Focus rings on interactive form elements.

### Named Rules
**The Tonal Layering Rule.** Avoid blurry dark drop-shadows on dark mode interfaces. Depth is communicated through tonal elevation steps (`bg-background` < `bg-surface` < `bg-surface-elevated`) outlined by crisp 1px borders (`border-border`).

## Shapes

- **Small Corners (`rounded-sm` / 4px):** Tags, small badges, status dots.
- **Standard Corners (`rounded-md` / 8px):** Buttons, text inputs, dropdown menus.
- **Card & Container Corners (`rounded-lg` / 16px):** Project cards, wizard steps, preview panels.
- **Full Radius (`rounded-full` / 9999px):** Avatars, pill chips, circular badge icons.

## Components

### Buttons
- **Shape:** Rounded rectangle (`rounded-md`, 8px).
- **Primary:** `bg-primary text-primary-foreground font-medium h-11 px-5`. On hover: `opacity-90`.
- **Outline:** `border border-border bg-transparent text-text font-medium h-11 px-5`. On hover: `bg-surface`.
- **Ghost:** `bg-transparent text-text font-medium h-11 px-5`. On hover: `bg-surface`.

### Cards / Containers
- **Corner Style:** Rounded (`rounded-lg`, 16px).
- **Background:** `bg-surface` or `bg-surface-elevated`.
- **Border:** 1px `border-border`.
- **Internal Padding:** `p-5` or `p-6` (20-24px).

### Inputs / Fields
- **Style:** Animated floating label, `bg-input-background`, `border border-border`, `rounded-md` or `rounded-lg`, height 58px (single line) or 120px (textarea).
- **Focus:** Smooth Reanimated focus transition with `border-primary` ring and floating label shrink.

### Navigation & Modals
- **Modals:** Centered overlay with backdrop filter, `bg-surface-elevated`, `border border-border`, max-width 672px, responsive full-width bottom sheet on screens < 768px.

## Do's and Don'ts

### Do:
- **Do** consume semantic tokens (`bg-background`, `bg-surface`, `text-text`, `border-border`) across all UI elements.
- **Do** provide bilingual i18n keys for every user-visible string in both `pt.json` and `en.json`.
- **Do** maintain 44x44pt minimum touch targets on mobile touch devices.
- **Do** test every screen against all 4 main themes: Light, Dark, Lava, AMOLED.
- **Do** isolate platform-specific APIs using `.web.tsx` and `.native.tsx` extensions.

### Don't:
- **Don't** hardcode hex colors, rgb values, or Tailwind literal colors (`bg-white`, `text-black`, `#000`, `#FFF`).
- **Don't** insert hardcoded strings or untranslated literals directly into JSX.
- **Don't** use bouncy or cartoonish easing transitions; use exponential/cubic deceleration (`ease-out`).
- **Don't** use empty or placeholder `<img>` tags without valid fallback sources.

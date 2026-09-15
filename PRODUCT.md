# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Software engineers, open-source maintainers, and developers who need to showcase their work, document open-source repositories, and prepare job applications without having to design custom portfolio websites, write standardized READMEs, or format ATS resumes manually from scratch.

## Product Purpose

Automate and simplify how developers present their technical craft by providing an all-in-one universal hub for generating responsive developer portfolios, standardized project READMEs, and ATS-friendly PDF resumes.

## Positioning

A zero-subscription, local-first, privacy-focused tool that replaces fragile custom templates and fragmented services with a universal, automated workspace driven by semantic GitHub repository parsing.

## Operating Context

Runs natively across Web (PWA/SPA), Mobile (iOS and Android via Expo), and Desktop. Operates offline-first with persistent local storage (AsyncStorage) and debounced autosave (500ms), exporting clean standalone HTML/CSS bundles and markdown documents with no dynamic runtime lock-in.

## Capabilities and Constraints

- **Capabilities**:
  - Guided step-by-step wizard (profile, projects, skills, ai, visual editor).
  - GitHub integration for auto-importing repositories, languages, metrics, and parsing README markdown.
  - Multi-theme switching (`dark`, `light`, `lava`, `terminal`, `ocean`, `amoled`).
  - Strict internationalization (`pt-BR`, `en`).
  - Static HTML/CSS portfolio export via JSZip.
  - ATS-friendly PDF resume export.
- **Constraints**:
  - Universal First architecture (React Native 0.86 / Expo SDK 57 / React 19 / NativeWind v4).
  - Strict tokenized theming (zero hardcoded hex/Tailwind colors).
  - Strict i18n (zero hardcoded strings).
  - Decoupled template rendering via ViewModels (`src/templates/viewModel.ts`).
  - Strict validation on domain layer using Zod schemas (`src/domain/portfolio/schema.ts`).

## Brand Commitments

- **Name**: Portfolio Builder (Portfolium).
- **Aesthetic Tone**: Clean, technical, precise, distraction-free. Elevated developer experience with dark-first defaults, crisp borders, and subtle micro-interactions.
- **Visual Commitments**: High-contrast, accessibility-compliant, strictly tokenized across 6 distinct themes with Dark and AMOLED as primary showcase environments.

## Evidence on Hand

- Universal Expo Router app with active screen flow (`src/app/`).
- Centralized Zustand store with persistence adapter (`src/store/index.ts`).
- Full bilingual dictionary (`src/i18n/locales/pt.json` and `src/i18n/locales/en.json`).
- Core styling tokens defined in `src/global.css` and `tailwind.config.js`.

## Product Principles

1. **Code-First Showcase**: The developer's work and code are the heroes; interface chrome recedes to let projects and commit history shine.
2. **Universal Fidelity**: Zero platform compromises—layouts feel equally intentional on mobile touchscreens and desktop viewports.
3. **Data Sovereignty & Portability**: 100% client-side data ownership, local autosave, and self-contained static exports with zero runtime vendor lock-in.
4. **Strict Token Discipline**: All visual elements strictly consume semantic tokens ensuring consistent readability across all theme environments.

## Accessibility & Inclusion

- WCAG AA contrast compliance verified across all themes.
- Touch target minimum of 44x44pt on touch surfaces.
- Accessible heading hierarchy and semantic HTML on web.
- Full bilingual parity for all UI text and screen reader labels.

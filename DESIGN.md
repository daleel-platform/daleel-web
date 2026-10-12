# Design Guidelines

This document establishes the UI/UX design standards for Daleel. Any agent or developer adding or modifying user interfaces must follow these guidelines to maintain visual consistency, accessibility, and brand coherence.

---

## 1. Visual Identity & Brand Philosophy

- **Theme Mode**: **Strict Light Mode only** (`color-scheme: light`). Do not introduce dark mode classes or inverted palettes.
- **Brand Spirit**: Daleel (دليل — _Guide / Compass_) is a mentorship platform for career guidance. Interfaces should feel **inspiring, trustworthy, structured, and human** — not like a cold developer tool or a playful toy app.
- **Typography**: **Plus Jakarta Sans** is the single typeface for all headings, body text, and compact UI. Loaded via [index.html](./index.html) and mapped to `var(--font-sans)`.

---

## 2. Design Tokens & Styling (Tailwind v4)

> **Single Source of Truth**: All raw color values and variables are defined in [src/index.css](./src/index.css). **Do not hardcode arbitrary hex colors** (`#...`) in components when a semantic token exists.

### Semantic Tokens Reference

| Role              | Class Prefix                  | Purpose                                                     | Token Source in `index.css` |
| :---------------- | :---------------------------- | :---------------------------------------------------------- | :-------------------------- |
| **Canvas**        | `bg-background`               | Global app background (`#F8FAFC` soft slate)                | `--color-background`        |
| **Surface**       | `bg-surface`                  | Cards, modals, inputs, elevated containers (`#FFFFFF`)      | `--color-surface`           |
| **Primary**       | `bg-primary`, `text-primary`  | Brand color: Forest Teal / Guiding Emerald (`#0F766E`)      | `--color-primary`           |
| **Primary Light** | `bg-teal-50`, `text-teal-800` | Active pills, soft callouts, badge backgrounds              | `--color-primary-surface`   |
| **Accent / CTA**  | `bg-accent`, `text-accent`    | Sunrise Amber / Beacon (`#F59E0B`) for high-conversion CTAs | `--color-accent`            |
| **Foreground**    | `text-foreground`             | Primary text (`#0F172A` deep navy/slate)                    | `--color-foreground`        |
| **Muted**         | `text-muted`                  | Secondary labels, captions, subtitles (`#64748B`)           | `--color-muted`             |
| **Border**        | `border-border`               | Subtle dividers and card outlines (`#E2E8F0`)               | `--color-border`            |
| **Feedback**      | `text-error`, `text-success`  | Form errors (`#EF4444`) and positive states (`#10B981`)     | Semantic feedback states    |

---

## 3. Reusable Component Catalog (`src/components/`)

**Rule**: Always check and reuse existing primitives from `@/components/` before creating ad-hoc elements or writing raw markup.

| Primitive      | Path                      | Supported Variants / Options                                                                                                                      | When to Use                                                                                       |
| :------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------ |
| **Button**     | `@/components/button`     | `variant`: `primary`, `secondary`, `outline`, `ghost`, `accent`, `danger`<br>`size`: `xs`, `sm`, `md`, `lg`<br>`leftIcon`, `rightIcon`, `loading` | All interactive buttons, action links, and form submissions.                                      |
| **TextInput**  | `@/components/text-input` | `label`, `helperText`, `error`, `leftIcon`, `rightIcon`, `required`, password toggle                                                              | Form inputs. Automatically handles accessible labels, descriptions, and show/hide password logic. |
| **Card**       | `@/components/card`       | Suite: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`<br>`hoverable` prop                                      | Enclosing grouped content, mentor listings, session previews, or metric widgets.                  |
| **Badge**      | `@/components/badge`      | `variant`: `primary`, `accent`, `default`, `outline`, `success`, `warning`<br>`size`: `sm`, `md`                                                  | Skills, status indicators (e.g. _Confirmed_, _Pending_), category tracks, and counts.             |
| **Avatar**     | `@/components/avatar`     | `name`, `src`, `size`: `xs`, `sm`, `md`, `lg`, `xl`<br>`status`: `online`, `busy`, `offline`                                                      | Displaying user, mentor, or reviewer profiles with fallback initials and status dots.             |
| **DaleelLogo** | `@/components/logo`       | `size`: `sm`, `md`, `lg`<br>`showTagline`                                                                                                         | The official compass brand mark + bilingual title (_Daleel دليل_).                                |
| **Text**       | `@/components/text`       | `variant`: `display`, `h1`, `h2`, `h3`, `h4`, `body`, `body-sm`, `caption`, `muted`                                                               | Headings and typography when semantic styling is needed.                                          |

---

## 4. UI & UX Rules for Agents

1. **Vector Icons Only**:
   - Use **Lucide icons** (`lucide-react`) exclusively.
   - **Never use emojis as UI, navigation, or status icons** (e.g. no ⚙️, 🚀, 💬). Emojis are platform-inconsistent and fail screen-reader contrast rules.
2. **Accessible Contrast (WCAG 2.2 AA)**:
   - All body text and form labels must have at least **4.5:1** contrast against adjacent backgrounds.
   - Primary buttons must have high-contrast text (`text-white` on teal, dark text on amber).
3. **Tactile Interaction Feedback**:
   - Interactive controls must include smooth transitions (`transition-all duration-150`), visible focus rings (`focus-visible:ring-2 focus-visible:ring-teal-700`), and subtle press feedback (`active:scale-[0.985]`).
4. **Form Ergonomics**:
   - Pair forms with `react-hook-form` + `zod` (`mode: 'onTouched'`).
   - Keep forms distraction-free: do not add cosmetic checkboxes (e.g. fake "Remember me" checkboxes) unless backed by explicit backend token handling.
5. **No Barrel Files**:
   - Import directly from component files (e.g., `import { Button } from '@/components/button';`).

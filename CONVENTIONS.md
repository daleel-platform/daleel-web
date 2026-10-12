# Conventions

Coding conventions for the Daleel frontend web app. Read this before writing or reviewing code.

---

## Project Structure

```
src/
├── main.tsx                    # Bootstrap entry point & root providers
├── app.tsx                     # Root application container / shell
├── api/                        # Typed HTTP client & backend response envelope unwrapper
│   ├── client.ts               # fetch wrapper with auth & unwrap logic
│   └── errors.ts               # Typed ApiError class
├── components/                 # Reusable UI primitives (Button, Input, Modal, etc.)
│   └── button.tsx
├── config/                     # Environment configuration & constants
│   ├── constants.ts
│   └── env.ts
├── features/                   # Domain feature slices (business logic heart)
│   └── <feature>/              # e.g., auth, mentors, sessions, chat
│       ├── components/         # Domain-specific UI components
│       ├── hooks/              # Custom & TanStack Query hooks
│       ├── api/                # Domain-specific API caller functions
│       ├── schemas/            # Domain-specific Zod schemas & form types
│       └── types/              # Domain-specific interfaces & DTO shapes
├── hooks/                      # Reusable utility hooks (useDebounce.ts, etc.)
├── pages/                      # Thin page composition shells (1:1 with URLs)
│   ├── home-page.tsx
│   ├── mentor-discovery-page.tsx
│   └── not-found-page.tsx
├── routes/                     # Router setup, layouts, and route path constants
│   ├── app-router.tsx
│   ├── paths.ts
│   └── layouts/
├── types/                      # Global shared types (api.ts, pagination.ts)
│   └── api.ts
└── utils/                      # Pure utility functions (cn.ts, formatters.ts)
    └── cn.ts
```

All domain-specific code lives under `src/features/`. Do not put business logic in `src/pages/` or shared root directories.

---

## Naming

| Element             | Convention                                | Example                                   |
| :------------------ | :---------------------------------------- | :---------------------------------------- |
| Component files     | `kebab-case.tsx`                          | `mentor-card.tsx`, `button.tsx`           |
| Hook files          | `use-kebab-case.ts`                       | `use-mentor-search.ts`, `use-debounce.ts` |
| API / Type files    | `kebab-case.[role].ts` or `kebab-case.ts` | `mentor.api.ts`, `api.ts`                 |
| Components          | PascalCase                                | `MentorCard`, `Button`                    |
| Component Props     | PascalCase suffixed with `Props`          | `MentorCardProps`, `ButtonProps`          |
| Custom Hooks        | camelCase starting with `use`             | `useMentorSearch`                         |
| Interfaces & Types  | PascalCase, no `I` prefix                 | `MentorProfile`, `SessionStatus`          |
| Functions / Helpers | camelCase                                 | `formatCurrency`, `calculateDuration`     |
| Constants           | UPPER_SNAKE_CASE                          | `DEFAULT_PAGE_SIZE`, `API_TIMEOUT`        |
| Route paths         | kebab-case                                | `/mentors`, `/sessions/book`              |

---

## TypeScript

- **Strict mode** is enabled — never use `any`. Use `unknown` and narrow the type.
- Prefer `interface` for object shapes and component props; use `type` for unions, intersections, and aliases.
- Explicitly define return types on custom hooks, API caller functions, and non-trivial helpers.
- Always import from path aliases using `@/` (e.g., `@/components/button`, `@/api/client`).

---

## Architectural Patterns

### 1. Features & Isolation

- **One folder per business feature** (`src/features/<feature>/`).
- **Strictly one-directional isolation**: Features must NEVER import from peer features directly. If code is shared across features, move it to `src/components/`, `src/hooks/`, or `src/utils/`. If a view needs multiple features, compose them in `src/pages/`.
- **No barrel files (`index.ts`) anywhere.** Always import directly from the target file (e.g., `@/components/button`, `@/api/client`, `@/features/mentors/hooks/use-mentor`). Barrel files degrade Vite HMR performance, cause circular dependencies, and hurt tree-shaking.

### 2. Pages as Thin Composition Shells

- Files under `src/pages/` map directly to user-facing routes.
- **Rule**: Pages are thin presentation and composition shells. They must NOT contain business logic, data fetching effects, or ad-hoc state calculations.
- A page extracts URL params (`useParams`), sets page metadata, and renders layout plus feature components imported from `src/features/`.

### 3. Styling & Theming (Tailwind CSS v4)

- **Prefer Theme Tokens**: Use semantic tokens (`bg-primary`, `text-muted`, `border-border`, `bg-surface`) or standard Tailwind scales for brand and shared elements.
- **One-Off Values Are Fine**: Arbitrary values (`[#...]`, `w-[...]`) are completely acceptable for component-specific, single-use styling without needing to pollute the global theme.
- **Promote When Reused**: If an arbitrary color or style is reused across multiple components or represents a shared design decision, promote it to `@theme` in `src/index.css`.
- **Dynamic Classes**: Always use `cn(...)` from `@/utils/cn` for conditional class composition. Avoid inline `style={{ ... }}` except for dynamic runtime calculations (e.g. pointer coordinates).

### 4. API Integration & Server State

- Backend standardizes responses in `{ success: true, data: T, timestamp: string }` and errors in `{ success: false, statusCode: number, message: string | string[], ... }`.
- All requests go through `src/api/client.ts`, which automatically unwraps `.data` into typed `T` and throws structured `ApiError` instances on non-2xx responses.
- **TanStack Query**: Use `@tanstack/react-query` for all server-state fetching, caching, and mutation. Define feature queries in `src/features/<feature>/hooks/` with explicit query key factories.

### 5. State Management (Simplicity First)

- **Local State**: Use `useState` and `useReducer` inside components for UI-only state.
- **Server State**: Managed exclusively by TanStack Query. Never mirror API responses in client state stores.
- **Global UI State**: Use React Context only for global cross-cutting UI state (e.g., Theme, Auth Session, Toasts). Do not introduce external state libraries without explicit need.

### 6. Routing & Navigation

- **Centralized Route Constants**: Define all route paths as constants in `src/routes/paths.ts` (e.g., `ROUTES.HOME`, `ROUTES.MENTORS`) instead of hardcoding route path strings across pages and components.
- **Dynamic Paths**: For parameterized paths, export helper functions (e.g., `ROUTES.MENTOR_PROFILE: (id: string) => \`/mentors/${id}\``).
- **Layout Shells**: Reusable layout shells (e.g., root shell, authenticated dashboard shell) live under `src/routes/layouts/`.

### 7. Forms & Validation

- **React Hook Form & Zod**: Use `react-hook-form` paired with `zod` (`@hookform/resolvers/zod`) for all inputs and forms. Prefer `mode: 'onTouched'`.
- **Schemas**: Colocate validation schemas in `src/features/<feature>/schemas/<feature>.schemas.ts`.

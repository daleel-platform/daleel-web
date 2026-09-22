# Contributing to Daleel Web

## Getting Started

See the [README](./README.md) for installation and setup instructions.

---

## Development Workflow

### Branch Naming

```
feat/<short-description>     # New features or UI components
fix/<short-description>      # Bug fixes
refactor/<short-description> # Code refactoring
docs/<short-description>     # Documentation changes
chore/<short-description>    # Tooling, dependencies, config
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add mentor card grid component
fix: handle network error in session booking
refactor: simplify useMentorSearch hook
docs: update CONVENTIONS with state rules
chore: upgrade @tailwindcss/vite
```

### Pull Request Process

1. Create a feature branch from `main`.
2. Make your changes — keep PRs focused and minimal.
3. Ensure all quality checks pass locally:
   ```bash
   pnpm lint
   pnpm format:check
   pnpm build
   ```
4. Open a PR with a clear title (following conventional commits) and description.
5. Request a review.
6. Squash-merge into `main` once approved.

---

## Git Hooks

Husky + lint-staged run automatically on every commit:

- **Pre-commit**: Lints (`oxlint`) and formats (`prettier`) staged files.

No need to run these manually — they'll catch issues before they reach the PR.

---

## Code Quality

| Tool           | Purpose                    | Command       |
| :------------- | :------------------------- | :------------ |
| **OxLint**     | Type-aware linting         | `pnpm lint`   |
| **Prettier**   | Code formatting            | `pnpm format` |
| **TypeScript** | Type checking & Vite build | `pnpm build`  |

Before opening a PR or declaring a task complete, always verify that `pnpm lint` and `pnpm build` succeed with zero warnings or errors.

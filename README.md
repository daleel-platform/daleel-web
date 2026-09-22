# Daleel Web

> **Daleel** (دليل) — Arabic for "guide". A mentorship platform that connects mentors and mentees to grow together.

## What is Daleel Web?

Daleel Web is the modern frontend client for the Daleel mentorship platform, built with React 19, TypeScript, Vite, and Tailwind CSS v4. It connects to the [Daleel Backend](file:///a:/Projects/Daleel/daleel-backend) REST API.

### Planned Features

- **Authentication & Onboarding** — Sign up, log in, session persistence, and role selection.
- **Mentor Discovery & Search** — Filter mentors by skills, domain, availability, and rating.
- **AI-Powered Matching** — Personalized recommendations pairing mentees with optimal mentors.
- **Become a Mentor** — Interactive onboarding flow to build professional mentor profiles.
- **Calendar & Session Booking** — View availability slots and schedule meetings.
- **Real-time Chat** — Direct messaging between mentees and mentors.
- **In-app Video/Audio Meetings** — Embedded conference rooms for scheduled mentorship calls.

---

## Tech Stack

| Layer                            | Technology                            |
| :------------------------------- | :------------------------------------ |
| **Framework**                    | React 19                              |
| **Build Tool**                   | Vite 8                                |
| **Language**                     | TypeScript 6                          |
| **Routing**                      | React Router v8                       |
| **Server State & Data Fetching** | TanStack Query v5                     |
| **Styling**                      | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Linting**                      | OxLint                                |
| **Formatting**                   | Prettier                              |
| **Package Manager**              | pnpm                                  |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22
- **pnpm** ≥ 10
- Running [Daleel Backend](file:///a:/Projects/Daleel/daleel-backend) API (defaults to `http://localhost:3000`)

### Installation

```bash
# Clone the repo
git clone git@github.com:daleel-platform/daleel-web.git
cd daleel-web

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Running the App

```bash
# Start Vite development server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

The web application will be available at `http://localhost:5173`.

### Code Quality & Formatting

```bash
# Lint with OxLint
pnpm lint

# Format code with Prettier
pnpm format

# Check formatting without writing
pnpm format:check

# Type check and build
pnpm build
```

> Husky + lint-staged run linting and formatting automatically on every commit.

---

## Project Structure

Daleel Web follows a feature-driven modular structure where business domain logic lives inside isolated feature slices under `src/features/`.

For the complete directory breakdown, file naming rules, and architectural guidelines, see [CONVENTIONS.md](./CONVENTIONS.md). For domain terminology, refer to [CONTEXT.md](./CONTEXT.md). For workflow and branching guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Environment Variables

| Variable            | Description                              | Default                        |
| :------------------ | :--------------------------------------- | :----------------------------- |
| `VITE_API_BASE_URL` | Base URL for the Daleel backend REST API | `http://localhost:3000/api/v1` |

---

## License

This project is **UNLICENSED** — proprietary and confidential.

# Repository Guidelines

## Project Overview
This repository contains the Intikhab React ecommerce platform, migrated from a static HTML prototype to a modern **Next.js 14 App Router** application. It features a fully functional cart system, an admin dashboard, and production-ready performance optimizations.

## Project Structure & Module Organization
- **`src/app/`**: Next.js App Router. Contains the main ecommerce routes and the `/admin` dashboard.
- **`src/components/`**: Domain-specific UI components (e.g., `admin/`, `cart/`, `home/`, `products/`). Generic components are in `ui/`.
- **`src/stores/`**: Global state management using **Zustand** (e.g., `cartStore.ts`, `adminStore.ts`).
- **`src/data/`**: Static data files serving as the initial source of truth for products and navigation.
- **`src/hooks/`**: Custom React hooks for specialized UI behaviors like carousels and scroll reveals.
- **`src/lib/`**: Shared utilities (e.g., `cn` for Tailwind class merging) and constants.
- **`src/types/`**: Centralized TypeScript definitions for products, orders, and admin entities.
- **`public/`**: Static assets, including product images and the original `index.html` reference.
- **`openspec/`**: Project specifications, design proposals, and task tracking.

## Build, Test, and Development Commands
- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Runs Next.js ESLint checks.

## Coding Style & Naming Conventions
- **TypeScript**: Strict mode is enabled and must be maintained. Use `@/*` path alias for imports.
- **Styling**: **Tailwind CSS v3**. Use the `cn` utility from `@/lib/utils` for conditional classes.
- **Components**: Functional components with named exports. Use **Framer Motion** for animations.
- **Forms**: Managed via **React Hook Form** with **Zod** schema validation.
- **State**: Use **Zustand** for global client-side state; avoid unnecessary Prop Drilling.

## Commit & Pull Request Guidelines
Follow the **Conventional Commits** pattern:
- `feat:` for new features (e.g., `feat: restore MEN/WOMEN/KIDS tabs`).
- `fix:` for bug fixes (e.g., `fix: stack cart items by base product name`).
- `refactor:` for code changes that neither fix a bug nor add a feature.
- `chore:` for maintenance tasks (e.g., `chore: update contact info`).
- `docs:` for documentation changes.

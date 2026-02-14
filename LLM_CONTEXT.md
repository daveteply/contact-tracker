# Contact Tracker Monorepo --- LLM Alignment Context

## Purpose

This file provides concise but sufficient context to align an LLM before
discussing changes or questions about the Contact Tracker project.

This is a full-stack job/contact tracking application built as an Nx
monorepo with strong type safety and shared DTOs across a .NET backend
and a Next.js frontend.

The **.NET DTOs are the single source of truth for data shape and
validation.**

---

# 1. High-Level Architecture

## Monorepo

- Managed with **Nx**
- Uses Docker Compose for full-stack local development
- Dev containers supported for consistent local environments

---

# 2. Technology Stack

## Backend

- **Framework:** ASP.NET Core Minimal API
- **Target Framework:** `net10.0`
- **Location:** `apps/tracker-api`
- **Database:** PostgreSQL
- **ORM:** EF Core (Npgsql provider)
- **Migrations:** `apps/tracker-api/Migrations`
- **Testing:** `apps/tracker-api-tests`

### Backend Responsibilities

- Exposes REST endpoints
- Uses DTOs for request/response models
- Uses PATCH (not PUT)
- Uses EF Core for transactional updates
- Backend validation is authoritative
- May return validation/schema metadata when needed

---

## Frontend

- **Framework:** Next.js 16 + React 19
- **Location:** `apps/tracker-ui`
- Uses:
  - Server Actions
  - Backend-for-Frontend patterns
  - React Hook Form
  - Zod (UI-level validation only)

### BFF Layer

- Location: `apps/tracker-ui/src/lib/server`
- Uses generated TypeScript types
- Uses Zod for request-shape and UX-level validation
- Calls backend API endpoints

---

## Shared Libraries

### C# DTOs (Canonical Source of Truth)

- Location: `packages/shared-dtos/dto`
- Referenced by API
- Use `System.ComponentModel.DataAnnotations`
  - `[Required]`
  - `[MaxLength]`
  - etc.

These DTOs define: - Data shape - Validation constraints - Canonical
contract

---

### TypeScript API Models

- Location: `packages/api-models`
- Generated from C# DTOs using **TypeGen**
- Output typically in:\
  `packages/api-models/src/lib/dtos`

Purpose: - Shared typing between API and UI - Prevent drift between
frontend and backend contracts

---

### Validation & UI Libraries

- `packages/ui-components`
- `packages/validation`

Validation details: - Zod schemas live in `packages/validation` - Used
by UI and React Hook Form - Manually maintained - Best-effort only (not
authoritative)

---

# 3. Validation & Typing Flow

Canonical flow:

C# DTOs (DataAnnotations) ↓ TypeScript Types (TypeGen) ↓ Zod Schemas
(manual, UI-focused) ↓ React Hook Form

Key rule:

> The backend (.NET DTOs + EF + DB) is the final source of truth.

Zod is for UX, not enforcement.

---

# 4. Core Domain Model

## Central Entity: Event

An Event represents a meaningful job-search action.

### Event Relationships

- **EventType**
  - Seeded in database
  - Manual numeric primary key
  - Examples:
    - Applied
    - Recruiter Outreach
    - Interview Scheduled
    - etc.
- **Company** (optional)
  - Selectable
  - Can be inline-created
- **Contact** (optional)
  - Minimal inline creation
  - May reference Company (optional)
- **Role** (optional)
  - Minimal inline creation
  - May reference Company (optional)

---

# 5. UX & Data Entry Philosophy

The UI prioritizes:

- Low-friction data entry
- Fast event logging
- Progressive enrichment of data

Patterns:

- Type-ahead selection for related entities
- Inline minimal creation (only required fields)
- Detailed editing happens later
- PATCH-based updates

---

# 6. Important Paths

## Backend

- API: `apps/tracker-api`
- Migrations: `apps/tracker-api/Migrations`
- API Tests: `apps/tracker-api-tests`

## Frontend

- UI App: `apps/tracker-ui`
- BFF Layer: `apps/tracker-ui/src/lib/server`
- E2E: `apps/tracker-ui-e2e`

## Shared

- C# DTOs: `shared-dtos`
- TS API Models: `packages/api-models`
- UI Shared Components: `packages/ui-components`
- Zod Validation: `packages/validation`

---

# 7. Dev & Run Commands

## Run API

npx nx serve tracker-api

## Run UI

npx nx dev tracker-ui

or:

cd apps/tracker-ui\
npm run dev

## Run API Tests

npx nx test tracker-api-tests

## Full Stack via Docker

docker-compose up --build

Services: - postgres - pgadmin - tracker-api - tracker-ui

Connection string wired via:

ConnectionStrings\_\_DefaultConnection

---

# 8. Testing Notes

- API integration tests:
  - `apps/tracker-api-tests`
  - Use in-memory or configured test DB
- Frontend:
  - Unit tests: Jest (where present)
  - E2E: Playwright (`apps/tracker-ui-e2e`)

---

# 9. Code Generation Notes

- TypeScript types are generated from C# DTOs using TypeGen.
- Zod schemas are currently manual.
- If discussing codegen changes, validation syncing, or DTO
  modifications:
  - Always treat C# DTOs as canonical.
  - Do not move validation authority to the frontend.

---

# 10. Assumptions for LLM Conversations

Unless explicitly stated otherwise:

- DTOs are authoritative.
- We prioritize type safety over convenience.
- We avoid duplicating validation logic unnecessarily.
- Backend validation must always remain the source of truth.
- UI validation exists for UX only.

If exact generator configs, Nx task names, or scripts are required, I
will provide them.

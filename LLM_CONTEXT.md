# Project Context: Contact Tracker Monorepo

## High-Level Goal

A full-stack job/contact tracking application with strong type safety.

## Repo Type

- Nx monorepo
- Uses dev containers for local development consistency

---

## Backend

### API

- **Framework:** ASP.NET Core v10 Minimal API
- **Location:** `apps/tracker-api`
- **Responsibilities:**
  - Exposes REST endpoints
  - Uses DTOs for request/response models
  - Returns metadata (validation/schema info) when needed
  - Uses PATCH and not PUT, backend uses EF Core to create a singular transaction

### DTOs

- **Framework:** .NET v10
- **Location:** `packages/libs/shared/dtos`
- **Details:**
  - DTOs use `System.ComponentModel.DataAnnotations`
  - Attributes like `[Required]`, `[MaxLength]`, etc.
  - These DTOs are the _single source of truth_ for data shape and constraints

---

## Code Generation & Schemas

### TypeScript DTO Generation

- **Source:** .NET DTOs
- **Target:** TypeScript interfaces using TypeGen
- **Output Location:** `packages/api-models/src/lib/dtos`
- **Purpose:** Shared typing between API and UI

---

## Frontend

### UI

- **Framework:** Next.js + React
- **Location:** `apps/tracker-ui`
- **Details:**
  - Backend-for-Frontend
    - **Location:** `apps/tracker-ui/src/lib/server`
    - Uses Zod schemas for **request-shape and UX-level validation**
    - Uses Server Actions with generated TypeScript types to interact with backend

### Shared UI Library

- **Framework:** Next.js + React
- **Location:** `packages/ui-shared`
- **Details:**
  - Uses React Hook Form
  - Uses Zod schemas for form-level validation and user feedback
  - **Location:** `packages/validation`

---

## Validation Strategy

- Canonical validation rules live in .NET DTOs (DataAnnotations)
- Zod schemas are currently **manually maintained**
- Zod validation is **best-effort and UI-focused**, not authoritative
- Backend remains the final source of truth

Flow:
DTO (DataAnnotations)
→ TypeScript Types (TypeGen)
→ Zod v4 Schemas (manual, partial)
→ React Hook Form

---

## Core Domain Entities

- Event (central entity)
  - EventType (seeded in database with manual numeric primary key: `Applied`, `Recruiter Outreach`, `Interview Scheduled`, etc. )
  - Company (optional, selectable or inline-created)
  - Contact (optional, minimal fields for inline creation)
    - Company (optional)
  - Role (optional, minimal fields for inline creation)
    - Company (optional)

## UX & Data Entry Philosophy

- UI prioritizes low-friction data entry
- Related entities are selected via type-ahead search
- New entities can be created inline with minimal required fields
- Additional data is filled in later via edit flows

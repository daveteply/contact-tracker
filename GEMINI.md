# Project: ContactTracker

This is an Nx monorepo designed to track contacts. It comprises both a .NET backend API and a Next.js frontend application, along with shared libraries and configurations. The project leverages Docker for service orchestration, including a PostgreSQL database and pgAdmin.

## Technologies Used

*   **Monorepo Tool:** Nx
*   **Backend:** .NET
*   **Frontend:** Next.js (React)
*   **Database:** PostgreSQL
*   **Containerization:** Docker, Docker Compose
*   **Linting:** ESLint
*   **Formatting:** Prettier
*   **Testing:** Jest (unit), Playwright (e2e)

## Project Structure

The workspace is organized into `apps/` and `packages/`:

*   **`apps/`**: Contains the main applications.
    *   `tracker-api`: The .NET backend API.
    *   `tracker-api-tests`: Unit/Integration tests for the .NET API.
    *   `tracker-ui`: The Next.js frontend application.
    *   `tracker-ui-e2e`: End-to-end tests for the Next.js application using Playwright.
*   **`packages/`**: Contains shared libraries and domain models.
    *   `api-models`: TypeScript models for API interactions.
    *   `app-logic`: Shared application logic.
    *   `data-access`: Data access layer.
    *   `document-model`: Document data models.
    *   `server-domain`: .NET domain models.
    *   `shared-dtos`: Shared Data Transfer Objects (DTOs), including .NET and TypeScript.
    *   `ui-components`: Reusable UI components.
    *   `validation`: Validation logic.

## Building and Running

This project uses Docker Compose for managing its services.

### 1. Start Core Services (PostgreSQL & pgAdmin)

To start the database and its administration interface:

```bash
npm run start:services
# or directly: docker-compose up -d postgres pgadmin
```

### 2. Start Applications

Applications can be started individually or all at once using Nx or Docker Compose.

#### Using Docker Compose (Recommended for local development)

*   **Start Backend API:**
    ```bash
    npm run start:api
    # or directly: docker-compose up tracker-api
    ```
*   **Start Frontend UI:**
    ```bash
    npm run start:ui
    # or directly: docker-compose up tracker-ui
    ```
*   **Start All Applications and Services:**
    ```bash
    npm run start:all
    # or directly: docker-compose up
    ```

#### Using Nx (For specific tasks or CI)

*   **Serve Backend API:**
    ```bash
    npx nx serve tracker-api
    ```
*   **Serve Frontend UI:**
    ```bash
    npx nx dev tracker-ui
    ```

### 3. Building Projects

*   **Build Backend API:**
    ```bash
    npx nx build tracker-api
    ```
*   **Build Frontend UI:**
    ```bash
    npx nx build tracker-ui
    ```
*   **Build a specific package (e.g., `api-models`):**
    ```bash
    npx nx build api-models
    ```

## Testing

*   **Run Backend API Tests:**
    ```bash
    npx nx test tracker-api
    ```
*   **Run Frontend UI Unit Tests:**
    ```bash
    npx nx test tracker-ui
    ```
*   **Run Frontend UI E2E Tests:**
    ```bash
    npx nx e2e tracker-ui-e2e
    ```

## Development Conventions

*   **Linting:** ESLint is configured for JavaScript/TypeScript projects. Run `npx nx lint <project-name>` to check for linting issues.
*   **Formatting:** Prettier is used for code formatting.
*   **TypeScript References:** Nx automatically manages TypeScript project references. You can manually sync them with `npx nx sync` or check their status in CI with `npx nx sync:check`.
*   **Nx Console:** The project recommends installing Nx Console for an enhanced IDE experience.

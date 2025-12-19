# Collaborative Task Manager

This is a full-stack, real-time task management application built with TypeScript. It allows users to organize tasks, assign them to team members, and see updates instantly without refreshing the page. The project focuses on clean architecture and reliable backend logic.

## Project Structure

Here is a quick overview of the codebase:

```bash
ablespace/
├── backend/
│   ├── src/
│   │   ├── modules/         # Auth, Tasks, Users, Notifications (Controller/Service/Repo pattern)
│   │   ├── middlewares/     # Auth checks, Error handling
│   │   └── server.ts        # Entry point
│   ├── prisma/              # Schema and migrations
│   └── tests/               # Jest unit tests
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # UI components
│   │   ├── pages/           # React Router pages
│   │   └── context/         # Auth context
│
├── docker/                  # Dockerfiles for frontend and backend
└── docker-compose.yml       # Orchestrates the full stack
```

## Setup & Local Development

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (running locally or via Docker)
- npm

### Backend Setup

1.  **Navigate to the backend:**

    ```bash
    cd backend
    ```

2.  **Environment Variables:**
    Create a `.env` file matching `.env.example`:

    ```env
    PORT=3000
    DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
    JWT_SECRET="your_secure_secret"
    FRONTEND_URL="http://localhost:5173"
    ```

3.  **Install & Setup:**

    ```bash
    npm install
    npx prisma migrate dev  # Creates tables in your local DB
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the frontend:**

    ```bash
    cd frontend
    ```

2.  **Environment Variables:**
    Create a `.env` file (if not present, Vite will use defaults, but you can configure the API URL):

    ```env
    VITE_API_URL="http://localhost:3000/api/v1"
    ```

3.  **Install & Run:**
    ```bash
    npm install
    npm run dev
    ```
    The app will be running at `http://localhost:5173`.

## Running with Docker

First, copy `.env.example` to `.env` in the project root and update with your values:

```env
# Edit .env with your PostgreSQL credentials and JWT secret
```

### Running with Docker

Run the entire stack (Frontend + Backend + Database) with one command:

```bash
docker compose up --build
```

### Service URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Database:** PostgreSQL on localhost:5432

### How It Works

The `docker-compose.yml` creates a network linking all services. Database uses `db_data` volume for persistence across restarts. Backend connects via `DATABASE_URL` from `.env`.

## API Contract

Here are the key endpoints implemented in the backend.

### Authentication

- **POST** `/api/v1/auth/register`
  - Creates a new user account.
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
- **POST** `/api/v1/auth/login`
  - Logs in and sets a secure HTTP-only cookie.
  - Body: `{ "email": "...", "password": "..." }`
- **GET** `/api/v1/auth/me`
  - Returns the currently logged-in user profile.

### Tasks

- **GET** `/api/v1/tasks`
  - Fetches tasks. Supports filtering: `?status=TODO&priority=HIGH`.
- **POST** `/api/v1/tasks`
  - Creates a new task.
  - Body: `{ "title": "...", "dueDate": "...", "priority": "..." }`
- **PATCH** `/api/v1/tasks/:id`
  - Updates a task.
  - Body: `{ "status": "IN_PROGRESS" }` (Partial updates allowed)
- **DELETE** `/api/v1/tasks/:id`
  - Deletes a task (Creator only).

## Architecture & Design Decisions

### 1. Database Choice: PostgreSQL

**Why?**
The application relies on structured relationships between `Users`, `Tasks`, and `AuditLogs`.

- **Relational Integrity:** PostgreSQL enforces foreign key constraints (e.g., a Task must belong to a valid User), preventing orphaned data.
- **Reliability:** Strict ACID compliance ensures that critical operations (like task updates + audit logging) happen atomically.

### 2. Authentication Strategy: JWT + HTTP-Only Cookies

**How?**

- **Implementation:** We use JSON Web Tokens (JWT) to statelessly verify users.
- **Security:** Instead of local storage (vulnerable to XSS), the JWT is sent in an `HttpOnly`, `Secure` cookie. This means client-side JavaScript cannot read the token, effectively mitigating XSS attacks.

### 3. Backend Architecture: Controller-Service-Repository

**How?**
We implemented a strict layered architecture to ensure separation of concerns:

- **Controller (`tasks.controller.ts`):** Handles HTTP request parsing, validation (Zod), and response formatting. It never touches the database directly.
- **Service (`tasks.service.ts`):** Contains all business logic (e.g., "User A cannot delete User B's task", sending Socket.io events).
- **Repository (`tasks.repository.ts`):** Wraps **Prisma** calls. This abstracts the database layer, making it easier to swap ORMs or mock database calls during testing.

### Frontend Strategy

- **State Management:** **React Query** handles server state (caching tasks, background refetching), while **Context API** manages the user's authentication state.
- **Components:** Built with **Tailwind CSS** for rapid styling and responsiveness.

## Socket.io & Real-time Features

Real-time updates are powered by **Socket.io**.

1.  **Server:** When a task is created or updated in `TaskService`, the server emits a `task.updated` event to all connected clients.
2.  **Client:** The frontend listens for this event and instantly updates the task list without a manual refresh.
3.  **Notifications:** If a task is assigned to a specific user, the server sends a focused `notification.new` event to just that user's private channel (`user:userId`).

## Audit Logging

The system tracks important changes for accountability.

- **Implementation:** Inside `TaskService.updateTask`, we check if the `status` field has changed.
- **Record:** If changed, an entry is written to the `AuditLog` table containing the `taskId`, `userId`, `action` ("STATUS_UPDATE"), and `details`.

## Testing

The project includes unit tests using **Jest**.

- **Coverage:** Tests cover critical business logic in `AuthService` and `TaskService`.
- **Run Tests:**
  ```bash
  cd backend
  npm test
  ```

## Live Demo

You can try the application live here: **https://collaborative-task-management-lemon.vercel.app/**

(Backend is running on Render, Frontend on Vercel).

## Trade-offs & Assumptions

- **Permissions:** For this version, any user can create tasks. Deletion is restricted to the creator.
- **Pagination:** The task list currently loads all tasks; pagination would be added for large datasets.

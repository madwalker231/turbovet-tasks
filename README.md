# TurbovetTasks

TurboVets - Full Stack Task Management Assessment
This is a take-home assessment for the Full Stack Engineer role at TurboVets. The project is a secure, multi-tenant, role-based task management system built in an Nx monorepo with a NestJS backend and an Angular frontend.

The primary focus of this submission was on backend security, correctness, and architectural discipline, prioritizing a robust API over UI polish.

Backend: NestJS, TypeORM (with SQLite), Passport.js (JWT)

Frontend: Angular (Standalone Components), TailwindCSS

1. Setup and Running
Prerequisites
Node.js: This project was built using Node.js v22 (LTS).

NPM: npm (v10+).

!Note for any Nx line commands npx may be needed to run the command depending on how your machine is set up.!
!All commands in this read me will have the npx at teh beginning of the command.!
Example command: npx nx serve api or nx serve api

1.1 Installation
Clone the repository.

Install all dependencies from the root directory:
npm install

Running the Application
You must run both the backend and frontend simultaneously in two separate terminals.

Terminal 1: Run the Backend (API)
The API runs on http://localhost:3000.

API side start up command
npx nx serve api

The server will start, connect to the SQLite database (creating a db.sqlite file in the root), and run a seed script to create test users.

Terminal 2: Run the Frontend (Client)
The Angular app runs on http://localhost:4200.

Client side start up command
npx nx serve client


2. Architecture and Design Rationale 

Monorepo
I used an Nx package-based monorepo. This allows for a clean separation of concerns while enabling code sharing. The data-models library, for example, shares UserRole and TaskStatus enums between the backend and frontend, ensuring type safety across the stack.

Backend (NestJS)
The backend uses a modular, service-oriented architecture.

AuthModule / UsersModule / TasksModule: Each feature is self-contained.

TypeORM + SQLite: SQLite was chosen for its zero-config setup, which is ideal for a timed assessment. The database schema is generated automatically from the TypeORM entities using synchronize: true. For a production environment, this would be replaced with formal migration files.

.env: A .env file in the api project root stores the JWT_SECRET.

Frontend (Angular)
Standalone Components: The frontend is built using Angular's modern, standalone component architecture. This eliminates the need for NgModules and simplifies the component structure.

State Management: For this 8-hour project, I used a simple RxJS-based AuthService to manage the session state (access_token in localStorage). This is lightweight and effective for authentication. For a larger application, I would implement a more robust solution like NgRx or Ngrx-SignalStore.

3. 🔐 Access Control and User Roles 

Security was the top priority. The API is secure by default, and access is only granted explicitly.

1. Authentication (JWT) 

Authentication is handled by @nestjs/passport using a dual-strategy approach:

LocalStrategy: Protects the POST /api/auth/login endpoint. It validates the user's email and password (using bcrypt.compare) against the database.

JwtStrategy: Protects the entire API. It runs on every request, validates the Bearer token, and attaches a user payload (e.g., { userId, role, organizationId }) to the request object.

2. Global Guards & Public Routes
JwtAuthGuard is applied globally in main.ts, protecting every single endpoint by default.

A custom @Public() decorator was created to explicitly mark the login endpoint as public, bypassing the global JwtAuthGuard.

3. Role-Based Access Control (RBAC) 

RBAC is enforced by a custom, global RolesGuard.

A @Roles() decorator is used on controllers to specify which roles are allowed (e.g., @Roles(UserRole.ADMIN)).

The RolesGuard runs after the JwtAuthGuard and checks if the request.user.role is included in the decorator's list of allowed roles.

If the user's role does not match, a 403 Forbidden error is returned.

4. Organization-Level Scoping 

This is the most critical security feature and is enforced at the service layer.

Never trust the client: The API never allows a user to specify which organization they are acting on.

Service-Layer Logic: Every database query in services like TasksService and UsersService explicitly uses the organizationId from the authenticated user's token.

Example (TasksService): findAll(user: RequestUser)

return this.tasksRepository.find({
  where: {
    organizationId: user.organizationId, // <-- Scoping
  },
});
This design makes it impossible for a user from one organization to see, edit, or create data in another organization, even if they try to guess IDs.

4. Example Workflows 

Test Data
When the API first starts, it automatically runs a seed script (onModuleInit in UsersService) that creates a new organization and two users in a fresh db.sqlite file:

Admin: admin@test.com / password123

Viewer: viewer@test.com / password123

Workflow 1: Frontend Login (Success)
Run both api and client servers.

Open http://localhost:4200 in your browser.

You are redirected to /login (as required by the authGuard).

Enter admin@test.com and password123 and click "Sign In".

Result: You are authenticated, the token is saved, and you are redirected to the /dashboard page. Clicking "Sign Out" logs you out and returns you to /login.

Workflow 2: RBAC Test (Admin Creates User)
This test proves an ADMIN can access the POST /api/users endpoint.

4.1.1 Get Admin Token
$response = Invoke-WebRequest -Uri http://localhost:3000/api/auth/login -Method POST -Headers @{"Content-Type" = "application/json"} -Body '{"email": "admin@test.com", "password": "password123"}'
$adminToken = ($response.Content | ConvertFrom-Json).access_token

4.1.2 Run POST /api/users as Admin
$newUserBody = '{"email": "new.member@test.com", "password": "password123", "role": "member"}'
Invoke-WebRequest -Uri http://localhost:3000/api/users -Method POST -Headers @{"Authorization" = "Bearer $adminToken"; "Content-Type" = "application/json"} -Body $newUserBody
Result: StatusCode: 201 Created

Workflow 3: RBAC Test (Viewer Blocked)
This test proves a VIEWER is blocked from the same endpoint.

4.2.1 Get Viewer Token
$response = Invoke-WebRequest -Uri http://localhost:3000/api/auth/login -Method POST -Headers @{"Content-Type" = "application/json"} -Body '{"email": "viewer@test.com", "password": "password123"}'
$viewerToken = ($response.Content | ConvertFrom-Json).access_token

4.2.2 Run POST /api/users as Viewer
$newUserBody = '{"email": "another.member@test.com", "password": "password123", "role": "member"}'
Invoke-WebRequest -Uri http://localhost:3000/api/users -Method POST -Headers @{"Authorization" = "Bearer $viewerToken"; "Content-Type" = "application/json"} -Body $newUserBody
Result: StatusCode: 403 Forbidden

5.Time Limit & Future Improvements 

The 8-hour time limit was reached. The core backend security and functionality are complete. The frontend has a working auth flow.

Given more time, I would add the following:

Frontend
Task Dashboard: Build the full UI for the Task CRUD operations.

HTTP Interceptor: Create an HttpInterceptor to automatically attach the Bearer token to all API requests instead of AuthService handling it.

UI-Based RBAC: Implement a directive or service to hide UI elements based on user role (e.g., hide the "Add User" button from viewers).

State Management: For the Task Dashboard, I would implement a simple Signal-based store to manage the state of the task list.

Backend

Formal Logging: Implement the Log or track important system actions requirement  more formally, perhaps by saving actions to a separate AuditLog table.

Testing: Write comprehensive unit and E2E tests for the API, especially for the service-layer security logic.

Migrations: Replace synchronize: true with TypeORM migrations for a production-safe database workflow.

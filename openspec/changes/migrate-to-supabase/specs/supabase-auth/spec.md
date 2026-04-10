## ADDED Requirements

### Requirement: Supabase Auth for admin access
The system SHALL use Supabase Auth (email/password) to protect the `/admin` route. A single admin account SHALL be seeded during initial setup. No customer-facing signup or login UI is required for v1.

#### Scenario: Unauthenticated user is blocked from /admin
- **WHEN** an unauthenticated user visits `/admin`
- **THEN** they are redirected to `/admin/login`

#### Scenario: Seeded admin can log in
- **WHEN** the seeded admin enters correct email and password
- **THEN** they are redirected to `/admin` dashboard with a valid session

### Requirement: Server-side session validation
Server components and API routes protecting admin functionality SHALL validate the Supabase session using `@supabase/ssr` before performing any mutation (create/update/delete product, view all orders).

#### Scenario: API route rejects unauthenticated product creation
- **WHEN** a POST to `/api/products` is made without a valid admin session
- **THEN** the route returns 401 Unauthorized

### Requirement: Auth session available in client components
Client components (e.g., admin sidebar, top bar) SHALL receive the current session state via a React Context or provider, allowing conditional rendering of login/logout buttons.

#### Scenario: Admin top bar shows logged-in state
- **WHEN** an admin is authenticated
- **THEN** the top bar displays their email and a logout button

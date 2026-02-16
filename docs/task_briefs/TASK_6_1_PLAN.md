# Task 6.1 Plan — Client Creation (Top‑Level)

## Goal
Add a simple “New Client” flow on `/clients` to create a client with first + last name only.

## Step 1: Add API endpoint
- In `apps/api/src/clients/clients.controller.ts`, add `POST /clients`.
- In `apps/api/src/clients/clients.service.ts`, add `create()` that accepts `{ firstName, lastName }`.
- Validate non‑empty strings (trim) and return `{ id, firstName, lastName }`.

## Step 2: Add lightweight UI form on `/clients`
- In `apps/web/src/app/clients/page.tsx`, add a **New Client** button in the header row.
- Clicking opens a small modal or inline form with **First name** and **Last name** fields.
- Use a client component (e.g., `NewClientForm.tsx`) to manage form state and API call.

## Step 3: Create NewClientForm component
- File: `apps/web/src/components/NewClientForm.tsx`.
- Fields: firstName, lastName.
- Buttons: **Create** and **Cancel**.
- On submit: `POST /clients` and redirect to `/clients/:id`.
- Basic validation: disable Create until both fields are non‑empty.

## Step 4: Wire it into `/clients` page
- Render `NewClientForm` conditionally when button is clicked.
- Keep the list layout unchanged.

## Step 5: Verify
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Files to Modify/Create
- Modify: `apps/api/src/clients/clients.controller.ts`
- Modify: `apps/api/src/clients/clients.service.ts`
- Modify: `apps/web/src/app/clients/page.tsx`
- Create: `apps/web/src/components/NewClientForm.tsx`

## Notes
- No permissions yet.
- Only name fields; no external ID or program metadata.


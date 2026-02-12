# Original ChatGPT Brief

## Product Vision

This product is a visual workflow operating system for human services case management.
It is NOT:

- A CRM
- A note-taking system
- A task manager
- A replacement for CharityTracker or HMIS

It IS:

- A visual state engine layered on top of existing case management systems
- A shared mental model of client progress
- A structured roadmap engine
- A clarity tool for case managers

The goal is to eliminate:

- Wall-of-text case logs
- Duplicate work between case managers
- Confusion during staff handoffs
- Unclear program pathways
- Training gaps for new case managers

## Target User (MVP)

Primary user: Case Manager
Not supervisors. Not directors. Not administrators (yet).

The system must answer immediately:

- Where is this client in the program?
- What am I responsible for?
- What is blocked?
- What needs attention now?

If it feels like extra documentation, the product has failed.

## Tech Stack (MVP)

Frontend

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS (or similar lightweight utility framework)

Backend

- Supabase
- PostgreSQL database
- Auth
- API access

Hosting

- Vercel

No custom backend server.
No microservices.
No AI integration in MVP.

## Core Architecture

### Multi-Roadmap Per Client

A single client can have multiple active roadmaps (program instances).
Example:

- Housing
- Benefits
- Employment
  Each roadmap is created from a template.

For MVP:

- Hardcode one Housing template.
- Architect system to support multiple templates.

## Data Model (MVP)

### Core Tables

users

- id
- name
- email
- role (for now: case_manager)

clients

- id
- first_name
- last_name
- external_id (optional)
- created_at

program_templates

- id
- name
- description
- is_active

template_stages

- id
- template_id (FK)
- title
- order_index (integer)
- icon_name (string)
- recommended_duration_days (optional)

template_tasks

- id
- stage_id (FK)
- title
- description (optional)
- is_required (boolean)
- depends_on_task_id (nullable FK)
- order_index

client_program_instances

- id
- client_id (FK)
- template_id (FK)
- start_date
- is_active (boolean)

stage_instances

- id
- client_program_instance_id (FK)
- template_stage_id (FK)
- activated_at (timestamp nullable)
- completed_at (timestamp nullable)

task_instances

- id
- stage_instance_id (FK)
- template_task_id (FK)
- status (enum)
- assigned_user_id (FK nullable)
- due_date (nullable)
- blocker_type (nullable enum)
- blocker_note (nullable text)
- completed_at (nullable timestamp)
- is_na (boolean default false)

## Status System (Fixed System-Wide)

Task Status Enum

- NOT_STARTED
- IN_PROGRESS
- BLOCKED
- COMPLETE
  Plus:
- is_na (boolean flag)

Do NOT allow custom statuses per template.

## Engine Logic (Critical)

### Task State Rules

Task is RED if:

- status != COMPLETE
- AND due_date < today
- OR status == BLOCKED

Task is LOCKED if:

- depends_on_task_id exists
- AND required task is not COMPLETE

Locked tasks:

- Display gray
- Cannot change status

### Stage Status Calculation

Stage is GREEN if:

- All required tasks are COMPLETE or is_na = true

Stage is RED if:

- Any required task is BLOCKED
- OR any required task is overdue

Stage is YELLOW if:

- At least one required task incomplete
- No blockers
- No overdue

Stage is GRAY if:

- Not activated yet

Stage status is derived.
Never manually set.

## UI Architecture

### Client Page Layout

- Client Name
- Active Roadmaps Tabs
- Horizontal Stage Roadmap Bar
- Stage Detail Section

No nested scroll regions.
No clutter.

### Stage Roadmap Bar (Top-Level)

- Horizontal linear bar.
- Each stage node shows:
  - Icon
  - Title
  - Color state (green, yellow, red, gray)
  - Tiny badge: number of red tasks
  - Tooltip: “3 of 6 tasks complete”
- Max 7 stages visible.
- No branching.
- No drag-and-drop.
- No editing here.

### Stage Detail View (Execution Layer)

- Vertical list of tasks.
- Each row shows:
  - Status indicator (colored circle or checkbox)
  - Task title
  - Assigned CM avatar
  - Due date
  - Blocker badge if exists
  - Lock icon if locked
- Two filters:
  - Show All Tasks
  - Show My Tasks

### Task Detail Drawer (Right Panel)

Slide-in panel.
Fields:

- Title (read-only)
- Description
- Status dropdown
- Assigned user
- Due date
- Blocker type (dropdown)
- Blocker note
- N/A toggle (if allowed)
- Activity log (optional v1.1)

Never navigate away from stage page.

## UX Design Principles

- White space heavy
- Minimal color usage
- No visual noise
- No animated connectors
- No radial graphs
- No drag-and-drop in MVP
- Focus on clarity, not cleverness

Color System:

- Green = Complete
- Yellow = In Progress
- Red = Blocked/Overdue
- Gray = Locked/Not Activated

Use icon + color for accessibility.

## Parallel Stage Behavior

Stages are ordered but allow overlap.
Rules:

- Stage activates when previous stage first has activity
- Completion of one stage does not require previous stage completion
- Multiple stages may be yellow at same time

## Handoff Feature

Each stage has a required:
“Current Focus / Handoff Summary” field.
Short text.
This replaces messy note scanning during split-week transitions.

## N/A Handling

Tasks can be marked N/A.
Requirements:

- Optional reason field
- Counts as complete in stage calculation
- Should visually appear subtle (gray check)

## Overdue Logic

If:

- due_date < today
- AND not COMPLETE
  Then:
- Task auto red
- Stage may auto red
  No manual override.

## Roadmap Creation Flow

For MVP:

- Admin creates program template in seed file.
- When client enrolls:
  - System clones template into stage_instances and task_instances
  - Sets activated_at for first stage
- Do NOT build template editor yet.

## Out of Scope (MVP)

- Template visual editor
- Drag-and-drop builder
- Supervisor dashboards
- Analytics
- Stripe billing
- Role-based permissions
- AI integrations
- Cross-program analytics
- File uploads

## MVP Development Milestones

Phase 1:

- Schema creation
- Hardcoded housing template
- Roadmap rendering
- Stage status engine

Phase 2:

- Task detail drawer
- Assignment system
- Overdue logic
- My Tasks filter

Phase 3:

- Multiple roadmaps per client
- Handoff field
- UI polish

## Product Positioning

This is:

- “A visual program state engine for case managers.”

It is not:

- “A task manager.”

It solves:

- Duplicate work
- Handoff confusion
- Workflow ambiguity
- Training inconsistency
- Blocker invisibility

## Coding Expectations

- Use strict TypeScript types
- Separate engine logic from UI
- Keep status calculations pure functions
- No business logic inside components
- Prepare for future multi-tenancy

## Naming Conventions

Avoid domain-specific naming like:

- “HousingOnlyStage”

Keep it generic:

- ProgramTemplate
- Stage
- Task

## Open Question (at the time)

Multi-organization support from day one, or single-org MVP?

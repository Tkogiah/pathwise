# Changelog (Manual Notes)

## 2026-02-12 — Task 1.3 Fixes

- Updated `metadata.title` to a neutral label ("Program Roadmap") to avoid hardcoded branding.
- Fixed Next.js App Router params typing in `apps/web/src/app/clients/[id]/page.tsx` (params is a plain object, not a Promise).

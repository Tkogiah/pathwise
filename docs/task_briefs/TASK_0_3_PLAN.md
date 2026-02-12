# Task 0.3 Plan — CI Skeleton

## Scope

- Add GitHub Actions workflow for lint, typecheck, tests
- Trigger on push and PR

## Workflow

- File: `.github/workflows/ci.yml`
- Single job: `ci`
- Node: 20 LTS

## Steps

1. Create `.github/workflows/`
2. Add `ci.yml` with steps:
   - checkout
   - setup-node (cache npm)
   - `npm ci`
   - `npm run lint`
   - `npm run format`
   - `npm run typecheck`
   - `npm run test`
3. Verify YAML structure

## Notes

- `npm ci` requires committed `package-lock.json`
- No deploy step
- Typecheck already runs `tsc -b`

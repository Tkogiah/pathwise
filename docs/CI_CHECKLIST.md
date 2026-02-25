# CI / Test Checklist

## Standard (run for most changes)

```bash
npm run typecheck
npm run lint
npm run format:check
npm run db:seed
npx playwright test
```

## Targeted Tests (run when relevant)

- Engine logic changes:
  ```bash
  npm run test
  ```
- Digest pipeline changes:
  ```bash
  npx vitest run apps/api/src/digest/digest.service.spec.ts
  ```

## Note for Agents

User prefers to run tests locally to save tokens. Agents should not run tests unless explicitly asked.

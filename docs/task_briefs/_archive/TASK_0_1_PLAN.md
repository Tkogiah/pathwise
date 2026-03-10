# Task 0.1 Plan — Monorepo Scaffolding (Build-to-dist)

## Workspace Tooling

- npm workspaces (no Turborepo/Nx at this scale)

## Folder Structure

pathwise/
├── apps/
│ ├── api/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── src/index.ts
│ └── web/
│ ├── package.json
│ ├── tsconfig.json
│ └── src/index.ts
├── packages/
│ ├── engine/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── src/index.ts
│ └── types/
│ ├── package.json
│ ├── tsconfig.json
│ └── src/index.ts
├── infra/
│ └── compose/
├── docs/
├── package.json
├── tsconfig.json
├── tsconfig.base.json
└── .gitignore

## Steps

1. Initialize root `package.json`
   - `private: true`, `workspaces: ["apps/*", "packages/*"]`
   - Scripts: `build`, `lint`, `typecheck`, `test`
2. Create directory skeleton (apps, packages, infra/compose)
3. Create `tsconfig.base.json`
   - Shared compiler options: `strict`, `composite`, `declaration`, `outDir: dist`, `rootDir: src`
4. Create `packages/types`
   - `name: @pathwise/types`
   - `main: dist/index.js`, `types: dist/index.d.ts`
   - `build: tsc -b`
5. Create `packages/engine`
   - Depends on `@pathwise/types`
   - `main/types` point to `dist/`
   - `build: tsc -b`
6. Create `apps/api`
   - Depends on `@pathwise/engine` and `@pathwise/types`
   - `main/types` point to `dist/`
   - `build: tsc -b`
7. Create `apps/web`
   - Same dependency pattern as API
8. Add `.gitignore`
   - `node_modules/`, `dist/`, `.env`, `.next/`, `*.tsbuildinfo`
9. Verify
   - `npm install`
   - `npm run build` at root (tsc -b)
   - Confirm `dist/` emitted and imports resolve across workspaces

## Notes

- `packages/ui` is explicitly deferred.
- Root `build` uses `tsc -b` to respect project reference order.

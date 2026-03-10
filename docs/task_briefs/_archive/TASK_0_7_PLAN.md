# Task 0.7 Plan — App Bootstrap (API + Web)

## Scope

- Scaffold NestJS API and Next.js web
- Configure app-level tsconfig overrides
- Add Tailwind to web
- Add dev/start scripts
- Add Prisma module skeleton (no registration yet)

## Steps

1. Scaffold apps/api (NestJS)
   - Dependencies: @nestjs/core, @nestjs/common, @nestjs/platform-express, reflect-metadata, rxjs
   - Create `src/main.ts`, `src/app.module.ts`, `src/app.controller.ts`
   - Health endpoint: `GET /health` → `{ status: "ok" }`
   - Enable CORS for localhost dev
2. Update apps/api/tsconfig.json
   - Enable decorators + metadata
   - Keep base config, override as needed
3. Update apps/api/package.json
   - Set `main: dist/main.js`
   - Add `dev` and `start` scripts
   - Use `tsx` for dev
4. Scaffold apps/web (Next.js)
   - Dependencies: next, react, react-dom, @types/react, @types/react-dom
   - Create `src/app/layout.tsx` + `src/app/page.tsx`
   - Add `next.config.js` with `transpilePackages: ['@pathwise/engine', '@pathwise/types']`
5. Update apps/web/tsconfig.json
   - Next.js overrides: `jsx`, `module`, `moduleResolution`
   - Include Next.js type files
6. Add TailwindCSS to apps/web
   - Dependencies: tailwindcss, @tailwindcss/postcss, postcss
   - `postcss.config.mjs`
   - `src/app/globals.css` with Tailwind import
   - Import globals.css in layout
7. Add root scripts
   - `dev:api`: `npm run dev -w @pathwise/api`
   - `dev:web`: `npm run dev -w @pathwise/web`
8. Prisma module skeleton (no registration)
   - Create `src/prisma/prisma.service.ts` and `src/prisma/prisma.module.ts`
   - Do not import into `AppModule` until Task 0.5

## Verification

- `npm run dev:api` starts API on 3001
- `GET /health` returns 200
- `npm run dev:web` starts Next.js on 3000

## Notes

- Prisma schema and migrations are deferred to Task 0.5
- If `composite` causes issues in Next.js tsconfig, disable it there and remove web from root project references

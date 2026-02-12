# Task 0.2 Plan — Tooling Baseline

## Tooling Choices

- ESLint 9 flat config (`eslint.config.mjs`)
- typescript-eslint v8+ (parser + plugin)
- eslint-config-prettier
- Prettier

## Steps

1. Install dev dependencies at root
   - `npm install -D eslint typescript-eslint eslint-config-prettier prettier`
2. Create `eslint.config.mjs` at root
   - Use `typescript-eslint` flat config with type-aware rules
   - `parserOptions.projectService: true`
   - Add `eslint-config-prettier` last
   - Ignore `dist/`, `node_modules/`, `.next/`
3. Create `.prettierrc` at root
   - `semi: true`, `singleQuote: true`, `trailingComma: "all"`, `printWidth: 80`
4. Create `.prettierignore`
   - `dist/`, `node_modules/`, `.next/`, `*.tsbuildinfo`, `package-lock.json`
5. Update root scripts
   - `lint`: `eslint .`
   - `lint:fix`: `eslint . --fix`
   - `format`: `prettier --check .`
   - `format:fix`: `prettier --write .`
6. Verify
   - `npm run lint`
   - `npm run format`
7. Normalize formatting
   - `npm run format:fix`

## Notes

- CI setup is Task 0.3.
- Testing setup comes later.
- If type-aware linting is flaky, fallback to explicit project references later.

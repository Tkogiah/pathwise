# Local vs Production Env

## Local development

Use local env files that point to local services:

- apps/api/.env
  - DATABASE_URL=postgresql://localhost:5432/pathwise_dev
  - CORS_ORIGIN=http://localhost:3000
  - JWT_SECRET=dev-secret-change-me

- apps/web/.env.local
  - NEXT_PUBLIC_API_URL=http://localhost:3001

## Production / demo hosting

Set env vars in the hosting platforms (Railway/Vercel/Neon). Do not commit production secrets.

- Railway (API): DATABASE_URL, JWT_SECRET, CORS_ORIGIN
- Vercel (Web): NEXT_PUBLIC_API_URL

## Notes

- .env files are gitignored. Use the .env.example files as templates.
- If local dev stops working after deploying, verify local env files are still pointing to localhost.

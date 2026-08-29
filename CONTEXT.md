# Project Context

## Current Progress
- Set up a Next.js 16 frontend with Tailwind v4 for the VPS service `howtoselfhost.com`.
- Designed and integrated `next-themes` for seamless Dark/Light Mode transitions.
- Created reusable brand components (`Navbar`, `Footer`, `PricingCard`, `LegalPageLayout`).
- Implemented marketing pages: Homepage, Pricing, Refund Policy, Privacy Policy, Terms & Conditions.
- Implemented the login UI and a customer panel (dashboard) shell.
- Started implementing the Prisma Database layer with an SQLite backend to store the VPS data.

## Architecture Decisions
- Using **Next.js App Router** with React Server Components (RSC) to easily interface with the database.
- Opted for **Tailwind v4** utilizing the new `@theme inline` configuration within `globals.css` rather than `tailwind.config`.
- Utilizing **Prisma ORM** coupled initially with an SQLite database (`dev.db`) for the first draft. This allows rapid, zero-setup prototyping locally, which can be seamlessly upgraded to PostgreSQL by swapping the provider string in `schema.prisma`.
- The `VpsInstance` schema is mapped conceptually to proxy the "Contabo API" data points, ensuring a smooth transition when moving from the mock database to the live upstream API.

## Immediate Next Steps
1. Finalize the Prisma configuration (`.env` and `lib/db.ts`).
2. Draft a `prisma/seed.ts` script to generate a mock `User` and standard `VpsInstance` rows.
3. Execute the Prisma migration and seed the SQLite database.
4. Refactor `app/dashboard/page.tsx` to pull server data, IPs, and instance status directly from the Database instead of hardcoded markup.

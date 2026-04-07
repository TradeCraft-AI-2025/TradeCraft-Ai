# AGENTS.md

## Cursor Cloud specific instructions

### Overview

TradeCraft AI is a Next.js 14 (App Router) stock trading terminal and portfolio management web app. It is a single-service monolith — the only process to run is the Next.js dev server. All market data and portfolio data is mocked; no real external APIs are called for market data.

### Running the app

- **Dev server**: `pnpm dev` (port 3000)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`

### Environment variables

A `.env.local` file with placeholder Stripe keys is required for the app to build and run. Without `STRIPE_SECRET_KEY` set, the build will fail at the page data collection step for the Stripe webhook route. The placeholder values (`sk_test_placeholder`, etc.) are sufficient for development of non-payment features.

Required env vars (see `docs/stripe-testing-guide.md` for details):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID`
- `NEXT_PUBLIC_BASE_URL`

### Key caveats

- **In-memory user store**: Users are stored in a JS object in `lib/user-service.ts`. All data is lost on server restart.
- **ESLint**: The project ships without an `.eslintrc.json` or ESLint dependency. You need `eslint@8` and `eslint-config-next@14` as devDependencies plus an `.eslintrc.json` with `{"extends": "next/core-web-vitals"}` for `pnpm lint` to work. There are ~20 pre-existing lint errors (mostly `react/no-unescaped-entities`).
- **Stripe payment flows**: Real Stripe test keys are required to test checkout/subscription flows. Without them, non-payment pages (dashboard, trading, signup/login) still work fine with placeholder keys.
- **No database**: SQL scripts in `scripts/` define a PostgreSQL schema but are not connected to the application code.
- **pnpm build scripts warning**: pnpm may warn about ignored build scripts for `unrs-resolver`. This is safe to ignore.
- **React 19 peer warnings**: The project uses React 19 with Next.js 14 which causes peer dependency warnings. These are cosmetic and do not affect functionality.

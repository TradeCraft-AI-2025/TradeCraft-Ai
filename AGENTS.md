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

Required env vars for `.env.local` (placeholders are sufficient for non-payment dev):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PRO`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (needed for build — the Stripe webhook route initializes a Supabase admin client at module level)

### Supabase client architecture

- **`lib/supabase-browser.ts`**: browser client for use in `"use client"` components
- **`lib/supabase.ts`**: server client (imports `next/headers`) — only import from server components, API routes, and middleware. Also re-exports `createBrowserSupabaseClient` for backward compat, but client components should import from `lib/supabase-browser.ts` directly.

### Key caveats

- **ESLint**: `.eslintrc.json` and `eslint@8`/`eslint-config-next@14` are configured. ~20 pre-existing lint errors (mostly `react/no-unescaped-entities`).
- **Stripe payment flows**: Real Stripe test keys are required to test checkout/subscription flows. Placeholder keys work for non-payment pages.
- **Supabase**: The app uses Supabase for auth, portfolios, AI usage tracking, and subscriptions. See `supabase/schema.sql` and `supabase/subscriptions.sql`.
- **pnpm build scripts warning**: pnpm may warn about ignored build scripts for `unrs-resolver`. Safe to ignore.
- **React 19 peer warnings**: Cosmetic peer dependency warnings from Next.js 14 + React 19. Does not affect functionality.

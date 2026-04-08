# TradeCraft AI — Operator Audit & Beta Execution Plan

*Generated: April 2026*

---

## PART 1 — REPO + INFRASTRUCTURE AUDIT

### 1.1 Current True Product Surface

**What the app actually does today:**
- Supabase magic-link authentication
- Manual portfolio entry (add/remove positions with symbol, quantity, cost basis)
- Mock stock quotes with simulated price movement (no real market data)
- Portfolio P/L calculation from mock prices
- Dashboard overview of holdings, concentration bars, and risk labels
- Stripe Pro subscription flow (partially wired)
- Two placeholder AI endpoints (daily brief, position explanation) that return static strings
- Static marketing pages (homepage, pricing, about)

**Core beta routes (keep):**

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Landing page | Stable, clean |
| `/auth` | Magic-link login | Stable, real Supabase auth |
| `/portfolio` | Holdings CRUD | Functional, needs polish |
| `/dashboard` | Portfolio overview | Functional, needs splitting |
| `/pricing` | Plan comparison | Clean, static |

**Legacy / dead / misleading routes (remove or hide):**

| Route | Problem |
|-------|---------|
| `/login` | Email/password login using in-memory `user-service` — completely disconnected from Supabase auth. Users who "log in" here get no real session. |
| `/signup` | Same as `/login` — in-memory, no Supabase, creates confusion. |
| `/trading` | Placeholder "coming soon" page. Misleading — implies brokerage capability. |
| `/account` | Settings page with broker connection card and trading preferences — features that don't exist. Implies brokerage integration. |
| `/about` | Marketing copy, not harmful but not linked from nav. Low priority. |
| `/pro` | Pro tools hub linking to strategy builder and backtester — features that don't fit the core product direction. |
| `/pro/builder` | Strategy builder UI — wrong product category entirely. TradeCraft is not a strategy-builder platform. |
| `/pro/backtest` | Backtest simulation — same problem. Remove from beta surface. |
| `/checkout` | Checkout page with plan selection UI, but the API ignores the plan selection and only creates subscriptions. Partially broken. |
| `/payment-success` | Expects `session_id` param that the actual Stripe success URL doesn't provide. Dead path. |

**Parts that still feel like the old demo:**
- The entire `/login` + `/signup` + `/api/auth/*` cookie-based auth system
- `lib/user-service.ts` (in-memory user store, doesn't survive server restart)
- `lib/auth.ts` (`mockAuthWithBroker`, `isAuthenticated` stubs)
- Mock stock data pretending to be live prices
- Strategy builder and backtester pages
- "Trading preferences" in account settings
- Package name is still `"my-v0-project"`

### 1.2 Architecture Quality

#### Auth/Session Consistency — CRITICAL ISSUE

Three separate auth systems running in parallel:

| System | Mechanism | Used by |
|--------|-----------|---------|
| **Supabase Auth** | Magic-link OTP, cookie session via `@supabase/ssr` | Middleware, `/auth`, `/portfolio`, `/dashboard`, site header, Stripe checkout, AI gate |
| **Cookie + in-memory** | `user_email` cookie → `lib/user-service.ts` in-memory store | `/api/auth/login`, `/api/auth/signup`, `/api/auth/me`, `/api/auth/logout` |
| **AuthContext** | React context calling `/api/auth/me` on mount | `app/layout.tsx` (wraps everything), `/login`, `/signup`, `/checkout`, `/account` |

**The conflict:** `AuthContext` calls `/api/auth/me` which uses the cookie/in-memory system. The middleware and site header use Supabase auth. A user who logs in via `/login` gets an `AuthContext` session but no Supabase session — middleware still blocks `/portfolio` and `/dashboard`. A user who uses magic link gets a Supabase session but `/api/auth/me` returns 401 because they have no `user_email` cookie.

**Verdict:** The cookie/in-memory auth system and `AuthContext` are legacy demo code that must be removed. Supabase is the real auth.

#### Supabase Usage — SOLID

Factory pattern is clean and consistent:
- `createServerSupabaseClient()` for server components and API routes
- `createBrowserSupabaseClient()` for client components
- Service-role client in webhook handler only
- Middleware creates its own client (necessary for edge runtime)

#### Data Model — MINIMAL BUT SOUND

| Table | Assessment |
|-------|------------|
| `portfolios` | Single JSONB column for holdings. Works for beta. Schema upgrade (normalized holdings table) can wait. |
| `subscriptions` | Clean Stripe-mapped row per user. Sufficient. |
| `ai_usage` | Simple counter table. Works for rate limiting. |
| `waitlist` | Standalone email capture. Fine. |

**Missing:** No `SubscriptionEvent` table despite TypeScript type existing. In-memory event recording in `user-service.ts` is dead code.

#### Dashboard Structure — NEEDS SPLITTING

`dashboard.tsx` is 507 lines, single file, client-only. Contains:
- Portfolio summary cards
- Holdings list
- Concentration bars
- Risk summary
- Price alerts (local state, not persisted)
- Market context (static copy)
- Preference toggles (uncontrolled switches)
- 6 helper sub-components inlined at bottom

Should be split into 4-5 focused components. The data loading pattern (Supabase browser client in `useEffect`) is fine for beta.

#### Stripe/Payment Flow — INCOMPLETE

| Piece | Status |
|-------|--------|
| Checkout session creation | Works (Supabase auth required) |
| Webhook handler | Works (upserts subscription) |
| Success redirect | Points to `/portfolio?success=true` — no `session_id`, so `/payment-success` page is unreachable |
| Plan selection UI | Checkout page sends plan type, but API ignores it — only creates subscriptions |
| Verify payment | Expects `session_id` that's never provided |
| Lifetime pricing | UI mentions it, backend doesn't support it |

**Verdict:** Webhook + subscription DB path is real. Everything else around it needs cleanup or removal.

#### Dead Code Inventory

**Dead libraries:**

| File | Reason |
|------|--------|
| `lib/api.ts` | `fetchPortfolioData` — no importers |
| `lib/auth.ts` | `getUserFromCookie`, `mockAuthWithBroker`, `isAuthenticated` — no importers |
| `lib/stripe-client.ts` | `createCheckoutSession` — no importers |
| `lib/checkout.ts` | Only imported by dead `stripe-client.ts` |
| `lib/market-data.ts` | Only imported by dead components (watchlist, ticker, market-overview) |
| `lib/analytics.ts` | `trackServerEvent` unused; others used only by dead `payment-success` |

**Dead components (25+ files):** `dashboard-shell`, `watchlist-card`, `with-async-state`, `status-strip`, `loading-screen`, `animated-background`, `news-card`, `market-news`, `market-overview` (also broken — imports nonexistent `ui/chart`), `recent-transactions`, `live-watchlist`, `live-ticker-price`, `ticker-bar`, `trading-view-chart`, `custom-trading-view`, `portfolio-holdings`, `empty-portfolio-state`, `onboarding-tour`, `email-capture-modal`, `simple-help-modal`, `subscription-status`, `pro-sidebar`, `pro-feature-guard`, `locked-feature`.

**Dead CSS:** `app/dashboard-sections.css` — not imported anywhere.

**Unused dependencies (no imports found):**
`@ai-sdk/anthropic`, `ai`, `@hookform/resolvers`, `react-hook-form`, `zod`, `sonner`, `date-fns`, `cmdk`, `embla-carousel-react`, `input-otp`, `vaul`, `geist`, `@vercel/analytics`

#### Environment Variable Complexity

8 env vars required. This is manageable. The middleware crash when Supabase vars are missing has been fixed (guard added). No other env-var fragility found.

#### Stability Assessment

| Area | Stability |
|------|-----------|
| Supabase auth flow | **Stable** |
| Middleware | **Stable** (after env guard fix) |
| Portfolio CRUD | **Stable** (mock prices, but functional) |
| Dashboard rendering | **Stable** |
| Stripe webhook | **Stable** |
| Stripe checkout UI | **Fragile** (plan selection ignored, success URL broken) |
| Legacy auth pages | **Broken** (fundamentally disconnected from real auth) |
| Pro/builder/backtest | **Functional but wrong product** |

### 1.3 Minimum Architecture for Credible Beta

#### KEEP (core foundation)

- Supabase auth (magic-link OTP)
- Middleware with route protection
- `createServerSupabaseClient` / `createBrowserSupabaseClient` pattern
- Portfolio CRUD (add/remove positions, Supabase persistence)
- Dashboard overview (after splitting)
- Pricing page
- Homepage
- Stripe webhook + subscription table
- `ai_usage` rate limiting

#### DELETE (before beta)

- `/login` and `/signup` pages
- `/api/auth/login`, `/api/auth/signup`, `/api/auth/me`, `/api/auth/logout` routes
- `lib/user-service.ts` (in-memory user store)
- `lib/auth.ts` (mock auth helpers)
- `lib/api.ts`, `lib/stripe-client.ts`, `lib/checkout.ts` (dead)
- `AuthContext` provider (replace with direct Supabase session checks)
- `/trading` page
- `/account` page (broker card, trading preferences — features that don't exist)
- `/pro/builder` and `/pro/backtest` pages
- `/payment-success` page (dead path)
- All 25+ dead components listed above
- `app/dashboard-sections.css`
- Unused dependencies from `package.json`

#### SIMPLIFY

- **Dashboard:** Split `dashboard.tsx` into `PortfolioSummary`, `HoldingsList`, `ConcentrationChart`, `RiskSummary`, `AlertsPanel`
- **Checkout flow:** Remove plan selection UI; single "Upgrade to Pro" button → Stripe Checkout → redirect to `/portfolio?upgraded=true` with toast
- **Header auth state:** Already uses Supabase directly — just remove `AuthContext` dependency chain
- **Package name:** Change from `my-v0-project` to `tradecraft`

#### DEFER UNTIL AFTER BETA

- Real market data (API integration, WebSocket prices)
- Account aggregation / broker connections
- Strategy builder / backtester
- Actual AI-generated insights (keep placeholder endpoints, ship deterministic insights first)
- Normalized holdings table (JSONB is fine for beta scale)
- Mobile responsive polish beyond basics
- Onboarding tour

#### MUST BE DETERMINISTIC (not AI-generated)

- Concentration percentages and allocation breakdown
- P/L calculations
- Risk flags (over-concentration, single-stock exposure)
- Portfolio drift from target allocation
- Sector/geography exposure calculations
- Holdings summary statistics

These are the trust-building features. They must be math, not LLM output.

### 1.4 Insight Engine Opportunities

Features that can be built on existing data model (`portfolios.holdings` JSONB with symbol, quantity, costBasis, currentPrice):

| Feature | Complexity | Trust Value | Description |
|---------|-----------|-------------|-------------|
| **Concentration analysis** | Low | Very High | Top-N holdings as % of portfolio. Flag any position >25%. Bar chart already partially exists in dashboard. |
| **Portfolio summary card** | Low | High | Total value, total cost, overall P/L, number of positions, largest holding — one glanceable card. |
| **Single-stock risk flags** | Low | Very High | "40% of your portfolio is in NVDA" — deterministic, clear, actionable. |
| **Sector exposure** | Medium | High | Map symbols to sectors (static lookup table). Show sector allocation pie chart. Flag >50% in one sector. |
| **Holdings change log** | Medium | Medium | Track additions/removals over time. "You added 50 shares of AAPL on March 15." |
| **Portfolio drift** | Medium | High | If user sets target allocation, show drift from target. Requires a new "target allocation" input. |
| **Event exposure** | Medium-High | High | Match holdings against upcoming earnings dates (static calendar). "3 of your holdings report earnings this week." |
| **Correlation warning** | High | High | Flag holdings that tend to move together (requires price history data). Defer post-beta. |

**Priority for beta:** Concentration analysis, summary card, single-stock risk flags, sector exposure. These are deterministic, require no external APIs, and directly serve the "understand what you own" positioning.

---

## PART 2 — COMPETITIVE MARKET ANALYSIS

### 2.1 The 5 Closest Competitors

| # | Competitor | Category | Pricing | Key Strength |
|---|-----------|----------|---------|--------------|
| 1 | **Portfolio Genius** | AI portfolio tracker | $10-20/mo | BUY/HOLD/REDUCE signals, trade management, multi-broker CSV import |
| 2 | **Empower** | Free portfolio aggregator | Free (advisory at $250k+) | Full account aggregation, retirement planning, fee analysis, massive user base |
| 3 | **Sharesight** | Portfolio tracker + tax | $7-23/mo | Tax reporting, dividend tracking, ETF overlap analysis, international |
| 4 | **Robinhood Cortex** | AI investing assistant | $5/mo (Gold) | Tied to real brokerage data, real-time analysis, trade suggestions, massive distribution |
| 5 | **Public Alpha + AI Agents** | AI investing platform | Free (Alpha) | Natural language research, agentic trading, real brokerage integration |

### 2.2 Competitor Strengths

- **Portfolio Genius:** Most similar product shape to TradeCraft. Already has AI signals, diversification scoring, and multi-broker CSV import. The "AI tells you what to do" angle is their bet.
- **Empower:** Unbeatable on aggregation breadth. Free forever. Connects to everything. Hard to compete with on pure portfolio visibility.
- **Sharesight:** Best-in-class for tax reporting and international investors. ETF overlap / concentration analysis is specifically relevant.
- **Robinhood Cortex:** The elephant. Tied to actual holdings, real prices, real trades. $5/mo inside a platform with 24M+ users. Distribution advantage is insurmountable.
- **Public Alpha:** Free AI research on any asset. AI Agents that actually execute trades. Moving toward "AI manages your money" territory.

### 2.3 What Each Leaves Open

| Competitor | Gap |
|-----------|-----|
| **Portfolio Genius** | Opaque AI signals ("BUY/HOLD/REDUCE" without clear reasoning). No focus on portfolio *understanding* — focused on *action*. Trust problem. |
| **Empower** | No position-level insight. Shows you what you have, not what it means. Optimized for high-net-worth advisory upsell, not self-directed investors learning their portfolio. |
| **Sharesight** | Excellent reporting, but UX is built for accountants and tax prep. Not designed for "I want to understand my portfolio in 30 seconds." Weak on plain-English explanations. |
| **Robinhood Cortex** | Locked to Robinhood. If you hold positions at Fidelity, Schwab, and Robinhood, Cortex only sees Robinhood. Generic AI chat, not structured portfolio analysis. |
| **Public Alpha** | Also locked to Public. AI Agents are exciting but terrifying for risk-conscious investors. No structured risk analysis — it's a chat interface. |

### 2.4 Where TradeCraft Should NOT Compete

- **Brokerage execution.** Do not build trade execution. Robinhood, Public, and every broker does this. Attempting it adds regulatory burden and zero differentiation.
- **Full account aggregation.** Empower owns this with Plaid integration and free pricing. Competing on aggregation breadth is a losing game for a startup.
- **AI chat / AI agents.** Robinhood Cortex and Public Alpha have massive LLM budgets, real-time data feeds, and millions of users to train on. Generic AI chat is a commodity.
- **Tax reporting.** Sharesight has years of tax rule engines. This is table stakes for them and a massive build for TradeCraft.
- **Strategy building / backtesting.** QuantConnect, TradingView, and dozens of platforms own this space. The `/pro/builder` and `/pro/backtest` pages should be removed.

### 2.5 The Wedge: TradeCraft's Narrow Lane

**The gap in the market:** No product today gives self-directed investors a structured, deterministic, plain-English analysis of *what their portfolio actually means* — across all their holdings, regardless of where those holdings are held.

- Robinhood/Public only see their own holdings
- Empower shows you the data but doesn't explain it
- Portfolio Genius gives you AI signals without showing its work
- Sharesight reports are for tax prep, not portfolio understanding

**TradeCraft's wedge:** Be the **portfolio X-ray** — the tool that takes your holdings (manually entered or CSV-imported) and gives you a structured, honest, deterministic breakdown of concentration risk, sector exposure, and what your portfolio actually looks like. No AI black-box. No brokerage lock-in. No trade execution. Just clarity.

**Why this works:**
1. Manual entry / CSV import means no Plaid dependency, no regulatory burden, no aggregation failures
2. Deterministic analysis means every insight can be explained and verified
3. Cross-broker by nature — users enter all their positions regardless of where they're held
4. The "understand what you own" positioning is underserved and trust-building
5. Pro tier ($9.99/mo) is justified by deeper analysis, not by AI token costs

### 2.6 Product Story

> "TradeCraft is portfolio intelligence for people who pick their own stocks. It doesn't tell you what to buy. It helps you see what you already own — concentration risk, sector tilt, single-stock exposure — in plain English. Think of it as a portfolio X-ray that works across all your brokerages."

This is believable, differentiated, and commercially interesting because:
- It's a clear problem (most investors don't know their actual concentration risk)
- It's not dependent on AI hype (deterministic analysis builds trust)
- The wedge is narrow enough to execute in 30 days
- The expansion path is clear (add more insight layers, eventually add data feeds)

---

## PART 3 — DIFFERENTIATED BETA PLAN

### 3.1 Positioning Recommendation

> **"Portfolio intelligence for self-directed investors — understand your concentration, exposure, and risk in plain English."**

Not: "AI-powered trading terminal." Not: "Portfolio tracker." Not: "Your investing copilot."

The word "intelligence" here means *structured analysis*, not *artificial intelligence*. The product story is about **clarity**, not automation.

### 3.2 Core Beta Promise

**What the beta promises:**
- Enter your holdings from any brokerage (manual or CSV)
- See your concentration risk, sector exposure, and single-stock flags
- Get a clear, structured portfolio summary you can understand in 30 seconds
- Access basic P/L tracking with mock market data (clearly labeled as beta)
- Upgrade to Pro for deeper analysis and unlimited insights

**What the beta does NOT promise:**
- Real-time market data (beta uses representative/delayed data, clearly disclosed)
- Trade execution or brokerage integration
- AI-generated investment advice
- Tax reporting
- Account aggregation via Plaid
- Strategy building or backtesting

### 3.3 Differentiated Feature Stack

**5 features that create trust, stickiness, and differentiation:**

#### 1. Concentration X-Ray (Week 1-2)
Show every holding as a percentage of total portfolio value. Flag any position >20% as "concentrated" and >35% as "heavily concentrated." This is the signature view.
- **Data source:** Existing `portfolios.holdings` JSONB
- **Differentiation:** Structured and visual, not buried in a report. Front-and-center on dashboard.
- **Trust:** Pure math. User can verify every number.

#### 2. Sector Exposure Map (Week 2-3)
Map every holding to its GICS sector using a static lookup table (no API needed for top 500 stocks). Show a sector allocation breakdown. Flag >50% exposure to any single sector.
- **Data source:** Static `symbol → sector` mapping + holdings data
- **Differentiation:** No competitor at this price point shows sector concentration for manually-entered portfolios.
- **Build cost:** One lookup table file + one component.

#### 3. Risk Flag Cards (Week 2-3)
A set of deterministic risk checks that produce clear, actionable flags:
- "NVDA is 42% of your portfolio" (concentration)
- "78% of your portfolio is in Technology" (sector tilt)
- "You have 3 positions — most advisors suggest 10-20 for diversification" (under-diversification)
- "Your top 3 holdings are 89% of your portfolio" (top-heavy)
- **Differentiation:** Not AI chat responses. Structured cards with clear thresholds. User can see exactly why each flag was raised.

#### 4. Portfolio Summary Brief (Week 3)
A one-paragraph, deterministic summary that reads like a human wrote it but is built from templates + data:
> "Your portfolio has 7 holdings worth $24,350. It's moderately concentrated — your top position (NVDA) is 28% of the total. 65% is in Technology, with minimal exposure to other sectors. Your overall P/L is +12.4% ($2,680)."
- **Differentiation:** This is what Robinhood Cortex tries to do with AI, but TradeCraft does it deterministically — no hallucination risk, no API cost, instant generation.
- **Build cost:** Template engine + holdings data. No LLM needed.

#### 5. CSV Import (Week 3-4)
Accept CSV exports from major brokerages (Fidelity, Schwab, Vanguard, Robinhood format). Parse symbol, quantity, and cost basis. One-click portfolio population.
- **Differentiation:** Removes the biggest friction point (manual entry). Makes TradeCraft instantly useful for any investor.
- **Build cost:** File upload + parser per broker format. Well-defined problem.

### 3.4 Product Scope Rules

**Belongs in beta:**
- Magic-link auth
- Portfolio entry (manual + CSV import)
- Concentration X-ray
- Sector exposure
- Risk flag cards
- Portfolio summary brief
- Pro subscription via Stripe
- Clean pricing page

**Must be cut from beta:**
- Strategy builder (`/pro/builder`)
- Backtester (`/pro/backtest`)
- Trading page (`/trading`)
- Account settings with broker connection (`/account`)
- Legacy email/password auth (`/login`, `/signup`)
- AI-generated insights (keep endpoints as placeholders for post-beta)
- Real-time market data (use mock data clearly labeled)

**Can wait until later:**
- Real market data integration (post-beta, after validating demand)
- Plaid account aggregation
- Earnings calendar / event exposure
- Portfolio drift tracking
- Holdings change log
- Onboarding tour
- Mobile-specific polish

**Should never be the focus:**
- Trade execution
- AI chat as primary interface
- Strategy building / backtesting
- Tax reporting
- Institutional / advisor features
- Social features

### 3.5 30-Day Execution Roadmap

---

#### Week 1: Stabilization

**Product tasks:**
- Remove `/login`, `/signup`, and all legacy auth API routes
- Remove `AuthContext` provider from layout; replace any dependent pages with direct Supabase checks
- Remove `/trading`, `/account`, `/pro/builder`, `/pro/backtest` pages
- Remove `/payment-success` (dead path)
- Remove all dead components (25+ files)
- Remove dead libraries (`lib/auth.ts`, `lib/api.ts`, `lib/stripe-client.ts`, `lib/checkout.ts`, `lib/market-data.ts`)
- Clean unused dependencies from `package.json`
- Rename package from `my-v0-project` to `tradecraft`

**Repo/infrastructure tasks:**
- Delete `app/dashboard-sections.css`
- Fix Stripe checkout flow: remove plan selection, single "Upgrade" button, verify success redirect works
- Ensure middleware gracefully handles missing env vars (already done)
- Verify all remaining routes render cleanly after deletions

**UX tasks:**
- Update site header nav: Home, Portfolio, Overview (dashboard), Pricing
- Update site footer to match
- Ensure `/pro` page either becomes the Pro upgrade CTA or is removed (no links to deleted builder/backtest)

**Testing tasks:**
- Verify: Homepage → Auth → Portfolio → Dashboard → Pricing all render
- Verify: Magic-link auth flow works end-to-end
- Verify: Protected routes redirect correctly when unauthenticated
- Verify: No console errors on any core route
- Verify: `pnpm build` succeeds

**Done means:** Zero dead code. Zero legacy auth. All 5 core routes render. Build passes. No references to deleted pages.

---

#### Week 2: Beta Surface Cleanup

**Product tasks:**
- Split `dashboard.tsx` into focused components: `PortfolioSummary`, `HoldingsList`, `ConcentrationChart`, `RiskSummary`
- Add "Beta" badge to header or hero
- Add mock data disclosure ("Prices are representative during beta") to portfolio and dashboard
- Make the empty-state experience for new users compelling: "Add your first position to see your portfolio X-ray"

**Repo/infrastructure tasks:**
- Create `lib/sector-map.ts` — static mapping of top 500 US stock symbols to GICS sectors
- Create `lib/portfolio-analysis.ts` — deterministic functions:
  - `calculateConcentration(holdings)` → per-holding percentage + flags
  - `calculateSectorExposure(holdings)` → sector breakdown
  - `generateRiskFlags(holdings)` → array of structured risk flag objects
- Write unit tests for all analysis functions (these must be deterministic and testable)

**UX tasks:**
- Redesign dashboard to prominently feature Concentration X-ray as the hero section
- Design risk flag card component (icon + title + description + severity)
- Ensure portfolio page has clear "Add Position" CTA above the fold

**Testing tasks:**
- Unit tests for `calculateConcentration`, `calculateSectorExposure`, `generateRiskFlags`
- Manual test: add 3-5 positions, verify concentration percentages are correct
- Manual test: verify dashboard reflects portfolio changes immediately
- Verify build still passes

**Done means:** Dashboard is split. Analysis functions exist and are tested. Concentration is the hero feature on dashboard. Empty states are clear.

---

#### Week 3: Differentiated Insight Layer

**Product tasks:**
- Wire Concentration X-ray into dashboard with visual bars and flag badges
- Wire Sector Exposure Map into dashboard (pie chart or horizontal bar chart using existing recharts dependency)
- Wire Risk Flag Cards into dashboard (structured cards, not AI text)
- Build `generatePortfolioSummary(holdings)` — template-based plain-English paragraph
- Display Portfolio Summary Brief at top of dashboard

**Repo/infrastructure tasks:**
- Build CSV import: file upload component + parsers for Fidelity, Schwab, Vanguard, Robinhood CSV formats
- Add CSV import to portfolio page
- Ensure imported holdings are saved to Supabase `portfolios` table

**UX tasks:**
- Polish risk flag cards with appropriate severity colors (green/amber/red)
- Polish concentration bars with clear percentage labels
- Polish sector chart with clear legend
- Make portfolio summary brief visually distinct (card with slight highlight)

**Testing tasks:**
- Manual test: upload CSV from each supported broker format, verify parsing
- Manual test: verify all insight features with realistic portfolio (5-10 holdings across sectors)
- Verify risk flags trigger correctly at defined thresholds
- Verify portfolio summary text is grammatically correct for edge cases (0 holdings, 1 holding, 20 holdings)
- Verify build passes

**Done means:** All 5 differentiated features are live. CSV import works for at least 2 broker formats. Dashboard shows concentration, sector exposure, risk flags, and summary for any portfolio.

---

#### Week 4: Beta Launch Prep

**Product tasks:**
- Add "Feedback" link or widget (simple mailto: or Supabase-backed form)
- Ensure Pro upgrade flow works: Pricing → Stripe Checkout → redirect back with success toast
- Add Pro badge/indicator for subscribed users
- Write concise copy for empty states, error states, and loading states
- Final copy pass on all pages (remove any v0/demo language)

**Repo/infrastructure tasks:**
- Run full `pnpm lint` and fix any new errors (pre-existing ~17 can stay)
- Run `pnpm build` and verify clean production build
- Verify all env vars are documented in `AGENTS.md`
- Ensure `.env.local` example is accurate and complete
- Remove any remaining TODO comments that reference demo/placeholder behavior
- Tag release: `v0.1.0-beta`

**UX tasks:**
- Final visual pass: dark theme consistency, spacing, typography
- Test on common viewport sizes (desktop, tablet basics)
- Ensure all CTAs have clear destinations
- Verify no broken images (logo-neon.png is missing from public/ — fix or replace)

**Testing tasks:**
- Full manual walkthrough: land on homepage → auth → add positions → view dashboard → view concentration → check risk flags → upgrade to Pro → verify Pro status
- Verify all 5 core routes with and without authentication
- Verify Stripe webhook with test events (if test keys available)
- Verify graceful behavior when Supabase is unreachable (placeholder env vars)
- Performance check: page load times under 3 seconds

**Done means:** Product is presentable. All core flows work. No dead code. No misleading features. Copy is clean. Can share a URL with beta testers.

---

### 3.6 Final Operator Recommendation

#### Is this repo a real base worth continuing?

**Yes, but barely.** The Supabase auth, portfolio CRUD, middleware, and Stripe webhook form a legitimate skeleton. The data model is minimal but sound. The UI components (shadcn/ui + Tailwind) are production-quality primitives.

However, the repo is carrying roughly 40% dead weight — legacy auth, dead components, unused dependencies, pages for features that don't fit the product, and mock systems pretending to be real. The repo needs a hard cleanup before any more product work happens. Adding features on top of this codebase without cleaning it first will compound the technical debt exponentially.

#### The fastest path to a credible beta:

1. **Week 1:** Delete everything that doesn't belong. This is the highest-leverage work. Removing 25+ dead components, 4 dead libraries, 5 dead routes, and the entire legacy auth system will make the codebase navigable and trustworthy.

2. **Week 2:** Split the dashboard and build the deterministic analysis functions. These are the product's actual moat — not AI, not real-time data, but clear math that users can trust and verify.

3. **Week 3:** Wire the insight layer and ship CSV import. This is where the product becomes differentiated. "Upload your holdings, see your concentration risk in 10 seconds" is a compelling beta pitch.

4. **Week 4:** Polish and launch prep. The bar for a credible beta is: does it look intentional? Does every feature work? Can a stranger use it without guidance?

#### The biggest strategic mistake to avoid:

**Do not add AI chat as the primary feature.** The temptation will be strong — the `@ai-sdk/anthropic` dependency is already installed, the AI endpoints exist as placeholders, and "AI-powered" sounds good in a pitch. But:

- AI chat is a commodity. Robinhood Cortex and Public Alpha already do it with real brokerage data.
- AI chat erodes trust. Investors need to verify analysis, and LLM output can't be verified.
- AI chat costs money per query. At $9.99/mo with GPT-4/Claude, the margin math doesn't work unless usage is heavily gated.
- AI chat is fragile. Hallucinated portfolio analysis is worse than no analysis at all.

The right move: **Ship deterministic insights first. Add AI as a supplement later (e.g., "Explain this risk flag in more detail") — never as the core.** The positioning should be "portfolio intelligence," not "AI assistant." Intelligence means structured analysis you can trust. AI means a chat box that might be wrong.

**TradeCraft's real moat is clarity, not intelligence.** Build the portfolio X-ray. Make it deterministic. Make it fast. Make it honest. That's enough for a beta, and it's the foundation everything else gets built on.

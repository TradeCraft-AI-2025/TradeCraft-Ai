# Manual QA Checklist

Test the full user journey end-to-end. Mark each step Pass or Fail and add notes for anything unexpected.

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|----------------|-----------|-------|
| 1 | Visit homepage | Hero renders with logo, stats, and CTA buttons. No console errors. | | |
| 2 | Submit waitlist email in modal | Toast confirms subscription. New row appears in Supabase `waitlist` table. | | |
| 3 | Click "Sign in" CTA | Navigates to `/auth`. Email input and "Send magic link" button visible. | | |
| 4 | Enter email and submit | Button shows loading spinner, then success state: "Check your email — we sent you a sign-in link". Email arrives in inbox. | | |
| 5 | Click magic link in email | Redirects through `/auth/callback` to `/portfolio` with an active session. | | |
| 6 | Portfolio empty state | Page shows "No portfolio yet — import your CSV" prompt (or upload UI). | | |
| 7 | Upload a real CSV | Holdings table renders with correct symbols, quantities, and prices. | | |
| 8 | Refresh the page | Holdings persist — loaded from Supabase `portfolios` table, not reset. | | |
| 9 | Click brain icon on a holding | AI explanation appears for that position. `ai_usage` row inserted in Supabase. | | |
| 10 | Click Daily brief | Brief card renders with market summary. `ai_usage` row inserted with action `daily-brief`. | | |
| 11 | Click Daily brief 5 more times (free user) | Requests succeed until 5 total used this month, then API returns 402 `{ error: "Monthly limit reached", upgradeUrl: "/pricing" }`. | | |
| 12 | Visit `/pricing` | Both tiers (monthly and lifetime/Pro) render with prices and feature lists. | | |
| 13 | Click "Start Pro" / upgrade button | Stripe Checkout page opens with correct price and email pre-filled. | | |
| 14 | Complete checkout with test card `4242 4242 4242 4242` | Payment succeeds. Redirects to `/portfolio`. Supabase `subscriptions` row has `status: 'active'`. | | |
| 15 | Click Daily brief again (now Pro) | Brief renders with no rate limit. Response includes `isPro: true`, `remaining: -1`. | | |
| 16 | Visit `/portfolio` without session (incognito window) | Middleware redirects to `/?auth=required`. Portfolio page never renders. | | |

## Notes

- Use Stripe test mode keys for steps 13–14.
- Any future expiry date, any CVC, and any billing ZIP work with the `4242` test card.
- To verify Supabase rows, open the Table Editor in the Supabase dashboard.
- To reset the free tier limit for re-testing, delete rows from `ai_usage` for the test user.

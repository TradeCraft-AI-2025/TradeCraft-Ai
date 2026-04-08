# Deploy to Vercel

## Environment Variables

### Anthropic

| Variable | Where to find it |
|----------|-----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) → Create key |

### Supabase

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → service_role key (keep secret) |

### Stripe

| Variable | Where to find it |
|----------|-----------------|
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) → Secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) → Publishable key |
| `STRIPE_PRICE_PRO` | Stripe dashboard → Products → Pro plan → Price ID (starts with `price_`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Developers → Webhooks → Signing secret (starts with `whsec_`) |

### App

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_APP_URL` | Your Vercel production URL, e.g. `https://tradecraft.ai` |

## Pre-deploy checklist

1. Run `supabase/schema.sql` and `supabase/subscriptions.sql` in Supabase SQL Editor
2. Enable Email (Magic Link) auth provider in Supabase → Authentication → Providers
3. Add your production URL to Supabase → Authentication → URL Configuration → Redirect URLs
4. Create the Pro subscription product in Stripe and copy the Price ID into `STRIPE_PRICE_PRO`
5. Add a Stripe webhook endpoint pointing to `https://<your-domain>/api/webhooks/stripe` for events `checkout.session.completed` and `customer.subscription.deleted`
6. Set all environment variables listed above in Vercel → Project Settings → Environment Variables
7. Verify `pnpm build` succeeds locally with production env vars
8. After first deploy, send a test magic link and confirm the auth callback redirects correctly

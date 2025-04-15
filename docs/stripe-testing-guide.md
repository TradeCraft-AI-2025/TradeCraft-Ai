# Stripe Integration Testing Guide

This guide will help you test your Stripe integration for TradeCraft AI Pro subscriptions.

## Prerequisites

Ensure you have the following environment variables set up in your Vercel project:

1. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
2. `STRIPE_SECRET_KEY` - Your Stripe secret key
3. `STRIPE_SUBSCRIPTION_PRICE_ID` - The price ID for your monthly subscription product
4. `STRIPE_LIFETIME_PRICE_ID` - The price ID for your lifetime access product
5. `DOMAIN` - Your application domain (e.g., https://your-app.vercel.app)
6. `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret

## Testing the Payment Flow

### 1. Test User Registration/Login

1. Navigate to `/signup` to create a test account
2. Fill in the required details and create your account
3. Verify you're redirected to the dashboard

### 2. Test Pro Subscription Modal

1. Navigate to `/pro`
2. Click on "Upgrade to Pro" or "Unlock Your AI Assistant"
3. Verify the subscription modal opens with:
   - Your email pre-filled (if logged in)
   - Two plan options (Monthly Subscription and Lifetime Access)
   - A secure checkout button

### 3. Test Checkout Process

1. Select a plan (Monthly or Lifetime)
2. Click "Secure Checkout"
3. Verify you're redirected to the Stripe Checkout page
4. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
5. Enter any future expiration date, any 3-digit CVC, and any billing details
6. Complete the checkout process

### 4. Test Success Redirect

1. After successful payment, verify you're redirected to `/payment-success`
2. Verify the success page shows:
   - A confirmation message
   - Details about your subscription
   - Links to access Pro features

### 5. Test Pro Feature Access

1. Navigate to `/pro/backtest` or `/pro/builder`
2. Verify you can access these Pro features without seeing the upgrade prompt

## Testing Webhooks Locally

To test webhooks locally:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login with `stripe login`
3. Forward webhooks to your local server:
   \`\`\`
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   \`\`\`
4. The CLI will display a webhook signing secret - use this for your `STRIPE_WEBHOOK_SECRET` environment variable during local testing

## Stripe Test Events

You can trigger test webhook events using the Stripe CLI:

\`\`\`
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
\`\`\`

## Verifying Subscription Status

1. Check your Stripe Dashboard > Customers to see the new customer
2. For subscriptions, check Stripe Dashboard > Subscriptions
3. In your application, verify the user's subscription status is updated correctly

## Common Issues and Troubleshooting

### Payment Fails

- Check browser console for JavaScript errors
- Verify your Stripe keys are correct
- Ensure price IDs exist in your Stripe account

### Webhook Issues

- Verify your webhook endpoint is accessible
- Check that the webhook secret is correct
- Look for webhook delivery attempts in Stripe Dashboard > Developers > Webhooks

### Subscription Not Updating

- Check webhook logs for errors
- Verify the webhook is being received by your application
- Check your database for subscription updates

## Production Deployment

For production:

1. Switch to live Stripe API keys
2. Set up a production webhook endpoint in the Stripe Dashboard
3. Update your environment variables with production values
4. Test the complete flow in production with a real payment
\`\`\`

Let's also create a user account page to view subscription status:

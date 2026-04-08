-- Run this in Supabase > SQL Editor
-- This replaces the subscriptions table from schema.sql with the Stripe-backed version

drop table if exists subscriptions;

create table subscriptions (
  user_id                uuid references auth.users primary key,
  stripe_customer_id     text,
  stripe_subscription_id text,
  status                 text,
  updated_at             timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "Users can read own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

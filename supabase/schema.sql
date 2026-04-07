-- Run this in Supabase > SQL Editor before deploying

-- 1. Waitlist
create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

create policy "Anyone can join the waitlist"
  on waitlist for insert
  with check (true);

create policy "Only service role reads waitlist"
  on waitlist for select
  using (false);

-- 2. Portfolios
create table portfolios (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  holdings    jsonb not null,
  imported_at timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id)
);

alter table portfolios enable row level security;

create policy "Users can read own portfolio"
  on portfolios for select
  using (auth.uid() = user_id);

create policy "Users can insert own portfolio"
  on portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update own portfolio"
  on portfolios for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own portfolio"
  on portfolios for delete
  using (auth.uid() = user_id);

-- 3. Subscriptions
create table subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null unique,
  plan       text not null default 'free',
  status     text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "Users can read own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- 4. AI usage
create table ai_usage (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  action     text not null,
  created_at timestamptz default now()
);

alter table ai_usage enable row level security;

create policy "Users can read own ai_usage"
  on ai_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai_usage"
  on ai_usage for insert
  with check (auth.uid() = user_id);

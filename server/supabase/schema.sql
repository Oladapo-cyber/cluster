-- Enable extension for UUID generation
create extension if not exists "pgcrypto";

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  full_description text,
  image_url text,
  price_kobo integer not null check (price_kobo >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.products
  add column if not exists full_description text;

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);

-- User profiles (linked to Supabase auth.users)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  is_legacy_user boolean not null default false,
  is_activated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders
create type public.order_status as enum (
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  total_kobo integer not null check (total_kobo >= 0),
  status public.order_status not null default 'pending_payment',
  payment_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_kobo integer not null check (unit_price_kobo >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- Quiz questions
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  options jsonb not null,
  sort_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Quiz responses
create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  session_id text,
  responses jsonb not null,
  recommended_product_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_responses_user_id on public.quiz_responses(user_id);

-- Health records
create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  metric_name text not null,
  metric_value text not null,
  recorded_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_health_records_user_id on public.health_records(user_id);
create index if not exists idx_health_records_recorded_at on public.health_records(recorded_at desc);

-- Row level security baseline
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.user_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_responses enable row level security;
alter table public.health_records enable row level security;

-- Public read access for active catalog data
create policy "public_read_categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "public_read_active_products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

create policy "public_read_active_quiz_questions"
  on public.quiz_questions for select
  to anon, authenticated
  using (is_active = true);

-- Authenticated users can read/write own profile
create policy "users_manage_own_profile"
  on public.user_profiles for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Authenticated users can read own orders
create policy "users_read_own_orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users_read_own_order_items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "users_manage_own_quiz_responses"
  on public.quiz_responses for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_manage_own_health_records"
  on public.health_records for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
